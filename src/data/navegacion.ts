// Navegación común a toda la web. Un solo sitio para cambiar enlaces, teléfono o idiomas.
// Mientras una sección no tenga página propia, su enlace apunta a su bloque de la portada;
// cuando se publique la página se cambia aquí el `href` y se actualiza toda la web.

export interface Enlace {
  href: string;
  texto: string;
}

export const principal: Enlace[] = [
  { href: '/#gama', texto: 'Centrífugas' },
  { href: '/#gama', texto: 'Elegir centrífuga' },
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
};

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

/** Sellos que acompañan al logo, como en la web actual */
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
