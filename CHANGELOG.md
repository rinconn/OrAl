# Registro de cambios

Todos los cambios de la web, PR a PR. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Hasta que se publique la web, todo va en "Sin publicar"; al publicar se cierra la versión 1.0.0.

## [Sin publicar]

### Añadido

- Lupa en la cabecera: busca modelos y secciones al escribir, sin tildes ni mayúsculas, y sin servidor. (#8)
- Sellos ODS y Empresa Solidaria en el pie, en todas las pantallas. (#8)
- Documentación del proyecto en `docs/`: objetivo, hoja de ruta, arquitectura, marca, contenido, antes y después,
  pendiente de la empresa, forma de trabajar y registro de decisiones. Plantilla de PR y este registro. (#6)
- Cabecera definitiva: barra superior con teléfono, correo comercial, acceso para distribuidores e idiomas;
  la cabecera se aparta al bajar y vuelve al subir; menú móvil a pantalla completa y accesible;
  enlace "Saltar al contenido"; enlaces centralizados en `src/data/navegacion.ts`. (#3)
- Entorno en GitHub Codespaces: se abre, instala y arranca la web solo; vista previa en `*.app.github.dev`. (#2)
- Base de calidad: comprobación automática en cada PR (formato, lint, tipos y build), sitemap, página 404,
  `robots.txt`, cabeceras de seguridad y caché, y normas del proyecto en `CLAUDE.md`. (#1)
- Portada nueva con la marca de Orto Alresa: titular, cifras, gama con filtro, tecnología, distribuidores,
  empresa y aplicaciones, con notas "antes y después" para la presentación.

### Cambiado

- Cabecera nueva: logo de dos líneas, menú con el mismo hueco a cada lado, idioma con banderas y sin la
  barra negra superior (teléfono y correo siguen en el menú móvil y en el pie). Por debajo de 1220 px sale
  el botón de menú; en móvil las banderas y la lupa quedan siempre a la vista. (#8)
- Las anclas ya no quedan tapadas por la cabecera fija (`scroll-margin-top`). (#3)
