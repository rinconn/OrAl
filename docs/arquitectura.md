# Arquitectura

## En una frase

Una **web estática**: Astro genera todas las páginas en HTML en el momento de publicar, y el visitante recibe
archivos ya hechos. Solo las piezas que necesitan interacción (el filtro de la gama, el selector, el modelo 3D)
cargan React, y solo cuando aparecen en pantalla. La decisión y sus alternativas están en
[0001](decisiones/0001-web-estatica-con-astro.md) y [0002](decisiones/0002-react-solo-en-islas.md).

## Tecnología

| Pieza               | Qué usamos                                                             | Por qué                                                    |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| Generador de la web | Astro 7                                                                | HTML estático, rápido, con componentes y rutas por archivo |
| Partes interactivas | React 19 como "islas" (`client:visible`)                               | Solo pesa donde hace falta                                 |
| Lenguaje            | TypeScript estricto                                                    | Los errores salen al compilar, no en la web publicada      |
| Datos del catálogo  | Colecciones de contenido de Astro con esquema (Zod)                    | Si un dato falta o está mal escrito, la web no compila     |
| Estilos             | CSS propio con variables de marca, estilos por componente              | Sin frameworks de CSS: nada que parezca plantilla          |
| Calidad             | Prettier, ESLint (con reglas de accesibilidad), `astro check`          | Se ejecutan en cada PR                                     |
| SEO                 | Sitemap automático, URL canónica, 404 propia, `robots.txt`             |                                                            |
| Idiomas             | Enrutado i18n de Astro: `es` sin prefijo, `/en/`, `/fr/`               | Mismas URLs que la web actual                              |
| Seguridad y caché   | `public/_headers` (Netlify o Cloudflare Pages)                         | Cabeceras de seguridad y caché larga para recursos         |
| Entorno de trabajo  | GitHub Codespaces ([0003](decisiones/0003-codespaces-como-entorno.md)) | El portátil de empresa bloquea binarios nativos            |

Sin servidor propio: los formularios irán por Formspree o una función del alojamiento, y las noticias
por un gestor de contenidos externo cuando se aborden.

## Carpetas

```
.devcontainer/           Configuración de Codespaces: instala y arranca la web sola
.github/
  workflows/ci.yml       Comprobación automática en cada PR: formato, lint y build
  pull_request_template.md
docs/                    Esta documentación
public/                  Se publica tal cual
  _headers               Cabeceras de seguridad y caché
  fonts/                 Helvetica Neue Condensed (marca)
  img/                   Imágenes ya optimizadas (WebP, máx. ~1400 px)
    productos/  fotos/  marca/  iconos/ (iconos: fase 1)
src/
  pages/                 Cada archivo es una URL (index.astro → /, 404.astro → página de error)
  layouts/Base.astro     Estructura común: <head>, cabecera y pie
  components/            Una sección por archivo, con sus estilos dentro
  data/                  Datos tipados: navegación, productos...
  styles/global.css      Variables de marca y utilidades comunes
  types/                 Tipos de librerías que no los traen
astro.config.mjs         Dominio, integraciones, idiomas
CLAUDE.md                Normas del proyecto
CHANGELOG.md             Registro de cambios
```

## Cómo fluyen los datos

Así queda al terminar la fase 1. Hoy los productos de la portada están en `src/data/productos.ts`.

```
Catálogo General 2025 (PDF) ──► src/data/…json ──► esquema (src/content.config.ts) ──► páginas y componentes
Material de la empresa (fotos, CAD, PDFs) ──► public/ + src/data/medios.ts ──────────────┘
Enlaces, teléfono, idiomas ──► src/data/navegacion.ts ──► cabecera y pie
```

- Los **datos de producto** y los **medios** van separados: el catálogo cambia una vez al año y las
  fotos llegan poco a poco. Añadir una foto nunca obliga a tocar las fichas.
- Nada se escribe a mano dos veces: si un dato aparece en varios sitios, sale de un solo archivo.

## Estilos

- `global.css` define las variables de marca (`--red`, `--ink`, `--carbon`…) y las utilidades comunes:
  `.wrap` (ancho máximo), `.sec` (espaciado de sección), `.head` (titular de dos pesos), `.eyebrow`,
  `.arrow` (enlace con `»`), `.btn`.
- Cada componente lleva su propio `<style>`, que Astro limita a ese componente.
- Puntos de corte habituales: 1240, 1080, 900, 760 y 520 px. Todo se revisa a 1440 y 390 px.

## Publicación (pendiente, fase 5)

`npm run build` genera la carpeta `dist/`, que se sube a Netlify o Cloudflare Pages. Cada PR podrá tener
su propia vista previa pública. El dominio y el alojamiento están por decidir con la empresa.
