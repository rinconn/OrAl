# 0014 · La galería de la ficha, sin 3D y con seis miniaturas como mucho

- **Estado:** Aceptada
- **Fecha:** 2026-10-16
- **Sustituye a:** [0009](0009-fichas-de-producto-y-modelo-3d.md) en lo del 3D en la ficha (el de la página de
  productos se queda)

## Contexto

La ficha de la Digicen 22 era la única que abría con el modelo 3D en un panel oscuro: no se parecía a las demás
fichas, y el panel con su barra («Digicen 22 · Modelo 3D · Ver por dentro») ocupaba la galería entera.

Además, la galería pone una miniatura por vista y hay modelos con una docena de rotores: 18 vistas en la Digicen 22 (contando el 3D),
18 en la Cyto 22. La tira crecía sin límite, cruzaba la página de lado a lado y tapaba la temperatura y las
referencias. En móvil eran 18 puntos de 44 px (792 px en una pantalla de 390).

## Decisión

- **La ficha no lleva 3D.** La Digicen 22 empieza por su foto, como el resto. El 3D sigue en la página de productos
  (`HeroProductos.astro`). Se borran `src/components/Visor3D.astro` y `src/scripts/visor3d.ts`, que solo usaba la ficha.
- **Seis casillas como mucho.** Con más de seis vistas, la tira enseña las cinco primeras (máquina, detalle y los
  primeros rotores) y una casilla «+N» que abre la pantalla completa en la primera foto sin miniatura, con flechas
  para recorrerlas todas. Las vistas sin miniatura siguen en la galería: flechas del teclado y, en móvil, deslizar;
  cuando se ve una de ellas, el indicador rojo se queda bajo «+N». En móvil, cinco puntos y «+N» en texto.
  El límite es `MAX_MINIS` en `Ficha.astro` y vale para todas las fichas.

## Alternativas descartadas

- **Tira con scroll lateral:** sigue ocupando todo el ancho y esconde a medias; el distribuidor no sabe cuántas hay.
- **Desplegar todas las miniaturas al pulsar «+N»:** vuelve a tapar la tarjeta, que es lo que se quería evitar.
- **Quitar las fotos de los rotores de la galería:** ya están en Compatibilidad, pero son las únicas fotos reales
  de muchas máquinas y verlas en grande ayuda a reconocer el rotor.
- **Dejar el 3D en la ficha detrás de la foto (como otra miniatura):** la galería volvería a tener un panel distinto
  solo en un modelo.

## Consecuencias

- 13 fichas pasan a tener «+N» (de +2 en la Biocen 22 R a +13 en la Cyto 22); el resto no cambia.
- La ficha de la Digicen 22 ya no descarga three.js ni el modelo (594 KB).
- Si llegan más modelos 3D, irían a la página de productos, no a la ficha, salvo que se decida otra cosa.
