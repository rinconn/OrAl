// El dossier de Descargas en PDF: los equipos elegidos, cada uno con su foto, familia, frase, fecha y el QR (y el
// enlace) de cada catálogo, para enviárselo al cliente o imprimirlo. Al final, el QR de la propia selección en la
// web. Misma cabecera, franja de datos y pie que el resto de PDF de la web (src/scripts/exportar.ts).
import {
  cabecera,
  cargar,
  encajar,
  franja,
  GRIS,
  pdfTxt,
  pieDeHojas,
  ROJO,
  TINTA,
  type Doc,
  type Pie,
} from './exportar';
import { qrMatriz } from './qr';

export interface EquipoDossier {
  nombre: string;
  variantes?: string;
  grupo: string;
  frase: string;
  /** "Actualizado 10 jun 2026" */
  fecha: string;
  /** Foto del equipo; los documentos de empresa no tienen */
  img: string;
  /** Su ficha en la web, con la dirección completa */
  ficha: string;
  pdfs: { l: string; url: string; peso: string }[];
}

export interface Dossier {
  tipo: string;
  titulo: string;
  fecha: string;
  datos: [string, string][];
  intro: string;
  /** "Ver la ficha en la web" */
  verFicha: string;
  /** "Esta selección en la web" y su dirección */
  enlace: [string, string];
  equipos: EquipoDossier[];
}

// El QR con sus módulos exactos, fila a fila (los negros seguidos, en un solo rectángulo) y su margen blanco
function qr(doc: Doc, texto: string, x: number, y: number, lado: number) {
  const filas = qrMatriz(texto);
  const m = 2;
  const k = lado / (filas.length + 2 * m);
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, lado, lado, 'F');
  doc.setFillColor(...TINTA);
  filas.forEach((fila, j) => {
    for (let i = 0; i < fila.length; i++) {
      if (!fila[i]) continue;
      let fin = i;
      while (fila[fin + 1]) fin++;
      doc.rect(x + (i + m) * k, y + (j + m) * k, (fin - i + 1) * k + 0.01, k + 0.01, 'F');
      i = fin;
    }
  });
  doc.link(x, y, lado, lado, { url: texto });
}

export async function dossierPdf(d: Dossier, pie: Pie) {
  const { jsPDF } = await import('jspdf');
  // Comprimido: los QR son cientos de rectángulos
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({ title: pdfTxt(`${d.titulo} · ${d.fecha}`), author: 'Orto Alresa', creator: 'ortoalresa.com' });
  const M = 12;
  const ancho = 210 - 2 * M;
  const limite = 297 - 22;
  const [logo, ...fotos] = await Promise.all([
    cargar('/img/marca/logo-ortoalresa-white.svg', 600, true),
    ...d.equipos.map((e) => (e.img ? cargar(e.img, 420) : Promise.resolve(undefined))),
  ]);

  cabecera(doc, logo, d, M, ancho);
  let y = M + 26.2;
  y += franja(doc, d.datos, y, M, ancho) + 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRIS);
  doc.text(pdfTxt(d.intro), M, y);
  y += 4;

  // Cada equipo, una fila: la foto sobre el gris, el texto en medio y los QR de sus catálogos a la derecha
  const alto = 44;
  const foto = 40;
  const lado = 25;
  const hueco = 5;
  d.equipos.forEach((e, n) => {
    if (y + alto > limite) {
      doc.addPage();
      y = M + 2;
    }
    doc.setFillColor(242, 242, 242);
    doc.rect(M, y + 2, foto, alto - 4, 'F');
    const f = fotos[n];
    if (f) doc.addImage(f.data, 'JPEG', ...encajar(f, M + 3, y + 5, foto - 6, alto - 10));
    else {
      // Documento sin foto (certificado, condiciones): la marca de PDF
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...ROJO);
      doc.text('PDF', M + foto / 2, y + alto / 2 + 2, { align: 'center' });
    }

    const qrs = e.pdfs.length * lado + (e.pdfs.length - 1) * hueco;
    const xt = M + foto + 7;
    const wt = ancho - foto - 7 - qrs - 8;
    let yt = y + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...ROJO);
    doc.setCharSpace(0.4);
    doc.text(pdfTxt(e.grupo.toUpperCase()), xt, yt);
    doc.setCharSpace(0);
    yt += 6.5;
    doc.setFontSize(15);
    doc.setTextColor(...TINTA);
    doc.text(pdfTxt(e.nombre), xt, yt);
    if (e.variantes) {
      const w = doc.getTextWidth(pdfTxt(e.nombre));
      doc.setFont('helvetica', 'normal');
      doc.text(pdfTxt(` · ${e.variantes}`), xt + w, yt, { maxWidth: wt - w });
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(77, 77, 77);
    const frase = (doc.splitTextToSize(pdfTxt(e.frase), wt) as string[]).slice(0, 3);
    doc.text(frase, xt, yt + 5.5, { lineHeightFactor: 1.3 });
    doc.setFontSize(7);
    doc.setTextColor(...GRIS);
    doc.text(pdfTxt(e.fecha), xt, y + alto - 9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ROJO);
    // Solo los equipos tienen ficha; un documento de empresa ya es su propio PDF
    if (e.img) doc.textWithLink(pdfTxt(`${d.verFicha} »`), xt, y + alto - 4.5, { url: e.ficha });

    e.pdfs.forEach((p, i) => {
      const xq = M + ancho - qrs + i * (lado + hueco);
      qr(doc, p.url, xq, y + 3, lado);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...TINTA);
      doc.text(`PDF ${p.l.toUpperCase()}`, xq + lado / 2, y + lado + 7, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GRIS);
      doc.text(pdfTxt(p.peso), xq + lado / 2, y + lado + 10.5, { align: 'center' });
    });

    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.25);
    doc.line(M, y + alto + 1, M + ancho, y + alto + 1);
    y += alto + 3;
  });

  // La selección en la web: su QR y su dirección, para volver a ella o pasársela a otro
  const caja = 30;
  if (y + caja + 4 > limite) {
    doc.addPage();
    y = M + 2;
  }
  y += 4;
  doc.setFillColor(242, 242, 242);
  doc.rect(M, y, ancho, caja, 'F');
  doc.setFillColor(...ROJO);
  doc.rect(M, y, 1.2, caja, 'F');
  qr(doc, d.enlace[1], M + ancho - caja + 3, y + 3, caja - 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...TINTA);
  doc.text(pdfTxt(d.enlace[0]), M + 7, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...ROJO);
  const url = doc.splitTextToSize(d.enlace[1], ancho - caja - 14) as string[];
  doc.text(url, M + 7, y + 18);
  doc.link(M + 7, y + 15, ancho - caja - 14, 4 * url.length, { url: d.enlace[1] });

  pieDeHojas(doc, pie, M, ancho);
  return doc.output('blob');
}
