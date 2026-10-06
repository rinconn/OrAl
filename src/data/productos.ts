// Gama de centrífugas: las 17 series del Catálogo General 2025 (23 modelos).
// Cifras de la tabla comparativa y de la ficha de cada serie. Fotos, del propio catálogo.
// Las frases, usos y nombres de familia, por idioma, en src/i18n/ (`series` y `familias`).

export type Temperatura = 'ventilada' | 'refrigerada' | 'calefactada';

/** Familias por uso, en el orden en que se muestran. Colores suaves para no competir con el rojo de marca */
export const familias = {
  peq: { color: '#8a7bb0' },
  uni: { color: '#5e9487' },
  gran: { color: '#b08a52' },
  cli: { color: '#9c5664' },
  ind: { color: '#7b8758' },
} as const;

export type Familia = keyof typeof familias;

/** Aplicaciones, como en el filtro de la página de productos de ortoalresa.com: generales y especiales */
export const categorias = {
  generales: ['mini', 'pequena', 'micro', 'universal', 'gran', 'sobrepiso'],
  especiales: ['oil', 'tejidos', 'lacteos'],
} as const;
export type Categoria = (typeof categorias)[keyof typeof categorias][number];

export interface Serie {
  slug: string;
  nombre: string;
  /** Otras versiones de la misma serie, p. ej. "22 R" */
  variantes?: string;
  familia: Familia;
  /** Aplicación en el catálogo */
  categoria: Categoria;
  capacidad: string;
  rpm: string;
  xg: string;
  /** Tipo de pantalla, de la página de productos de ortoalresa.com */
  pantalla: 'LCD' | 'TFT' | 'LED';
  temperatura: Temperatura[];
  /** Página del Catálogo General 2025 */
  pagina: number;
  imagen: { src: string; ancho: number; alto: number };
}

const img = (slug: string, ancho: number, alto = 720) => ({ src: `/img/gama/${slug}.webp`, ancho, alto });

export const productos: Serie[] = [
  {
    slug: 'minicen',
    nombre: 'Minicen',
    familia: 'peq',
    categoria: 'mini',
    capacidad: '12 × 2 ml',
    rpm: '15.000',
    xg: '15.596',
    pantalla: 'LCD',
    temperatura: ['ventilada'],
    pagina: 34,
    imagen: img('minicen', 593),
  },
  {
    slug: 'microcen-24',
    nombre: 'Microcen 24',
    familia: 'peq',
    categoria: 'pequena',
    capacidad: '10 × 15 ml',
    rpm: '8.000',
    xg: '6.511',
    pantalla: 'LED',
    temperatura: ['ventilada'],
    pagina: 36,
    imagen: img('microcen-24', 657),
  },
  {
    slug: 'biocen-22',
    nombre: 'Biocen 22',
    familia: 'peq',
    categoria: 'micro',
    capacidad: '24 × 2 ml',
    rpm: '15.000',
    xg: '21.885',
    pantalla: 'LED',
    temperatura: ['ventilada'],
    pagina: 38,
    imagen: img('biocen-22', 670),
  },
  {
    slug: 'biocen-22-r',
    nombre: 'Biocen 22 R',
    familia: 'peq',
    categoria: 'micro',
    capacidad: '8 × 15 ml',
    rpm: '18.100',
    xg: '31.865',
    pantalla: 'LCD',
    temperatura: ['refrigerada'],
    pagina: 40,
    imagen: img('biocen-22-r', 702),
  },
  {
    slug: 'digicen-22',
    nombre: 'Digicen 22',
    variantes: '22 R',
    familia: 'uni',
    categoria: 'universal',
    capacidad: '4 × 125 ml',
    rpm: '16.500',
    xg: '26.480',
    pantalla: 'TFT',
    temperatura: ['ventilada', 'refrigerada'],
    pagina: 52,
    imagen: img('digicen-22', 696),
  },
  {
    slug: 'bioprocen-22-r',
    nombre: 'Bioprocen 22 R',
    familia: 'uni',
    categoria: 'universal',
    capacidad: '6 × 50 ml',
    rpm: '18.100',
    xg: '31.865',
    pantalla: 'LCD',
    temperatura: ['refrigerada'],
    pagina: 44,
    imagen: img('bioprocen-22-r', 641),
  },
  {
    slug: 'unicen-21',
    nombre: 'Unicen 21',
    familia: 'uni',
    categoria: 'universal',
    capacidad: '4 × 100 ml',
    rpm: '4.200',
    xg: '2.938',
    pantalla: 'LED',
    temperatura: ['ventilada'],
    pagina: 48,
    imagen: img('unicen-21', 713),
  },
  {
    slug: 'consul-22',
    nombre: 'Consul 22',
    variantes: '22 R',
    familia: 'gran',
    categoria: 'gran',
    capacidad: '4 × 400 ml',
    rpm: '14.300',
    xg: '21.948',
    pantalla: 'TFT',
    temperatura: ['ventilada', 'refrigerada'],
    pagina: 62,
    imagen: img('consul-22', 678),
  },
  {
    slug: 'digtor-22',
    nombre: 'Digtor 22',
    variantes: '22 R',
    familia: 'gran',
    categoria: 'gran',
    capacidad: '4 × 750 ml',
    rpm: '14.300',
    xg: '21.948',
    pantalla: 'TFT',
    temperatura: ['ventilada', 'refrigerada'],
    pagina: 68,
    imagen: img('digtor-22', 701),
  },
  {
    slug: 'dilitcen-22-r',
    nombre: 'Dilitcen 22 R',
    familia: 'gran',
    categoria: 'gran',
    capacidad: '4 × 1000 ml',
    rpm: '14.300',
    xg: '21.948',
    pantalla: 'TFT',
    temperatura: ['refrigerada'],
    pagina: 74,
    imagen: img('dilitcen-22-r', 717),
  },
  {
    slug: 'magnus-22',
    nombre: 'Magnus 22',
    variantes: '22 R',
    familia: 'gran',
    categoria: 'sobrepiso',
    capacidad: '4 × 750 ml',
    rpm: '14.300',
    xg: '21.948',
    pantalla: 'TFT',
    temperatura: ['ventilada', 'refrigerada'],
    pagina: 80,
    imagen: img('magnus-22', 685),
  },
  {
    slug: 'cyto-22',
    nombre: 'Cyto 22',
    familia: 'cli',
    categoria: 'tejidos',
    capacidad: '12 × 6 ml',
    rpm: '2.500',
    xg: '866',
    pantalla: 'TFT',
    temperatura: ['ventilada'],
    pagina: 102,
    imagen: img('cyto-22', 684),
  },
  {
    slug: 'plasma-22',
    nombre: 'Plasma 22',
    familia: 'cli',
    categoria: 'tejidos',
    capacidad: '8 × 9/15 ml',
    rpm: '3.000',
    xg: '1.288',
    pantalla: 'LCD',
    temperatura: ['ventilada'],
    pagina: 104,
    imagen: img('plasma-22', 717),
  },
  {
    slug: 'vetcen',
    nombre: 'Vetcen',
    familia: 'cli',
    categoria: 'lacteos',
    capacidad: '6 + 6 tubos',
    rpm: '11.500',
    xg: '12.716',
    pantalla: 'LED',
    temperatura: ['ventilada'],
    pagina: 100,
    imagen: img('vetcen', 701),
  },
  {
    slug: 'digtor-22-col',
    nombre: 'Digtor 22 Col',
    familia: 'cli',
    categoria: 'tejidos',
    capacidad: '4 × 60 ml',
    rpm: '3.000',
    xg: '1.801',
    pantalla: 'TFT',
    temperatura: ['ventilada'],
    pagina: 106,
    imagen: img('digtor-22-col', 703),
  },
  {
    slug: 'digtor-22-c',
    nombre: 'Digtor 22 C',
    variantes: 'C-U · C-8',
    familia: 'ind',
    categoria: 'oil',
    capacidad: '4 × 100 ml',
    rpm: '3.000',
    xg: '2.425',
    pantalla: 'TFT',
    temperatura: ['calefactada', 'ventilada'],
    pagina: 92,
    imagen: img('digtor-22-c', 649),
  },
  {
    slug: 'lacter-21',
    nombre: 'Lacter 21',
    familia: 'ind',
    categoria: 'lacteos',
    capacidad: '12 butirómetros',
    rpm: '1.600',
    xg: '398',
    pantalla: 'LCD',
    temperatura: ['calefactada'],
    pagina: 90,
    imagen: img('lacter-21', 720, 717),
  },
];

/** Número de modelos contando cada versión (22 y 22 R, C, C-U y C-8…) */
export const totalModelos = 23;

/** Cada modelo del catálogo, con su foto entera (las de la página de productos de ortoalresa.com) */
export interface Modelo {
  /** Para el enlace y la foto: la serie, o la serie más su versión ("consul-22-r") */
  slug: string;
  /** Serie a la que pertenece: sus textos, por idioma, son los de la serie */
  serie: string;
  nombre: string;
  categoria: Categoria;
  capacidad: string;
  rpm: string;
  /** Sin xg cuando el catálogo no da la de esa versión */
  xg?: string;
  pantalla: Serie['pantalla'];
  temperatura: Temperatura;
  /** true en la primera versión de cada serie: lleva el id de la serie para los enlaces de Tecnología y la lupa */
  principal: boolean;
  imagen: { src: string; ancho: number; alto: number };
}

const foto = (slug: string) => ({ src: `/img/catalogo/${slug}.webp`, ancho: 640, alto: 640 });

/**
 * Las versiones de cada serie como en la web actual: "22" ventilada y "22 R" refrigerada; la Digtor 22 C, C-U
 * (ventilada) y C-8 (8 × 100 ml, del catálogo de la web actual).
 */
export const modelos: Modelo[] = productos.flatMap((p): Modelo[] => {
  const base = { serie: p.slug, categoria: p.categoria, capacidad: p.capacidad, rpm: p.rpm, pantalla: p.pantalla };
  if (p.slug === 'digtor-22-c') {
    return [
      {
        ...base,
        slug: p.slug,
        nombre: p.nombre,
        xg: p.xg,
        temperatura: 'calefactada',
        principal: true,
        imagen: foto(p.slug),
      },
      {
        ...base,
        slug: `${p.slug}-u`,
        nombre: 'Digtor 22 C-U',
        xg: p.xg,
        temperatura: 'ventilada',
        principal: false,
        imagen: foto(`${p.slug}-u`),
      },
      {
        ...base,
        slug: `${p.slug}-8`,
        nombre: 'Digtor 22 C-8',
        capacidad: '8 × 100 ml',
        temperatura: 'calefactada',
        principal: false,
        imagen: foto(`${p.slug}-8`),
      },
    ];
  }
  if (p.variantes === '22 R') {
    return [
      {
        ...base,
        slug: p.slug,
        nombre: p.nombre,
        xg: p.xg,
        temperatura: 'ventilada',
        principal: true,
        imagen: foto(p.slug),
      },
      {
        ...base,
        slug: `${p.slug}-r`,
        nombre: `${p.nombre} R`,
        xg: p.xg,
        temperatura: 'refrigerada',
        principal: false,
        imagen: foto(`${p.slug}-r`),
      },
    ];
  }
  return [
    {
      ...base,
      slug: p.slug,
      nombre: p.nombre,
      xg: p.xg,
      temperatura: p.temperatura[0],
      principal: true,
      imagen: foto(p.slug),
    },
  ];
});
