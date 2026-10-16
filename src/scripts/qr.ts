// Código QR en SVG, con un solo trazado y sus módulos exactos (se ve nítido a cualquier tamaño y se imprime bien).
// Lo usan la página de Descargas al generarse y el dossier en PDF (que dibuja los módulos con qrMatriz).
import qrcode from 'qrcode-generator';

/** Los módulos del QR de `texto`, fila a fila: true es negro. Sin el margen blanco */
export const qrMatriz = (texto: string): boolean[][] => {
  const qr = qrcode(0, 'M');
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount();
  return Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => qr.isDark(y, x)));
};

/** SVG del QR de `texto`, con su margen blanco de 4 módulos, que es el que piden los lectores */
export const qrSvg = (texto: string, titulo = ''): string => {
  const filas = qrMatriz(texto);
  const m = 4;
  let d = '';
  filas.forEach((fila, y) => fila.forEach((negro, x) => negro && (d += `M${x + m} ${y + m}h1v1h-1z`)));
  const lado = filas.length + m * 2;
  const t = titulo.replace(/[<&"]/g, '');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" shape-rendering="crispEdges"` +
    ` role="img" aria-label="${t}"><rect width="${lado}" height="${lado}" fill="#fff"/>` +
    `<path d="${d}" fill="#1a1a1a"/></svg>`
  );
};
