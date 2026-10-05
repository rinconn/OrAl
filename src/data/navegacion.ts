// Navegación común a toda la web. Un solo sitio para cambiar enlaces o teléfono (los idiomas, en src/i18n/).
// Mientras una sección no tenga página propia, su enlace apunta a su bloque de la portada;
// cuando se publique la página se cambia aquí el `href` y se actualiza toda la web.

// Los textos de cada enlace están en src/i18n/ (`nav` y `pie`), por idioma.
import type { Textos } from '../i18n/es';

// En el orden en que aparecen las secciones al bajar por la portada: inicio ("Ver la gama"), Tecnología, Empresa,
// Distribuidores, notas y pie. Descargas no tiene sección; va al final.
export const principal: { href: string; clave: keyof Textos['nav'] }[] = [
  { href: '/centrifugas/', clave: 'centrifugas' },
  // La tecnología propia, seguida y con el nombre de cada pieza, como en la web actual, en el orden del acordeón
  // de Tecnología. Cada enlace abre su panel.
  { href: '/#rei-system', clave: 'rei' },
  { href: '/#smartconnect', clave: 'smartconnect' },
  { href: '/#configurador', clave: 'configurador' },
  { href: '/#empresa', clave: 'empresa' },
  { href: '/#distribuidores', clave: 'distribuidores' },
  { href: '/#aplicaciones', clave: 'noticias' },
  { href: '/#contacto', clave: 'servicio' },
  // Guías y descargas juntas en una página, con una sección para cada cosa
  { href: '/descargas/', clave: 'descargas' },
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
export const pie: {
  titulo: keyof Textos['pie']['titulos'];
  enlaces: { href: string; clave: keyof Textos['pie']['enlaces'] }[];
}[] = [
  {
    titulo: 'centrifugas',
    enlaces: [
      { href: '/centrifugas/', clave: 'gama' },
      { href: '/#tecnologia', clave: 'tecnologia' },
      { href: '/descargas/', clave: 'catalogo' },
    ],
  },
  {
    titulo: 'empresa',
    enlaces: [
      { href: '/empresa/', clave: 'quienes' },
      { href: '/#distribuidores', clave: 'distribuidores' },
      { href: '/#aplicaciones', clave: 'aplicaciones' },
      { href: '/#empresa', clave: 'certificados' },
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

/** Sellos de la empresa que acompañan al logo en el pie, como en la web actual */
export const sellos: { src: string; clave: keyof Textos['pie']['sellos']; ancho: number; alto: number }[] = [
  {
    src: '/img/sellos/ods.webp',
    clave: 'ods',
    ancho: 96,
    alto: 96,
  },
  {
    src: '/img/sellos/empresa-solidaria-2024.webp',
    clave: 'solidaria',
    ancho: 204,
    alto: 96,
  },
];
