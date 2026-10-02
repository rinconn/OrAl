# 0008 · El catálogo sale de la portada a su propia página

- **Estado:** Aceptada
- **Fecha:** 2026-10-02
- **Sustituye en parte a:** [0007](0007-gama-por-uso.md) (las cinco familias se mantienen; los colores y el filtro desaparecen)

## Contexto

La dirección vio la portada y el catálogo le pareció agresivo de primeras: barra de filtros oscura, fichas con
cifras e iconos de temperatura nada más llegar. La portada tiene que ser lo más limpia posible. Además, el menú
tenía "Centrífugas" y "Elegir centrífuga" apuntando al mismo sitio.

## Decisión

- Catálogo en `/centrifugas/`: las 17 series agrupadas por las cinco familias, sin filtro ni colores, con foto,
  nombre, frase y tres cifras (capacidad, rpm y xg). Dos por fila en el móvil.
- La portada queda: inicio, Tecnología, Empresa, Distribuidores y Aplicaciones.
- Fuera "Elegir centrífuga" del menú y del pie hasta que exista la página del Configurador.
- Entre secciones oscuras seguidas (inicio → Tecnología → foto de Empresa), un paso: el color de arriba se funde
  en el de abajo y una raya roja se dibuja con un destello que la recorre (`src/components/Paso.astro`).

## Alternativas descartadas

- **Franja de 5 fotos en la portada que lleve al catálogo:** al usuario no le gustó.
- **Subir Empresa tras el inicio (solo la foto, o entera con los certificados primero):** demasiada imagen seguida.
- **Las cuatro cifras del inicio en una franja blanca (simple, con título o con tarjetas a caballo):** muy simple,
  o parecía un pie de página; las placas de cristal sobre la foto gustan más.
- **Título de Tecnología sobre blanco o raya roja fija:** el cambio de blanco a gris chirriaba.

## Consecuencias

Portada más corta y limpia, y el catálogo tiene una dirección propia que Google puede enseñar. Los enlaces a una
serie (Tecnología, lupa) van a `/centrifugas/#serie`. El filtro en React se borra; la web ya no tiene islas de
React hasta que llegue el Configurador.
