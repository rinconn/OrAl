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

| Antes                                                   | Ahora                                                                                                                 | Por qué es mejor                                                          |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 10 entradas de menú al mismo nivel                      | 6 entradas (Centrífugas, Elegir centrífuga, Tecnología, Distribuidores, Servicio técnico, Empresa) y Contacto en rojo | Menos opciones y más claras; Contacto, que es lo que más importa, destaca |
| Menú con huecos desiguales                              | El mismo hueco a cada lado de cada entrada                                                                            | La barra se ve ordenada y equilibrada                                     |
| Idioma en texto                                         | Banderas                                                                                                              | Se reconoce sin leer, en cualquier idioma                                 |
| Para buscar un modelo había que recorrer menús          | Lupa: se escribe el modelo y aparece, sin tildes ni mayúsculas                                                        | El distribuidor que sabe lo que quiere llega directo a la ficha           |
| Barra negra superior con teléfono y correo              | Fuera; teléfono y correo siguen en el menú móvil y en el pie                                                          | Más aire arriba y la cabecera queda para navegar                          |
| Sellos ODS y Empresa Solidaria apretados en la cabecera | En el pie, en todas las pantallas                                                                                     | Se ven enteros y no compiten con el menú                                  |
| Cabecera fija ocupando pantalla mientras se lee         | Se aparta al bajar y vuelve en cuanto se sube                                                                         | Más espacio para el contenido, sobre todo en móvil                        |
| En móvil, menú pequeño                                  | Banderas y lupa siempre a la vista; menú a pantalla completa con Contacto, teléfono y correo                          | Se usa con el pulgar; se llama en un toque                                |
| Logo en una línea                                       | Logo en dos líneas, la versión del manual                                                                             | Más compacto y reconocible                                                |

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
  centrífugas de laboratorio en Daganzo (Madrid)…", y la pestaña roja lateral sigue diciendo "desde 1949".
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

---

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
- **Al bajar, el filtro se queda pegado** justo debajo del menú, y sube cuando el menú se aparta. Si se
  cambia de pestaña con el filtro pegado, la página vuelve al principio de las fichas.
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
- **Ahora:** las razones para trabajar con Orto Alresa se cuentan como **el recorrido de un pedido**, en
  cuatro tarjetas colgadas de una línea. Llevan el mismo borde gris oscuro que las tarjetas de la gama y una
  esquina gris oscuro arriba a la derecha, que recuerda a las pestañas del catálogo:
  1. **Stock:** haces el pedido y hay existencias de toda la gama.
  2. **1 semana:** te llega al almacén. Es el plazo medio de 2024 y 2025 según la web actual; en la tarjeta no
     se ponen los años para que no se quede vieja.
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

- Al llegar a la sección, la línea roja se dibuja de izquierda a derecha y las cuatro paradas aparecen una
  detrás de otra, como un pedido que avanza. En el móvil la línea es vertical y se dibuja hacia abajo.
- Al pasar el ratón por una tarjeta, sube un poco, le crece la raya roja arriba (como las tarjetas de
  Tecnología), la esquina se pone roja y su cuadrado de la línea se rellena de rojo. La flecha del
  botón se desplaza y el enlace del laboratorio se subraya en rojo, como los enlaces de Tecnología.
- Si el sistema pide menos movimiento, no hay animaciones y todo se ve desde el principio.

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

---

## 8. Empresa (portada)

La frase, los datos y los certificados salen del Catálogo General 2025. La frase completa del catálogo es
"Nuestro objetivo no es ser una opción más, sino ser una empresa que destaca del resto por ir más allá de lo
estándar"; en la portada va un poco más corta para que se lea de un golpe.

### 8.1 Qué había y qué hay

- **Antes:** la web actual presenta la empresa con valores genéricos ("integridad, dinamismo") y deja los
  certificados en otra página. El prototipo de la portada nueva seguía el molde de siempre: foto a un lado,
  texto al otro, una etiqueta pequeña "La empresa" encima, los certificados como etiquetas sueltas y un enlace
  que llevaba a la misma sección.
- **Ahora:**
  - La foto va **a todo el ancho**, encuadrada para que se vean la mano y la pantalla, y la frase del catálogo
    va **centrada** en la zona clara de arriba, con "más allá de lo estándar" en negrita y mayúsculas y
    subrayado en rojo, como los titulares del catálogo.
  - **Tres tarjetas sueltas** que se montan sobre el borde de la foto: 1949 (fabricantes de centrífugas y
    referente europeo), Familiar (una empresa de familia que integra a socios, usuarios y asociados) y Daganzo
    (fábrica propia en Madrid con sus tres ISO). Llevan el borde y la esquina de las tarjetas de Distribuidores.
  - Un botón **"Conoce la empresa"** que llevará a la página de Empresa, para quien quiera saber más.
  - Una franja gris con **los nueve certificados y normas** en una rueda: el del centro se destaca en gris
    oscuro y debajo se explica en una frase qué significa. Avanza sola, se para al pasar el ratón y se puede
    mover con las flechas o pulsando cualquier certificado.

### 8.2 Por qué es mejor

- La frase es de la propia empresa, no un eslogan inventado, y ahora es lo primero que se lee.
- La foto a todo el ancho rompe con las secciones anteriores, que son de columnas y tarjetas, y las tarjetas
  montadas sobre ella dan profundidad sin recargar.
- Las tarjetas cuentan tres cosas distintas de la empresa (historia, familia y fábrica). No se repiten las 48 h
  ni los 3 años, que ya están en Distribuidores.
- Los certificados dejan de ser siglas: el distribuidor lee qué garantiza cada uno, que es lo que tendrá que
  explicar a su cliente.
- Bordes, esquina y botón repiten los de secciones anteriores, así que la portada se lee como un conjunto.

### 8.3 Movimiento y efectos

- Al llegar, la foto se acerca despacio hasta su sitio, la frase sube y las tarjetas entran una tras otra.
- Al pasar el ratón por una tarjeta, sube un poco, le crece la raya roja arriba y la cifra y la esquina se
  ponen rojas. La flecha del botón se desplaza.
- La rueda gira cada pocos segundos y la explicación cambia con un fundido corto.
- Si el sistema pide menos movimiento, no hay animaciones y la rueda no avanza sola; se mueve con las flechas.
  Sin JavaScript, los certificados se ven todos en filas centradas.

### 8.4 Descartados

- **Foto y ficha con sellos (B):** ordenada, pero seguía siendo el reparto en dos mitades de siempre.
- **Línea del tiempo en panel oscuro (C):** cuenta más historia, pero repetía el tono oscuro de la primera
  pantalla y de Tecnología.
- **Primera versión de la A**, revisada con el usuario: frase a la izquierda, tres datos pegados en una sola
  ficha, sin botón y con los certificados pasando en una cinta continua. La ficha parecía una tabla, los datos
  se quedaban cortos y la cinta daba vueltas sin decir nada.

### 8.5 Lo que viene después

- Cuando lleguen **fotos de la fábrica y del equipo**, van en el mismo hueco de la foto.
- La **página de Empresa** (historia, fábrica, calidad y medio ambiente) es el destino del botón "Conoce la
  empresa". Hasta que exista, el botón lleva a la página de error.

---

## 9. Secciones que faltan por revisar

Las siguientes piezas de la portada existen como prototipo y se revisarán una a una, en este orden:
Aplicaciones y el pie. Cada una se añadirá aquí cuando esté aprobada.
