# Registro de cambios

Todos los cambios de la web, PR a PR. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Hasta que se publique la web, todo va en "Sin publicar"; al publicar se cierra la versión 1.0.0.

## [Sin publicar]

### Añadido

- Productos: el hero entra con la Digicen 22 ya montada y la cámara asentándose en tres cuartos (antes llegaba en despiece y medio transparente). Se prueba un catálogo nuevo como exposición (capítulos por familia, filtros fijos y comparador) y se vuelve al anterior, que gustaba más; queda en el historial (9dc360e).
- Productos: placa bajo la máquina 3D con su nombre y su aplicación (Modelo 3D · Universal · Digicen 22) y "Ver ficha", que lleva a la ficha de la Digicen 22. Se oculta durante el recorrido.
- Productos, hero nuevo (`HeroProductos.astro`, `src/scripts/escena-productos.ts`): la Digicen 22 en 3D en un estudio oscuro con un remolino de luz detrás que se acelera al girarla, haz de luz con polvo y aro rojo con destello. Acabado real o rayos X, vistas 3/4, frente, lado y arriba, zoom (botones, Ctrl + rueda, doble clic en una pieza), despiece con las etiquetas en columna y un punto sobre cada pieza, y **recorrido por dentro** pieza a pieza con su descripción de la ficha de ortoalresa.com. Cifras con los iconos de la marca y la raya roja con destello. Modelo 3D aligerado de 1,45 MB a 594 KB.
- Productos, rehecho otra vez: hero oscuro con la **Digicen 22 en 3D** (modelo de SolidWorks de la empresa) que gira despacio, se gira arrastrando y se abre en despiece con "Ver por dentro" (tapa, amortiguador, cuerpo, carátula, depósito, motor y base, cada pieza con su código). Debajo, un índice fijo a la izquierda (buscador, temperatura y las 9 aplicaciones más Accesorios y Laboratorio, por grupos) y una rejilla continua sin huecos con el título de lo elegido. Tarjetas nuevas (`Tarjeta.astro`): foto de estudio (fondo blanco y suelo gris) con contorno negro, la temperatura en una etiqueta de color con su icono (ventilador verde, copo azul, llama ámbar; `ui/IconoTemp.astro`), nombre y tres cifras, y entrada escalonada al bajar. Visor en `Visor3D.astro` y `src/scripts/visor3d.ts` (three.js).
- Una ficha por producto en `/centrifugas/<modelo>/` (28, en los tres idiomas): foto de estudio (o el 3D), versión (ventilada / refrigerada, C / C-U / C-8), placa de características como la placa CE de la máquina (capacidad, velocidad, fuerza, pantalla, temperatura, voltaje y códigos), catálogo PDF y "Pedir a un distribuidor"; debajo, pestañas con la descripción y "De un vistazo" en placas (código, medidas, peso, consumo, voltaje y rotores), la ficha técnica como hoja de especificaciones (características, funcionamiento, seguridad, refrigeración, normas), los rotores compatibles en un selector (lista y rotor elegido con sus cifras y su tabla de tubos y adaptadores) con búsqueda "¿Qué tubo usas?", las versiones con sus datos técnicos y los accesorios, y al final otros modelos de la misma aplicación. La lupa y Tecnología enlazan a la ficha.
- `scripts/importar-web-actual.mjs`: importa de la web actual (WordPress y ERP) las fichas en los tres idiomas, los 73 rotores con sus tubos y sus fotos, a `src/data/web-actual.json` y `public/img/rotores/`. Tipos y traducciones en `src/data/fichas.ts`.
- Aplicaciones en la portada, rehecha: la nota más reciente en grande y las otras cuatro en lista, cada una con su área de aplicación en rojo, su fecha y su foto. Las notas son las del blog actual, con su texto, su fecha y su foto destacada (`public/img/notas/`); se añaden Análisis del chocolate y Centrifugación citológica. Mientras no haya página de Noticias, cada nota lleva a la suya en el blog actual. Fuera la baraja de cartas.
- Cabecera con las entradas de la web actual, en el orden en que aparecen al bajar por la portada: Productos, REI System, SmartConnect, Configurador, Empresa, Distribuidores, Noticias, Servicio técnico y Descargas (Guías y Descargas juntas). REI System, SmartConnect y Configurador abren su panel de Tecnología en la portada y el menú marca el panel abierto. Menos hueco entre entradas y menú a pantalla completa por debajo de 1440 px para que quepan en los tres idiomas. Enlaces en `src/data/navegacion.ts`.
- Tecnología: SmartConnect y Configurador a la par, con botón "Iniciar sesión" al panel de SmartConnect y "Empezar" para el Configurador de 6 pasos (su página está por hacer). Las tarjetas llevan una raya roja que les da una vuelta y deja su último tramo respirando con un punto que late en la punta. Componente `ui/Borde.astro`.
- Web en inglés (`/en/`) y francés (`/fr/`): las banderas de la cabecera llevan a la misma página en el otro idioma. Portada y Centrífugas traducidas; los textos de cada idioma están en `src/i18n/` (es, en, fr). Traducción provisional, pendiente de revisar por la empresa.
- Paso entre secciones oscuras seguidas (inicio → Tecnología → foto de Empresa): el color se funde y una raya roja se dibuja con un destello que la recorre cada pocos segundos. Componente `Paso.astro`. (#28)
- Pie nuevo: oscuro en tres pisos, con el teléfono en grande, enlaces ordenados, sellos ODS y Empresa Solidaria y los logos de las ayudas públicas, sin repetir, en una cinta que pasa despacio. Correos, enlaces, redes y logos en `src/data/navegacion.ts`.
- Aplicaciones en la portada: las cinco últimas notas como una baraja de fotos que se reparte sola al llegar a ella y se queda abierta. Las notas son archivos en `src/content/notas/` y la portada se actualiza sola.
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

- Tecnología propia en acordeón: REI System, SmartConnect y Configurador en tres franjas; la abierta enseña foto y texto y las cerradas son tiras con número, nombre en vertical y "+". Al abrir una, una cortina roja barre su foto. En móvil, una encima de otra. "Propia" en rojo. La sección pasa de unos 2.800 px a unos 1.050 en escritorio.
- Más rojo de marca en los títulos: "en el laboratorio" (Aplicaciones), como "propia" en Tecnología. En Empresa, "más allá de lo estándar" se queda en blanco con una raya roja más fina: sobre la foto de tapones rojos, más rojo la cargaba.
- Cabecera a todo el ancho de la pantalla, como la de la web actual: logo pegado a la izquierda y banderas, lupa y Contacto a la derecha (antes iba en el ancho máximo de la página, centrada).
- Pie con más rojo de marca: el logo con "orto" en rojo (`logo-ortoalresa-oscuro.svg`), un filo rojo arriba, una raya roja corta bajo cada título de columna y todos los enlaces en rojo al pasar el ratón o pulsarlos.
- Logos de las ayudas en su color, sin la ficha blanca y a plena luz: archivos de `public/img/ayudas/` preparados para fondo oscuro (fondo transparente, bloques de color intactos y el texto oscuro suelto en blanco).
- Catálogo en su propia página, `/centrifugas/`: todas las series agrupadas por familia, sin filtros, con foto, frase y tres cifras. Sale de la portada para dejarla más limpia; "Centrífugas", "Ver la gama", "Toda la gama", los modelos de Tecnología y la lupa llevan allí. (#28)
- Menú y pie sin "Elegir centrífuga": llevaba al mismo sitio que "Centrífugas". Volverá cuando exista la página del Configurador. (#28)

- Empresa: foto del rotor con tubos rojos a lo ancho, más baja, con la frase y el botón "Conoce la empresa" encima. 1949, Familiar y Daganzo pasan a tres tubos de sangre en su gradilla, con tapón rojo y etiqueta, que al llegar se llenan y se separan en capas como al centrifugar; luego suben burbujas despacio. Certificados en franja gris con placas de borde oscuro y la del centro en rojo.
- Portada: la foto de fondo pasa a ser un rotor girando a toda velocidad, con estelas rojas y el buje nítido (foto de la empresa). Fuera el temblor que seguía al ratón y el giro de entrada: la foto solo se aclara y se asienta despacio. "Ver la gama" se vuelve cristal rojo al pasar el ratón. Las cuatro cifras pasan a placas de cristal con los iconos de la marca (teléfono, caja, escudo, casillas) y, al pasar el ratón, un destello de luz, un rojo neón suave y el icono que da un pequeño salto.
- Portada nueva: manos con guantes cargando un rotor, a pantalla completa (foto de la empresa), que gira y frena al entrar y sigue al ratón con un brillo suave, con el titular, la frase, los dos botones (con destello y relleno al pasar el ratón) y las cuatro razones (48 h, 1 semana, 3 años, ISO 13485) encima, sin cajas. Fuera el recuadro oscuro con retícula, la Digicen recortada y las notas técnicas.
- Distribuidores: fuera los cuadrados sobre la línea y las tarjetas. Ahora una ruta en onda, como un tubo que se llena de sangre con burbujas que lo recorren, se dibuja sobre un fondo
  de laboratorio oscuro con la silueta de un rotor girando despacio, y en cada parada un haz de luz proyecta un rotor que gira, con
  4, 6, 8 y 12 tubos. Hueco preparado para cambiarlos por los rotores reales en 3D.
- Portada: Distribuidores pasa detrás de Empresa para que las dos secciones oscuras no vayan seguidas.
- Gama: el filtro por uso ya no baja con la página; se queda encima de las fichas y no tapa las fotos.

- Toda la portada: un solo tamaño para los títulos de sección y otro para los subtítulos, los del inicio. Las cuatro cifras del inicio pasan a fichas con borde y esquina oscuros y el mismo efecto que las tarjetas de Distribuidores (raya roja y esquina roja al pasar el ratón).
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

### Quitado

- Tecnología: las tarjetas de Pantalla táctil, PCBS y ULS (con su foto y sus esquemas) y la lista "Y además, según el modelo". Fuera sus textos de los tres idiomas y `sistemas` de `src/data/tecnologia.ts`.
- Pestaña roja vertical de la izquierda ("Expertos en centrifugación · desde 1949"): tapaba el contenido y repetía lo que ya dice el inicio. Fuera también el texto `meta.pestana` de los tres idiomas.
- Las cuatro tarjetas de la portada (48 h, 1 semana, 3 años, ISO 13485): la primera pantalla queda con el titular, la frase y los dos botones sobre la foto del rotor. Fuera `src/data/cifras.ts` y los textos `hero.cifras` de los tres idiomas. Los datos siguen en Distribuidores y Empresa.
- Botón "Ver antes y después" y sus notas en cada sección: fuera de la web. Las notas se guardan en `docs/antes-y-despues.md`.
