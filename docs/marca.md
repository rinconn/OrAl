# Marca

El sistema de diseño de Orto Alresa (manual de marca, Catálogo 2025, logos, tipografía, iconos y fotos)
es **la base, no una regla fija**: se conserva lo que hace reconocible la marca y se moderniza el resto
cuando mejora el resultado. Decisión: [0004](decisiones/0004-marca-como-base.md).
El material original está en la carpeta compartida del proyecto, `sistema-diseno/`.

## Lo que se conserva

| Elemento             | Regla                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Logo                 | Sin cambios. Versión horizontal en la cabecera y blanca en el pie                         |
| Rojo `#DD040A`       | Un solo rojo, nunca más del ~10 % de la pantalla: llamadas a la acción, datos clave y `»` |
| Tipografía           | Helvetica Neue Condensed, ligera y negrita (Roboto Condensed como alternativa)            |
| Titulares            | En dos pesos: frase ligera + palabra clave en negrita ("Expertos en **centrifugación**")  |
| Enlaces              | Negrita con `»` rojo                                                                      |
| Grises               | En porcentaje de negro, como en el manual                                                 |
| Formas               | Esquinas rectas, sin sombras decorativas                                                  |
| Motivos del catálogo | Pestaña roja vertical y equipos sobre "estantes" grises                                   |
| Iconos               | Los iconos técnicos propios (capacidad, velocidad, pantalla, temperatura, tubos)          |
| Fotografía           | Solo fotos reales de producto y laboratorio. Nunca de stock                               |
| Tono                 | "Nosotros" a "vosotros", frases concretas con cifras, sin emojis                          |

## Lo que se moderniza

| Antes (web actual)                  | Ahora                                                                                  | Por qué                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Titulares pequeños                  | Titulares grandes con la tipografía condensada                                         | Se lee de un vistazo; la condensada luce a gran tamaño |
| Fondo blanco en todas las secciones | Secciones oscuras (`--carbon`) para tecnología, como la portada del catálogo           | Ritmo y contraste; da peso a la tecnología propia      |
| Fotos pequeñas en recuadros         | Fotos a sangre                                                                         | El producto real es el mejor argumento                 |
| Sin movimiento                      | Movimiento sutil (cabecera, estantes), desactivado si el sistema pide menos movimiento | Sensación de web cuidada sin distraer                  |
| Pensada para escritorio             | Diseñada desde el móvil                                                                | Distribuidores en ferias y en ruta                     |

## Pendiente

- **Licencia web de Helvetica Neue Condensed.** Los archivos `.otf` son del cliente. Si su licencia no cubre
  uso web, se cambia a Roboto Condensed en una línea (`--f` en `global.css`).
