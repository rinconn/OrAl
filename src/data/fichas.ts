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

/** Familias de tubo para el filtro del catálogo: pocas y reconocibles, en vez de los ~30 tipos del ERP */
export type FamiliaTubo = 'micro' | 'conicos' | 'fondo' | 'sangre' | 'placas' | 'industria' | 'citologia';
export const familiasTubo: FamiliaTubo[] = ['micro', 'conicos', 'fondo', 'sangre', 'placas', 'industria', 'citologia'];

/** Tipos de tubo del ERP con su familia y un mismo criterio en los tres idiomas: forma, luego cierre y al final "(HS)"
 * si lo lleva el dato. Los nombres de marca (Cytofunnel, Cyto-Clips) se dejan como están */
const tiposTubo: Record<string, { es: string; en: string; fr: string; f: FamiliaTubo }> = {
  microtubos: { es: 'microtubos', en: 'microtubes', fr: 'microtubes', f: 'micro' },
  'tiras PCR': { es: 'tiras PCR', en: 'PCR strips', fr: 'barrettes PCR', f: 'micro' },
  criotubos: { es: 'criotubos', en: 'cryotubes', fr: 'cryotubes', f: 'micro' },
  capilares: { es: 'capilares', en: 'capillaries', fr: 'capillaires', f: 'micro' },
  cónico: { es: 'cónico', en: 'conical', fr: 'conique', f: 'conicos' },
  'cónico tapón': { es: 'cónico con tapón', en: 'conical with cap', fr: 'conique avec bouchon', f: 'conicos' },
  'cónico tapón rosca': {
    es: 'cónico con tapón de rosca',
    en: 'conical with screw cap',
    fr: 'conique avec bouchon à vis',
    f: 'conicos',
  },
  'cónico tapón a presión': {
    es: 'cónico con tapón a presión',
    en: 'conical with snap cap',
    fr: 'conique avec bouchon à pression',
    f: 'conicos',
  },
  'fondo redondo': { es: 'fondo redondo', en: 'round bottom', fr: 'fond rond', f: 'fondo' },
  'fondo redondo, tapón': {
    es: 'fondo redondo con tapón',
    en: 'round bottom with cap',
    fr: 'fond rond avec bouchon',
    f: 'fondo',
  },
  'fondo redondo, tapón (hs)': {
    es: 'fondo redondo con tapón (HS)',
    en: 'round bottom with cap (HS)',
    fr: 'fond rond avec bouchon (HS)',
    f: 'fondo',
  },
  'fondo plano, tapón': {
    es: 'fondo plano con tapón',
    en: 'flat bottom with cap',
    fr: 'fond plat avec bouchon',
    f: 'fondo',
  },
  'fondo plano, tapón, (hs)': {
    es: 'fondo plano con tapón (HS)',
    en: 'flat bottom with cap (HS)',
    fr: 'fond plat avec bouchon (HS)',
    f: 'fondo',
  },
  hemólisis: { es: 'hemólisis', en: 'haemolysis', fr: 'hémolyse', f: 'fondo' },
  'cultivo celular': { es: 'cultivo celular', en: 'cell culture', fr: 'culture cellulaire', f: 'fondo' },
  'extr. sangre': { es: 'extracción de sangre', en: 'blood collection', fr: 'prélèvement sanguin', f: 'sangre' },
  'bolsas sangre, dobles': {
    es: 'bolsas de sangre dobles',
    en: 'double blood bags',
    fr: 'poches de sang doubles',
    f: 'sangre',
  },
  jeringas: { es: 'jeringas', en: 'syringes', fr: 'seringues', f: 'sangre' },
  'placas microtiter': { es: 'microplacas', en: 'microtiter plates', fr: 'microplaques', f: 'placas' },
  'deep well': { es: 'deep well', en: 'deep well', fr: 'deep well', f: 'placas' },
  cilindrocónico: { es: 'cilindrocónico', en: 'cylindro-conical', fr: 'cylindro-conique', f: 'industria' },
  'traza, cónico': { es: 'cónico de traza', en: 'conical trace', fr: 'conique de trace', f: 'industria' },
  finger: { es: 'finger', en: 'finger', fr: 'finger', f: 'industria' },
  pera: { es: 'pera', en: 'pear-shaped', fr: 'en poire', f: 'industria' },
  butirómetros: { es: 'butirómetros', en: 'butyrometers', fr: 'butyromètres', f: 'industria' },
};
/** Nombre limpio de un tipo de tubo ("(TM)" pasa a "™") */
export const tipoTubo = (lang: Idioma, tipo?: string) =>
  tipo && (tiposTubo[tipo]?.[lang] ?? tipo.replace(/\(TM\)/g, '™'));
/** Familia de un tipo de tubo; los de marca para citología (Cytofunnel, Cyto-Clips) van a la suya */
export const familiaTubo = (tipo: string): FamiliaTubo => tiposTubo[tipo]?.f ?? 'citologia';
