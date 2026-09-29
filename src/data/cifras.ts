// Cifras de la primera pantalla. Todas salen del Catálogo General 2025 ("¿Qué nos diferencia?") o de ortoalresa.com.
// 1949 no va aquí: ya lo dice la frase bajo el titular ("Desde 1949 diseñamos y fabricamos…").

export interface Cifra {
  valor: string;
  texto: string;
}

export const cifras: Cifra[] = [
  { valor: '48 h', texto: 'de respuesta' },
  { valor: '1 semana', texto: 'plazo de entrega' },
  { valor: '3 años', texto: 'de garantía' },
  { valor: 'ISO 13485', texto: '9001 · 14001 · IVDR' },
];
