# 0011 · En móvil, el 3D arriba y compacto, y el catálogo asomando en la primera pantalla

- **Estado:** Aceptada
- **Fecha:** 2026-10-13
- **Completa a:** [0009](0009-fichas-de-producto-y-modelo-3d.md) (la Digicen 22 en 3D sigue en el hero de Productos)

## Contexto

En un teléfono (390 × 844) la página de Productos empezaba con un hero de 1.214 px: título en dos líneas, entrada,
botón al catálogo, raya, cuatro cifras, la escena 3D cuadrada (390 px), la placa y los mandos en tres filas. Después
venían los filtros, los atajos y una portada de familia de 165 px. La primera tarjeta empezaba a 1.748 px: había que
bajar dos pantallas para ver un producto, y nada en la primera decía que debajo hubiera un catálogo.

La condición era no mover el 3D: es lo que distingue la página y tiene que seguir siendo lo primero.

## Decisión

En teléfono (hasta 640 px) el bloque del 3D se compacta para que la primera tarjeta asome dentro de la primera
pantalla, sin cambiar el orden ni el escritorio:

- **Texto:** el título en una línea y la entrada; fuera el botón "Ver las 23 centrífugas" (el catálogo está justo
  debajo) y las cuatro cifras con su raya (repiten lo que dice la entrada).
- **Escena:** 60 % del ancho de alto en lugar de cuadrada. La máquina no encoge, porque en un lienzo cuadrado lo que
  la limitaba era el ancho: solo se recorta aire de arriba y de abajo. La placa con el nombre y el zoom van encima, en
  las esquinas de arriba. Con el despiece abierto la escena vuelve a ser cuadrada, que es lo que necesitan las siete
  etiquetas.
- **Mandos:** en dos filas (acabado y vistas; despiece y recorrido), algo más bajos, sin perder ninguno.
- **Catálogo:** menos aire entre el 3D y los filtros, "Comparar" más baja y la portada de cada familia en una banda
  de una línea con el nombre y el número de productos (las aplicaciones van en cada tarjeta).

Resultado: la primera tarjeta empieza a 759 px (779 en francés, que tiene la entrada más larga).

## Alternativas descartadas

- **Poner el catálogo antes del 3D, o quitar el 3D en móvil:** se pierde lo que hace única a la página.
- **Escena aún más baja (por debajo del 55 % del ancho):** la máquina empezaba a encoger y dejaba de leerse bien.
- **Subir "Comparar" a la fila del buscador:** el buscador se quedaba en unos 100 px y "Rechercher" no cabía.
- **Quitar también la entrada:** es la única frase que dice qué hay en la página (cuántas, de dónde, en stock).

## Consecuencias

- En teléfono no se ven las cuatro cifras del hero ni el botón al catálogo; si se quieren de vuelta, hay que buscarles
  sitio sin volver a empujar el catálogo fuera de la primera pantalla.
- Cualquier cosa nueva entre el 3D y las tarjetas debe medirse en 390 × 844: la primera tarjeta tiene que seguir
  empezando antes de 844 px.
- Las tabletas (641–900 px) siguen con la escena cuadrada; no entraban en este cambio.
