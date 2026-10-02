# Orto Alresa · web

Web nueva de Orto Alresa (Álvarez Redondo, S.A.), fabricante de centrífugas de laboratorio desde 1949.
El público son **distribuidores B2B**, no el laboratorio final. La web va en español (`/`), inglés (`/en/`) y
francés (`/fr/`); los textos visibles de cada idioma viven en `src/i18n/`, no en los componentes.

## Principios

- Se trabaja como si fuera la versión definitiva: nada provisional que haya que rehacer.
- Ningún dato inventado. Cifras, especificaciones y frases salen del Catálogo General 2025 o de
  ortoalresa.com. Si falta un dato, se deja fuera y se pide.
- La marca (rojo `#DD040A`, Helvetica Neue Condensed ligera + negrita, grises, esquinas rectas, `»`)
  es la base, y se moderniza cuando mejora el resultado. Cada cambio de peso se explica en
  `docs/antes-y-despues.md` y `docs/por-que.md` (en la web no se enseñan notas).
- Nada que parezca plantilla: sin degradados decorativos, sin emojis, sin iconos genéricos, sin fotos de stock.

## Stack

Astro 7 (web estática) + React 19 solo para islas interactivas + TypeScript estricto.

- `src/pages/` páginas · `src/layouts/Base.astro` estructura común
- `src/components/` una sección por archivo, con estilos en el propio componente
- `src/data/` datos tipados (productos, etc.)
- `src/styles/global.css` tokens de marca y utilidades (`.wrap`, `.sec`, `.head`, `.eyebrow`, `.arrow`, `.btn`)
- `public/img/` imágenes ya optimizadas en WebP (máx. ~1400 px de ancho)

## Documentación

Todo el proyecto está documentado en `docs/` (empieza por `docs/README.md`). Cada PR actualiza
`CHANGELOG.md` y los documentos que toque; cada decisión que cueste deshacer va en `docs/decisiones/`
(numerada, no se borra, se sustituye); cada mejora visible frente a la web actual va en
`docs/antes-y-despues.md`, y cada pieza aprobada se explica a fondo en `docs/por-que.md` (qué había, qué hay, por qué
es mejor y qué se descartó). Un cambio sin su documentación no está terminado.

## Antes de subir cambios

```bash
npm run verify   # formato + lint + astro check + build
```

La CI de GitHub ejecuta lo mismo en cada PR. Los cambios van por rama y PR, nunca directo a `main`.
Revisa siempre el resultado en escritorio (1440 px) y en móvil (390 px): sin scroll horizontal ni textos cortados.
