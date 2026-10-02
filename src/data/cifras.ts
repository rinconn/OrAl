// Cifras de la primera pantalla. Todas salen del Catálogo General 2025 ("¿Qué nos diferencia?") o de ortoalresa.com.
// 1949 no va aquí: ya lo dice la frase bajo el titular ("Desde 1949 diseñamos y fabricamos…").

export interface Cifra {
  valor: string;
  texto: string;
  /** Icono de la marca Orto Alresa (los de la web actual), en `public/img/iconos/` */
  icono: 'telefono' | 'pack' | 'ico-seguridad' | 'ico-tabla';
}

export const cifras: Cifra[] = [
  { valor: '48 h', texto: 'de respuesta', icono: 'telefono' },
  { valor: '1 semana', texto: 'plazo de entrega', icono: 'pack' },
  { valor: '3 años', texto: 'de garantía', icono: 'ico-seguridad' },
  { valor: 'ISO 13485', texto: '9001 · 14001 · IVDR', icono: 'ico-tabla' },
];
