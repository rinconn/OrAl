# 0006 · Datos solo de fuentes oficiales, validados al compilar

- **Estado:** Aceptada
- **Fecha:** 2026-09-28

## Contexto

La web actual se contradice (garantía de 2 y 3 años, 70 y 75 años). Un distribuidor que ve un dato erróneo
en una ficha técnica deja de fiarse de todas.

## Decisión

- Toda especificación sale del **Catálogo General 2025** o de la web actual, y si falta se pide a la empresa
  ([Contenido](../contenido.md)).
- El catálogo se transcribe a datos estructurados con un **esquema** (colecciones de contenido de Astro).
  Si un campo obligatorio falta o un número viene como texto, la web no compila.
- Datos de producto y medios (fotos, CAD, PDFs) van en archivos separados.

## Alternativas descartadas

- **Escribir las fichas a mano en cada página:** el mismo dato acabaría copiado en varios sitios y se desincronizaría.

## Consecuencias

- Un dato se corrige en un solo sitio y cambia en toda la web.
- Cuando salga el catálogo 2026, se actualiza el archivo de datos y el esquema avisa de lo que falte.
