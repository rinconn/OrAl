# 0012 · Las referencias y los rotores de cada centrífuga salen del CRM

- **Estado:** Aceptada
- **Fecha:** 2026-10-14

## Contexto

Las fichas de producto tomaban de la web actual (decisión [0009](0009-fichas-de-producto-y-modelo-3d.md)) las
referencias de cada centrífuga y sus rotores. Al contrastarlas con la relación de rotores por centrífuga que la empresa
saca de su CRM (Dynamics 365) y de su tarifa (Business Central), consultada el 14/10/2026, salieron diferencias:

- La **Unicen 21** tenía sus 8 rotores a 4.500 rpm, con más fuerza; el CRM y el Catálogo General 2025 dicen 4.200 rpm,
  y la tarjeta del catálogo de la propia web ya decía 4.200 rpm / 2.938 xg. La web se contradecía.
- Faltaban rotores: 16 en la Cyto 22, y uno o dos en Dilitcen 22 R, Digtor 22 R, Digtor 22, Digtor 22 C, Digtor 22 C-U
  y Consul 22.
- Faltaban las referencias IVD de casi todas y una tercera referencia en siete refrigeradas (CE 247, CE 248, CE 250,
  CE 251, CE 252, CE 253 y CE 265); a la Digtor 22 C-8 se le daba la CE 240, que es la versión ASTM.
- Algunos rotores no valen para todas las referencias de su centrífuga (la CE 202 no admite el RT 246), y la web no lo
  decía.

La empresa confirma que el Excel del CRM es como debe ser.

## Decisión

- Las **referencias** de cada centrífuga (con su IVD al lado), **qué rotores admite** y sus **rpm y xg** en esa
  centrífuga salen del Excel del CRM, importado con `node scripts/importar-rotores-excel.mjs <archivo.xlsx>` a
  `src/data/rotores-excel.json`.
- De la web actual se quedan la foto, el radio, el ángulo y los tubos de cada rotor, y las medidas, el peso y el
  consumo de cada versión. Se combinan en `src/data/fichas.ts`, así que toda la web (fichas, tabla, filtro de tubos)
  lee lo mismo.
- Un rotor que la web actual no tiene (RT 330, RT 332, RT 346) se enseña con lo que da el CRM: tipo, capacidad, rpm y
  xg, sin foto ni tubos.
- Un rotor sin precio en la tarifa (RT 336) no se enseña.
- Si un rotor no vale para alguna referencia, su ficha lo dice: "No compatible con CE 202, CE 203, CE 203IVD".
- No se publica nada interno: ni la tarifa ni el estado en el CRM.

## Alternativas descartadas

- **Corregir a mano `web-actual.json`:** se perdería la próxima vez que se importe la web actual.
- **Una fila de versión por cada referencia IVD:** el CRM no da medidas ni peso propios de las IVD; serían filas vacías.
- **Añadir los 14 modelos del Excel que la web no tiene** (NCP Tech, AURA 22, Consul 23, Cellprocen…): no están en el
  Catálogo 2025 ni tienen fotos ni cifras de máquina. Si alguno debe salir, lo decide la empresa.

## Consecuencias

- Las referencias y los rotores coinciden con lo que la empresa vende y factura.
- Con cada Excel nuevo se vuelve a ejecutar el importador y se revisa el `git diff` de `rotores-excel.json`.
- Amplía la decisión [0006](0006-datos-oficiales-validados.md): el CRM pasa a ser fuente oficial para referencias y
  rotores, por delante de la web actual.
