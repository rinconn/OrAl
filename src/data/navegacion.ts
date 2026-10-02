// Navegación común a toda la web. Un solo sitio para cambiar enlaces, teléfono o idiomas.
// Mientras una sección no tenga página propia, su enlace apunta a su bloque de la portada;
// cuando se publique la página se cambia aquí el `href` y se actualiza toda la web.

export interface Enlace {
  href: string;
  texto: string;
}

export const principal: Enlace[] = [
  { href: '/centrifugas/', texto: 'Centrífugas' },
  { href: '/#tecnologia', texto: 'Tecnología' },
  { href: '/#distribuidores', texto: 'Distribuidores' },
  { href: '/#contacto', texto: 'Servicio técnico' },
  { href: '/#empresa', texto: 'Empresa' },
];

export const contacto = {
  href: '/#contacto',
  telefono: '+34 91 884 40 16',
  telefonoHref: 'tel:+34918844016',
  comercial: 'sales@ortoalresa.com',
  tecnico: 'sat@ortoalresa.com',
  general: 'info@ortoalresa.com',
  empresa: 'Álvarez Redondo, S.A.',
  direccion: 'Los Frailes, 121 · Pol. Ind. Los Frailes · 28814 Daganzo, Madrid',
};

/** Columnas de enlaces del pie */
export const pie: { titulo: string; enlaces: Enlace[] }[] = [
  {
    titulo: 'Centrífugas',
    enlaces: [
      { href: '/centrifugas/', texto: 'Toda la gama' },
      { href: '/#tecnologia', texto: 'Tecnología' },
      { href: '/descargas/', texto: 'Catálogo 2025' },
    ],
  },
  {
    titulo: 'Empresa',
    enlaces: [
      { href: '/empresa/', texto: 'Quiénes somos' },
      { href: '/#distribuidores', texto: 'Distribuidores' },
      { href: '/#aplicaciones', texto: 'Aplicaciones' },
      { href: '/#empresa', texto: 'Certificados' },
    ],
  },
];

/** Redes sociales. Sin `href` se muestran sin enlace hasta que la empresa confirme la dirección. */
export const redes: { nombre: string; href?: string }[] = [
  { nombre: 'LinkedIn' },
  { nombre: 'YouTube', href: 'https://www.youtube.com/channel/UClCPt-TaRiH_Srm5Diq7GNA' },
  { nombre: 'Facebook' },
];

/**
 * Logos de las ayudas públicas que enseña la web actual (FEDER, NextGenerationEU, FSE+...), sin repetir.
 * Recortados de las filas de logos de la web actual; `ancho` y `alto` son los del archivo.
 * Sin `src` se muestra un hueco con el nombre hasta tener el logo oficial.
 */
export const ayudas: { nombre: string; src?: string; ancho?: number; alto?: number; bandera?: boolean }[] = [
  { nombre: 'Unión Europea · FEDER', bandera: true },
  {
    nombre: 'Financiado por la Unión Europea · NextGenerationEU',
    src: '/img/ayudas/nextgeneration-ue.webp',
    ancho: 388,
    alto: 96,
  },
  {
    nombre: 'Gobierno de España · Ministerio para la Transformación Digital y de la Función Pública',
    src: '/img/ayudas/gobierno-espana.webp',
    ancho: 382,
    alto: 96,
  },
  {
    nombre: 'Plan de Recuperación, Transformación y Resiliencia',
    src: '/img/ayudas/plan-recuperacion.webp',
    ancho: 442,
    alto: 96,
  },
  { nombre: 'Comunidad de Madrid', src: '/img/ayudas/comunidad-madrid.webp', ancho: 68, alto: 96 },
  { nombre: 'Cofinanciado por la Unión Europea', src: '/img/ayudas/cofinanciado-ue.webp', ancho: 410, alto: 96 },
  { nombre: 'Fondo Social Europeo Plus (FSE+)', src: '/img/ayudas/fse-plus.webp', ancho: 510, alto: 96 },
  { nombre: 'SEPE · Ministerio de Trabajo y Economía Social', src: '/img/ayudas/sepe.webp', ancho: 64, alto: 96 },
  { nombre: 'Fondos Europeos', src: '/img/ayudas/fondos-europeos.webp', ancho: 498, alto: 96 },
  {
    nombre: 'Comunidad de Madrid · Dirección General del Servicio Público de Empleo',
    src: '/img/ayudas/comunidad-madrid-empleo.webp',
    ancho: 262,
    alto: 96,
  },
];

export interface Idioma {
  codigo: 'es' | 'en' | 'fr';
  nombre: string;
  href: string;
  /** false hasta que esa versión exista; se muestra pero no enlaza */
  publicado: boolean;
}

export const idiomas: Idioma[] = [
  { codigo: 'es', nombre: 'Español', href: '/', publicado: true },
  { codigo: 'en', nombre: 'English', href: '/en/', publicado: false },
  { codigo: 'fr', nombre: 'Français', href: '/fr/', publicado: false },
];

/** Sellos de la empresa que acompañan al logo en el pie, como en la web actual */
export const sellos = [
  {
    src: '/img/sellos/ods.webp',
    alt: 'Objetivos de Desarrollo Sostenible',
    ancho: 96,
    alto: 96,
  },
  {
    src: '/img/sellos/empresa-solidaria-2024.webp',
    alt: 'Empresa Solidaria 2024',
    ancho: 204,
    alto: 96,
  },
];
