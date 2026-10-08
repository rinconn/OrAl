# 0010 · Los PDF del catálogo se generan con jsPDF, en Helvetica

- **Estado:** Aceptada
- **Fecha:** 2026-10-08

## Contexto

El distribuidor necesita mandar al cliente la tabla filtrada, la comparativa o la lista de presupuesto. La primera
versión usaba una hoja de impresión: el navegador abría su ventana de imprimir, añadía arriba la fecha, la hora y el
nombre de la página, no ofrecía claramente descargar y "atrás" sacaba del catálogo.

## Decisión

El PDF se genera en el navegador con jsPDF y jspdf-autotable (versiones fijas, solo se cargan al pulsar "PDF") y se
enseña en una vista previa con "Descargar PDF" e "Imprimir". Va en Helvetica, la estándar de los PDF. El Excel sigue
escrito a mano (un `.xlsx` sin librerías).

## Alternativas descartadas

- **Hoja de impresión del navegador:** sin descarga directa y con la cabecera del navegador encima.
- **Captura de la página (html2canvas):** el texto sale como imagen, pesa más y no se puede copiar ni buscar.
- **Generarlo en un servidor:** la web es estática ([0001](0001-web-estatica-con-astro.md)).
- **Incrustar Helvetica Neue Condensed:** los archivos de la marca son OpenType CFF, que jsPDF no admite, y la licencia
  de Helvetica Neue suele no permitir incrustarla en documentos que se reparten.

## Consecuencias

Unos 430 KB más de JavaScript (unos 140 KB comprimido), pero solo para quien pulsa "PDF". El diseño del PDF vive en
`src/scripts/exportar.ts`, aparte de los estilos de la web: un cambio de marca hay que llevarlo también allí. Si algún
día hay una versión TrueType con licencia para incrustar, se puede cambiar la letra.
