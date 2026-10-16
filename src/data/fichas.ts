// Fichas de producto: lo que la web actual cuenta de cada producto (descripción, características, versiones, rotores
// y tubos), importado con `node scripts/importar-web-actual.mjs` a web-actual.json. Aquí se le da tipo y se traducen
// los pocos términos que el ERP de la empresa solo tiene en español (tipo de rotor y de tubo).
// Las referencias de cada centrífuga y sus rotores (cuáles, rpm y xg) mandan los del CRM de la empresa, importados con
// `node scripts/importar-rotores-excel.mjs` a rotores-excel.json; de la web actual se quedan la foto, el radio, el
// ángulo y los tubos de cada rotor, y las medidas, el peso y el consumo de cada versión.
import datos from './web-actual.json';
import excel from './rotores-excel.json';
import type { Idioma } from '../i18n';

export interface Punto {
  t: string;
  punto: boolean;
  sub?: string[];
}
/** Celda de una tabla de la web actual; `span`, las columnas que ocupa si va unida */
export interface Celda {
  t: string;
  span?: number;
}
export interface Tabla {
  cabecera: Celda[][];
  filas: Celda[][];
}
export interface Bloque {
  titulo: string;
  puntos: Punto[];
  /** Tablas del bloque (versiones, referencias, accesorios), tal como las da la web actual */
  tablas?: Tabla[];
  imagenes?: { src: string; alt: string; ancho: number; alto: number }[];
}
export interface TextosFicha {
  nombre?: string;
  /** Párrafos; los que empiezan por "• " son elementos de una lista */
  descripcion: string[];
  /** Vídeo de YouTube (id) que acompaña a la descripción */
  video?: string;
  bloques: Bloque[];
}
export interface Version {
  codigo: string;
  /** Su versión IVD ("CE 126IVD"), si la tiene */
  ivd?: string;
  medidas?: string;
  peso?: string;
  voltaje?: string;
  frecuencia?: string;
  consumo?: string;
  zMax?: string;
  calefaccion?: string;
  /** Equipos: litros por hora que destila */
  produccion?: string;
  /** Equipos: agua de refrigeración, en l/h */
  agua?: string;
  /** Accesorios: las centrífugas para las que vale */
  para?: string;
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
  /** Referencias de la centrífuga con las que este rotor no vale */
  noEn?: string[];
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

// ——— Lo que manda el CRM: referencias y rotores de cada centrífuga ———
interface ModeloExcel {
  referencias: string[];
  rotores: { codigo: string; tipo: Rotor['tipo']; rpm?: string; xg?: string; capacidad?: string }[];
  noCompatibles?: Record<string, string[]>;
}
// El mismo modelo se escribe distinto en un sitio y otro ("Digtor 22 COL" y "Digtor 22 Col", "Digtor 22 C-U" y
// "Digtor 22 C-U (sin calefacción)"): se comparan sin mayúsculas, signos ni paréntesis
const clave = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const modelosExcel = new Map(
  Object.entries((excel as unknown as { modelos: Record<string, ModeloExcel> }).modelos).map(([n, m]) => [clave(n), m]),
);
const rotorPorCodigo = new Map(Object.values(d.rotores).map((r) => [r.nombre.trim(), r]));
const rotores: Record<string, Rotor> = { ...d.rotores };

const centrifugas = Object.fromEntries(
  Object.entries(d.centrifugas).map(([slug, c]) => {
    const x = modelosExcel.get(clave(c.nombre));
    if (!x) return [slug, c];
    // Una versión por referencia del CRM, con su IVD al lado; las medidas, el peso… de la web actual si los tiene
    const versiones = x.referencias
      .filter((r) => !r.endsWith('IVD'))
      .map((codigo) => ({
        ...c.versiones.find((v) => v.codigo.trim() === codigo),
        codigo,
        ivd: x.referencias.find((r) => r === `${codigo}IVD`),
      }));
    // Sus rotores, con las rpm y la fuerza que da el CRM para esta centrífuga; la foto, el radio y los tubos, del rotor
    // de la web actual. Un rotor que la web actual no tiene se queda con lo que dice el CRM (tipo, capacidad y cifras)
    const ids = x.rotores.map((r) => {
      const id = `${slug}:${r.codigo}`;
      const base = rotorPorCodigo.get(r.codigo);
      rotores[id] = {
        ...(base ?? { nombre: r.codigo, tipo: r.tipo, capacidad: r.capacidad, tubos: [] }),
        nombre: r.codigo,
        ...(r.rpm && { rpm: r.rpm }),
        ...(r.xg && { xg: r.xg }),
        ...(x.noCompatibles?.[r.codigo] && { noEn: x.noCompatibles[r.codigo] }),
      };
      return id;
    });
    return [slug, { ...c, versiones, rotores: ids }];
  }),
);

export const fechaImportacion = d.fecha;
export const fichaCentrifuga = (slug: string): FichaCentrifuga | undefined => centrifugas[slug];
export const rotor = (id: string): Rotor => rotores[id];

/** Productos de laboratorio y accesorios: nuestra clave → la de la web actual */
const claveLab: Record<string, string> = { tamizadora: 'tamizadora-y-tamices' };

/** Un código de la empresa: "CP 007", "DA 005", "PI 226" */
export const esCodigo = (s: string) => /^[A-Z]{2,3} ?\d{3}[A-Z]*$/.test(s.trim());

// La tabla de versiones de un equipo o accesorio pasa a ser como la de las centrífugas: una versión por código, con
// las mismas columnas, unidades y textos en cada idioma. Las cifras salen de la tabla en español (en inglés y francés
// son las mismas, pero con cabeceras en inglés y erratas); el texto de cada fila ("Unicen 21 y Digicen 22"), de la
// tabla de su idioma. La columna se reconoce por la cabecera en español; "agua" va antes que "consumo" porque
// "Consumo agua refrigeración" es el agua y no la potencia
type ColumnaLab = Exclude<keyof Version, 'codigo' | 'ivd'>;
const columnasLab: [RegExp, ColumnaLab][] = [
  [/dimensi/i, 'medidas'],
  [/peso/i, 'peso'],
  [/voltaje/i, 'voltaje'],
  [/frecuencia/i, 'frecuencia'],
  [/agua/i, 'agua'],
  [/capacidad/i, 'produccion'],
  [/consumo|resistencia/i, 'consumo'],
  [/modelo/i, 'para'],
];
/** Columna de cada celda de una fila, desplegando las celdas unidas de la cabecera ("Dimensiones" ocupa tres) */
const columnasDe = (t: Tabla) =>
  (t.cabecera.at(-1) ?? []).flatMap((c, i) => {
    const k = i === 0 ? 'codigo' : columnasLab.find(([re]) => re.test(c.t))?.[1];
    return Array<ColumnaLab | 'codigo' | undefined>(c.span ?? 1).fill(k);
  });
const esDeVersiones = (t: Tabla) =>
  t.filas.length > 0 &&
  t.filas.every((f) => esCodigo(f[0]?.t ?? '')) &&
  columnasDe(t).filter((k) => k && k !== 'codigo').length >= 2;

/** Textos de un equipo o accesorio en un idioma, con sus versiones ya sacadas de la tabla */
export interface TextosLab extends TextosFicha {
  versiones: Version[];
  /** Líneas que acompañaban a la tabla de versiones ("*Altura con la máxima capacidad de tamices: 750 mm") */
  notasVersiones: string[];
}
const textosLab = (textos: Record<Idioma, TextosFicha>): Record<Idioma, TextosLab> => {
  // Dónde está la tabla de versiones (bloque y tabla), en español
  const iB = textos.es.bloques.findIndex((b) => b.tablas?.some(esDeVersiones));
  const iT = iB < 0 ? -1 : textos.es.bloques[iB].tablas!.findIndex(esDeVersiones);
  const base = iB < 0 ? undefined : textos.es.bloques[iB].tablas![iT];
  const cols = base ? columnasDe(base) : [];
  const iPara = cols.indexOf('para');
  const versiones: Version[] = (base?.filas ?? []).map((f) => {
    const v: Version = { codigo: f[0].t.trim() };
    cols.forEach((k, i) => {
      const x = f[i]?.t.trim();
      if (!k || k === 'codigo' || !x) return;
      // Las medidas, en una celda ("370 220 440") o en tres: "370x220x440", como las de las centrífugas
      v[k] = k === 'medidas' ? [v[k], ...x.split(/\s+/)].filter(Boolean).join('x') : x;
    });
    return v;
  });
  return Object.fromEntries(
    (Object.keys(textos) as Idioma[]).map((l) => {
      const t = textos[l];
      if (!base) return [l, { ...t, versiones, notasVersiones: [] }];
      // El texto de cada fila en su idioma, si su tabla tiene las mismas filas
      const suya = t.bloques[iB]?.tablas?.[iT];
      const propias =
        iPara >= 0 && suya?.filas.length === versiones.length
          ? versiones.map((v, j) => ({ ...v, para: suya.filas[j][iPara]?.t.trim() || v.para }))
          : versiones;
      // La tabla sale de su bloque; si el bloque se queda sin tablas ni fotos, sale entero y sus líneas van debajo
      // de la tabla de versiones
      const b = t.bloques[iB];
      const resto = (b?.tablas ?? []).filter((_, k) => k !== iT);
      const queda = b && (resto.length > 0 || (b.imagenes?.length ?? 0) > 0);
      const bloques = t.bloques.flatMap((x, j) => (j !== iB ? [x] : queda ? [{ ...x, tablas: resto }] : []));
      const notasVersiones = b && !queda ? b.puntos.map((p) => p.t).filter(Boolean) : [];
      return [l, { ...t, bloques, versiones: propias, notasVersiones }];
    }),
  ) as Record<Idioma, TextosLab>;
};
const fichasLab = new Map<string, Record<Idioma, TextosLab> | undefined>();
export const fichaLab = (slug: string): Record<Idioma, TextosLab> | undefined => {
  if (!fichasLab.has(slug)) {
    const clave = claveLab[slug] ?? slug;
    const textos = d.laboratorio[clave]?.textos ?? d.accesorios[clave]?.textos;
    fichasLab.set(slug, textos && textosLab(textos));
  }
  return fichasLab.get(slug);
};

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
