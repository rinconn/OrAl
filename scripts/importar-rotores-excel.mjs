// Importa la relación de rotores por centrífuga que la empresa saca de su CRM (Dynamics 365) y de la tarifa
// (Business Central): Rotores_por_centrifuga_<año>.xlsx. Es la referencia buena para las referencias de cada
// centrífuga (CE…, con sus versiones IVD), los rotores que admite cada modelo con sus rpm y xg, y los que no valen
// para alguna de sus referencias. Lo guarda en src/data/rotores-excel.json.
//
//   node scripts/importar-rotores-excel.mjs ruta/al/Rotores_por_centrifuga_2026.xlsx
//
// Lo interno no se guarda: de la tarifa y del estado en el CRM solo se usa que un rotor sin precio en la tarifa no se
// enseña. Se vuelve a ejecutar con cada Excel nuevo; el resultado se revisa con git diff.
import { readFile, writeFile } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';

const ruta = process.argv[2];
if (!ruta) {
  console.error('Uso: node scripts/importar-rotores-excel.mjs ruta/al/archivo.xlsx');
  process.exit(1);
}

// Un .xlsx es un zip: se lee su índice (directorio central) y se descomprime cada archivo que haga falta
const zip = await readFile(ruta);
const fin = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const archivos = new Map();
for (let i = 0, p = zip.readUInt32LE(fin + 16); i < zip.readUInt16LE(fin + 10); i++) {
  const metodo = zip.readUInt16LE(p + 10);
  const tam = zip.readUInt32LE(p + 20);
  const nombre = zip.toString('utf8', p + 46, p + 46 + zip.readUInt16LE(p + 28));
  const local = zip.readUInt32LE(p + 42);
  const datos = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
  const crudo = zip.subarray(datos, datos + tam);
  archivos.set(nombre, (metodo === 8 ? inflateRawSync(crudo) : crudo).toString('utf8'));
  p += 46 + zip.readUInt16LE(p + 28) + zip.readUInt16LE(p + 30) + zip.readUInt16LE(p + 32);
}

// Celdas de cada hoja como filas de { A: '…', B: '…' } (los textos van en sharedStrings)
const texto = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const comunes = [...(archivos.get('xl/sharedStrings.xml') ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
  texto([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')),
);
const hoja = (n) =>
  [...archivos.get(`xl/worksheets/sheet${n}.xml`).matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)]
    .map((fila) => {
      const o = {};
      for (const c of fila[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const tipo = /t="(\w+)"/.exec(c[2])?.[1];
        const v = /<v>([\s\S]*?)<\/v>/.exec(c[3] ?? '')?.[1];
        const enLinea = /<t[^>]*>([\s\S]*?)<\/t>/.exec(c[3] ?? '')?.[1];
        o[c[1]] = (tipo === 's' ? comunes[+v] : tipo === 'inlineStr' ? texto(enLinea ?? '') : (v ?? '')).trim();
      }
      return o;
    })
    .slice(1);

// Cifras del texto del rotor ("4.200 RPM / max 2.603 xg", "14,000 RPM"): enteros, sin separador de miles
const entero = (s) => s?.replace(/[.,\s]/g, '');
const leerRotor = (linea) => {
  const codigo = /RT\s*(\d+)/.exec(linea)?.[1];
  if (!codigo) return null;
  const tipo = /oscilante/i.test(linea) ? 'oscilante' : /horizontal/i.test(linea) ? 'horizontal' : 'angular';
  const cap = /para\s+(\d+)\s+(?:tubos|microtubos)[^\d]*?de\s+([\d,]+(?:-[\d,]+)?)\s*ml/i.exec(linea);
  return {
    codigo: `RT ${codigo}`,
    tipo,
    rpm: entero(/([\d.,]+)\s*RPM/i.exec(linea)?.[1]),
    xg: entero(/([\d.,]+)\s*x\s?g/i.exec(linea)?.[1]),
    capacidad: cap ? `${cap[1]} x ${cap[2]} ml` : undefined,
  };
};

// Rotores sin precio en la tarifa: no se enseñan
const porReferencia = hoja(2).filter((f) => /^CE\s/.test(f.A ?? ''));
const enTarifa = new Map();
for (const f of porReferencia) enTarifa.set(f.C, enTarifa.get(f.C) || f.E === 'Sí');
const fueraDeTarifa = [...enTarifa].filter(([, si]) => !si).map(([rt]) => rt);

const modelos = {};
for (const f of hoja(1).filter((f) => f.A)) {
  const rotores = (f.D ?? '')
    .split('\n')
    .map(leerRotor)
    .filter((r) => r && !fueraDeTarifa.includes(r.codigo));
  // "CE 202 no tiene RT 246; CE 203 no tiene RT 246" → { 'RT 246': ['CE 202', 'CE 203'] }
  const noCompatibles = {};
  for (const [, ce, rt] of (f.E ?? '').matchAll(/(CE\s*\d+\w*)\s+no tiene\s+(RT\s*\d+)/gi))
    (noCompatibles[rt] ??= []).push(ce);
  modelos[f.A] = {
    referencias: f.B.split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    rotores: rotores.map(({ codigo, ...r }) => ({
      codigo,
      ...Object.fromEntries(Object.entries(r).filter(([, v]) => v)),
    })),
    ...(Object.keys(noCompatibles).length && { noCompatibles }),
  };
}

const consulta = /Consulta del (\d+)\/(\d+)\/(\d+)/.exec(
  hoja(2)
    .map((f) => f.A)
    .find((a) => /Consulta del/.test(a ?? '')) ?? '',
);
await writeFile(
  new URL('../src/data/rotores-excel.json', import.meta.url),
  JSON.stringify(
    {
      fuente: 'CRM (Dynamics 365) y tarifa (Business Central)',
      consulta: consulta ? `${consulta[3]}-${consulta[2]}-${consulta[1]}` : undefined,
      fueraDeTarifa,
      modelos,
    },
    null,
    2,
  ) + '\n',
);
console.log(`${Object.keys(modelos).length} modelos; fuera de tarifa: ${fueraDeTarifa.join(', ') || 'ninguno'}`);
