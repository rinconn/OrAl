// Gama de centrífugas. Datos tomados del Catálogo General 2025 y de ortoalresa.com.
// Solo se publican cifras confirmadas en esas fuentes; lo que falte se completa con el catálogo.

export type Aplicacion = 'general' | 'especial';

export interface Producto {
  slug: string;
  nombre: string;
  aplicacion: Aplicacion;
  /** Etiqueta del "estante", como en el catálogo */
  categoria: string;
  descripcion: string;
  destacados: string[];
  /** Destacados que se pintan en rojo (tecnología propia) */
  tecnologia?: string[];
  imagen?: { src: string; ancho: number; alto: number };
}

export const productos: Producto[] = [
  {
    slug: 'digicen-22-r',
    nombre: 'Digicen 22 R',
    aplicacion: 'general',
    categoria: 'Universal',
    descripcion: 'Universal refrigerada, con una amplia gama de rotores compatibles.',
    destacados: ['TFT táctil', 'REI System'],
    tecnologia: ['SmartConnect'],
    imagen: { src: '/img/productos/digicen-22-r.webp', ancho: 1400, alto: 1380 },
  },
  {
    slug: 'dilitcen-22-r',
    nombre: 'Dilitcen 22 R',
    aplicacion: 'general',
    categoria: 'Gran capacidad',
    descripcion: 'Gran capacidad con refrigeración.',
    destacados: ['Refrigerada', 'Gran capacidad'],
    imagen: { src: '/img/productos/dilitcen-22-r.webp', ancho: 800, alto: 665 },
  },
  {
    slug: 'cyto-22',
    nombre: 'Cyto 22',
    aplicacion: 'especial',
    categoria: 'Citología',
    descripcion:
      'Citocentrífuga para oncología, hematología y microbiología. Procesa en menos de 15 minutos.',
    destacados: ['2.500 rpm', '607 xg'],
    tecnologia: ['SmartConnect'],
    imagen: { src: '/img/productos/cyto-22.webp', ancho: 900, alto: 600 },
  },
  {
    slug: 'digtor-22-c',
    nombre: 'Digtor 22 C',
    aplicacion: 'especial',
    categoria: 'Oil / Petrol',
    descripcion: 'Serie para análisis de aceites y petróleo, calefactada o ventilada.',
    destacados: ['Calefactada', 'Compatible GRS'],
    imagen: { src: '/img/productos/digtor-22-c.webp', ancho: 800, alto: 818 },
  },
  {
    slug: 'plasma-22',
    nombre: 'Plasma 22',
    aplicacion: 'especial',
    categoria: 'PRP / PRF',
    descripcion: 'Plasma rico en plaquetas y fibrina, en tubos de 9 y 15 ml.',
    destacados: ['3.000 rpm', '1.288 xg', '8 × 15 ml'],
    imagen: { src: '/img/productos/plasma-22.webp', ancho: 800, alto: 880 },
  },
];
