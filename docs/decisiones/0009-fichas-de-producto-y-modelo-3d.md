# 0009 · Una ficha por producto con los datos de la web actual, y la Digicen 22 en 3D

- **Estado:** Aceptada
- **Fecha:** 2026-10-06
- **Completa a:** [0008](0008-catalogo-en-pagina-propia.md) (el catálogo sigue en `/centrifugas/`; ahora cada producto tiene además su página)

## Contexto

El catálogo enseñaba los 28 productos, pero no se podía entrar en ninguno: lo que un distribuidor necesita para
pedir (rotores compatibles, tubos y adaptadores de cada rotor, códigos, medidas, peso, consumo, normas) solo estaba
en la web actual. Esa web es un WordPress cuyos datos se pueden leer ordenados: cada ficha tiene sus campos
(descripción, bloques, versiones) en los tres idiomas, y el ERP de la empresa publica los 73 rotores con sus cifras,
qué rotores van con cada centrífuga y qué tubos admite cada rotor.

Además, la empresa ha pasado el modelo 3D de la Digicen 22 (`Digicen22_web3d.zip`, sacado del STEP de SolidWorks:
34 piezas con su código, acabados PBR y carátula con pantalla).

## Decisión

- **Una página por producto** en `/centrifugas/<slug>/` (y `/en/…`, `/fr/…`): los 23 modelos, los 2 accesorios y los
  3 equipos de laboratorio. Componente `src/components/paginas/Ficha.astro`.
- **Los datos se importan, no se copian a mano**: `node scripts/importar-web-actual.mjs` lee el WordPress y el ERP
  de la web actual y escribe `src/data/web-actual.json` (texto limpio, sin HTML) y las fotos de los rotores en
  `public/img/rotores/` (WebP). Se vuelve a ejecutar cuando la empresa cambie algo y se revisa con `git diff`.
  `src/data/fichas.ts` le da tipo y traduce los términos que el ERP solo tiene en español (tipo de rotor y de tubo).
- Las **cifras de cabecera** (capacidad, rpm, xg, pantalla) siguen saliendo de `src/data/productos.ts` (Catálogo
  2025), como el resto de la web. Solo donde el catálogo no da un dato se usa el de la web actual (xg de la Digtor
  22 C-8).
- **Modelo 3D con three.js**, no con `<model-viewer>` (el visor que venía en el zip): model-viewer no deja mover
  piezas sueltas y el despiece es lo que hace especial al modelo. three.js se descarga aparte y solo si el navegador
  tiene WebGL; el modelo (`public/3d/digicen22.glb`, 1,4 MB) y el decodificador Draco (`public/3d/draco/`) se sirven
  desde la propia web, sin CDN. Está en el hero del catálogo y en la ficha de la Digicen 22.

## Alternativas descartadas

- **Copiar a mano las 28 fichas a `src/i18n/`:** miles de líneas en tres idiomas, con riesgo de erratas y sin forma
  de saber qué ha cambiado en la web actual.
- **Leer la web actual en cada visita:** la web dejaría de ser estática y dependería de que el WordPress siga vivo.
- **`<model-viewer>` desde jsDelivr, como traía el zip:** más sencillo, pero sin despiece y con dependencia de un CDN.
- **Fichas en ventana sobre el catálogo:** no tienen dirección propia, no se pueden compartir ni las encuentra Google.

## Consecuencias

- 84 páginas nuevas (28 × 3 idiomas). La lupa de la cabecera y Tecnología enlazan ya a la ficha de cada modelo.
- `three` pasa a ser dependencia (solo se carga en las dos páginas con el visor).
- Cuando la web antigua se apague, los PDF de catálogo de cada serie (que hoy se enlazan en
  `ortoalresa.com/catalogo_producto/`) tendrán que copiarse a la web nueva. Está en `docs/pendiente-empresa.md`.
