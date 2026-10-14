# 0013 · Las familias, sin color propio: grafito y el rojo de la marca

- **Estado:** Aceptada
- **Fecha:** 2026-10-14

## Contexto

La decisión [0007](0007-gama-por-uso.md) dio a cada familia un color suave (morado, verde agua, ocre, granate y
oliva) para distinguirlas cuando la página era una lista larga de tarjetas. Esos cinco colores tenían cada uno su
propia luz e intensidad: no se leían como una familia de colores, el granate rozaba el rojo de la marca y eran lo
único de la web fuera de su paleta.

Con el rediseño de la página de productos, las familias ya se distinguen sin color: pestañas con su nombre arriba y,
al empezar cada una, una franja oscura con su número (01, 02…), su nombre y sus aplicaciones.

## Decisión

- Todas las familias (y accesorios y otros productos de laboratorio) usan el mismo **grafito** (`#3d4247`) en
  `src/data/productos.ts`: la raya bajo la foto de cada tarjeta, el cuadradito de la aplicación, la ficha de
  producto y el PDF.
- Lo que marca dónde empieza cada familia es el **rojo de la marca**: la raya de arriba de su franja y su número.
- Las pestañas de familia van sin marca de color: nombre y número de productos.

## Alternativas descartadas

- **Armonizar los cinco colores** (misma luz e intensidad, el granate pasado a ciruela): seguía siendo una paleta
  ajena a la marca para un dato que ya se ve de otra forma.
- **Una gama fría de aceros:** elegante, pero las familias contiguas apenas se distinguían.
- **Poner en rojo también la raya de cada tarjeta:** la tarjeta se llenaba de rojo junto a la flecha, Comparar y el
  «+» de Presupuesto, que son las acciones.

## Consecuencias

- La web usa solo el rojo, el negro y los grises de la marca.
- Sustituye la parte del color de la decisión 0007; la agrupación por uso sigue igual.
- Si algún día se quiere volver a un color por familia, basta con cambiar los cinco valores de `familias` en
  `src/data/productos.ts`.
