# El porqué de todo

Este documento explica **por qué la web nueva es como es**, pieza a pieza, frente a la web actual
(ortoalresa.com). Es el guion para presentarla a la dirección: cada punto dice qué había, qué hay ahora
y por qué es mejor, y también qué se probó y se descartó por el camino.

Se lee en el mismo orden en que un visitante recorre la web: primero lo que afecta a toda la web, luego
la cabecera y después cada sección de arriba abajo. Cada PR que cambia algo visible actualiza este documento.

Las fuentes de los datos están en [Contenido](contenido.md); las decisiones técnicas, en [Decisiones](decisiones/).

---

## 1. El punto de partida: qué fallaba en la web actual

Antes de diseñar nada se revisó la web actual página a página (ES, EN y FR). Estos son los problemas que la
web nueva resuelve, y todo lo demás de este documento sale de aquí:

| Problema                                                                       | Por qué importa                                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| La portada es un tablón de novedades (carrusel de 7)                           | Quien entra no sabe en diez segundos quiénes sois ni por qué comprar            |
| 10 entradas de menú al mismo nivel                                             | Demasiadas opciones; SmartConnect y REI System son funciones, no secciones      |
| Configurador, guía de equipos y tabla comparativa en tres sitios               | Las tres sirven para lo mismo: elegir centrífuga                                |
| Nada pensado para el distribuidor; el formulario pone "Cliente final" primero  | El distribuidor es vuestro cliente real y no tenía sitio                        |
| El enlace "Guías" del menú da error 404                                        | Un enlace roto en el menú da imagen de abandono                                 |
| Garantía de 3 años en portada y "2 años" en Empresa                            | Una web que se contradice pierde la confianza del cliente                       |
| "Más de 70 años" en portada y "75 años" en Empresa                             | Igual; además, caduca cada año                                                  |
| "Más de 25" centrífugas, cuando el Catálogo 2025 tiene 23 modelos              | El dato no coincidía con el catálogo                                            |
| Google muestra el WordPress interno (wp.ortoalresa.com) con títulos de trabajo | Contenido duplicado e imagen de web a medio hacer en los resultados de búsqueda |
| Fax, © 2021, URLs en español dentro de la versión inglesa                      | Detalles de época que restan seriedad                                           |

## 2. Toda la web

### 2.1 Tecnología: web estática en lugar de WordPress

- **Antes:** WordPress con plugins (WPML, Analytics, Tag Manager…).
- **Ahora:** web estática hecha con Astro: cada página se genera una vez y se sirve ya hecha.
- **Por qué es mejor:**
  - **Carga casi instantánea**, también en móvil y con mala cobertura (un distribuidor en una feria).
  - **Más segura:** no hay base de datos ni panel de administración que atacar, ni plugins que actualizar.
  - **Más barata de alojar:** se puede servir gratis o casi desde un CDN.
  - **Mejor para Google:** las páginas rápidas y bien estructuradas posicionan mejor.
- Las partes que se mueven (filtro de la gama, y más adelante el selector y el modelo 3D) son pequeñas
  "islas" que solo se cargan cuando aparecen en pantalla. El resto de la página no descarga código.
- Detalle: decisiones [0001](decisiones/0001-web-estatica-con-astro.md) y [0002](decisiones/0002-react-solo-en-islas.md).

### 2.2 Datos: uno solo, y siempre del catálogo

- **Antes:** el mismo dato escrito a mano en varias páginas, y por eso contradicciones (garantía, años, modelos).
- **Ahora:** cada dato vive en un único sitio del código y sale del **Catálogo General 2025** o de la web
  actual. Si falta, no se inventa: se deja fuera y se pide a la empresa.
- **Por qué es mejor:** la web no puede contradecirse, y cambiar un dato (un teléfono, una cifra) lo cambia
  en toda la web a la vez.
- Datos corregidos hasta ahora: garantía **3 años** (salvo Minicen y destiladores, 14 meses), **desde 1949**
  (sin contar años, así no caduca), **23 modelos en 17 series**, y la Cyto 22 con **866 xg**.
- Detalle: [Contenido](contenido.md) y decisión [0006](decisiones/0006-datos-oficiales-validados.md).

### 2.3 Marca: la vuestra, modernizada

- **Se conserva todo lo que hace reconocible a Orto Alresa:** logo sin tocar, el rojo `#DD040A`, la
  Helvetica Neue Condensed en dos pesos, esquinas rectas, el `»` rojo de los enlaces y los equipos sobre
  "estantes" grises como en el catálogo.
- **Se moderniza el resto:** titulares mucho más grandes (la letra condensada luce a gran tamaño), más aire
  entre bloques y movimiento sutil.
- **Por qué:** aplicar el manual al pie de la letra repetiría las limitaciones de la web actual; inventar una
  estética nueva haría perder la identidad. El punto medio se reconoce como Orto Alresa y se ve actual.
- **El rojo, con medida:** nunca más de un 10 % de la pantalla, solo en lo que hay que pulsar o recordar.
  Así, cuando aparece, llama la atención.
- **Sin antetítulos pequeños en mayúsculas** encima de los titulares ("LA GAMA", "FABRICANTES EN MADRID"):
  competían con el titular y hacían la página más recargada. Cada sección tiene una sola jerarquía clara.
- **Nada de plantilla:** sin degradados, sin iconos genéricos, sin fotos de stock, sin emojis. Solo fotos
  reales de vuestros equipos.
- Detalle: [Marca](marca.md) y decisión [0004](decisiones/0004-marca-como-base.md).

### 2.4 Móvil

- **Antes:** una web pensada para escritorio que en móvil se estrecha.
- **Ahora:** cada pieza se diseña y se revisa a la vez en escritorio (1440 px) y en móvil (390 px), sin
  scroll lateral ni textos cortados.
- **Por qué:** muchos distribuidores consultan en ruta o en ferias, desde el móvil.

### 2.5 Accesibilidad y detalles de calidad

- Enlace "Saltar al contenido" para quien navega con teclado.
- Si el sistema del visitante pide menos movimiento, las animaciones se desactivan.
- Revisión automática de accesibilidad en cada cambio (lint con reglas de accesibilidad).
- Página 404 propia, mapa del sitio para Google y cabeceras de seguridad.
- **Por qué:** una web de empresa seria tiene que funcionar para todo el mundo y dar la misma impresión de
  cuidado que vuestros equipos.

### 2.6 Cómo se trabaja

- Cada cambio va por separado, se revisa y se aprueba antes de entrar; una comprobación automática revisa
  formato, errores y que la web compile.
- Todo queda documentado: qué se cambió, por qué y qué se descartó.
- **Por qué:** la web se puede mantener y ampliar durante años sin depender de una persona concreta.

---

## 3. Cabecera

| Antes                                                   | Ahora                                                                                                                                                                       | Por qué es mejor                                                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10 entradas de menú al mismo nivel                      | 9 entradas en el orden de la portada (Productos, REI System, SmartConnect, Configurador, Empresa, Distribuidores, Noticias, Servicio técnico, Descargas) y Contacto en rojo | Lo mismo que la web actual, con Guías y Descargas juntas; el menú se lee como se baja por la portada y Contacto, que es lo que más importa, destaca |
| Menú con huecos desiguales                              | El mismo hueco a cada lado de cada entrada                                                                                                                                  | La barra se ve ordenada y equilibrada                                                                                                               |
| Idioma en texto                                         | Banderas                                                                                                                                                                    | Se reconoce sin leer, en cualquier idioma                                                                                                           |
| Para buscar un modelo había que recorrer menús          | Lupa: se escribe el modelo y aparece, sin tildes ni mayúsculas                                                                                                              | El distribuidor que sabe lo que quiere llega directo a la ficha                                                                                     |
| Barra negra superior con teléfono y correo              | Fuera; teléfono y correo siguen en el menú móvil y en el pie                                                                                                                | Más aire arriba y la cabecera queda para navegar                                                                                                    |
| Sellos ODS y Empresa Solidaria apretados en la cabecera | En el pie, en todas las pantallas                                                                                                                                           | Se ven enteros y no compiten con el menú                                                                                                            |
| Cabecera fija ocupando pantalla mientras se lee         | Se aparta al bajar y vuelve en cuanto se sube                                                                                                                               | Más espacio para el contenido, sobre todo en móvil                                                                                                  |
| En móvil, menú pequeño                                  | Banderas y lupa siempre a la vista; menú a pantalla completa con Contacto, teléfono y correo                                                                                | Se usa con el pulgar; se llama en un toque                                                                                                          |
| Logo en una línea                                       | Logo en dos líneas, la versión del manual                                                                                                                                   | Más compacto y reconocible                                                                                                                          |

La barra se parece a la de la web actual a propósito: a la empresa le gusta que la navegación no cambie, así que la
simplificación va dentro de cada página, no en la barra.

- **Productos**, como en la web actual (antes "Centrífugas").
- **REI System, SmartConnect y Configurador** seguidos y con su nombre, en el orden del acordeón de Tecnología, en
  lugar de un solo "Tecnología": son lo que distingue a la marca. Cada uno abre su panel en la portada y, al leer esa
  sección, el menú marca el panel abierto. Sin los iconos de la web actual: desentonaban con el resto de la barra.
- **Descargas** junta las Guías y las Descargas de la web actual: las dos son documentos, y dentro de la página cada
  cosa tiene su sección. **Noticias** lleva a las notas de la portada hasta que tenga página propia.
- Nueve entradas caben a 1440 px en los tres idiomas (el francés es el más largo) con 16 px entre ellas; por debajo
  de 1440 px se usa el menú a pantalla completa.
- Descartado: agrupar REI System, SmartConnect y Configurador en un desplegable bajo un título común, porque escondía
  justo lo que la empresa quiere enseñar; y juntar Contacto con Servicio técnico, porque son públicos distintos
  (comprar frente a una máquina averiada).

Pendiente, a propósito: los desplegables de Centrífugas y Distribuidores llegan cuando existan esas páginas.
Ponerlos antes haría que todos los enlaces llevaran a la portada.

---

## 4. Primera pantalla de la portada

- **Antes:** un carrusel de 7 novedades (mesas móviles, pantalla nueva, ISO 14001…), con el titular cortado
  bajo el menú.
- **Ahora:** en una sola pantalla, sin bajar:
  - **Quiénes sois:** "Expertos en **centrifugación**" y una frase: desde 1949 diseñáis y fabricáis en
    Daganzo (Madrid) y vendéis en todo el mundo a través de distribuidores.
  - **Por qué fiarse**, con cuatro cifras reales: respuesta en **48 h**, entrega en **1 semana**,
    **3 años** de garantía e **ISO 13485**.
  - **Dos caminos:** "Ver la gama" (en rojo) y "Soy distribuidor".
  - **Un equipo real:** la Digicen 22 sobre su estante, como en el catálogo, con sus cifras y tres notas
    técnicas (SmartConnect, REI System y pantalla TFT) que se dibujan al entrar (ver 4.2).
- **Por qué es mejor:**
  - Un carrusel obliga a esperar y casi nadie ve más allá de la primera diapositiva. Aquí todo se entiende
    en diez segundos.
  - Las cifras convencen más que los adjetivos ("integridad, dinamismo"…): lo concreto no lo puede decir
    cualquiera.
  - El distribuidor tiene su propio camino desde el primer segundo.
  - La foto sobre el estante es el motivo del catálogo: se reconoce la marca de un vistazo.
- **Preparado para después:** el hueco de la foto es el del futuro modelo 3D interactivo de la Digicen 22.
  Cuando lleguen los archivos CAD, el visor ocupará ese sitio sin mover nada más.
- En móvil, las notas técnicas pasan a una lista bajo la foto para que no tapen el equipo.

### 4.1 Sin antetítulo: "desde 1949" pasa a la frase

- **Antes (primera versión nueva):** una línea pequeña en mayúsculas encima del titular, "FABRICANTES EN MADRID
  DESDE 1949".
- **Ahora:** fuera. El dato no se pierde: la frase de debajo empieza por "Desde 1949 diseñamos y fabricamos
  centrífugas de laboratorio en Daganzo (Madrid)…". (La pestaña roja lateral que también lo decía se quitó después: ver §16.)
- **Por qué:** un texto pequeño encima de un titular enorme compite con él y recarga la pantalla. Es el mismo
  criterio que en la gama: una sola jerarquía, el titular manda.

### 4.2 El recuadro de la Digicen 22: oscuro y con retícula de plano

- **Antes (primera versión nueva):** fondo gris claro y ficha en un gris algo más oscuro. Se diferenciaba poco
  del resto de la pantalla y la máquina, que también es clara, se perdía.
- **Ahora:**
  - **Fondo gris oscuro**, el mismo de la barra de filtros de la gama, y la ficha de abajo en un gris aún más
    oscuro con letra blanca.
  - **Retícula fina** de fondo, como el papel de un plano.
  - **La cota del ancho real** de la máquina, **410 mm** (tabla de versiones de la serie Digicen 22 del
    catálogo), dibujada bajo la máquina como en un plano técnico.
  - **Las patas se apoyan justo en la ficha**, con una sombra de contacto, en lugar de pisarla.
  - **La máquina se centra en todo el recuadro oscuro**, también en monitores anchos, donde el recuadro llega
    hasta el borde de la pantalla.
- **Por qué es mejor:**
  - El contraste separa la foto del texto sin necesidad de bordes, y la máquina clara destaca sobre el oscuro.
  - La retícula y la cota dicen, sin palabras, que sois fabricantes: es el lenguaje de ingeniería de quien
    diseña la máquina, no de quien la revende. Casan con las notas técnicas que ya se dibujan sobre la foto.
  - El mismo gris oscuro en la portada y en la gama hace que la web se vea como un conjunto.
- **Descartados:**
  - **Solo la ficha oscura** con el fondo claro: mejoraba la base, pero la foto seguía sin destacar.
  - **Recuadro con borde** como las tarjetas de la gama: ordenado, pero con poco contraste para una primera
    pantalla.
  - **Luz de estudio detrás de la máquina:** bonita, pero genérica; cualquier web de producto la tiene.
  - **Fondo oscuro sin nada más:** correcto, pero desaprovechaba la ocasión de mostrar oficio.

### 4.3 Efectos al pasar el ratón

- Los botones "Ver la gama" y "Soy distribuidor" llevan su `»` y lo desplazan; el rojo se oscurece y el de
  borde se rellena de negro.
- "Ver en la gama" se subraya en rojo y la máquina sube un poco.
- **Por qué:** dejan claro qué se puede pulsar y dan sensación de web cuidada, sin distraer. Si el sistema pide
  menos movimiento, no hay animaciones.

### 4.4 El texto llena la pantalla: titular arriba, cifras grandes abajo

- **Antes:** el texto estaba centrado en vertical frente al recuadro oscuro, que ocupa toda la pantalla. Al
  quitar el antetítulo el texto quedó más corto, y lo que perdió se convirtió en un hueco blanco grande entre
  el menú y "Expertos en centrifugación".
- **Ahora:**
  - El titular empieza a una distancia fija bajo el menú (entre 56 y 88 px según la altura de la pantalla) y
    crece hasta llenar el ancho de su columna (hasta 92 px, antes 84). La frase se ensancha y los dos botones
    van justo debajo.
  - Las cuatro cifras (48 h, 1 semana, 3 años, ISO 13485) pasan a ser grandes, en una rejilla de 2 × 2 con
    rayas finas, y ocupan todo lo que queda de columna hasta el pie de la portada, a la altura de la ficha de la
    Digicen 22.
  - En pantallas bajas (portátiles de 720–820 px de alto) las cifras vuelven a una sola fila, con el tamaño
    ajustado al ancho de la columna, para que todo quepa en una pantalla sin cortar nada.
  - El margen de la izquierda no se toca: el texto empieza en la misma vertical que el logo, igual que todas las
    secciones de la web.
  - En móvil no cambia.
- **Por qué es mejor:**
  - No queda ningún hueco blanco que parezca un error, en ninguna pantalla.
  - El espacio lo ocupan los cuatro argumentos que un distribuidor quiere ver (respuesta, entrega, garantía,
    certificación), ahora a un tamaño que se lee de un vistazo, en lugar de aire vacío.
  - Titular, frase y botones arriba: quiénes sois y los dos caminos, sin bajar.
- **Descartados (probados con capturas):**
  - **Solo subir el texto:** el hueco pasaba abajo.
  - **Cifras abajo en fila pequeña:** el hueco pasaba al medio, entre los botones y las cifras.
  - **Portada menos alta con todo junto:** sin hueco, pero la máquina se hacía más pequeña, y ahí irá el modelo
    3D.

### 4.5 Rediseño: el rotor de cerca a pantalla completa (1-10-2026)

- **Antes:** texto a la izquierda y, a la derecha, la Digicen 22 recortada sobre un recuadro oscuro con retícula y
  notas técnicas; las cuatro cifras en cajas.
- **Ahora:** una foto vuestra desde arriba: manos con guantes cargando tubos de tapón rojo en un rotor RT 267, con
  "ortoalresa" grabado, ocupa toda la portada. Encima, el titular en blanco con "ción" en rojo, la frase, los dos botones y, al pie, las
  cuatro razones (48 h, 1 semana, 3 años, ISO 13485) sobre una línea fina, sin cajas. Un velo oscuro solo donde va el
  texto; el rotor y los tubos de la derecha quedan limpios.
- **Movimiento:**
  - Al entrar, el rotor llega girando y frena hasta pararse, como al final de un ciclo de centrifugación. El titular
    se descubre desde abajo y el resto sube detrás.
  - Con ratón, la foto se desplaza unos píxeles siguiendo el puntero y un brillo suave ilumina el metal y los tapones
    por donde pasa.
  - Botones: "Ver la gama" sube un poco, le cruza un destello y se ilumina en rojo; "Soy distribuidor" se rellena de
    blanco de izquierda a derecha. En los dos la » avanza.
  - Cifras: al pasar el ratón crece encima la misma raya roja de las tarjetas de la web y la cifra sube.
  - Con "reducir movimiento" activado en el sistema, todo queda quieto.
- **Por qué es mejor:** es vuestro producto en uso, en manos de una persona: el visitante ve una centrífuga por
  dentro, cargándose, con vuestra marca grabada. Foto propia y nítida. Una sola imagen y poco texto, más limpio que la versión anterior. El movimiento
  cuenta algo (un rotor que frena), no es adorno.
- **Móvil:** la foto ocupa la mitad de arriba, con el buje a la vista, y se funde con el fondo oscuro del texto.
- **Descartados el mismo día:**
  - **Foto del técnico con guante (lab-114) de fondo:** ya se usaba en otras secciones.
  - **Miniatura de YouTube del mismo rotor (686 px):** se veía borrosa; se sustituyó por una captura del vídeo a
    1315 px.
  - **Captura del vídeo del rotor RT 266 (1315 px):** mejor, pero algo blanda y sin personas.
  - **Rotores con REI System del catálogo (pág. 31):** nítida, pero ya sale en Tecnología.
  - **Cartel con "centrifugación" a todo el ancho y cinco máquinas recortadas turnándose delante:** la centrífuga
    recortada seguía pareciendo catálogo.
  - **Vitrina gris con selector de modelos:** misma estructura de dos columnas de siempre.
  - Antes, en otro hilo: la máquina gigante sobre blanco, máquina con foto de la fábrica, fachada con titular y un
    modelo 3D genérico de Sketchfab.
- **El modelo 3D:** cuando llegue el CAD de la Digicen 22 se decidirá dónde va; ya no ocupa la portada.

---

### 4.6 Foto del rotor girando, movimiento más tranquilo y cifras con iconos (2-10-2026)

- **Foto, antes:** manos con guantes cargando tubos en un rotor RT 267. **Ahora:** un rotor girando a toda
  velocidad, con estelas rojas y el buje de metal nítido (foto de la empresa). Es lo que hace una centrífuga,
  contado en una imagen; deja más zona oscura para el texto y, al estar en movimiento, no se le nota la resolución.
  No se ha subido la resolución con IA porque se inventa detalles; si la empresa tiene el original, se cambia el
  archivo y listo. En móvil se encuadra con el buje centrado arriba.
- **Movimiento, antes:** la foto entraba girando y luego se desplazaba con el ratón, con un brillo detrás del
  puntero; se notaba como un temblor. **Ahora:** la foto solo se aclara y se asienta despacio al cargar, y luego
  queda quieta. Un fondo quieto se lee mejor y transmite más seriedad.
- **Botón "Ver la gama":** mantiene el destello y, al pasar el ratón, se vuelve cristal rojo: deja ver la foto
  detrás, con un brillo fino en el borde de arriba y un halo rojo muy suave.
- **Cifras, antes:** cuatro textos sobre una línea fina, sin nada que los distinga. **Ahora:** cuatro placas de
  cristal esmerilado, cada una con un icono de la propia marca (los mismos de la web actual y del sistema de diseño) en
  un círculo rojo: teléfono para 48 h, caja para 1 semana, escudo para 3 años y casillas marcadas para ISO. Se entienden de un vistazo, antes de leer.
  - Al pasar el ratón: cruza el mismo destello de luz que en el botón, la raya roja de la web crece arriba, la
    esquina se vuelve roja, el borde y el icono se encienden con un rojo neón muy suave y el icono da un pequeño
    salto.
  - Con "reducir movimiento" activado en el sistema, los iconos quedan quietos.
- **Fluidez:** todo el movimiento usa solo desplazamientos y transparencias, que el navegador mueve sin
  redibujar la página (60 fotogramas por segundo medidos al entrar y al pasar el ratón). Los efectos de ratón solo
  existen con ratón: en el móvil, al tocar una cifra no se queda encendida. La foto pesa 41 KB (23 KB en móvil).
- **Descartados (con capturas):** iconos dibujados para la ocasión (reloj, camión, calendario, sello): se veían
  genéricos, y los de la marca ya son vuestros y sin derechos que pagar. Cifras sin cajas con el icono encima, y tarjetas oscuras opacas como las del
  resto de la web; las placas de cristal casan mejor con la foto y con el botón.

## 5. La gama (portada)

### 5.1 Qué había y qué hay

- **Antes:** una rejilla plana con parte de la gama. Para elegir había que ir a tres sitios distintos
  (configurador, guía de equipos y tabla comparativa).
- **Ahora:** **las 17 series del catálogo (23 modelos)** en la portada, cada una en su tarjeta con foto,
  frase, cifras y tipo de temperatura, y un filtro por uso.
- **Por qué es mejor:** el distribuidor ve toda la gama de un vistazo y encuentra la que busca sin salir de
  la portada.

### 5.2 El titular: "La gama completa, siempre en stock"

- Sale del catálogo: "continuo stock de nuestros productos que nos permite ofrecer rápidos plazos de
  entrega" (pág. 12).
- **Por qué:** al distribuidor le importa sobre todo poder vender y servir rápido. El titular le dice las
  dos cosas: está todo, y está disponible.
- **Descartados:**
  - "Una centrífuga para cada laboratorio": sonaba a promoción ("una por laboratorio").
  - "De 0,2 ml a 1 litro por tubo": correcto, pero frío y difícil de leer.
  - "Nuestro catálogo de centrífugas" y "Elige por uso, compara de un vistazo": correctos, pero sin
    argumento de venta.

### 5.3 El filtro: cinco familias por uso

- **Pestañas:** Todas · Compactas · Universales · Gran capacidad · Clínica · Industria.
- **Por qué por uso:** el catálogo tiene ocho familias (Mini, Pequeña, Micro, Universales, Gran capacidad,
  Sobre piso, Industriales y Clínicas) y varias tienen una sola serie. Agrupadas por uso quedan cinco, y cada
  pestaña tiene contenido suficiente.
  - **Compactas** junta Mini, Pequeña y Micro (Minicen, Microcen 24, Biocen 22 y 22 R). Una sola palabra,
    como las demás pestañas; el catálogo usa "compacta" para describir la Minicen.
  - **Gran capacidad** incluye la Magnus 22, de suelo.
- **Cómo se ve:** una banda gris oscura a todo el ancho, con las seis pestañas repartidas a partes iguales.
  La elegida se marca en blanco con una raya roja que se desliza hasta ella.
- **Por qué así:**
  - Una barra gris clara se veía "flotando"; la banda oscura la ancla y separa el filtro de las fichas.
  - Gris oscuro y no negro: el negro hacía demasiado contraste con el resto de la página.
  - A todo el ancho y con huecos iguales, no sobra barra vacía al final.
  - La raya roja es el rojo de la marca, usado en lo único que hay que ver: qué está elegido.
- **El filtro se queda en su sitio**, encima de las fichas, y no baja con la página.
  - Antes iba pegado debajo del menú al bajar, pero flotaba sobre las fotos y cortaba las fichas por la
    mitad: quedaba feo y tapaba justo el producto.
  - El filtro se usa al llegar a la gama, no a mitad de ella, y la lista es corta (seis fichas, o las de una
    familia), así que volver a él cuesta poco.
  - Descartado: dejarlo pegado con una banda a todo el ancho. Tapa menos, pero sigue quitando sitio a las
    fotos en el móvil.
- **Descartados:**
  - **Filtro por temperatura:** casi todas son ventiladas; la temperatura va en cada ficha.
  - **Las ocho familias del catálogo:** filtro largo y pestañas con una sola serie.
- Detalle: decisión [0007](decisiones/0007-gama-por-uso.md).

### 5.4 Un color por familia

- Morado (Compactas), verde agua (Universales), ocre (Gran capacidad), granate (Clínica) y verde oliva
  (Industria). Aparecen en el punto de cada pestaña, en una franja encima de la foto y en el nombre de la
  familia de cada ficha.
- **Por qué:** se sabe de qué familia es cada equipo sin leer, y al filtrar se ve que todas las tarjetas son
  del mismo grupo.
- **Por qué colores suaves:** con colores vivos, la página competía con el rojo de la marca. Los suaves
  ordenan sin gritar, y el rojo sigue siendo el único color de marca.

### 5.5 La tarjeta de cada serie

De arriba abajo:

1. **Foto** del propio catálogo, sobre fondo gris.
2. **Familia**, con su color.
3. **Nombre** en grande y en negrita, con sus versiones en letra ligera ("Digicen 22 · 22 R") y el `»` rojo
   siempre visible.
4. **Una frase** que resume la ficha del catálogo ("Universal por concepto.", "De suelo, para no quitar sitio
   en la poyata.").
5. **Cifras clave:** capacidad máxima, rpm y xg.
6. **Temperatura:** ventilada, refrigerada o calefactada, con un icono en un círculo de color (gris, azul o
   naranja) y la palabra.

- **Por qué este contenido:** con mirar la tarjeta se sabe si es lo que se busca, sin abrir nada. Es lo mismo
  que hace un buen catálogo impreso.
- **Por qué con borde:** sin tarjeta, las fichas parecían sueltas sobre la página. Un borde gris oscuro de
  2 px (el mismo tono de la barra de filtros) encierra cada ficha, y otra raya igual separa la foto del texto.
  Al pasar el ratón, el borde se vuelve negro.
- **Por qué la temperatura sin recuadro:** en un recuadro blanco el icono se perdía. En un círculo de color
  destaca y se distingue a la primera.
- **Las cifras, siempre a la misma altura** en todas las tarjetas de una fila, aunque la frase ocupe una o
  dos líneas. Así se comparan de un vistazo.
- **Descartados:** etiquetas tipo "chip" sobre la foto y recuadros para cada dato (recargaban la tarjeta),
  y el `»` que solo aparecía al pasar el ratón (no se veía en móvil).

### 5.6 Seis a la vista y "Ver las 17 series"

- Al entrar se ven las 6 primeras y un botón "Ver las 17 series".
- **Por qué:** 17 tarjetas seguidas alargan mucho la portada y empujan hacia abajo el resto de secciones. Seis
  enseñan la variedad y el botón deja ver todo con un clic. Al elegir una familia se ven todas las suyas.

### 5.7 Movimiento

- El titular, el filtro y las tarjetas entran con un fundido corto la primera vez que se ve la sección, y al
  pasar el ratón la foto se acerca un poco, la franja de color crece y el `»` se desplaza.
- **Por qué:** da sensación de web cuidada sin distraer. Si el sistema pide menos movimiento, no hay animaciones.

### 5.8 Las fotos

- **Ahora** son recortes del Catálogo 2025, porque aún no tenemos las originales de todos los modelos.
- **Por qué:** mejor una foto real del catálogo que una genérica o un hueco. Cuando lleguen las originales,
  se cambian sin tocar el diseño.

### 5.9 La lupa lleva a la ficha

- Si se busca un modelo con la lupa de la cabecera, se abre la gama completa y la página va a esa tarjeta.
- Cuando existan las páginas de cada modelo, la tarjeta llevará a su página: solo cambia el enlace.

---

## 6. Tecnología propia (portada)

Todo el contenido sale del Catálogo General 2025 (págs. 12-13, 28-31, 58 y 60) y de la web actual. El
inventario completo, con cada frase y su fuente, está en `analisis/tecnologia-contenido.md` de la carpeta del
proyecto.

### 6.1 Qué había y qué hay

- **Antes:** la tecnología estaba repartida en cuatro sitios que no se enlazaban entre sí:
  - REI System y SmartConnect eran entradas sueltas del menú principal, al mismo nivel que Empresa.
  - PCBS, ULS, GRS y las pantallas estaban dentro de una "Guía de equipos", y el enlace del menú a esa guía da
    error (404).
  - Las siglas solo se explicaban en las preguntas frecuentes.
  - Ninguna página decía qué modelos llevan cada sistema. Web y catálogo se contradicen en varias cifras.
- **Ahora:** una sección de la portada lo reúne todo en tres niveles:
  1. **REI System y SmartConnect, a lo grande.** Son lo que más diferencia a Orto Alresa, y cada uno va con su
     foto real del catálogo. El REI explica en 3 pasos cómo se pone y se quita el rotor y enlaza al vídeo
     oficial. SmartConnect cuenta en 4 puntos lo que ve el laboratorio y el servicio técnico.
  2. **Pantalla táctil, PCBS y ULS, en tres tarjetas.** Cada una lleva una imagen o un esquema, una frase y
     una cifra: 100 memorias, 175 rampas de frenado y el nº del vaso en pantalla.
  3. **"Y además, según el modelo":** reconocimiento del rotor, tapa segura, de −20 a 80 °C y menos de 60 dB.
- **Cada sistema dice qué modelos lo llevan**, y cada nombre enlaza con su tarjeta de la gama.

### 6.2 Por qué es mejor

- Un distribuidor entiende en segundos qué hace cada sistema y en qué equipos está, sin buscar en tres páginas
  ni en una FAQ.
- Se explica con palabras de uso ("se levanta el tirador rojo", "dice qué vaso lo ha causado"), no con siglas.
- Las fotos son reales del catálogo. PCBS y ULS no se ven en una foto, así que llevan un esquema dibujado con
  el mismo estilo de plano que la portada (retícula y rojo de marca): una curva de velocidad con frenado brusco
  y progresivo, y un rotor visto desde arriba con el vaso señalado.
- La sección es oscura, como la franja de filtros de la gama y el recuadro de la portada, para que la web se
  vea como un conjunto y la sección destaque entre las blancas.

### 6.3 Movimiento y efectos

- Cada bloque entra suave la primera vez que se ve. Los pasos del REI aparecen uno detrás de otro.
- En el esquema del PCBS la curva se dibuja sola y el frenado progresivo, en rojo, llega el último. En el del
  ULS el vaso con desequilibrio late dos veces y aparece el aviso.
- Al pasar el ratón, las fotos se acercan un poco y las tarjetas suben con una raya roja arriba, como la barra
  del filtro de la gama. "Ver el vídeo" y los nombres de modelo se subrayan en rojo, como "Ver en la gama" en
  la portada.
- **Por qué:** guían la vista hacia lo importante y hacen que la sección se sienta cuidada, sin distraer. Si
  el sistema pide menos movimiento, no hay animaciones y todo se ve desde el principio.

### 6.4 Descartados

- **Pestañas** (como el filtro de la gama): ocupaban poco, pero lo que no se pulsa no se ve, y aquí interesa
  que se vea todo.
- **Recorrido al bajar** (imagen fija que cambia): muy vistoso, pero ocupaba unas cinco pantallas de alto en la
  portada.
- **GRS en la portada:** solo lo lleva la serie Digtor 22 C, como opción. Irá en la página de Tecnología a
  fondo y en su ficha.

### 6.5 Lo que viene después

Esta sección es el escaparate. Lo que en la web antigua se usaba, y no solo se leía, tendrá su página:

- **Tecnología a fondo:** el vídeo del REI dentro de la página, el paso a paso con fotos, el acceso a
  SmartConnect, los PDF, el GRS y las preguntas frecuentes.
- **Elegir centrífuga:** el configurador por pasos, la guía de tubos y la tabla comparativa.

---

## 7. Distribuidores (portada)

Los datos salen del Catálogo General 2025 ("¿Qué nos diferencia?", garantía y OEM) y de la web actual (plazo de
entrega).

### 7.1 Qué había y qué hay

- **Antes:** la web no tenía nada para distribuidores. El formulario de contacto ponía "Cliente final" como
  primera opción. El prototipo de esta sección llevaba una etiqueta pequeña en mayúsculas, cuatro casillas
  iguales y dos botones del mismo peso, que además iban al mismo sitio.
- **Ahora:** las razones para trabajar con Orto Alresa se cuentan como **el recorrido de un pedido**: una ruta
  roja que se dibuja sobre un fondo de laboratorio y, en cada parada, un haz de luz que proyecta un rotor girando
  (rediseño del 1 de octubre de 2026, ver 7.6):
  1. **Stock:** haces el pedido y hay existencias de toda la gama.
  2. **1 semana:** te llega al almacén. Es el plazo medio de 2024 y 2025 según la web actual; no se ponen los
     años para que no se quede vieja.
  3. **48 h:** si tienes una duda, tienes respuesta, con puesta en marcha, reparaciones y formación online.
  4. **3 años:** tu cliente queda cubierto por la garantía, salvo la Minicen, que tiene 14 meses.
- Debajo, una franja oscura remata la sección con el **OEM** ("¿Necesitas un equipo a medida?", tal como lo cuenta el catálogo) y **un solo
  botón fuerte**, "Hazte distribuidor".
- Arriba, bajo la entradilla, un enlace para el laboratorio que llega por error: "¿Eres un laboratorio?
  Encuentra tu distribuidor". Lo ve antes de empezar a leer lo que no va con él, y no compite con el botón
  del distribuidor. Se probó también en una franja gris bajo la oscura, pero quedaba como una tarjeta suelta.

### 7.2 Por qué es mejor

- Habla al cliente real con lo que vive en su día a día: pedir, recibir, resolver dudas y responder ante su
  cliente. Una lista de ventajas se lee y se olvida; un recorrido se entiende.
- Un solo botón principal, porque la sección es para el distribuidor. El laboratorio que entra por error tiene
  su salida, pero no le quita protagonismo.
- Sin etiqueta pequeña encima del título: la jerarquía la marca el titular, como en el resto de la web.
- Cada cifra tiene fuente. Se quitó "una marca europea que se vende sola", que no aparece en ningún documento.
- La garantía dice la verdad completa, con la excepción de la Minicen, para que el distribuidor no se lleve
  sorpresas.
- La franja oscura repite el gris de la portada y de Tecnología, así que la sección encaja en el conjunto y el
  botón queda donde acaba la lectura.

### 7.3 Movimiento y efectos

- Al llegar a la sección, la ruta roja se dibuja de izquierda a derecha a ritmo constante. Cuando llega a cada
  parada se enciende un haz de luz y aparece un rotor con un parpadeo, como un proyector, y se queda girando
  despacio. Después entra su texto.
- Las paradas de arriba proyectan el rotor hacia arriba y las de abajo hacia abajo, colgando de la línea, para
  que cada rotor quede junto a su texto.
- Detrás, la silueta enorme de un rotor de 12 tubos gira muy despacio (una vuelta cada seis minutos), con el aro y
  algunos tubos en rojo tenue; abajo a la izquierda, otra menor de 6 tubos gira al revés. Solo giran mientras la
  sección se ve.
- En el móvil la ruta se apila: cada rotor a la izquierda de su texto, uno detrás de otro.
- Si el sistema pide menos movimiento, no hay animaciones, los rotores no giran y la silueta del fondo queda quieta.

### 7.4 Descartados

- **Cuatro cifras a lo ancho (A):** limpia, pero es la misma idea de siempre, una fila de ventajas.
- **Panel oscuro y lista (C):** elegante, pero después de la sección oscura de Tecnología pesaba demasiado.
- **Contadores que suben** (0 → 48): es de los recursos que más delatan una web hecha con plantilla.
- **Registro con usuario y contraseña:** "Hazte distribuidor" es una solicitud que se contesta por correo. La
  zona privada, con tarifas y material, queda para una etapa posterior (hoja de ruta, fase 6).

### 7.5 Lo que viene después

La sección es el escaparate de una página de Distribuidores con:

- **Encuentra un distribuidor:** lista o mapa por país. Hace falta la lista publicable.
- **Hazte distribuidor:** un formulario de solicitud que llega por correo. Hace falta saber qué correo lo recibe
  y qué datos quieren pedir.

Hasta entonces, los dos enlaces llevan al contacto del pie.

### 7.6 Rediseño: ruta, rotores proyectados y fondo de laboratorio (1-10-2026)

- **Antes (versión del 30-09):** cuatro cuadrados sobre una línea recta y una tarjeta bajo cada uno. Mirando la
  portada entera se vio que ese esquema (casillas en una línea y tarjetas iguales) es de los que más delatan una
  web hecha con plantilla o con IA.
- **Ahora:** sin cuadrados ni tarjetas. Una ruta en onda suave, hecha como un tubo de sangre, y en cada parada un rotor
  de centrífuga proyectado. Cada rotor lleva más tubos que el anterior (4, 6, 8 y 12), como el pedido que avanza.
  La sección pasa a oscura, con una foto del laboratorio muy apagada y dos siluetas de rotor girando despacio, con toques de rojo.
- **Por qué es mejor:**
  - Las cifras quedan sueltas, grandes y con aire, y la imagen que se recuerda es un rotor, que es lo que fabrica
    la empresa. Ninguna otra web de centrífugas cuenta su servicio así.
  - La animación se apoya en el producto, no en adornos genéricos.
  - Es ligera: los rotores y la silueta del fondo son dibujos vectoriales, sin imágenes ni código que los mueva.
- **Se probó y se descartó:**
  - **Pompas que crecen:** cuatro círculos de tamaño creciente. Más sencillo, pero los círculos con una cifra dentro
    también son muy de plantilla.
  - **Una frase como en una revista:** el recorrido en una sola frase grande. Elegante, pero sin la sensación de
    recorrido.
  - **Línea punteada** como guía de la ruta: se cambió por una línea continua y tenue, más limpia.
  - **Red de puntos y líneas** de fondo, primero densa y luego plana: es de los fondos que más delatan una web
    hecha con IA. Se cambió por la silueta de un rotor, que es propia de la empresa.
- **Contra lo que se dijo en 7.4:** allí se descartó un panel oscuro después de Tecnología porque pesaba demasiado.
  Ahora sí va oscuro porque el fondo es una foto apagada con movimiento y los rotores necesitan oscuridad para
  verse como proyectados; la franja OEM pasa a gris translúcido para no sumar otro bloque macizo.
- **Hueco preparado:** cuando la empresa pase los archivos CAD de los rotores, cada dibujo se cambia por su modelo
  real en 3D (unos 200-400 KB cada uno, cargado solo al llegar a la sección) sin tocar la ruta ni los textos.
  También se cambiará la foto de fondo por una buena del laboratorio. Ver `docs/pendiente-empresa.md`.
- **La ruta, un tubo de sangre:** la línea es una onda suave que sube y baja entre paradas. Se probaron tramos rectos
  tipo plano de metro, un zigzag, una escalera, un serpentín y un colector con ramales; ninguno mejoraba la onda y
  se volvió a ella. Lo que la hace nuestra es el trazo: un tubo transparente y grueso (pared clara, interior oscuro)
  que se va llenando de sangre hasta cada rotor, y una vez lleno lo recorren despacio burbujas de un rojo más vivo.
  Así la ruta habla del oficio (tubos y muestras) en vez de ser una línea genérica. Las burbujas se paran fuera de
  pantalla y siempre son redondas, aunque el dibujo se estire a lo ancho.
- **Orden de la portada:** Distribuidores pasa a ir después de Empresa. Así las dos secciones oscuras (Tecnología y
  Distribuidores) no van seguidas y la portada alterna claro y oscuro.
- **Movimiento del fondo:** las siluetas giran muy despacio (una vuelta cada seis minutos la grande), crecen y
  menguan un poco y su rojo se aviva y se apaga, todo con transiciones suaves.
- **Efecto al pasar el ratón:** ya no hay tarjetas, así que no se usa el efecto común de las tarjetas. Al pasar
  por una parada, su haz de luz se aviva.

---

## 8. Empresa (portada)

La frase, los datos y los certificados salen del Catálogo General 2025. La frase completa del catálogo es
"Nuestro objetivo no es ser una opción más, sino ser una empresa que destaca del resto por ir más allá de lo
estándar"; en la portada va un poco más corta para que se lea de un golpe.

### 8.1 Qué había y qué hay

- **Antes:** la web actual presenta la empresa con valores genéricos ("integridad, dinamismo") y deja los
  certificados en otra página. La primera versión de la portada nueva ponía la foto de una mano con guante a todo
  el ancho, tres tarjetas blancas con borde y los certificados en una rueda sobre franja gris.
- **Ahora:**
  - Foto del rotor con tubos de tapón rojo (foto de la empresa) **a lo ancho y más baja**, con la frase del catálogo
    y el botón **"Conoce la empresa"** encima, en blanco.
  - **Tres tubos de sangre** en su gradilla gris, con tapón rojo estriado, etiqueta con código de barras y sangre
    separada en capas (glóbulos, capa blanca y plasma). Al lado de cada uno, el dato en grande (1949, Familiar,
    Daganzo), su título y su frase. En el móvil, uno debajo de otro.
  - Los **nueve certificados** en una franja gris: placas blancas con borde oscuro y la del centro en rojo, explicada
    debajo.

### 8.2 Por qué es mejor

- La frase es de la propia empresa y el dato principal de cada bloque se lee de un vistazo.
- Los tubos cuentan lo que hace Orto Alresa, centrifugar, sin decirlo: no es decoración genérica sino su oficio.
- La sección es blanca y solo lleva una foto baja: la portada recupera el equilibrio entre secciones oscuras y
  claras y no se convierte en una sucesión de fotos.
- El botón dentro de la foto evita un hueco en blanco antes de los certificados.
- El certificado activo en rojo se ve desde lejos; antes, todo blanco, pasaba desapercibido.

### 8.3 Movimiento y efectos

- Al llegar, la foto se asienta, la frase y el botón suben, y cada tubo, uno tras otro, se llena de sangre con un
  leve vaivén y en seguida se separa en capas, como al centrifugar. El 1949 cuenta rápido desde 1900.
- Después suben burbujas por el tubo, despacio y sin parar. Al pasar el ratón, el tubo sube un poco, las burbujas
  van más rápido y la cifra se pone roja.
- La rueda de certificados gira sola, se para al pasar el ratón y se mueve con flechas o pulsando un certificado.
- Solo se animan transformaciones y opacidad. Con menos movimiento pedido por el sistema no hay animaciones y la
  rueda no avanza sola; sin JavaScript, los certificados se ven en filas.

### 8.4 Descartados

- **Escena oscura con la foto de fondo y pompas rojas encima:** vistosa, pero dejaba tres secciones oscuras
  seguidas y la portada perdía el blanco.
- **Pompas rojo-negro flotando:** no terminaban de encajar; parecían adorno.
- **Foto de la mano con guante cargando tubos:** se lee la etiqueta "digicen 21", un modelo que ya no está en el
  catálogo.
- **Otras ideas para los datos:** burbujas de sangre que suben y estallan (demasiado recargado) y tapones vistos
  desde arriba en un rotor (más sobrio, menos expresivo). Para no dejar los tubos sueltos se eligió la gradilla
  frente a un panel gris o un plano del rotor de fondo.
- **Versiones anteriores** (tarjetas blancas, ficha tipo tabla, cinta de certificados): correctas pero planas.

### 8.5 Lo que viene después

- Cuando lleguen **fotos de la fábrica y del equipo**, van en el mismo hueco de la foto.
- La **página de Empresa** (historia, fábrica, calidad y medio ambiente) es el destino del botón "Conoce la
  empresa". Hasta que exista, el botón lleva a la página de error.

---

## 9. Aplicaciones en el laboratorio (portada)

### 9.1 Qué había y qué hay

- **Antes:** en la portada de la web actual no había notas de aplicación. Solo estaban dentro de Noticias,
  en una rejilla de fotos con una etiqueta roja ("Artículos y novedades") encima y el título tapando la imagen,
  mezcladas con ferias y retrospectivas.
- **Ahora (5-10-2026):** las cinco últimas notas del blog en la portada. La más reciente va en grande a la
  izquierda (foto ancha, área, fecha, título grande y "Leer la nota »"); las otras cuatro, en lista a la derecha,
  con foto pequeña, área, fecha y título, separadas por rayas finas. "Ver todas las notas »" junto al título.
  En tableta y móvil, la destacada arriba y la lista debajo.
- Las notas son las del blog actual, con su texto, su fecha y su foto destacada, sacados de su WordPress
  (`wp.ortoalresa.com/wp-json`). Cada nota guarda la dirección de la original en `origen`.

### 9.2 Por qué es mejor

- Enseña al distribuidor que la empresa sabe de centrifugación, no solo que vende centrífugas.
- **Jerarquía:** antes eran cinco cajas iguales y el ojo no sabía por dónde empezar. Ahora la última nota manda y
  las demás acompañan, y los títulos largos se leen en dos o tres líneas en lugar de en cinco apretadas.
- **El área de aplicación en rojo** (Alimentación, Microbiología, Diagnóstico clínico...) dice al distribuidor,
  antes de leer el título, a qué cliente le sirve la nota. El blog no lo tenía: el área sale del tema de cada nota.
- **Fotos de verdad:** cada nota lleva la foto de su tema, en vez de las provisionales, que repetían la misma
  pantalla de una centrífuga.
- **Todas con fecha:** las de células NK y Helicobacter pylori ya tienen la suya (la del blog).
- La portada se actualiza sola: cada nota es un archivo (`src/content/notas/`) y la portada coge las cinco
  últimas. Nadie tiene que tocar la portada al publicar.

### 9.3 Movimiento y efectos

- Entrada suave al llegar, como en el resto de la portada; la lista entra un poco después que la destacada.
- En la destacada, la raya roja de la foto se alarga de lado a lado al pasar el ratón, la foto se acerca un poco y
  el título se pone rojo. En la lista, el título se pone rojo y la `»` se adelanta.
- Con "reducir movimiento" activado en el sistema, sin animaciones.

### 9.4 Descartados

- **La baraja de cinco cartas iguales que se repartía al llegar** (la versión anterior): llamativa al entrar, pero
  después eran cinco cajas iguales en fila, sin jerarquía, con títulos de cinco líneas en tarjetas estrechas y una
  franja gris de "Leer la nota" repetida cinco veces que pesaba más que los títulos. Era la sección más sosa.
- **Índice grande sobre fondo oscuro con la foto al pasar el ratón:** se llegó a montar, pero junto al pie, que
  también es oscuro, las dos cosas se fundían.
- **Tres tarjetas iguales a las de Distribuidores:** repetía el molde de las secciones de arriba.
- **Tres tarjetas con la fecha grande:** poco visual.
- **Rejilla de fotos con el título encima, como el blog actual:** el texto sobre la foto se lee mal y tapa la imagen.
- **Quitar las fechas por si dejan de publicar:** se mantienen porque la empresa publica una nota al mes y la
  portada siempre enseña las últimas.

### 9.5 Lo que viene después

- La **página de Noticias** con todas las notas y cada nota con su página (el texto ya está en cada archivo).
  Hasta que exista, cada nota y "Ver todas las notas" llevan a su página del blog actual.
- **Fotos:** son las del blog y casi todas de banco de imágenes. Si la empresa tiene fotos propias de cada
  aplicación, se cambian en `public/img/notas/`.
- Que la empresa confirme las **áreas** de cada nota (las puso el equipo web a partir del tema).
- Más adelante, un editor web sencillo para que la empresa publique notas sin tocar código.

---

## 10. Pie de página

### 10.1 Qué había y qué hay

- **Antes:** encima del pie, una pared de logos de ayudas públicas (FEDER, NextGenerationEU, FSE+, SEPE, Comunidad de
  Madrid...) en cinco bloques centrados, con los mismos logos repetidos y un párrafo largo debajo de cada bloque.
  Después, un pie gris en dos colores con "Contacta" y un texto largo, iconos redondos de redes, "Sobre nosotros",
  un texto de RGPD y un dibujo de una centrífuga de fondo. Al final, "© 2021 Ankaa Studio".
- **Ahora:** un pie oscuro de principio a fin en tres pisos:
  1. Logo, empresa, dirección y los sellos ODS y Empresa Solidaria a la izquierda; el teléfono en grande y el
     correo comercial a la derecha.
  2. Cuatro columnas de enlaces: Centrífugas, Empresa, Contacto (servicio técnico e información, cada correo con
     para qué sirve) y Síguenos.
  3. Todos los logos de las ayudas, sin repetir, en una cinta que pasa despacio a todo el ancho. Debajo, © con el
     año en curso y Aviso legal, Privacidad y Cookies.

### 10.2 Por qué es mejor

- **Las ayudas siguen con todo su peso**, pero ordenadas: cada logo una vez, a la misma altura, en su ficha blanca
  (los logos oficiales llevan letra oscura). La cinta llama la atención sin ocupar media pantalla.
- **El teléfono es lo más visible del pie.** Un distribuidor que llega al final de la página busca cómo hablar con
  la empresa, no un párrafo que le invite a contactar.
- **Cada correo dice para qué es**: pedidos y distribuidores, servicio técnico, información general.
- **Limpio y ordenado:** todo en un solo tono oscuro, sin cambios de color ni dibujos de fondo, y separado de la
  sección de Aplicaciones (clara) de un vistazo.
- **Sin datos viejos:** el año del © se pone solo y ya no firma el estudio de diseño anterior.
- Todo sale de `src/data/navegacion.ts`: cambiar un correo, un enlace o un logo es tocar una línea.

### 10.3 Movimiento y efectos

- La cinta de logos avanza sola, sin saltos, y se para al poner el ratón encima para poder mirar uno.
- Los bordes de la cinta se desvanecen en el negro.
- El teléfono se subraya en rojo al pasar el ratón; los enlaces se aclaran.
- Con "reducir movimiento" activado en el sistema, los logos quedan quietos en varias filas centradas.

### 10.4 Descartados

- **Contacto protagonista con frase grande ("¿Hablamos de tu próximo pedido?"), cajetín de plano técnico y franja de
  catálogo con columnas:** primera tanda de maquetas; ninguna convenció.
- **Quitar los logos del pie y llevarlos a una página aparte:** la empresa les da mucha importancia y se quedan a la
  vista.
- **Sección propia con cada ayuda en una fila desplegable o un muro de logos:** demasiadas cosas para un pie.
- **Franja blanca para los logos:** un cambio de color dentro del pie se veía raro; ahora cada logo lleva su ficha
  blanca dentro del pie oscuro.
- **Enlace "Proyectos financiados":** sobraba; el pie queda más limpio sin él.

### 10.5 Lo que viene después

- **Logo FEDER** ("Fondo Europeo de Desarrollo Regional · Una manera de hacer Europa"): de momento es un hueco con
  la bandera y el nombre.
- **Logos oficiales** en buena calidad: los actuales están recortados de las filas de la web antigua.
- **Textos oficiales de cada ayuda** (ICEX-Next y Cheque Innovación, OA SmartConnect + LADS, solución digital,
  empleo joven FSE+): preguntar a la empresa si deben seguir publicados en la web y dónde.
- **Direcciones de LinkedIn y Facebook**: hasta tenerlas se muestran sin enlace. YouTube ya enlaza al canal.
- Páginas de Aviso legal, Privacidad, Cookies, Descargas y Empresa: los enlaces ya están puestos.

---

## 11. Portada terminada

Con el pie quedan revisadas y aprobadas todas las piezas de la portada. Queda pendiente decidir, con la página
entera delante, si se ensancha el contenido de 1280 a 1440 px.

---

## 12. Ajustes de toda la portada

### 12.1 Un tamaño para los títulos y otro para los subtítulos

- **Antes:** cada sección tenía su propio tamaño de título (de 60 a 92 px) y de subtítulo (de 17 a 24 px).
- **Ahora:** todos los títulos de sección miden lo mismo que el del inicio ("Expertos en centrifugación") y todos los
  subtítulos lo mismo que su texto de entrada. Son dos variables en `global.css` (`--t-titulo` y `--t-sub`).
- **Por qué:** la página se lee como una sola pieza, cada sección se reconoce igual de rápido y los subtítulos,
  más grandes, se leen mejor.
- **Excepción:** la frase de Empresa ("Nuestro objetivo no es ser una opción más...") mantiene su tamaño. Es una
  cita larga sobre una foto: a tamaño de título ocupaba tres líneas enormes y tapaba la imagen.

### 12.2 Las cuatro cifras del inicio como fichas

- **Antes:** 48 h, 1 semana, 3 años e ISO 13485 separadas por líneas finas grises.
- **Ahora:** cada cifra en su ficha con borde gris oscuro y esquina oscura, con el mismo efecto que las tarjetas
  de Distribuidores: al pasar el ratón la ficha sube un poco, le crece una raya roja por arriba y la esquina se
  pone roja.
- **Por qué:** son los cuatro motivos para fiarse de la empresa; como fichas destacan más y siguen el mismo
  lenguaje que el resto de la portada.

## 13. Portada más limpia: el catálogo a su página

### 13.1 El catálogo, fuera de la portada

- **Antes:** la portada enseñaba el catálogo entero con barra de filtros oscura, fichas con cifras e iconos de
  temperatura, y el menú repetía "Centrífugas" y "Elegir centrífuga".
- **Ahora:** el catálogo vive en `/centrifugas/`, agrupado por familias, con foto, nombre, una frase y tres cifras,
  sin filtros ni etiquetas. El menú tiene un solo "Centrífugas".
- **Por qué:** la dirección vio el catálogo agresivo de primeras; la portada presenta la empresa y el catálogo se
  consulta. Con página propia, además, Google puede enseñar el catálogo y cada botón lleva a un sitio distinto.
- **Descartado:** una franja de cinco fotos en la portada y subir Empresa tras el inicio (demasiada imagen seguida).

### 13.2 Paso entre secciones oscuras

- **Problema:** sin la gama en medio, la foto del inicio quedaba pegada a Tecnología (las dos oscuras) y se leían
  como un solo bloque. Lo mismo entre Tecnología y la foto de Empresa.
- **Ahora:** el color de arriba se funde en el de abajo y una raya roja de marca se dibuja desde el centro, con un
  destello de luz que la recorre cada pocos segundos, como el de los botones del inicio.
- **Por qué:** separa sin cambiar el orden, sin quitar fuerza a Tecnología y sin meter franjas blancas que
  rompían el ritmo. Es el mismo lenguaje (rojo, destello) que el resto de la web.
- **Descartado:** las cifras del inicio en una franja blanca (muy simple o parecía un pie), el título de
  Tecnología sobre blanco (el cambio de blanco a gris chirriaba) y una raya roja quieta.

## 14. Tecnología, más completa

### 14.1 SmartConnect y Configurador, a la par y con su botón

- **Antes:** SmartConnect se explicaba pero no llevaba a ningún sitio, y el Configurador de 6 pasos no aparecía en
  ninguna parte de la web nueva. En la web antigua los dos tenían su acceso.
- **Ahora:** tras el REI System van dos tarjetas iguales: SmartConnect con su botón **Iniciar sesión** (el mismo
  panel de la app que usa la web antigua) y el Configurador con foto, "6 pasos", las seis preguntas y **Empezar**.
  La página del Configurador aún no existe: de momento el botón se queda en la tarjeta.
- **Por qué:** son las dos herramientas que el distribuidor usa de verdad; ponerlas juntas y del mismo tamaño
  les da el peso que la empresa pide sin quitar fuerza a la sección.
- **Descartado:** una banda del Configurador al final de la sección (quedaba como un añadido) y dos placas de
  acceso bajo el título (pequeñas para lo que son).

### 14.2 La raya roja que recorre las tarjetas

- **Ahora:** al aparecer cada tarjeta, una raya roja le da una vuelta al borde. Su último tramo se queda donde
  acaba, apagándose y encendiéndose suave, y en su punta late un punto rojo que suelta una onda cada pocos
  segundos, como el vaso del esquema ULS. Cada tarjeta empieza por un lado y a su tiempo, y los tramos quedan en lados de fuera para que nunca
  choquen entre tarjetas vecinas. Sin animaciones (accesibilidad), el tramo se ve quieto.
- **Por qué:** da vida a la sección con el rojo de la marca, sin texto ni adornos, y con un efecto propio que no se
  confunde con la raya entre secciones.
- **Descartado:** que la raya diera dos vueltas y se apagara, una punta blanca mientras corre (dos colores
  liaban), un borde de neón entero (demasiado) y un destello blanco cruzando el tramo (igual que la raya entre
  secciones).

### 14.3 Iconos en los pasos del Configurador

- **Ahora:** cada paso lleva un icono de la propia marca (los del sistema de diseño, no genéricos) en un círculo
  rojo, con el mismo efecto al pasar el ratón que las placas del inicio.
- **Por qué:** se lee de un vistazo qué pregunta cada paso, y repetir el efecto del inicio hace la web coherente.

## 15. Portada sin las cuatro tarjetas

- **Antes:** al pie de la primera pantalla, cuatro tarjetas de cristal con icono: 48 h de respuesta, 1 semana de
  entrega, 3 años de garantía e ISO 13485.
- **Ahora:** la primera pantalla tiene solo el titular, la frase y los dos botones sobre la foto del rotor.
- **Por qué:** lo pidió la empresa (5-10-2026). La foto respira entera y los dos caminos (gama y distribuidor) son
  lo único que pide atención. Las cifras no se pierden: respuesta, entrega y garantía siguen en Distribuidores, y
  las certificaciones en Empresa.

## 16. Pie con el rojo de marca y fuera la pestaña lateral

### 16.1 El logo del pie, con "orto" en rojo

- **Antes:** el pie usaba el logo entero en blanco; era el único sitio de la web donde "orto" no salía rojo.
- **Ahora:** `logo-ortoalresa-oscuro.svg`: "orto" en el rojo de marca y "alresa" en blanco, igual que el logo en
  color pero para fondo oscuro.
- **Por qué:** lo pidió la empresa (5-10-2026). El logo se reconoce por el "orto" rojo; en blanco parecía otro.

### 16.2 Más rojo en el pie

- **Ahora:** filo rojo de 4 px arriba del pie, raya roja corta bajo cada título de columna (el mismo gesto que el
  subrayado del teléfono) y todos los enlaces en rojo al pasar el ratón, al pulsarlos o al llegar con el teclado.
- **Por qué:** el pie era todo gris y blanco; el rojo, en poca cantidad, lo une con el resto de la web y deja claro
  qué se puede pulsar.

### 16.3 Fuera la pestaña roja vertical

- **Antes:** una pestaña roja fija a la izquierda, "Expertos en centrifugación · desde 1949", copiada del catálogo.
- **Ahora:** no hay pestaña.
- **Por qué:** lo pidió la empresa (5-10-2026). En pantalla tapaba el borde del contenido y repetía el titular del
  inicio; en el catálogo impreso sirve para hojear, en la web no tiene esa función.

### 16.4 Logos de las ayudas en color, sin ficha blanca y a plena luz

- **Antes:** cada logo en su ficha blanca, que en el pie oscuro se veía como una fila de pegatinas.
- **Ahora:** los logos van en su color directamente sobre el pie, sin apagar. Los archivos de
  `public/img/ayudas/` vienen ya preparados para fondo oscuro, como las versiones en negativo oficiales:
  - los bloques de color (bandera de la UE, rojo de Madrid, naranja del FSE+, amarillo de Gobierno y SEPE) quedan
    intactos, con lo que llevan dentro;
  - el fondo blanco de fuera pasa a transparente con los bordes suaves;
  - el texto y las rayas oscuras sueltas (negro, gris, azul oscuro) pasan a blanco; las estrellas doradas
    conservan su color.
- **Por qué:** lo pidió la empresa (5-10-2026). Se descartó pasarlos a blanco con un filtro (perdían los colores
  oficiales) y dejarlos tal cual sin fondo (el texto negro desaparecía sobre el pie).

## 17. Tecnología propia en acordeón

- **Antes:** cinco pisos: REI a lo grande, SmartConnect y Configurador a la par, tres tarjetas con foto o esquema
  (Pantalla táctil, PCBS, ULS) y la lista "Y además, según el modelo". Unos 2.800 px en escritorio.
- **Ahora:** solo REI System, SmartConnect y Configurador, en un acordeón de tres franjas. La abierta enseña su
  foto y su texto enteros; las cerradas son tiras estrechas con el número en rojo, el nombre en vertical, un "+" y
  un trozo de su foto por debajo. Al pulsar una tira se abre (y se cierra la otra) y una cortina roja barre la foto
  y la descubre. En tablet y móvil las franjas van una encima de otra, con cabecera, "+" y "−". Unos 1.050 px.
  "Propia", en rojo, como "ción" en el inicio.
- **Por qué:** lo pidió la empresa (5-10-2026). La sección era la más larga de la portada y lo de abajo (cifras de
  pantalla, rampas y vaso) pesaba menos que lo de arriba. Los tres que quedan son los que de verdad diferencian a
  Orto Alresa; en el acordeón se ven los tres a la vez y cada uno conserva su foto, su texto y su botón.
- **Detalles:** se abre al pulsar, no al pasar el ratón (para llegar a un enlace del panel abierto se cruza por
  encima de las tiras). No pasa solo: en un acordeón molesta que se cierre lo que se está leyendo. Lo cerrado queda
  inerte para el teclado. Sin movimiento si el sistema lo pide.
- **Descartado:** una tira de cifras con Pantalla, PCBS y ULS (seguía alargando la sección), un mosaico con REI a la
  izquierda y las otras dos apiladas (tarjetas apretadas y desiguales) y un carrusel con pestañas (correcto, pero
  solo enseñaba una tecnología cada vez).

## 18. Productos: hero, filtros sencillos y una tarjeta por modelo

- **Antes:** `/centrifugas/` tenía las 17 series en blanco, agrupadas en cinco familias propias, con fotos recortadas
  muy de cerca (la Magnus 22, que es de suelo, parecía de sobremesa) y una línea de cifras. Ni accesorios ni
  otros productos de laboratorio.
- **Ahora (5-10-2026, versión para revisar con la empresa):**
  - **Hero grande** con una foto de la empresa (una mano con guante sobre la pantalla de una centrífuga), el título
    con "productos" en rojo y **badges de cristal** como los botones de la portada: 23 centrífugas, 9 aplicaciones,
    1949 y "Siempre en stock" con un punto rojo que late.
  - **Filtros sencillos** en una barra blanca fija: buscador (sin tildes), temperatura (ventilada, refrigerada,
    calefactada), las 9 aplicaciones de la web actual más Accesorios y Laboratorio con su número, y **Borrar
    filtros**. Cada aplicación dice cuántos productos quedarían; la búsqueda se guarda en la dirección.
  - **Una tarjeta por modelo (23)**, como la web actual, con la foto entera de su página de productos recortada sobre
    un escenario gris claro con su sombra. La temperatura va en una etiqueta (azul la refrigerada, ámbar la
    calefactada) y capacidad, velocidad (con las xg) y pantalla, en filas con los iconos de la web actual.
  - **Accesorios** (mesas móviles y GRS, con una segunda foto al pasar el ratón) y **otros productos de laboratorio**
    (tamizadora, molino de bolas y destiladores) con su catálogo en PDF.
- **Por qué:** lo pidió la empresa: todo lo que vende en un sitio, ordenado como lo conocen sus distribuidores, con un
  hero a la altura de la portada y el catálogo limpio en blanco. Los iconos siguen fuera de la portada, que era lo que
  la dirección veía agresivo (13.1).
- **Descartado:** una primera versión en blanco con un panel de filtros grande (pesada); una versión toda en oscuro
  con tarjetas de cristal ahumado (demasiado oscura para un catálogo); repetir la foto del rotor de la portada en la
  cabecera; y filtrar por pantalla u ordenar (complicaban la barra; la pantalla sigue en cada tarjeta).
- **Pendiente:** los 73 rotores (en la web actual van dentro de la ficha de cada centrífuga) y las tablas de tamices y
  de eficacia del destilado, para las fichas de cada producto.

## 19. Productos con vida: el 3D, tarjetas nuevas y una ficha por producto

### 19.1 La Digicen 22 en 3D, en el hero

- **Antes:** una foto de la empresa (una mano con guante sobre la pantalla) a todo el ancho; a la dirección le pareció fea.
- **Ahora:** fondo carbón con el título a la izquierda y la **Digicen 22 en 3D** a la derecha, del modelo de
  SolidWorks de la empresa. Gira sola (una vuelta cada 40 s), se gira arrastrando y con **Ver por dentro** se abre
  en despiece vertical, como un plano: la tapa sube, el cuerpo se levanta, la carátula sale hacia delante y quedan a
  la vista depósito, motor y base, con su etiqueta y su código (PP 367 Tapa, PI 448 Depósito, PE 494 Motor de
  inducción…). Mientras carga se ve la foto de la Digicen 22; sin WebGL, se queda la foto.
- **Por qué:** es lo que ningún otro fabricante enseña en su web: la máquina por dentro, con las piezas que fabrica
  la empresa. Dice "fabricante" sin escribirlo.
- **Detalles:** solo dibuja mientras se ve; quieta si el sistema pide menos movimiento; en pantallas táctiles no se
  gira con el dedo, para que el dedo siga bajando la página.
- **Descartado:** el visor de Google que traía el zip (`<model-viewer>`): no deja separar piezas.

### 19.2 Catálogo sin huecos

- **Antes:** un título por aplicación y sus tarjetas debajo; como muchas aplicaciones tienen 1 o 2 modelos, quedaban
  filas medio vacías. La barra de filtros ocupaba dos líneas.
- **Ahora:** índice fijo a la izquierda, como el de un catálogo impreso (buscador, temperatura, aplicaciones por
  grupos en negrita con su número) y una **rejilla continua** a la derecha con el título de lo elegido en grande. En
  móvil el índice es la barra fija de arriba. El texto pequeño pasa de gris claro a gris oscuro: se leía mal.

### 19.3 Tarjetas con vida

- **Ahora:** el escenario de la foto toma el **tono de su temperatura** (azul hielo, arena, gris) y lleva el nombre de
  la serie enorme y en blanco detrás de la máquina, como el catálogo impreso. La temperatura va en una **etiqueta de
  color lleno**; debajo, nombre y tres cifras **centradas** (capacidad, rpm, pantalla). Al pasar el ratón la máquina
  se eleva sobre su sombra, el nombre de fondo se desliza y se pinta una raya del color de la temperatura. Al bajar,
  las tarjetas entran escalonadas.
- **Por qué:** antes la temperatura era un punto de 7 px; ahora la rejilla se lee por colores. El color sirve para
  algo, no decora.
- **Descartado:** tarjetas con iconos en filas (abarrotadas) y una frase en cada tarjeta (va en la ficha).

### 19.4 Una ficha por producto

- **Antes:** no se podía entrar en un producto. En la web actual sí, pero la ficha era un bloque de texto con
  desplegables y los rotores un carrusel de fotos sin cifras.
- **Ahora:** `/centrifugas/<modelo>/`. Arriba, foto (o el 3D en la Digicen 22) con el tono de su temperatura,
  versión para saltar entre ventilada y refrigerada, cuatro cifras grandes y dos botones (catálogo PDF y pedir a un
  distribuidor). Debajo, **pestañas** en una barra oscura fija: Descripción (con "De un vistazo": código, medidas,
  peso, consumo, voltaje y número de rotores), Ficha técnica (en dos columnas que encajan sin huecos), Rotores (cada
  uno abre una ventana con sus cifras y la tabla de tubos y adaptadores), Versiones y Accesorios. Al final, otros
  modelos de la misma aplicación.
- **Por qué:** todo lo que el distribuidor necesita para pedir, en una página y sin bajar por huecos en blanco. Los
  rotores con sus tubos no estaban visibles en ninguna web de la empresa: el dato existía en su ERP.
- **De dónde sale:** de la web actual y su ERP, importado con `scripts/importar-web-actual.mjs` (decisión 0009). Las
  cifras de cabecera siguen siendo las del Catálogo 2025.
- **Descartado:** secciones apiladas una tras otra (la primera versión: mucho hueco en blanco) y la ficha en una
  ventana sobre el catálogo (sin dirección propia).

### 19.5 Segunda vuelta: escenario oscuro y cristal

- **Problema:** con el escenario claro la tarjeta parecía no tener bordes y la máquina no resaltaba; las cifras en
  filas finas apenas se veían; en la ficha, la descripción dejaba una columna vacía, la ficha técnica en tarjetas de
  alturas desiguales se veía desordenada y los accesorios quedaban apagados.
- **Ahora:**
  - **Tarjeta:** escenario de estudio en carbón con un halo del color de su temperatura detrás de la máquina (azul,
    ámbar, acero; rojo de marca en accesorios y laboratorio). Las centrífugas, blancas y grises, resaltan sobre el
    oscuro. Las tres cifras van en una **franja de cristal** al pie del escenario; borde y sombra más marcados, y el
    borde toma el color de la temperatura al pasar el ratón.
  - **Cabecera de la ficha:** también en carbón con el halo, y las cuatro cifras en **placas de cristal** con la raya
    roja de marca. La versión, en botones de cristal. El rojo del antetítulo, un punto más claro sobre el oscuro para
    que se lea.
  - **Descripción:** "De un vistazo" pasa a una fila de placas arriba y el texto debajo, a dos columnas si es largo.
    Sin columnas vacías.
  - **Ficha técnica:** como una hoja de especificaciones: una fila por bloque, el título a la izquierda (fijo al bajar)
    y los puntos en dos columnas a la derecha.
  - **Más de…:** incluye también las otras versiones de la serie, para que las fichas cortas no acaben de golpe.
- **Por qué:** el producto es lo primero que se ve y el color dice su temperatura sin leer. El halo es la luz de un
  estudio fotográfico, no un adorno: sin él, la máquina se pierde en el negro.
- **Descartado:** el escenario de color claro de la primera vuelta (la tarjeta se confundía con la página).

### 19.6 Tercera vuelta: foto de estudio, placa de características y selector de rotores

- **Problema:** el escenario negro con el nombre detrás no gustó; lo que pedía la dirección era un **contorno** que se
  viera. Ventilada en gris no se distinguía. Las cuatro cifras en cajas de cristal parecían de plantilla. Los rotores
  en ventanas obligaban a abrir y cerrar uno a uno.
- **Ahora:**
  - **Tarjeta como foto de estudio:** fondo blanco y suelo gris; **contorno
    negro**; sin nombre de fondo. Al pasar el ratón la tarjeta se levanta un poco con una sombra suave.
  - **Temperatura con icono propio**, dibujado para la web (`ui/IconoTemp.astro`): hélice la ventilada, copo la
    refrigerada, llama la calefactada. **Ventilada pasa a verde** (`--t-ventilada: #1e7f5c`). Los mismos iconos en
    el filtro del catálogo, que al elegirse se pinta del color de su temperatura.
  - **Ficha con cabecera clara** y la foto como en la tarjeta. Las cifras van en una **placa de características**,
    como la placa CE que lleva cada máquina: marco y cabecera negros, una fila por dato (capacidad, velocidad, fuerza,
    pantalla, temperatura, voltaje y frecuencia, códigos) y el fabricante con "CE" al pie. Qué es cada dato, en
    negrita; el valor, en normal.
  - **Rotores en un selector:** la lista a la izquierda (fija al bajar) y el elegido a la derecha, con su foto, sus
    cifras y su tabla de tubos. Encima, **"¿Qué tubo usas?"**: al elegir un tubo quedan solo los rotores que lo
    admiten y su fila sale marcada en la tabla. En móvil la lista se desliza de lado.
- **Por qué:** la placa es algo que solo tiene un fabricante y que el distribuidor reconoce de la máquina real; el
  selector y la búsqueda por tubo responden a la pregunta con la que llega ("¿qué rotor me vale para criotubos?").
- **Descartado:** escenario negro con halo y cristal (19.5), una línea del color de la temperatura bajo la foto y una
  sombra dura de color al pasar el ratón (demasiado bastas), medidores frente a la gama y una cifra protagonista
  (opciones enseñadas en maqueta), tabla comparativa de rotores.

## 20. Hero de Productos: la Digicen 22 en un estudio, que se recorre por dentro

- **Problema:** el hero anterior no gustó: las cuatro cifras en cajas de cristal de anchos distintos se partían en
  dos filas descuadradas, la máquina flotaba en un hueco con un foco blanco detrás que "rayaba", y la barra de
  "Digicen 22 · Ver por dentro" quedaba suelta. Se pedía una primera impresión que dejara en shock, moderna, y poder
  girar la máquina de verdad (verla desde arriba).
- **Ahora** (`HeroProductos.astro` y `src/scripts/escena-productos.ts`):
  - **Dos columnas a toda pantalla:** a la izquierda el título, la entrada, "Ver las 23 centrífugas" (baja al
    catálogo), la **raya roja con destello blanco** de los pasos de la portada y las cuatro cifras con los **iconos
    de la marca** (`public/img/iconos/`: velocímetro, gradilla de tubos, escudo y tabla). A la derecha, la máquina:
    la cámara la centra en su columna y la ajusta a su tamaño, así nunca pisa el texto.
  - **Estudio:** suelo que se funde con el negro, un haz de luz desde arriba con motas de polvo, un aro rojo en el
    suelo que recorre un destello blanco (el mismo de la raya) y una luz roja suave que sigue al ratón y cambia el
    reflejo de los cantos. Detrás, un **remolino de luz** generado en directo: las estelas de un rotor girando, como
    la foto de larga exposición de la portada; gira despacio y se acelera, en el mismo sentido, al girar la máquina.
  - **Mandos bajo la máquina:** acabado **Real / Rayos X** (carcasa casi transparente y las aristas de cada pieza en
    rojo), **vistas** 3/4, frente, lado y arriba con giro libre arrastrando, **Despiece** y **Recorrido por dentro**.
    Arriba a la derecha, los grados (AZ/EL) y el **zoom**: botones + y −, Ctrl + rueda o pellizco, y doble clic en una
    pieza para acercarse a ese punto. La rueda sola sigue bajando la página.
  - **Despiece:** las etiquetas van en **una columna a la derecha**, en el orden de arriba abajo de las piezas, con
    una línea hasta un **punto blanco con borde negro** que late sobre cada pieza (se ve igual sobre la carcasa blanca
    que sobre las piezas oscuras). La máquina se aparta a la izquierda para dejarles sitio.
  - **Recorrido por dentro:** la cámara viaja pieza a pieza (tapa, amortiguador, depósito, motor, carátula y base),
    cada una desde el ángulo en que mejor se ve; la pieza se ve real y el resto transparente con sus aristas en rojo
    tenue. Una tarjeta dice el paso (03 / 06), el nombre, el código y una **descripción sacada de la ficha de la
    Digicen 22 en ortoalresa.com** (en los tres idiomas). Flechas del teclado y Esc. El texto de la izquierda se apaga
    mientras dura.
  - **Placa con el nombre:** bajo la máquina, como la cartela de una pieza de museo: "Modelo 3D · Universal", **Digicen 22** y "Ver ficha", que lleva a su ficha. Así se sabe qué modelo es el que se está viendo por dentro. (En una vuelta anterior se quitó el nombre gigante del fondo y el de la esquina; esta placa es pequeña y sirve de enlace.)
  - **Entrada:** la máquina llega en despiece vista desde arriba y se monta sola mientras la cámara baja a tres
    cuartos.
- **Rendimiento:** el modelo pasa de 585.000 a 169.000 triángulos (`public/3d/digicen22.glb`, de 1,45 MB a 594 KB,
  sin diferencia a la vista; también aligera la ficha de la Digicen 22). Sin posprocesos, píxeles limitados a 1,5× y
  la escena se para fuera de pantalla o en otra pestaña. Con "reducir movimiento" no hay animaciones y solo se dibuja
  cuando algo cambia. Sin WebGL queda la foto de la Digicen 22 y no salen los mandos.
- **Por qué:** es la única web del sector donde el distribuidor puede abrir la máquina y ver qué lleva dentro, con
  los códigos de las piezas que fabrica la empresa. El rojo se usa en detalles (aro, raya, iconos, aristas) y no en
  neón por todas partes.
- **Descartado:** un primer prototipo con mucho neón (aros gigantes girando, tubos de neón con suelo espejo, brillo
  de posproceso): demasiado futurista y pesado. Un suelo de rejilla tipo CAD (abstracto, simple). El nombre "Digicen
  22" gigante detrás de la máquina y en una esquina. Iconos dibujados para la ocasión (genéricos): se usan los de la
  marca.
- **Pendiente de confirmar con la empresa:** que el amortiguador presurizado es lo que da la "protección ante caída
  de la tapa" y que el "Depósito" (PI 448) es la cámara de centrifugación; la base no lleva descripción porque la
  ficha no dice nada de ella.

## 21. Comparador de centrífugas en el catálogo

- **Problema:** para elegir entre dos o tres modelos, el distribuidor tenía que abrir cada ficha y apuntar las cifras.
- **Ahora:** cada centrífuga del catálogo lleva "Comparar" en una etiqueta blanca arriba a la derecha de la foto, a
  juego con la de temperatura (en rojo al marcarla). Al marcar una aparece abajo una barra oscura con las elegidas
  (hasta 3); con dos o más, "Comparar" abre una ventana con las máquinas lado a lado: aplicación, temperatura,
  capacidad, velocidad, fuerza, pantalla, medidas, peso, consumo y rotores compatibles, con un punto rojo en la cifra
  más alta de velocidad, fuerza y rotores. Se quitan desde la barra, desde la ventana o desmarcando la tarjeta. La
  elección se guarda en la sesión: sigue al ir a una ficha y volver. En móvil, la barra va en una línea con las fotos y
  la ventana ocupa toda la pantalla, con la columna de nombres fija al deslizar.
- **Por qué:** es la pregunta con la que llega un distribuidor ("¿esta o esta?") y se responde sin salir del catálogo.
  Los datos salen de la tabla de la serie y de la ficha de cada modelo en la web actual.
- **Descartado:** un rediseño completo del catálogo como exposición (capítulos por familia y máquinas sobre peana): no
  gustó tanto como el catálogo de siempre; de él se queda el comparador.

## 22. Tarjetas del catálogo: la misma foto de laboratorio, con menos cosas

- **Problema:** las tarjetas usan todas la misma foto de una mesa de laboratorio oscura, que es lo normal en un
  catálogo, pero la foto traía mucho detrás de la máquina: un guante con pipeta, una gradilla, botellas rojas, un
  microscopio y un matraz. Con veinte tarjetas seguidas, ese detalle competía con la máquina y con el rojo de la marca.
- **Ahora:** la misma foto retocada (`public/img/fondos/mesa-tarjeta.webp`): fuera el guante, la pipeta y el
  microscopio, el fondo más desenfocado, y solo quedan una gradilla de tubos rojos a la izquierda y un matraz rojo a la
  derecha, en los bordes, donde la máquina no los tapa.
- **Por qué:** sigue pareciendo un laboratorio de verdad y conserva el toque rojo, pero lo que se ve primero en cada
  tarjeta es la máquina. La foto original sigue en el bloque de equipo a medida, oscurecida, donde no hay máquina
  delante.
- **Descartado:** un estudio gris claro liso (la máquina blanca sobre gris claro queda plana), la foto sin ningún
  detalle (queda apagada) y un estudio gris oscuro liso (sin ambiente de laboratorio).

## 23. Presupuesto en la tarjeta: un contador de unidades

- **Problema:** al añadir una máquina, la mitad del pie de la tarjeta enseñaba a la vez "✓ Añadido" y "✕ Quitar",
  apretados y con poco contraste con el estado sin añadir; las unidades solo se cambiaban dentro del panel del
  presupuesto.
- **Ahora:** sin añadir, "+ Presupuesto" como antes. Al pulsarlo, ese hueco pasa a ser un contador "− 1 ud. +" con
  marco rojo: el "+" suma unidades, el "−" las resta y, con 1, quita la máquina del presupuesto y vuelve
  "+ Presupuesto". La tarjeta y el panel van a la par: lo que se cambia en uno se ve en el otro.
- **Por qué:** es como funciona cualquier tienda online, se deshace un error en un toque (también en móvil, donde no
  hay ratón) y el distribuidor, que no pide una máquina sino varias, pone la cantidad sin salir del catálogo; el correo
  sale con esas cantidades.
- **Descartado:** solo un icono "+" (no dice que es para el presupuesto), "✓ Añadido" en rojo con "Quitar" al pasar
  el ratón (en móvil no se podría quitar) y dejarlo como estaba.

## 24. Tabla del catálogo, mínimos y descargas para el cliente

### 24.1 Vista en tabla, más ligera

- **Problema:** con tarjetas, comparar cifras de 23 modelos obliga a ir de una en una. La primera tabla tenía una
  columna por dato y filas altas, y se veía cargada.
- **Ahora:** una fila por versión, ordenable por capacidad, velocidad o fuerza, con Comparar y Presupuesto al final.
  La aplicación va debajo del nombre (una columna menos), las fotos y los márgenes son más pequeños (filas de 77 a
  67 px) y la casilla de Comparar marcada es solo el cuadro rojo, sin el fondo negro de la tarjeta.
- **Por qué:** el distribuidor busca por cifra y compara de un vistazo; lo que no aporta a esa lectura, fuera.
- **Descartado:** quitar la pantalla o la temperatura (se miran al elegir) y dejar los botones con su palabra en cada
  fila (repetían lo que ya dice la cabecera).

### 24.2 Filtro por mínimos

- **Problema:** el laboratorio pide un requisito ("15.000 xg y 4 tubos de 250 ml"), no un modelo.
- **Ahora:** fuerza, velocidad y capacidad mínimas; la capacidad se mira en todos los rotores de cada versión.
- **Por qué:** es como pregunta el cliente final, y el distribuidor contesta sin abrir fichas.
- **Descartado:** rangos con deslizadores (imprecisos para cifras de miles) y filtrar solo por la capacidad de serie.

### 24.3 Descargar en PDF o Excel

- **Problema:** para mandar opciones al cliente, el distribuidor copiaba cifras o reenviaba el catálogo entero.
- **Ahora:** "Descargar · PDF | Excel" en la tabla, en las tarjetas, en el comparador y en el presupuesto. Sale lo que
  se ve (filtros y orden) o, si se han elegido filas en la tabla con la casilla de delante de la foto, solo esas (sin límite; Comparar se queda en 3 y solo para comparar). El PDF es un documento de empresa (banda carbón con el
  logo, datos con etiqueta, tabla con filas alternas y pie de membrete) y se ve antes en una vista previa, con
  "Descargar PDF" e "Imprimir". El Excel trae cifras como números, filtro y fila fija. Sin resultados, no se puede
  descargar.
- **Por qué:** primero se enseñan opciones (tabla o comparativa) y, cuando el cliente elige, se pasa la lista de
  presupuesto con unidades: el mismo diseño para todo lo que sale de la web.
- **Descartado:** la hoja de impresión del navegador (sin descarga, con su cabecera y "atrás" fuera del catálogo),
  descargar sin vista previa y la letra condensada de la marca en el PDF (ver
  [decisión 0010](decisiones/0010-pdf-generado-con-jspdf.md)).
