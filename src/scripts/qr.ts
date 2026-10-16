// Código QR en SVG, con un solo trazado y sus módulos exactos (se ve nítido a cualquier tamaño y se imprime bien).
// Lo usa la página de Descargas al generarse (el QR de la propia página) y en el navegador (el de cada PDF).
import qrcode from 'qrcode-generator';

/** SVG del QR de `texto`, con su margen blanco de 4 módulos, que es el que piden los lectores */
export const qrSvg = (texto: string, titulo = ''): string => {
  const qr = qrcode(0, 'M');
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount();
  const m = 4;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x + m} ${y + m}h1v1h-1z`;
  const lado = n + m * 2;
  const t = titulo.replace(/[<&"]/g, '');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" shape-rendering="crispEdges"` +
    ` role="img" aria-label="${t}"><rect width="${lado}" height="${lado}" fill="#fff"/>` +
    `<path d="${d}" fill="#1a1a1a"/></svg>`
  );
};
