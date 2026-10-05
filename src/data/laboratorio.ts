// Equipos de laboratorio y accesorios de centrífuga: los de ortoalresa.com (fichas de "Productos de laboratorio" y
// "Accesorios centrífugas"), con sus códigos y su catálogo en PDF. Fotos, las de cada ficha.
// El nombre, la frase y las cifras de cada uno, por idioma, en src/i18n/ (`laboratorio`).

import type { Textos } from '../i18n/es';

export interface ProductoLab {
  slug: keyof Textos['laboratorio']['items'];
  /** Modelo o códigos de la ficha, en fino junto al nombre */
  modelo: string;
  imagen: { src: string; ancho: number; alto: number };
  /** Segunda foto, que aparece al pasar el ratón: el accesorio en uso o la gama entera */
  imagen2?: { src: string; ancho: number; alto: number };
  /** Catálogo en PDF de la ficha actual, si lo tiene */
  pdf?: string;
}

const img = (slug: string) => ({ src: `/img/productos-lab/${slug}.webp`, ancho: 640, alto: 640 });

export const equipos: ProductoLab[] = [
  {
    slug: 'tamizadora',
    modelo: 'OASS203',
    imagen: img('tamizadora'),
    pdf: 'https://wp.ortoalresa.com/wp-content/uploads/2020/10/tamizadora.pdf',
  },
  {
    slug: 'molino-de-bolas',
    modelo: 'OABM 255',
    imagen: img('molino-de-bolas'),
    pdf: 'https://wp.ortoalresa.com/wp-content/uploads/2020/10/molinodebolas.pdf',
  },
  {
    slug: 'destiladores',
    modelo: 'DA 005 · DA 006 · DA 007',
    imagen: img('destiladores'),
    pdf: 'https://wp.ortoalresa.com/wp-content/uploads/2020/10/destiladores.pdf',
  },
];

export const accesorios: ProductoLab[] = [
  {
    slug: 'mesas-moviles',
    modelo: 'CP 007 – CP 010',
    imagen: img('mesas-moviles'),
    imagen2: img('mesas-moviles-2'),
  },
  { slug: 'grs', modelo: 'Gas Release System', imagen: img('grs'), imagen2: img('grs-2') },
];
