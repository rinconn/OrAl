import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Notas de aplicación del blog. Para publicar una nueva basta con añadir un archivo .md en src/content/notas/
const notas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notas' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    // true mientras no se sepa la fecha exacta: la nota se ordena con la aproximada pero no se enseña
    fechaPendiente: z.boolean().default(false),
    // Campo de aplicación (Alimentación, Microbiología...): la etiqueta roja de la portada
    area: z.string(),
    // Foto de la nota, dentro de public/ (por ejemplo /img/notas/mi-nota.webp)
    foto: z.string(),
    alt: z.string(),
    // Dirección de la nota en el blog actual, de donde salen el texto, la fecha y la foto
    origen: z.url().optional(),
    // Título, texto de la foto y área en los otros idiomas; si faltan, se enseña el español
    en: z.object({ titulo: z.string(), alt: z.string(), area: z.string().optional() }).optional(),
    fr: z.object({ titulo: z.string(), alt: z.string(), area: z.string().optional() }).optional(),
  }),
});

export const collections = { notas };
