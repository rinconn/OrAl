// Descargar lo que se ve para mandárselo al cliente: la tabla del catálogo (con sus filtros y su orden) o la
// comparativa, en PDF o en Excel. Se lee la propia tabla de la página: lo oculto por los filtros no sale, y las
// columnas de botones (marcadas con .fuera) tampoco. El Excel se escribe aquí mismo (un .xlsx de verdad, sin
// librerías); el PDF es la hoja de impresión de la marca, que el navegador guarda como PDF.

export interface Celda {
  t: string;
  n?: number;
  img?: string;
}
export interface Hoja {
  titulo: string;
  /** Tipo de documento, encima del título ("Selección de equipos") */
  tipo: string;
  fecha: string;
  /** Lo que resume el documento, con su etiqueta: selección, orden, modelos */
  datos: [string, string][];
  cabecera: (Celda & { ud?: string; num?: boolean })[];
  filas: Celda[][];
  archivo: string;
}

const limpio = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// ——— Leer una tabla: cada celda da una columna, o varias si lleva dentro partes marcadas con data-x ———
const partes = (c: Element): Celda[] => {
  const xs = [...c.querySelectorAll<HTMLElement>('[data-x]')];
  if (xs.length) return xs.map((x) => ({ t: limpio(x.textContent) }));
  const n = (c as HTMLElement).dataset.n;
  return [{ t: limpio(c.textContent), n: n ? Number(n) : undefined }];
};
export function leerTabla(tabla: HTMLTableElement, vale: (tr: HTMLTableRowElement) => boolean = () => true) {
  const celdas = (tr: Element) => [...tr.children].filter((c) => !c.classList.contains('fuera'));
  const cabecera = celdas(tabla.tHead!.rows[0]).flatMap((c) => {
    const el = c as HTMLElement;
    const img = el.querySelector('img')?.getAttribute('src') ?? undefined;
    if (el.dataset.cols) return el.dataset.cols.split('|').map((t) => ({ t, img }));
    return [{ t: limpio(el.textContent), ud: el.dataset.ud, num: el.classList.contains('num'), img }];
  });
  const filas = [...tabla.tBodies[0].rows]
    .filter((tr) => !tr.hidden && vale(tr))
    .map((tr) => {
      const fila = celdas(tr).flatMap(partes);
      const img = tr.querySelector('img')?.getAttribute('src');
      if (img) fila[0].img = img;
      return fila;
    });
  return { cabecera, filas };
}

// ——— Excel: un libro con una hoja. Título, lo filtrado, y la tabla con su cabecera oscura, filtro y la fila fija ———
const tablaCrc = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (const x of b) c = tablaCrc[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
// Un .zip sin comprimir: es lo que es un .xlsx por dentro
const zip = (archivos: [string, string][]) => {
  const utf8 = new TextEncoder();
  const locales: Uint8Array[] = [];
  const centrales: Uint8Array[] = [];
  let pos = 0;
  for (const [nombre, texto] of archivos) {
    const n = utf8.encode(nombre);
    const d = utf8.encode(texto);
    const crc = crc32(d);
    const cab = new DataView(new ArrayBuffer(30));
    [
      [0, 0x04034b50, 4],
      [4, 20, 2],
      [6, 0x0800, 2],
      [14, crc, 4],
      [18, d.length, 4],
      [22, d.length, 4],
      [26, n.length, 2],
    ].forEach(([o, v, l]) => (l === 4 ? cab.setUint32(o, v, true) : cab.setUint16(o, v, true)));
    locales.push(new Uint8Array(cab.buffer), n, d);
    const cen = new DataView(new ArrayBuffer(46));
    [
      [0, 0x02014b50, 4],
      [4, 20, 2],
      [6, 20, 2],
      [8, 0x0800, 2],
      [16, crc, 4],
      [20, d.length, 4],
      [24, d.length, 4],
      [28, n.length, 2],
      [42, pos, 4],
    ].forEach(([o, v, l]) => (l === 4 ? cen.setUint32(o, v, true) : cen.setUint16(o, v, true)));
    centrales.push(new Uint8Array(cen.buffer), n);
    pos += 30 + n.length + d.length;
  }
  const largo = centrales.reduce((s, b) => s + b.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, archivos.length, true);
  fin.setUint16(10, archivos.length, true);
  fin.setUint32(12, largo, true);
  fin.setUint32(16, pos, true);
  return new Blob([...locales, ...centrales, new Uint8Array(fin.buffer)] as BlobPart[], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};
const col = (i: number): string => (i < 26 ? '' : col(Math.floor(i / 26) - 1)) + String.fromCharCode(65 + (i % 26));

export function excel(h: Hoja) {
  const cab = h.cabecera.map((c) => (c.ud ? `${c.t} (${c.ud})` : c.t));
  // Con unidad en la cabecera, la cifra va como número (se puede ordenar y sumar en Excel)
  const filas = h.filas.map((f) => f.map((c, i) => ((h.cabecera[i]?.ud || h.cabecera[i]?.num) && c.n ? c.n : c.t)));
  const celda = (v: string | number, ref: string, s: number) =>
    typeof v === 'number'
      ? `<c r="${ref}" s="3"><v>${v}</v></c>`
      : `<c r="${ref}" t="inlineStr" s="${s}"><is><t xml:space="preserve">${escapar(v)}</t></is></c>`;
  const lineas = [...h.datos.map(([e, v]) => `${e}: ${v}`), h.fecha];
  const ini = lineas.length + 3;
  const filasXml = [
    `<row r="1">${celda(h.titulo, 'A1', 1)}</row>`,
    ...lineas.map((l, i) => `<row r="${i + 2}">${celda(l, `A${i + 2}`, 4)}</row>`),
    `<row r="${ini}">${cab.map((t, i) => celda(t, `${col(i)}${ini}`, 2)).join('')}</row>`,
    ...filas.map(
      (f, j) => `<row r="${ini + j + 1}">${f.map((v, i) => celda(v, `${col(i)}${ini + j + 1}`, 0)).join('')}</row>`,
    ),
  ].join('');
  const anchos = cab.map((t, i) =>
    Math.min(48, Math.max(10, t.length + 2, ...filas.map((f) => String(f[i] ?? '').length + 2))),
  );
  const ult = `${col(cab.length - 1)}${ini + filas.length}`;
  const hoja =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${ini}" topLeftCell="A${ini + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<cols>${anchos.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>` +
    `<sheetData>${filasXml}</sheetData><autoFilter ref="A${ini}:${ult}"/></worksheet>`;
  const estilos =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<fonts count="4"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="14"/><name val="Arial"/></font>` +
    `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><sz val="10"/><color rgb="FF6E6E6E"/><name val="Arial"/></font></fonts>` +
    `<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FF1A1A1A"/></patternFill></fill></fills>` +
    `<borders count="2"><border/><border><bottom style="medium"><color rgb="FFDD040A"/></bottom></border></borders>` +
    `<cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="5"><xf/><xf fontId="1" applyFont="1"/>` +
    `<xf fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="3" applyNumberFormat="1"/>` +
    `<xf fontId="3" applyFont="1"/></cellXfs></styleSheet>`;
  const blob = zip([
    [
      '[Content_Types].xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    ],
    [
      '_rels/.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    ],
    [
      'xl/workbook.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Orto Alresa" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'Orto Alresa'!$A$${ini}:$${col(cab.length - 1)}$${ini + filas.length}</definedName></definedNames></workbook>`,
    ],
    [
      'xl/_rels/workbook.xml.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    ],
    ['xl/worksheets/sheet1.xml', hoja],
    ['xl/styles.xml', estilos],
  ]);
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `${h.archivo}.xlsx`,
  });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ——— PDF: un documento de empresa. Banda oscura con el logo en blanco, el tipo de documento, el título y la fecha;
// debajo, lo que resume con sus etiquetas; la tabla con filas alternas; y en el margen de cada hoja, la empresa a la
// izquierda y el número de página a la derecha. Se imprime solo ella ———
export interface Pie {
  empresa: string;
  fuente: string;
}
export async function pdf(h: Hoja, pie: Pie) {
  document.getElementById('impreso')?.remove();
  const hoja = document.createElement('div');
  hoja.id = 'impreso';
  const img = (src?: string, cls = '') => (src ? `<img src="${src}" alt="" class="${cls}" loading="eager">` : '');
  const num = h.cabecera.map((c) => !!c.num);
  const comparativa = h.cabecera.some((c) => c.img);
  hoja.className = comparativa ? 'es-comp' : '';
  hoja.innerHTML =
    `<header class="banda"><img class="logo" src="/img/marca/logo-ortoalresa-white.svg" alt="orto alresa">` +
    `<div class="doc"><p class="tipo">${escapar(h.tipo)}</p><h1>${escapar(h.titulo)}</h1></div>` +
    `<p class="fecha">${escapar(h.fecha)}</p></header>` +
    `<dl class="datos">${h.datos.map(([e, v]) => `<div><dt>${escapar(e)}</dt><dd>${escapar(v)}</dd></div>`).join('')}</dl>` +
    `<table><thead><tr>${h.cabecera.map((c, i) => `<th${num[i] ? ' class="num"' : ''}>${img(c.img, 'cab')}<span>${escapar(c.t)}</span></th>`).join('')}</tr></thead>` +
    `<tbody>${h.filas
      .map(
        (f) =>
          `<tr>${f.map((c, i) => `<td${num[i] ? ' class="num"' : ''}>${img(c.img, 'foto')}${escapar(c.t)}</td>`).join('')}</tr>`,
      )
      .join('')}</tbody></table>` +
    `<p class="fuente">${escapar(pie.fuente)}</p>`;
  // El pie de cada hoja va en el margen de la página: la empresa y "1 / 2"
  const margen = document.createElement('style');
  margen.textContent = `@media print { @page { @bottom-left { content: "${pie.empresa.replace(/["\\]/g, '')}"; font: 7.5pt Arial, sans-serif; color: #6e6e6e; } @bottom-right { content: counter(page) " / " counter(pages); font: 7.5pt Arial, sans-serif; color: #6e6e6e; } } }`;
  document.head.append(margen);
  document.body.append(hoja);
  // Que las fotos estén cargadas antes de abrir la impresión
  await Promise.all([...hoja.querySelectorAll('img')].map((i) => i.decode().catch(() => undefined)));
  const titulo = document.title;
  // El navegador usa el título de la página como nombre del PDF
  document.title = h.archivo;
  document.body.classList.add('imprimiendo');
  const fin = () => {
    document.body.classList.remove('imprimiendo');
    document.title = titulo;
    hoja.remove();
    margen.remove();
    window.removeEventListener('afterprint', fin);
  };
  window.addEventListener('afterprint', fin);
  window.print();
}

// Fecha del día para el nombre del archivo (2026-10-08) y para la cabecera, en el idioma de la página
export const hoy = () => {
  const d = new Date();
  return {
    archivo: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    texto: d.toLocaleDateString(document.documentElement.lang || 'es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
};
