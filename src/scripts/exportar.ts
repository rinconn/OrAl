// Descargar lo que se ve para mandárselo al cliente: la tabla del catálogo (con sus filtros y su orden) o la
// comparativa, en PDF o en Excel. Se lee la propia tabla de la página: lo oculto por los filtros no sale, y las
// columnas de botones (marcadas con .fuera) tampoco. El Excel se escribe aquí mismo (un .xlsx de verdad, sin
// librerías); el PDF lo hace jsPDF y se enseña antes en una vista previa, desde donde se descarga o se imprime.

export interface Celda {
  t: string;
  n?: number;
  img?: string;
  /** El mayor de su fila en la comparativa: negrita y punto rojo, como en la ventana */
  mejor?: boolean;
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
  /** Vista de tarjetas: en vez de la tabla, fichas con foto agrupadas por familia, como en la pantalla */
  grupos?: Grupo[];
  /** Comparativa: la leyenda del punto rojo ("El mayor de la comparación"), bajo la tabla */
  leyenda?: string;
  /** Presupuesto: el comentario del distribuidor, con su etiqueta, bajo la tabla */
  nota?: [string, string];
  archivo: string;
}
export interface Ficha {
  img?: string;
  /** Producto de laboratorio (no centrífuga): su foto va algo más pequeña, como en la tarjeta */
  lab?: boolean;
  temp?: string;
  uso: string;
  nombre: string;
  frase?: string;
  /** Cada cifra de la placa: nombre y valor con su unidad */
  cifras: [string, string][];
  /** Lo que ponen los productos de laboratorio en vez de cifras (su modelo) */
  modelo?: string;
}
export interface Grupo {
  n: string;
  nombre: string;
  /** Color de la familia, en hexadecimal */
  color: string;
  cuenta: string;
  usos: string[];
  fichas: Ficha[];
}

const limpio = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// ——— Leer una tabla: cada celda da una columna, o varias si lleva dentro partes marcadas con data-x ———
const partes = (c: Element): Celda[] => {
  const xs = [...c.querySelectorAll<HTMLElement>('[data-x]')];
  if (xs.length) return xs.map((x) => ({ t: limpio(x.textContent) }));
  const n = (c as HTMLElement).dataset.n;
  return [
    { t: limpio(c.textContent), n: n ? Number(n) : undefined, mejor: c.classList.contains('mejor') || undefined },
  ];
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
  const lineas = [...h.datos.map(([e, v]) => `${e}: ${v}`), ...(h.nota ? [`${h.nota[0]}: ${h.nota[1]}`] : []), h.fecha];
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

// ——— PDF: un documento de empresa en A4, generado aquí (jsPDF, que solo se carga al pedirlo). Banda carbón con el
// logo en blanco, el tipo de documento, el título y la fecha, cerrada por la raya roja; debajo, lo que resume con sus
// etiquetas; la tabla con cabecera oscura y filas alternas; y al pie de cada hoja, la empresa y "1 / 2". Se enseña en
// una vista previa, con "Descargar PDF" e "Imprimir", y se elige ———
export interface Pie {
  /** Razón social y dirección, en gris bajo la marca */
  empresa: string;
  web: string;
  /** "Página {p} de {n}" */
  pagina: string;
  fuente: string;
}
export type Rgb = [number, number, number];
export const ROJO: Rgb = [221, 4, 10];
export const TINTA: Rgb = [26, 26, 26];
export const CARBON: Rgb = [21, 23, 25];
export const GRIS: Rgb = [110, 110, 110];
// Las letras del PDF son las estándar (Helvetica): lo que no cabe en ellas, por su equivalente
export const pdfTxt = (s: string) =>
  s.replace(/[‘’]/g, "'").replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/[–—]/g, '-');
// Una imagen de la página, lista para el PDF: las fotos en JPEG sobre blanco; el logo, en PNG con su transparencia
export type Img = { data: string; w: number; h: number };
export const cargar = (src: string, lado: number, png = false) =>
  new Promise<Img | undefined>((ok) => {
    const im = new Image();
    im.onload = () => {
      const nw = im.naturalWidth || lado;
      const nh = im.naturalHeight || lado;
      // El logo (SVG) se dibuja a ese ancho para que salga nítido; las fotos, como mucho a ese lado
      const k = png ? lado / nw : Math.min(1, lado / Math.max(nw, nh));
      const w = Math.max(1, Math.round(nw * k));
      const h = Math.max(1, Math.round(nh * k));
      const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
      const g = c.getContext('2d')!;
      if (!png) {
        g.fillStyle = '#fff';
        g.fillRect(0, 0, w, h);
      }
      g.drawImage(im, 0, 0, w, h);
      ok({ data: c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.9), w, h });
    };
    im.onerror = () => ok(undefined);
    im.src = src;
  });
// Cabe en una caja sin deformarse, centrada
export const encajar = (im: Img, x: number, y: number, w: number, h: number) => {
  const k = Math.min(w / im.w, h / im.h);
  return [x + (w - im.w * k) / 2, y + (h - im.h * k) / 2, im.w * k, im.h * k] as const;
};
const imagen = (src: string) =>
  new Promise<HTMLImageElement | undefined>((ok) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => ok(undefined);
    im.src = src;
  });
// La foto de una tarjeta como en la pantalla: la máquina sobre la mesa oscura, apoyada en su sombra
const estudio = async (src: string | undefined, fondo: HTMLImageElement | undefined, lab = false): Promise<Img> => {
  const [w, h] = [640, 480];
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const g = c.getContext('2d')!;
  g.fillStyle = '#2b2e31';
  g.fillRect(0, 0, w, h);
  if (fondo) {
    const k = Math.max(w / fondo.naturalWidth, h / fondo.naturalHeight);
    const [fw, fh] = [fondo.naturalWidth * k, fondo.naturalHeight * k];
    g.drawImage(fondo, (w - fw) / 2, (h - fh) / 2, fw, fh);
  }
  g.save();
  g.filter = 'blur(12px)';
  g.fillStyle = 'rgba(0,0,0,0.6)';
  g.beginPath();
  g.ellipse(w / 2, h * 0.87, w * 0.29, h * 0.035, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  const im = src ? await imagen(src) : undefined;
  if (im) {
    const alto = h * (lab ? 0.74 : 0.82);
    const k = Math.min(alto / im.naturalHeight, (w * 0.86) / im.naturalWidth);
    const [iw, ih] = [im.naturalWidth * k, im.naturalHeight * k];
    g.drawImage(im, (w - iw) / 2, h * 0.89 - ih, iw, ih);
  }
  return { data: c.toDataURL('image/jpeg', 0.86), w, h };
};
const hexRgb = (hex: string): Rgb => {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : GRIS;
};
// Más claro, para que el color de la familia se lea sobre la banda oscura
const aclarar = ([r, g, b]: Rgb, k: number): Rgb => [r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k];

// ——— Las tarjetas en el PDF: por familia, su cabecera oscura con el número, el nombre y cuántas hay; debajo, tres
// fichas por fila con la foto sobre la mesa, la raya del color de la familia, aplicación, nombre, frase y la placa ———
export type Doc = InstanceType<(typeof import('jspdf'))['jsPDF']>;
async function fichasPdf(doc: Doc, grupos: Grupo[], y: number, M: number, ancho: number) {
  const fondo = await imagen('/img/fondos/mesa-tarjeta.webp');
  const fotos = await Promise.all(grupos.map((gr) => Promise.all(gr.fichas.map((f) => estudio(f.img, fondo, f.lab)))));
  const limite = 297 - 20;
  const cols = 3;
  const gap = 4;
  const cw = (ancho - gap * (cols - 1)) / cols;
  const ph = cw * 0.75;
  const pad = 4;
  const iw = cw - 2 * pad;
  // Lo que ocupa cada ficha, para que las de una fila tengan el mismo alto
  const medir = (f: Ficha) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const nombre = doc.splitTextToSize(pdfTxt(f.nombre), iw) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const frase = (f.frase ? (doc.splitTextToSize(pdfTxt(f.frase), iw) as string[]) : []).slice(0, 3);
    const n = Math.max(1, f.cifras.length);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const valores = f.cifras.map(([, v]) => doc.splitTextToSize(pdfTxt(v), iw / n - 1.5) as string[]);
    const lineasPlaca = Math.max(1, ...valores.map((l) => l.length));
    doc.setFontSize(4.8);
    const etiquetas = f.cifras.map(([k]) => doc.splitTextToSize(pdfTxt(k.toUpperCase()), iw / n - 2) as string[]);
    const lineasEtq = Math.max(1, ...etiquetas.map((l) => l.length));
    const placa = 4.5 + 2.2 * lineasEtq + 3.6 * lineasPlaca;
    const cuerpo = 6.5 + 5.2 * nombre.length + (frase.length ? 1 + 3.1 * frase.length : 0) + 3 + placa;
    return { nombre, frase, valores, etiquetas, lineasEtq, placa, cuerpo };
  };
  const nueva = () => {
    doc.addPage();
    return M + 2;
  };

  for (const [gi, gr] of grupos.entries()) {
    const color = hexRgb(gr.color);
    const medidas = gr.fichas.map(medir);
    const altoFila = (i: number) => ph + 1.2 + Math.max(...medidas.slice(i, i + cols).map((m) => m.cuerpo));
    // La cabecera nunca se queda sola al pie de una hoja: va con su primera fila
    const cab = 17;
    if (y + cab + 4 + altoFila(0) > limite) y = nueva();
    doc.setFillColor(...CARBON);
    doc.rect(M, y, ancho, cab, 'F');
    doc.setFillColor(...color);
    doc.rect(M, y, 1.6, cab, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...aclarar(color, 0.25));
    doc.text(gr.n, M + 6, y + 11.6);
    const xn = M + 6 + doc.getTextWidth(gr.n) + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(pdfTxt(gr.nombre), xn, y + 8.6);
    doc.setFontSize(6.5);
    doc.setTextColor(191, 197, 201);
    doc.text(pdfTxt(gr.usos.join('  ·  ')), xn, y + 13.4, { maxWidth: ancho - (xn - M) - 34 });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(pdfTxt(gr.cuenta), M + ancho - 6, y + 10.2, { align: 'right' });
    y += cab + 4;

    for (let i = 0; i < gr.fichas.length; i += cols) {
      const alto = altoFila(i);
      if (y + alto > limite) y = nueva();
      gr.fichas.slice(i, i + cols).forEach((f, j) => {
        const m = medidas[i + j];
        const foto = fotos[gi][i + j];
        const x = M + j * (cw + gap);
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, cw, alto, 'F');
        doc.addImage(foto.data, 'JPEG', x, y, cw, ph);
        doc.setFillColor(...aclarar(color, 0.1));
        doc.rect(x, y + ph, cw, 1.2, 'F');
        // La temperatura, en su etiqueta blanca sobre la foto
        if (f.temp) {
          const temp = f.temp.toUpperCase();
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          const tw = doc.getTextWidth(pdfTxt(temp)) + 4;
          doc.setFillColor(255, 255, 255);
          doc.rect(x + 2.5, y + 2.5, tw, 5, 'F');
          doc.setTextColor(...TINTA);
          doc.text(pdfTxt(temp), x + 4.5, y + 5.9);
        }
        let yy = y + ph + 1.2 + 5.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(...GRIS);
        doc.setCharSpace(0.35);
        doc.text(pdfTxt(f.uso.toUpperCase()), x + pad, yy, { maxWidth: iw });
        doc.setCharSpace(0);
        yy += 5.6;
        doc.setFontSize(12);
        doc.setTextColor(...TINTA);
        doc.text(m.nombre, x + pad, yy);
        yy += 5.2 * (m.nombre.length - 1);
        if (m.frase.length) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(77, 77, 77);
          doc.text(m.frase, x + pad, yy + 4.3, { lineHeightFactor: 1.25 });
        }
        // La placa, abajo del todo: cada cifra con su nombre encima, separadas por rayas finas
        const yp = y + alto - m.placa - 3;
        doc.setDrawColor(225, 225, 225);
        doc.setLineWidth(0.25);
        doc.line(x + pad, yp, x + cw - pad, yp);
        if (f.cifras.length) {
          const pw = iw / f.cifras.length;
          f.cifras.forEach((_, c) => {
            const px = x + pad + c * pw;
            if (c) doc.line(px - 0.75, yp + 2, px - 0.75, yp + m.placa);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(4.8);
            doc.setTextColor(...GRIS);
            doc.text(m.etiquetas[c], px + (c ? 0.75 : 0), yp + 4.2, { lineHeightFactor: 1.25 });
            doc.setCharSpace(0);
            doc.setFontSize(8);
            doc.setTextColor(...TINTA);
            doc.text(m.valores[c], px + (c ? 0.75 : 0), yp + 4.8 + 2.2 * m.lineasEtq + 2.8, { lineHeightFactor: 1.2 });
          });
        } else if (f.modelo) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...TINTA);
          doc.text(pdfTxt(f.modelo), x + pad, yp + 6.5, { maxWidth: iw });
        }
        doc.setDrawColor(95, 101, 107);
        doc.setLineWidth(0.35);
        doc.rect(x, y, cw, alto, 'S');
      });
      y += alto + gap;
    }
    y += 3;
  }
  return y;
}

// Banda de la cabecera: logo, raya vertical, tipo en rojo y título; la fecha a la derecha
export function cabecera(
  doc: Doc,
  logo: Img | undefined,
  h: Pick<Hoja, 'tipo' | 'titulo' | 'fecha'>,
  M: number,
  ancho: number,
) {
  doc.setFillColor(...CARBON);
  doc.rect(M, M, ancho, 25, 'F');
  let x = M + 7;
  if (logo) {
    const lh = 10;
    const lw = (logo.w / logo.h) * lh;
    doc.addImage(logo.data, 'PNG', x, M + (25 - lh) / 2, lw, lh);
    x += lw + 7;
    doc.setDrawColor(51, 56, 60);
    doc.setLineWidth(0.3);
    doc.line(x, M + 6, x, M + 19);
    x += 7;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...ROJO);
  doc.setCharSpace(0.5);
  doc.text(pdfTxt(h.tipo.toUpperCase()), x, M + 10.5);
  doc.setCharSpace(0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(pdfTxt(h.titulo), x, M + 18.5);
  doc.setFontSize(8);
  doc.setTextColor(191, 197, 201);
  doc.text(pdfTxt(h.fecha), M + ancho - 7, M + 18.5, { align: 'right' });
  doc.setFillColor(...ROJO);
  doc.rect(M, M + 25, ancho, 1.2, 'F');
}

// Datos: una franja gris con cada dato y su etiqueta. Devuelve su alto
export function franja(doc: Doc, datos: [string, string][], y0: number, M: number, ancho: number) {
  const cw = ancho / datos.length;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const valores = datos.map(([, v]) => doc.splitTextToSize(pdfTxt(v), cw - 12) as string[]);
  const alto = 11 + 4 * Math.max(...valores.map((l) => l.length));
  doc.setFillColor(242, 242, 242);
  doc.rect(M, y0, ancho, alto, 'F');
  datos.forEach(([e], i) => {
    const cx = M + i * cw;
    if (i) {
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.4);
      doc.line(cx, y0, cx, y0 + alto);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...GRIS);
    doc.setCharSpace(0.4);
    doc.text(pdfTxt(e.toUpperCase()), cx + 6, y0 + 5.5);
    doc.setCharSpace(0);
    doc.setFontSize(9);
    doc.setTextColor(...TINTA);
    doc.text(valores[i], cx + 6, y0 + 10.5);
  });
  return alto;
}

let autoTablaCargada: (typeof import('jspdf-autotable'))['autoTable'] | undefined;
async function generar(h: Hoja, pie: Pie) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  autoTablaCargada = autoTable;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: pdfTxt(`${h.titulo} · ${h.fecha}`), author: 'Orto Alresa', creator: 'ortoalresa.com' });
  const M = 12;
  const ancho = 210 - 2 * M;
  const comparativa = h.cabecera.some((c) => c.img);
  const [logo, ...fotos] = await Promise.all([
    cargar('/img/marca/logo-ortoalresa-white.svg', 600, true),
    ...h.cabecera.map((c) => (c.img ? cargar(c.img, 500) : Promise.resolve(undefined))),
    ...h.filas.map((f) => (f[0]?.img ? cargar(f[0].img, 160) : Promise.resolve(undefined))),
  ]);
  const fotosCab = fotos.slice(0, h.cabecera.length);
  const fotosFila = fotos.slice(h.cabecera.length);

  cabecera(doc, logo, h, M, ancho);
  const y0 = M + 26.2;
  const alto = franja(doc, h.datos, y0, M, ancho);

  // Vista de tarjetas: las fichas por familia en vez de la tabla
  let fin: number;
  if (h.grupos) fin = await fichasPdf(doc, h.grupos, y0 + alto + 6, M, ancho);
  else fin = tabla(doc, h, { y: y0 + alto + 6, M, ancho, comparativa, fotosCab, fotosFila });

  // La leyenda del punto rojo (comparativa) y de dónde salen los datos, bajo lo último
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...GRIS);
  let yl = Math.min(fin + (h.grupos ? 0 : 6), 297 - 20);
  // El comentario del presupuesto: etiqueta pequeña y el texto entero; si no cabe sobre el pie, en una hoja nueva
  if (h.nota) {
    const [e, v] = h.nota;
    doc.setFontSize(9);
    const lineasNota = doc.splitTextToSize(pdfTxt(v), ancho) as string[];
    const altoNota = 6 + lineasNota.length * 4;
    let yn = fin + 8;
    if (yn + altoNota > 297 - 22) {
      doc.addPage();
      yn = M + 10;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...GRIS);
    doc.setCharSpace(0.4);
    doc.text(pdfTxt(e.toUpperCase()), M, yn);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TINTA);
    doc.text(lineasNota, M, yn + 5);
    yl = Math.min(yn + altoNota + 2, 297 - 20);
    doc.setFontSize(6.5);
    doc.setTextColor(...GRIS);
  }
  if (h.leyenda) {
    doc.setFillColor(...ROJO);
    doc.circle(M + 0.9, yl - 0.8, 0.9, 'F');
    doc.text(pdfTxt(h.leyenda), M + 3.2, yl);
    yl = Math.min(yl + 4, 297 - 20);
  }
  if (pie.fuente) doc.text(pdfTxt(pie.fuente), M, yl);
  pieDeHojas(doc, pie, M, ancho);
  return doc.output('blob');
}

// La tabla: cabecera oscura con la raya roja (en la comparativa, cada máquina con su foto) y filas alternas
function tabla(
  doc: Doc,
  h: Hoja,
  o: {
    y: number;
    M: number;
    ancho: number;
    comparativa: boolean;
    fotosCab: (Img | undefined)[];
    fotosFila: (Img | undefined)[];
  },
) {
  const { M, ancho, comparativa, fotosCab, fotosFila } = o;
  const autoTable = autoTablaCargada!;
  const num = h.cabecera.map((c) => !!c.num);
  const conFoto = fotosFila.some(Boolean);
  autoTable(doc, {
    startY: o.y,
    margin: { left: M, right: M, top: M + 4, bottom: 18 },
    head: [h.cabecera.map((c) => pdfTxt(comparativa ? c.t : c.t.toUpperCase()))],
    body: h.filas.map((f) => f.map((c) => pdfTxt(comparativa ? c.t : c.t))),
    showHead: 'everyPage',
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: [77, 77, 77],
      cellPadding: { top: 2.4, bottom: 2.4, left: 3, right: 3 },
      valign: 'middle',
      lineColor: [230, 230, 230],
      lineWidth: { bottom: 0.2 },
    },
    headStyles: {
      fillColor: TINTA,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: comparativa ? 9 : 6.5,
      valign: 'bottom',
      cellPadding: comparativa
        ? { top: 33, bottom: 3, left: 3, right: 3 }
        : { top: 3.2, bottom: 3.2, left: 3, right: 3 },
      lineWidth: 0,
    },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    columnStyles: Object.fromEntries(
      h.cabecera.map((_, i) => [
        i,
        i === 0
          ? comparativa
            ? { cellWidth: ancho * 0.24 }
            : {
                fontStyle: 'bold' as const,
                textColor: TINTA,
                ...(conFoto ? { cellPadding: { top: 2.4, bottom: 2.4, left: 13, right: 3 }, minCellHeight: 10 } : {}),
              }
          : { halign: num[i] ? ('right' as const) : ('left' as const), ...(num[i] ? { textColor: TINTA } : {}) },
      ]),
    ),
    didParseCell: (d) => {
      if (!comparativa || d.section !== 'body') return;
      // Comparativa: la etiqueta de cada fila pequeña, en gris y mayúsculas; los valores, en negro
      if (d.column.index === 0) {
        d.cell.text = d.cell.text.map((t) => t.toUpperCase());
        Object.assign(d.cell.styles, { fontStyle: 'bold', fontSize: 6.5, textColor: GRIS });
      } else {
        d.cell.styles.textColor = TINTA;
        if (h.filas[d.row.index]?.[d.column.index]?.mejor) d.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawCell: (d) => {
      const { x: cx, y: cy, width: w, height: ch } = d.cell;
      if (d.section === 'head') {
        doc.setFillColor(...ROJO);
        doc.rect(cx, cy + ch - 0.7, w, 0.7, 'F');
        const f = fotosCab[d.column.index];
        if (f) {
          doc.setFillColor(255, 255, 255);
          doc.rect(cx + 3, cy + 3, w - 6, 27, 'F');
          doc.addImage(f.data, 'JPEG', ...encajar(f, cx + 4, cy + 4, w - 8, 25));
        }
      }
      // El mayor de la fila: un punto rojo tras la cifra, como en la ventana
      if (comparativa && d.section === 'body' && h.filas[d.row.index]?.[d.column.index]?.mejor) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(d.cell.styles.fontSize);
        const tw = Math.max(...d.cell.text.map((t) => doc.getTextWidth(t)));
        doc.setFillColor(...ROJO);
        doc.circle(cx + 3 + tw + 2.2, cy + ch / 2, 0.85, 'F');
      }
      if (d.section === 'body' && d.column.index === 0 && !comparativa) {
        const f = fotosFila[d.row.index];
        if (f) doc.addImage(f.data, 'JPEG', ...encajar(f, cx + 3, cy + (ch - 7) / 2, 7, 7));
      }
    },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

// Pie de cada hoja, como un membrete: raya roja corta, la marca en negrita y debajo la empresa en gris; a la
// derecha la web en rojo y "Página 1 de 2"
export function pieDeHojas(doc: Doc, pie: Pie, M: number, ancho: number) {
  const n = doc.getNumberOfPages();
  for (let p = 1; p <= n; p++) {
    doc.setPage(p);
    doc.setFillColor(...ROJO);
    doc.rect(M, 297 - 15, 14, 0.9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...TINTA);
    doc.setCharSpace(0.8);
    doc.text('ORTO ALRESA', M, 297 - 10);
    doc.setCharSpace(0);
    doc.setTextColor(...ROJO);
    doc.text(pdfTxt(pie.web), M + ancho, 297 - 10, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...GRIS);
    doc.text(pdfTxt(pie.empresa), M, 297 - 6.5);
    doc.text(pdfTxt(pie.pagina.replace('{p}', String(p)).replace('{n}', String(n))), M + ancho, 297 - 6.5, {
      align: 'right',
    });
  }
}

// Vista previa: el PDF ya hecho dentro de una ventana, con "Descargar PDF" e "Imprimir"
let enlace = '';
let nombre = '';
export const pdf = (h: Hoja, pie: Pie) => vistaPdf(() => generar(h, pie), h.archivo);
/** La vista previa de cualquier PDF hecho en la página (la usa también el dossier de Descargas) */
export async function vistaPdf(hacer: () => Promise<Blob>, archivo: string) {
  const dialogo = document.getElementById('vista-pdf') as HTMLDialogElement | null;
  if (!dialogo) return;
  const marco = dialogo.querySelector('iframe')!;
  dialogo.classList.remove('fallo');
  dialogo.classList.add('cargando');
  if (!dialogo.open) dialogo.showModal();
  let blob: Blob;
  try {
    blob = await hacer();
  } catch {
    dialogo.classList.replace('cargando', 'fallo');
    return;
  }
  if (enlace) URL.revokeObjectURL(enlace);
  enlace = URL.createObjectURL(blob);
  nombre = `${archivo}.pdf`;
  // Sin visor de PDF en el navegador (la mayoría de móviles), solo se ofrece descargarlo
  dialogo.classList.toggle('sin-visor', navigator.pdfViewerEnabled === false);
  marco.src = `${enlace}#view=FitH&navpanes=0`;
  dialogo.classList.remove('cargando');
}
// Sin vista previa: el PDF se hace y se descarga directamente (lo usa "Pedir presupuesto", para adjuntarlo al correo)
export async function descargarPdf(h: Hoja, pie: Pie) {
  const url = URL.createObjectURL(await generar(h, pie));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${h.archivo}.pdf` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function iniciarVistaPdf() {
  const dialogo = document.getElementById('vista-pdf') as HTMLDialogElement | null;
  if (!dialogo) return;
  const marco = dialogo.querySelector('iframe')!;
  dialogo.querySelector('.vp-descargar')!.addEventListener('click', () => {
    if (!enlace) return;
    const a = Object.assign(document.createElement('a'), { href: enlace, download: nombre });
    document.body.append(a);
    a.click();
    a.remove();
  });
  dialogo.querySelector('.vp-imprimir')!.addEventListener('click', () => {
    try {
      marco.contentWindow?.focus();
      marco.contentWindow?.print();
    } catch {
      window.open(enlace, '_blank');
    }
  });
  dialogo.querySelector('.vp-cerrar')!.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', (ev) => {
    if (ev.target === dialogo) dialogo.close();
  });
  dialogo.addEventListener('close', () => marco.removeAttribute('src'));
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
