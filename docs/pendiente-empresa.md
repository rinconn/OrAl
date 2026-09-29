# Pendiente de la empresa

Lo que necesitamos que nos pase Orto Alresa. Nada de esto para el trabajo: cada cosa tiene su hueco preparado
en la web y, cuando llegue, solo hay que añadirla.

| Qué                                               | Para qué                                            | Dónde entra                                    | Bloquea            | Estado                 |
| ------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | ------------------ | ---------------------- |
| Archivos CAD de una centrífuga (STEP, por piezas) | Modelo 3D interactivo en la portada y la ficha      | `public/modelos/` y `src/data/medios.ts`       | Fase 4             | Pedido                 |
| Fotos de todos los modelos                        | Hoy hay 6 de ~25                                    | `public/img/productos/` y `src/data/medios.ts` | Fase 1 (se avanza) | Pendiente de pedir     |
| Código o exportación de WordPress                 | Textos, PDFs y URLs antiguas para las redirecciones | `docs/` y configuración de redirecciones       | Fases 3 y 5        | Pedido                 |
| Especificaciones originales de la web             | Contrastar la propuesta con lo que se pidió         | `docs/objetivo-y-alcance.md`                   | —                  | Pendiente de pedir     |
| Lista de distribuidores publicable                | "Encuentra un distribuidor"                         | `src/data/`                                    | Fase 3             | Pendiente de pedir     |
| Licencia web de Helvetica Neue Condensed          | Usar la tipografía de marca en la web               | `global.css` (si no, Roboto Condensed)         | Fase 5             | Pendiente de pedir     |
| Dominio y alojamiento                             | Publicar                                            | Configuración de despliegue                    | Fase 5             | Pendiente de pedir     |
| ¿Sellos ODS y Empresa Solidaria en la cabecera?   | Hoy van en el pie; saber si les dais más peso       | `src/components/Header.astro`                  | —                  | Pendiente de preguntar |
| ¿La Plasma 22 lleva REI System?                   | El catálogo dice que sí; la web antigua no la pone  | `src/data/tecnologia.ts`                       | —                  | Preguntado             |
| ¿Son 175 o 125 rampas de frenado (PCBS)?          | Catálogo 175; la web antigua dice 125 y 175         | `src/data/tecnologia.ts`                       | —                  | Preguntado             |
| ¿La Biocen 22 R lleva ULS?                        | La tabla del catálogo sí; su ficha no               | `src/data/tecnologia.ts`                       | —                  | Preguntado             |

Formatos preferidos:

- **CAD:** STEP por piezas (tapa, cuerpo, rotor, pantalla por separado) permite animar la apertura.
  Un STL de una pieza sirve para un modelo que solo gira.
- **Fotos:** originales en la mayor resolución posible, fondo blanco o neutro. Se optimizan aquí.
