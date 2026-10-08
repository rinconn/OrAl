# Registro de cambios

Todos los cambios de la web, PR a PR. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Hasta que se publique la web, todo va en "Sin publicar"; al publicar se cierra la versión 1.0.0.

## [Sin publicar]

### Añadido

- Productos: **descargar la tabla o la comparativa en PDF o Excel**, para mandársela al cliente. Sin ningún resultado, los botones se apagan y la tabla se oculta, y queda el mensaje de "sin resultados". En la tabla, cada fila tiene una casilla delante de la foto (y la cabecera, una para elegir todas las que se ven); si se eligen filas, salen solo esas, como "Modelos elegidos", y encima se ve cuántas hay con una × para quitarlas.; si no, lo que se ve: los modelos que dejan los filtros, en el orden elegido, con una cabecera que dice qué se filtró, el orden, cuántos modelos y la fecha. El Excel es un `.xlsx` de verdad (sin librerías): título, cabecera oscura con raya roja, filtro de columnas, fila fija y velocidad y fuerza como números. El PDF es un documento de empresa en A4: banda carbón con el logo en blanco, el tipo ("Selección de equipos" o "Comparativa técnica"), el título y la fecha, cerrada por la raya roja; debajo, sus datos con etiqueta (selección, orden, modelos); la tabla con cabecera oscura y filas alternas (en la comparativa, cada máquina con su foto); la fuente de los datos, y al pie de cada hoja un membrete: raya roja corta, "ORTO ALRESA" en negrita con la razón social y la dirección debajo, y a la derecha ortoalresa.com en rojo y "Página 1 de 2". Al pulsar "PDF" se abre una vista previa del documento ya hecho, con "Descargar PDF" e "Imprimir" (en móvil, sin visor, solo se descarga); lo genera jsPDF, que solo se carga al pedirlo; el archivo se llama `centrifugas-orto-alresa-AAAA-MM-DD`. En la tabla va junto a "Invertir"; en las tarjetas, a la derecha de los atajos de familia; en el comparador, junto a cerrar; y en el panel de presupuesto, bajo "Pedir presupuesto": la lista con cada producto, su foto y sus unidades, como "Solicitud de presupuesto" (`presupuesto-orto-alresa-AAAA-MM-DD`).
- Productos: **tabla más ligera**: la aplicación pasa debajo del nombre (una columna menos), fotos y márgenes más pequeños (filas de 77 a 67 px). En la descarga, la aplicación sigue en su columna.
- Productos: **filtro por mínimos** ("Mínimos") en la barra, para buscar por requisito y no por modelo: fuerza ≥ xg, velocidad ≥ rpm y capacidad ≥ tubos × ml. La capacidad se mira en todos los rotores de la web actual de cada versión (al menos esos tubos de al menos esos ml a la vez en un mismo rotor), además de la de su tabla de serie. Vale para tarjetas y tabla; una tarjeta con versiones enseña la que llega. El botón resume lo pedido ("≥ 15.000 xg +1", el resto al pasar por encima), filtra mientras se escribe y queda en la dirección (`?xg=15000&n=4&ml=250`). En móvil, los campos van dentro del panel de filtros.
- Productos: **vista en tabla** con los 23 modelos, una fila por versión (modelo con su foto y enlace a la ficha, aplicación, temperatura, capacidad, velocidad, fuerza y pantalla). Se elige con dos botones nuevos en la barra de filtros (tarjetas o tabla), usa los mismos filtros que las tarjetas y se ordena pulsando Capacidad, Velocidad o Fuerza: de mayor a menor y, otra vez, de menor a mayor. Vista y orden quedan en la dirección (`?v=tabla&o=xg&dir=asc`). Encima, en palabras, el orden que se ve ("Ordenado por fuerza máx., de mayor a menor") y un botón "Invertir". Cabecera oscura con la raya roja, la columna elegida marcada en rojo y una barra fina bajo cada cifra con su tamaño frente a la mayor; al pasar el ratón la fila se aclara, la raya de la familia se vuelve roja y el nombre se pone rojo con su ». En móvil, la tabla se desplaza dentro de su caja con el nombre fijo. Cada fila trae delante de la foto una **casilla para elegirla** (en la cabecera, una para todas las que se ven) y al final su **"+" de Presupuesto** (añadida, se vuelve el contador "− 1 ud. +", a la par con las tarjetas). Con filas elegidas, encima salen "n elegidos ×" y, con 2 o 3, **"Comparar n »"**, que abre el comparador con ellas (con más, avisa de que el máximo es 3): una sola casilla por fila para comparar y para descargar.

- Productos: **filtro por tubo** ("Tu tubo") en la barra: un panel con los 70 tubos de los rotores de la web actual, un título por tipo y sus medidas como botones (apagados los que no darían resultados). Deja solo las máquinas que lo admiten y cada tarjeta dice en qué rotor va y cuántos caben a la vez; si su versión a la vista no lo admite y otra sí, enseña esa. La barra de filtros pasa a dos filas.
- Productos: en pantallas de 1600 px o más el catálogo se ensancha (1560 px) y pasa a cuatro columnas, con tarjetas de unos 345 px.
- Productos: las portadas de familia pasan a gris oscuro sobre la foto del rotor, iguales para todas; el color de la familia queda solo en la raya de arriba (8 px, más vivo), y las tarjetas usan ese mismo color vivo en la raya bajo la foto (5 px) y en el cuadradito de la aplicación.
- Productos: el contador del presupuesto, más tranquilo: gris claro sin marco rojo; con 1 unidad el "−" es una papelera (también en "Mi presupuesto", donde sobra el aspa) y al añadir aparece un momento "Añadido al presupuesto: <modelo>" encima del botón de abajo.
- Productos: el presupuesto de cada tarjeta pasa a ser un contador de unidades. "+ Presupuesto" se convierte al pulsarlo en "− 1 ud. +" con marco rojo; con 1, el "−" quita la máquina. Fuera "Añadido" y "Quitar". La tarjeta y el panel del presupuesto van sincronizados.
- Productos: las tarjetas del catálogo usan la foto de laboratorio retocada (`mesa-tarjeta.webp`): sin guante, pipeta ni microscopio, el fondo más desenfocado y solo una gradilla de tubos y un matraz rojos en los bordes, para que la máquina sea lo primero que se ve.
- Productos: **barra de filtros** nueva (`Filtros.astro`), en su sitio bajo el hero (no baja al hacer scroll): gris con raya roja arriba, buscador con sugerencias (foto, nombre con lo escrito en rojo y aplicación; flechas y Enter), temperatura con iconos (ventilador, copo, llama), aplicación en un desplegable con el número de productos de cada una y títulos de grupo con línea roja, el total y "Borrar filtros". En móvil, buscador y botón que abre los filtros desde abajo.
- Productos: **tarjetas** nuevas (`Maquina.astro`): caja con la raya del color de su familia, escenario gris con el nombre gigante detrás de la máquina, etiqueta de temperatura, aplicación, nombre, frase y tres cifras grandes; al pasar el ratón se inclina hacia el cursor, el escenario se apaga a negro y la franja "Ver ficha" se llena de rojo. Títulos de familia en negrita grande con número rojo y la raya de su color.
- Productos: **comparador** en el catálogo. Cada centrífuga lleva "Comparar" (hasta 3) en una etiqueta blanca junto a la de temperatura; abajo aparece una barra con las elegidas y al abrirla se ven lado a lado: aplicación, temperatura, capacidad, velocidad, fuerza, pantalla, medidas, peso, consumo y rotores, con el mayor de cada cifra marcado. La elección se mantiene al ir a una ficha y volver. En móvil, barra de una línea y ventana a pantalla completa (`src/scripts/comparador.ts`).
- Ficha de producto: placa de datos técnicos más suave (tarjeta blanca, borde fino, sombra difusa, raya roja arriba).
- Ficha de producto: la descripción en una columna a la izquierda (entradilla y párrafos) y "De un vistazo" a la derecha en 2 × 2, fijo al bajar; en móvil, las placas arriba. Fuera la línea "Datos de la ficha de producto de ortoalresa.com".
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

- Productos, en móvil: los **atajos de familia van en una sola fila que se desliza** de borde a borde, en vez de cuatro filas que ocupaban media pantalla antes del primer producto; y el **buscador dice "Buscar"** (en tableta y móvil), porque la frase larga se cortaba a media palabra en un campo tan estrecho.
- Productos: la **barra de filtros** pasa de gris oscuro a blanca con contorno fino y la raya roja arriba, más limpia sobre la sección blanca. Los controles, con borde gris claro y texto oscuro; lo elegido, en gris muy claro con borde oscuro y su raya de color.
- Productos: el **selector de versión** de las tarjetas pasa a ser pestañas que salen de la raya de color de la foto: la elegida, del color de la raya y algo más alta, como parte de ella; las otras, oscuras. Se quita la etiqueta "Versión" de delante, que parecía un botón más.
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

### Corregido

- Productos: la caja del presupuesto (abajo a la derecha), aun cerrada, tapaba lo que quedaba encima de su botón: no se podía pulsar el "+" de algunas filas de la tabla ni "PDF" y "Excel". Ahora solo reciben el clic su botón y su panel abierto.
