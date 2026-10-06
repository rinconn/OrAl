// Fichas de producto: lo que la web actual cuenta de cada producto (descripción, características, versiones, rotores
// y tubos), importado con `node scripts/importar-web-actual.mjs` a web-actual.json. Aquí se le da tipo y se traducen
// los pocos términos que el ERP de la empresa solo tiene en español (tipo de rotor y de tubo).
import datos from './web-actual.json';
import type { Idioma } from '../i18n';

export interface Punto {
  t: string;
  punto: boolean;
  sub?: string[];
}
export interface Bloque {
  titulo: string;
  puntos: Punto[];
}
export interface TextosFicha {
  nombre?: string;
  descripcion: string[];
  bloques: Bloque[];
}
export interface Version {
  codigo: string;
  medidas?: string;
  peso?: string;
  voltaje?: string;
  frecuencia?: string;
  consumo?: string;
  zMax?: string;
  calefaccion?: string;
}
export interface Tubo {
  reductor?: string;
  posiciones?: string;
  tipo?: string;
  capacidad?: string;
  medidas?: string;
}
export interface Rotor {
  nombre: string;
  tipo: 'angular' | 'horizontal' | 'oscilante';
  rpm?: string;
  xg?: string;
  capacidad?: string;
  radio?: string;
  angulo?: string;
  tempMin?: string;
  imagen?: string;
  tubos: Tubo[];
}
export interface FichaCentrifuga {
  nombre: string;
  xg?: string;
  versiones: Version[];
  rotores: string[];
  relacionada: string[];
  accesorios: string[];
  pdf?: Record<Idioma, string>;
  textos: Record<Idioma, TextosFicha>;
}

const d = datos as unknown as {
  fecha: string;
  centrifugas: Record<string, FichaCentrifuga>;
  rotores: Record<string, Rotor>;
  accesorios: Record<string, { textos: Record<Idioma, TextosFicha> }>;
  laboratorio: Record<string, { textos: Record<Idioma, TextosFicha> }>;
};

export const fechaImportacion = d.fecha;
export const fichaCentrifuga = (slug: string): FichaCentrifuga | undefined => d.centrifugas[slug];
export const rotor = (id: string): Rotor => d.rotores[id];

/** Productos de laboratorio y accesorios: nuestra clave → la de la web actual */
const claveLab: Record<string, string> = { tamizadora: 'tamizadora-y-tamices' };
export const fichaLab = (slug: string) =>
  d.laboratorio[claveLab[slug] ?? slug]?.textos ?? d.accesorios[claveLab[slug] ?? slug]?.textos;

/** Formato de un número del ERP ("16500") con los miles de cada idioma */
export const cifra = (lang: Idioma, n?: string) => {
  if (!n || !/^-?\d+$/.test(n)) return n;
  const sep = lang === 'en' ? ',' : lang === 'fr' ? ' ' : '.';
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};

/** "4 x 125 ml" → "4 × 125 ml"; en inglés, coma decimal a punto */
export const medida = (lang: Idioma, s?: string) => {
  if (!s) return s;
  const t = s.replace(/(\d)\s*x\s*(?=\d)/g, '$1 × ');
  return lang === 'en' ? t.replace(/(\d),(\d)/g, '$1.$2') : t;
};

const tiposRotor: Record<Rotor['tipo'], Record<Idioma, string>> = {
  angular: { es: 'Angular', en: 'Fixed-angle', fr: 'Angulaire' },
  horizontal: { es: 'Horizontal', en: 'Horizontal', fr: 'Horizontal' },
  oscilante: { es: 'Oscilante', en: 'Swing-out', fr: 'Oscillant' },
};
export const tipoRotor = (lang: Idioma, tipo: Rotor['tipo']) => tiposRotor[tipo]?.[lang] ?? tipo;

/** Tipos de tubo del ERP. Los nombres de marca (Cytofunnel, Cyto-Clips) se dejan como están */
const tiposTubo: Record<string, { en: string; fr: string }> = {
  capilares: { en: 'capillaries', fr: 'capillaires' },
  microtubos: { en: 'microtubes', fr: 'microtubes' },
  cónico: { en: 'conical', fr: 'conique' },
  'extr. sangre': { en: 'blood collection', fr: 'prélèvement sanguin' },
  'fondo redondo, tapón': { en: 'round bottom, capped', fr: 'fond rond, bouchon' },
  'cónico tapón': { en: 'conical, capped', fr: 'conique, bouchon' },
  'fondo redondo': { en: 'round bottom', fr: 'fond rond' },
  'fondo redondo, tapón (hs)': { en: 'round bottom, capped (HS)', fr: 'fond rond, bouchon (HS)' },
  'fondo plano, tapón, (hs)': { en: 'flat bottom, capped (HS)', fr: 'fond plat, bouchon (HS)' },
  'fondo plano, tapón': { en: 'flat bottom, capped', fr: 'fond plat, bouchon' },
  'tiras PCR': { en: 'PCR strips', fr: 'barrettes PCR' },
  butirómetros: { en: 'butyrometers', fr: 'butyromètres' },
  'cónico tapón rosca': { en: 'conical, screw cap', fr: 'conique, bouchon à vis' },
  'cónico tapón a presión': { en: 'conical, snap cap', fr: 'conique, bouchon à pression' },
  criotubos: { en: 'cryotubes', fr: 'cryotubes' },
  'placas microtiter': { en: 'microtiter plates', fr: 'microplaques' },
  'cultivo celular': { en: 'cell culture', fr: 'culture cellulaire' },
  'deep well': { en: 'deep well', fr: 'deep well' },
  hemólisis: { en: 'haemolysis', fr: 'hémolyse' },
  'bolsas sangre, dobles': { en: 'blood bags, double', fr: 'poches de sang, doubles' },
  cilindrocónico: { en: 'cylindro-conical', fr: 'cylindro-conique' },
  'traza, cónico': { en: 'trace, conical', fr: 'trace, conique' },
  finger: { en: 'finger', fr: 'finger' },
  pera: { en: 'pear-shaped', fr: 'en poire' },
  jeringas: { en: 'syringes', fr: 'seringues' },
};
export const tipoTubo = (lang: Idioma, tipo?: string) =>
  !tipo || lang === 'es' ? tipo : (tiposTubo[tipo]?.[lang] ?? tipo);
