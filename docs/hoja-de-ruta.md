# Hoja de ruta

Cada fase se entrega en una o varias PRs y queda **terminada** antes de pasar a la siguiente.
Lo que depende de la empresa se construye con su hueco preparado, de forma que cuando llegue el material
solo haya que añadirlo, sin rehacer nada.

Estado a 28 de septiembre de 2026.

| Fase | Qué                            | Estado              | Depende de la empresa                        |
| ---- | ------------------------------ | ------------------- | -------------------------------------------- |
| 0    | Base del proyecto              | Hecha               | —                                            |
| 0b   | Cabecera definitiva            | En revisión (PR #3) | —                                            |
| 1    | Catálogo completo y fichas     | En curso            | Fotos de todos los modelos (hay 6 de ~25)    |
| 2    | Elegir centrífuga              | Pendiente           | —                                            |
| 3    | Resto de páginas               | Pendiente           | Código de WordPress, lista de distribuidores |
| 4    | Portada definitiva y modelo 3D | Pendiente           | Archivos CAD (STEP por piezas)               |
| 5    | Inglés, francés y publicación  | Pendiente           | Dominio, alojamiento, licencia tipográfica   |
| 6    | Área privada de distribuidores | Segunda etapa       | Aprobación de la web pública                 |

## 0 · Base del proyecto (hecha)

Astro + React + TypeScript, control de calidad automático en cada PR, SEO básico (sitemap, 404,
cabeceras de seguridad), entorno en GitHub Codespaces y prototipo de portada con las notas
"antes y después". PRs #1 y #2.

## 0b · Cabecera definitiva (en revisión)

Barra de contacto, cabecera que se aparta al bajar, menú móvil accesible y enlaces centralizados. PR #3.

## 1 · Catálogo completo

Los modelos del Catálogo General 2025 transcritos a datos validados en cada build, el listado de
Centrífugas por familias, la plantilla de ficha y el desplegable de Centrífugas en la cabecera.
Las fotos que faltan tienen su hueco en `src/data/medios.ts`.

## 2 · Elegir centrífuga

Selector por tipo de tubo, volumen, velocidad y temperatura, y comparativa entre modelos,
alimentados por los datos de la fase 1.

## 3 · Resto de páginas

Distribuidores, Tecnología, Servicio técnico, Empresa, Contacto (un solo formulario que reparte según el
motivo) y centro de descargas.

## 4 · Portada definitiva y modelo 3D

La portada se remata con todo lo anterior ya real y entra la centrífuga 3D interactiva (glTF y React Three Fiber).

## 5 · Inglés, francés y publicación

Traducciones, redirecciones 301 de todas las URLs antiguas, web de pruebas pública para la presentación
y publicación en el dominio.

## 6 · Área privada de distribuidores

Tarifas, imágenes en alta y material de marketing con acceso por usuario.
