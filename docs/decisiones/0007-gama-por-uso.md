# 0007 · La gama se agrupa por uso, con un color por familia

- **Estado:** Aceptada
- **Fecha:** 2026-09-29

## Contexto

El catálogo reparte las centrífugas en ocho familias (Mini, Pequeña, Micro, Universales, Gran capacidad,
Sobre piso, Industriales y Clínicas). En la web eran demasiadas pestañas, y varias tenían una sola serie.

## Decisión

Cinco familias por uso: Compactas (Mini, Pequeña y Micro), Universales, Gran capacidad (incluye Magnus,
de suelo), Clínica e Industria. Cada una tiene un color suave (`src/data/productos.ts`) que aparece en el
filtro, en la franja de la foto y en el nombre de la familia.

## Alternativas descartadas

- **Las ocho familias del catálogo:** filtro largo y pestañas con una sola serie.
- **Filtro por temperatura:** casi todas son ventiladas; la temperatura va en cada ficha.
- **Colores vivos:** chocaban con el rojo de la marca.

## Consecuencias

Menos pestañas y se encuentra antes la serie. Si el catálogo añade una serie, basta con darle una de las
cinco familias. Los colores son solo de la gama; el rojo sigue siendo el único color de marca.
