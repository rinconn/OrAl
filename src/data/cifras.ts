// Cifras de la primera pantalla. Todas salen del Catálogo General 2025 ("¿Qué nos diferencia?") o de ortoalresa.com.
// 1949 no va aquí: ya lo dice la frase bajo el titular ("Desde 1949 diseñamos y fabricamos…").
// Los textos de cada cifra, por idioma, en src/i18n/ (`hero.cifras`).
import type { Textos } from '../i18n/es';

export interface Cifra {
  clave: keyof Textos['hero']['cifras'];
  /** Icono de la marca Orto Alresa (los de la web actual), en `public/img/iconos/` */
  icono: 'telefono' | 'pack' | 'ico-seguridad' | 'ico-tabla';
}

export const cifras: Cifra[] = [
  { clave: 'respuesta', icono: 'telefono' },
  { clave: 'entrega', icono: 'pack' },
  { clave: 'garantia', icono: 'ico-seguridad' },
  { clave: 'iso', icono: 'ico-tabla' },
];
