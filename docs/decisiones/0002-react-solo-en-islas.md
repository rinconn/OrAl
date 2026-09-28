# 0002 · React solo en islas

- **Estado:** Aceptada
- **Fecha:** 2026-09-28

## Contexto

Casi toda la web es contenido. Solo unas piezas necesitan interacción: filtro de la gama, selector de
centrífuga, modelo 3D.

## Decisión

El contenido se escribe en componentes `.astro`, que no envían JavaScript al navegador. Las piezas interactivas
son componentes React (`.tsx`) cargados como **islas** con `client:visible`: solo se descargan cuando aparecen en pantalla.

## Alternativas descartadas

- **Toda la web en React:** más JavaScript para el visitante sin ninguna ventaja visible.
- **JavaScript sin librería:** suficiente para cosas pequeñas (la cabecera lo usa), pero no para el selector o el 3D.

## Consecuencias

- En `.astro` se escribe `class`; en `.tsx`, `className`.
- Un componente React no puede usar datos del navegador al compilar: lo que necesite, se le pasa por props.
