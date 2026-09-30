# Pendiente de la empresa

Lo que necesitamos que nos pase Orto Alresa. Nada de esto para el trabajo: cada cosa tiene su hueco preparado
en la web y, cuando llegue, solo hay que añadirla.

| Qué                                                | Para qué                                                                              | Dónde entra                                                 | Bloquea                      | Estado                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------- | ---------------------- |
| Archivos CAD de una centrífuga (STEP, por piezas)  | Modelo 3D interactivo en la portada y la ficha                                        | `public/modelos/` y `src/data/medios.ts`                    | Fase 4                       | Pedido                 |
| Fotos de todos los modelos                         | Hoy hay 6 de ~25                                                                      | `public/img/productos/` y `src/data/medios.ts`              | Fase 1 (se avanza)           | Pendiente de pedir     |
| Código o exportación de WordPress                  | Textos, PDFs y URLs antiguas para las redirecciones                                   | `docs/` y configuración de redirecciones                    | Fases 3 y 5                  | Pedido                 |
| Fotos originales de las notas del blog             | Foto de cada nota en Aplicaciones (portada)                                           | `public/img/notas/` y `src/content/notas/`                  | No (hay fotos provisionales) | Pedido                 |
| Especificaciones originales de la web              | Contrastar la propuesta con lo que se pidió                                           | `docs/objetivo-y-alcance.md`                                | —                            | Pendiente de pedir     |
| Lista de distribuidores publicable                 | "Encuentra un distribuidor"                                                           | `src/data/`                                                 | Fase 3                       | Pendiente de pedir     |
| Correo que recibe "Hazte distribuidor"             | Que las solicitudes lleguen a la persona adecuada                                     | Formulario de la página Distribuidores                      | Fase 3                       | Pendiente de preguntar |
| Qué datos pedir a un futuro distribuidor           | Preparar el formulario de solicitud                                                   | Formulario de la página Distribuidores                      | Fase 3                       | Pendiente de preguntar |
| ¿Quieren zona privada para distribuidores?         | Tarifas, catálogos y material con usuario                                             | Fase 6 de la hoja de ruta                                   | —                            | Pendiente de preguntar |
| ¿El OEM incluye fabricar con la marca del cliente? | Si es así, decirlo en Distribuidores ("con tu marca")                                 | `src/components/Distribuidores.astro`                       | —                            | Pendiente de preguntar |
| Licencia web de Helvetica Neue Condensed           | Usar la tipografía de marca en la web                                                 | `global.css` (si no, Roboto Condensed)                      | Fase 5                       | Pendiente de pedir     |
| Dominio y alojamiento                              | Publicar                                                                              | Configuración de despliegue                                 | Fase 5                       | Pendiente de pedir     |
| ¿Sellos ODS y Empresa Solidaria en la cabecera?    | Hoy van en el pie; saber si les dais más peso                                         | `src/components/Header.astro`                               | —                            | Pendiente de preguntar |
| Logo FEDER y logos oficiales de las ayudas         | La cinta del pie usa recortes de la web antigua; falta el de FEDER                    | `public/img/ayudas/` y `ayudas` en `src/data/navegacion.ts` | —                            | Pendiente de pedir     |
| ¿Hay que publicar los textos de cada ayuda?        | La web antigua los tenía bajo los logos; saber si son obligatorios y dónde ponerlos   | Página propia o pie                                         | —                            | Pendiente de preguntar |
| Direcciones de LinkedIn y Facebook                 | Enlazar las redes del pie                                                             | `redes` en `src/data/navegacion.ts`                         | —                            | Pendiente de pedir     |
| ¿La Plasma 22 lleva REI System?                    | No (manual V2.5: rotor con llave Allen). Errata del catálogo 2025: avisar a Marketing | `src/data/tecnologia.ts`                                    | —                            | Resuelto (30-09-2026)  |
| ¿Son 175 o 125 rampas de frenado (PCBS)?           | 175 (Excel de USP y manuales). El 125 de la web antigua es errata                     | `src/data/tecnologia.ts`                                    | —                            | Resuelto (30-09-2026)  |
| ¿La Biocen 22 R lleva ULS?                         | No (pantalla LCD). Errata de la tabla del catálogo: avisar a Marketing                | `src/data/tecnologia.ts`                                    | —                            | Resuelto (30-09-2026)  |

Formatos preferidos:

- **CAD:** STEP por piezas (tapa, cuerpo, rotor, pantalla por separado) permite animar la apertura.
  Un STL de una pieza sirve para un modelo que solo gira.
- **Fotos:** originales en la mayor resolución posible, fondo blanco o neutro. Se optimizan aquí.
