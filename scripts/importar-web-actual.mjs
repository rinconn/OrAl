// Importa de la web actual (ortoalresa.com, WordPress) todo lo que llevan las fichas de producto, en los tres idiomas:
// descripción, bloques (características, funcionamiento, seguridad…), versiones con código, medidas, peso y consumo,
// rotores compatibles con sus cifras y las configuraciones de tubos de cada rotor. Lo guarda ya limpio (texto, sin
// HTML) en src/data/web-actual.json y baja las fotos de los rotores a public/img/rotores/ en WebP.
//
//   node scripts/importar-web-actual.mjs
//
// Se vuelve a ejecutar cuando la empresa cambie algo en la web actual; el resultado se revisa con git diff.
import { mkdir, writeFile, access } from 'node:fs/promises';
import sharp from 'sharp';

const WP = 'https://wp.ortoalresa.com/wp-json';
const IMG = 'https://ortoalresa.com/imagen_producto';
const PDF = 'https://ortoalresa.com/catalogo_producto';
const idiomas = ['es', 'en', 'fr'];

const json = async (url) => {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    await new Promise((ok) => setTimeout(ok, 800));
  }
  throw new Error(`No se pudo leer ${url}`);
};

// HTML de WordPress → texto. Los párrafos y las líneas ("• …", "– …") quedan como lista de líneas.
const entidades = {
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8217;': '’',
  '&#8216;': '‘',
  '&#8220;': '“',
  '&#8221;': '”',
  '&#8243;': '″',
  '&#8242;': '′',
  '&#038;': '&',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&#215;': '×',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
};
const texto = (html = '') =>
  html
    .replace(
      /&#?\w+;/g,
      (e) => entidades[e] ?? (e.startsWith('&#') ? String.fromCodePoint(parseInt(e.slice(2), 10)) : e),
    )
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const lineas = (html = '') =>
  html
    .replace(/<\/(p|li|h\d)>|<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(texto)
    .filter(Boolean);
/** Las líneas de un bloque, en puntos: "• a" es un punto, "– b" un subpunto del anterior; las demás, un título */
const puntos = (html) => {
  const out = [];
  for (const l of lineas(html)) {
    if (/^[–-]\s*/.test(l) && out.length) (out.at(-1).sub ??= []).push(l.replace(/^[–-]\s*/, ''));
    else out.push({ t: l.replace(/^[•·]\s*/, ''), punto: /^[•·]/.test(l) || /<li/.test(html) });
  }
  return out;
};

const tipos = ['centrifugas', 'accesorio', 'producto_laboratorio'];
const wp = {};
for (const tipo of tipos) {
  wp[tipo] = {};
  for (const l of idiomas) {
    wp[tipo][l] = await json(`${WP}/wp/v2/${tipo}?per_page=100&lang=${l}&_fields=id,slug,title,acf`);
  }
}
const erp = await json(`${WP}/ank/v1/centrifugaerp`);
const rotoresErp = await json(`${WP}/ank/v1/rotorerp`);

// Cada producto en sus tres idiomas: WPML enlaza las traducciones por "id_asociado" (centrífugas) o por orden
const traducciones = (tipo, clave) =>
  wp[tipo].es.map((es, i) => {
    const otro = (l) => (clave ? wp[tipo][l].find((x) => x.acf[clave] === es.acf[clave]) : wp[tipo][l][i]);
    return { es, en: otro('en'), fr: otro('fr') };
  });

const porIdioma = (trad, f) => Object.fromEntries(idiomas.map((l) => [l, f(trad[l])]));
const bloques = (p) => (p.acf.bloque || []).map((b) => ({ titulo: texto(b.titulo), puntos: puntos(b.contenido) }));

const numero = (s) => (s == null || s === '' ? undefined : String(s).trim());

// Rotores: cifras y configuraciones de tubos
const rotores = {};
for (const r of rotoresErp) {
  const conf = await json(`${WP}/ank/v1/configuraciones-rotor/${r.id_rotor}`);
  rotores[r.id_rotor] = {
    nombre: r.nombre_rotor,
    tipo: r.tipo_rotor,
    rpm: numero(r.max_velocidad_rpm_rotor),
    xg: numero(r.max_velocidad_rcf_rotor),
    capacidad: numero(r.capacidad_max_rotor),
    radio: numero(r.radio_rotor),
    angulo: numero(r.angulo_rotor),
    tempMin: numero(r.temperatura_min_max_velocidad),
    imagen: r.imagen_rotor,
    tubos: conf.map((c) => ({
      reductor: c.id_reductor === '-' ? undefined : c.id_reductor,
      posiciones: numero(c.num_posiciones),
      tipo: numero(c.tipo_tubo),
      capacidad: numero(c.capacidad_tubo),
      medidas: numero(c.dimensiones_tubo),
    })),
  };
}

// Fotos de los rotores, en WebP a 480 px
await mkdir('public/img/rotores', { recursive: true });
for (const r of Object.values(rotores)) {
  const original = r.imagen;
  const destino = `public/img/rotores/${r.imagen.toLowerCase().replace(/_/g, '-')}.webp`;
  r.imagen = destino.replace('public', '');
  // Las que ya están no se vuelven a bajar
  const yaEsta = await access(destino).then(
    () => true,
    () => false,
  );
  if (yaEsta) continue;
  const res = await fetch(`${IMG}/${original}.avif`);
  if (!res.ok) {
    console.warn('Sin foto:', r.nombre);
    r.imagen = undefined;
    continue;
  }
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destino);
}

const centrifugas = {};
for (const trad of traducciones('centrifugas', 'id_asociado')) {
  const { es } = trad;
  const id = es.acf.id_asociado;
  const e = erp.find((x) => x.id_centrifuga === id);
  const compatibles = await json(`${WP}/ank/v1/rotores-compatibles/${id}`);
  centrifugas[es.slug] = {
    nombre: texto(es.title.rendered),
    temperatura: e?.tipo_centrifuga.toLowerCase(),
    ubicacion: erp.filter((x) => x.id_centrifuga === id).map((x) => x.localizacion_centrifuga.toLowerCase()),
    capacidad: e?.capacidad_max_centrifuga,
    rpm: numero(e?.max_velocidad_rpm_centrifuga),
    xg: numero(e?.max_velocidad_rcf_centrifuga),
    pantalla: es.acf.tipo_de_pantalla,
    pdf: e && {
      es: `${PDF}/${e.catalogo_es_centrifuga}.pdf`,
      en: `${PDF}/${e.catalogo_en_centrifuga}.pdf`,
      fr: `${PDF}/${e.catalogo_fr_centrifuga}.pdf`,
    },
    relacionada: (es.acf.centrifuga_relacionada || [])
      .map((wid) => wp.centrifugas.es.find((x) => x.id === wid)?.slug)
      .filter(Boolean),
    accesorios: (es.acf.accesorios || []).map((wid) => wp.accesorio.es.find((x) => x.id === wid)?.slug).filter(Boolean),
    versiones: (es.acf.versiones?.fila || []).map((v) => ({
      codigo: v.codigo,
      medidas: numero(v.dimensiones),
      peso: numero(v.peso_neto),
      voltaje: numero(v.voltaje),
      frecuencia: numero(v.frecuencia),
      consumo: numero(v.consumo),
      zMax: numero(v.z_max),
      calefaccion: numero(v.calefaccion),
    })),
    rotores: compatibles.map((c) => c.id_rotor).filter((r) => rotores[r]),
    textos: porIdioma(trad, (p) => p && { descripcion: lineas(p.acf.descripcion), bloques: bloques(p) }),
  };
}

const lab = (tipo) =>
  Object.fromEntries(
    traducciones(tipo).map((trad) => [
      trad.es.slug,
      {
        textos: porIdioma(
          trad,
          (p) => p && { nombre: texto(p.title.rendered), descripcion: lineas(p.acf.descripcion), bloques: bloques(p) },
        ),
      },
    ]),
  );

const salida = {
  fuente: 'ortoalresa.com (WordPress de la web actual)',
  fecha: new Date().toISOString().slice(0, 10),
  centrifugas,
  rotores,
  accesorios: lab('accesorio'),
  laboratorio: lab('producto_laboratorio'),
};
await writeFile('src/data/web-actual.json', JSON.stringify(salida, null, 2) + '\n');
console.log(
  `Centrífugas: ${Object.keys(centrifugas).length} · Rotores: ${Object.keys(rotores).length} · Accesorios: ${Object.keys(salida.accesorios).length} · Laboratorio: ${Object.keys(salida.laboratorio).length}`,
);
