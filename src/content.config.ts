import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Notas de aplicación del blog. Para publicar una nueva basta con añadir un archivo .md en src/content/notas/
const notas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notas' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    // Foto de la nota, dentro de public/ (por ejemplo /img/notas/mi-nota.webp)
    foto: z.string(),
    alt: z.string(),
  }),
});

export const collections = { notas };
