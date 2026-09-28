# Documentación del proyecto

Todo lo que hay que saber de la web nueva de Orto Alresa está aquí, en el mismo repositorio que el código.
Si algo cambia en el código y no se refleja en estos documentos, el cambio no está terminado.

| Documento                                       | Para qué sirve                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| [Objetivo y alcance](objetivo-y-alcance.md)     | Qué queremos conseguir, para quién y qué entra en la web                       |
| [Hoja de ruta](hoja-de-ruta.md)                 | Las fases del proyecto y en qué punto está cada una                            |
| [Arquitectura](arquitectura.md)                 | Cómo está hecha la web: tecnología, carpetas y cómo fluyen los datos           |
| [Marca](marca.md)                               | Qué conservamos del sistema de diseño y qué modernizamos                       |
| [Contenido](contenido.md)                       | De dónde sale cada dato y las reglas para no publicar nada inventado           |
| [Antes y después](antes-y-despues.md)           | Cada mejora frente a la web actual, con su porqué, para presentar a la empresa |
| [Pendiente de la empresa](pendiente-empresa.md) | Lo que necesitamos que nos pasen y qué bloquea cada cosa                       |
| [Cómo trabajamos](como-trabajamos.md)           | Entorno, ramas, PRs y la lista de comprobación antes de subir un cambio        |
| [Decisiones](decisiones/)                       | Cada decisión importante, por qué se tomó y qué alternativas se descartaron    |
| [Registro de cambios](../CHANGELOG.md)          | Qué ha cambiado en cada versión, PR a PR                                       |

## Cómo se mantiene

- **Cada PR** actualiza el [registro de cambios](../CHANGELOG.md) y los documentos que toque.
  La plantilla de PR lo recuerda.
- **Cada decisión que cueste deshacer** (tecnología, estructura, un cambio de marca) tiene su
  registro en [`decisiones/`](decisiones/), numerado y con fecha. No se borran: si una decisión cambia,
  se escribe una nueva que la sustituye.
- **Cada mejora visible** frente a la web actual se apunta en [Antes y después](antes-y-despues.md).
  Es el material con el que se vende la web a la empresa.
