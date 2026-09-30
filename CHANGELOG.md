# Registro de cambios

Todos los cambios de la web, PR a PR. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Hasta que se publique la web, todo va en "Sin publicar"; al publicar se cierra la versión 1.0.0.

## [Sin publicar]

### Añadido

- Aplicaciones en la portada: índice grande de las tres últimas notas sobre fondo oscuro, con la foto de
  cada una al pasar el ratón. Las notas son archivos en `src/content/notas/` y la portada se actualiza sola.
- Distribuidores en la portada: las razones como el recorrido de un pedido, con línea que se dibuja al
  verla, franja oscura con OEM y un solo botón "Hazte distribuidor" más un enlace para laboratorios. (#14)
- `docs/por-que.md`: el porqué de cada decisión de la web desde el principio, frente a la web actual, como
  guion para presentarla a la dirección. (#10)
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

- Empresa en la portada: foto a todo el ancho con la frase del catálogo centrada, tres tarjetas sobre la foto
  (1949, familia y Daganzo), botón "Conoce la empresa" y rueda con los nueve certificados explicados. (#15)
- Tecnología propia: REI System y SmartConnect a lo grande con foto real, pasos y vídeo; pantalla táctil, PCBS
  y ULS en tarjetas con esquema y cifra; qué modelos lleva cada sistema, enlazados a la gama; entradas suaves,
  esquemas que se dibujan y efectos al pasar el ratón. Datos en `src/data/tecnologia.ts`. Documentado en
  `docs/por-que.md`.
- Primera pantalla: fuera el antetítulo "Fabricantes en Madrid desde 1949" (el dato pasa a la frase); el
  recuadro de la Digicen 22 pasa a gris oscuro con retícula de plano y la cota de su ancho real (410 mm);
  la máquina se apoya en la ficha con sombra; efectos al pasar el ratón en los botones, "Ver en la gama" y la
  máquina. Documentado en `docs/por-que.md`.
- Primera pantalla: el titular empieza a una distancia fija bajo el menú y es más grande; las cifras pasan a una
  rejilla grande de 2 × 2 que llena la columna hasta el pie (una fila en pantallas bajas). Sin huecos blancos.
  Documentado en `docs/por-que.md`.
- Gama de la portada: las 17 series del Catálogo 2025 (23 modelos) con foto del catálogo, frase, capacidad,
  rpm, xg y temperatura. Filtro por uso (Compactas, Universales, Gran capacidad, Clínica, Industria) en una
  banda gris oscura que se queda pegada bajo el menú; cada familia con su color suave; fichas en tarjeta con
  borde; se ven 6 y el resto con "Ver las 17 series". Titular "La gama completa, siempre en stock", sin
  antetítulo. La lupa abre la gama y lleva a la ficha buscada. (#10)
- Primera pantalla de la portada: cabe entera en la pantalla, con las cifras (48 h, 1 semana, 3 años, ISO 13485)
  junto al titular y sin la franja de cifras aparte; la Digicen 22 se posa sobre su estante con una ficha corta;
  entrada animada breve (texto, máquina y notas dibujándose), desactivada si el sistema pide menos movimiento;
  en móvil las notas de la foto pasan a etiquetas. Se quita la nota interna del modelo 3D. (#9)
- Cabecera nueva: logo de dos líneas, menú con el mismo hueco a cada lado, idioma con banderas y sin la
  barra negra superior (teléfono y correo siguen en el menú móvil y en el pie). Por debajo de 1220 px sale
  el botón de menú; en móvil las banderas y la lupa quedan siempre a la vista. (#8)
- Las anclas ya no quedan tapadas por la cabecera fija (`scroll-margin-top`). (#3)
