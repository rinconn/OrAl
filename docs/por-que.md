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

## 6. Secciones que faltan por revisar

Las siguientes piezas de la portada existen como prototipo y se revisarán una a una, en este orden:
Tecnología, Distribuidores, Empresa y el pie. Cada una se añadirá aquí cuando esté aprobada.
