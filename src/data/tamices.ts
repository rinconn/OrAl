// Tamices de la tamizadora: la web actual los da en una foto de cuatro tablas (tamices-1.webp, sieves.webp). Aquí van
// como datos, para pintarlos como tablas de verdad, copiables y legibles en el móvil
import type { Idioma } from '../i18n';

export interface Tamiz {
  codigo: string;
  /** Luz de malla tal como se pide: "0.315" (mm), "3 ½\"", "No. 200" */
  luz: string;
  /** Tamiz para tamizadoras de barrido por aire */
  aire?: true;
}
export interface TablaTamices {
  tipo: 'chapa' | 'malla';
  norma: string;
  acero: string;
  /** La luz va en milímetros (ISO) o en pulgadas / número (ASTM) */
  enMm: boolean;
  filas: Tamiz[];
}
export interface SerieTamices {
  medida: string;
  /** Nombre corto de la familia de normas, para la etiqueta de la serie */
  normas: string;
  tablas: TablaTamices[];
  /** Fondos y tapas de la serie */
  extras: { codigo: string; que: 'fondo' | 'tapa' | 'fondoHumeda' | 'tapaHumeda' }[];
}

const f = (s: string): Tamiz[] =>
  s
    .trim()
    .split('\n')
    .map((l) => {
      const [c, luz] = l.split('|').map((x) => x.trim());
      const aire = c.startsWith('*');
      return { codigo: `PI ${c.replace('*', '')}`, luz, ...(aire && { aire: true as const }) };
    });

export const seriesTamices: SerieTamices[] = [
  {
    medida: 'Ø 200 × 50 mm',
    normas: 'ISO 3310',
    tablas: [
      {
        tipo: 'malla',
        norma: 'ISO 3310-1',
        acero: 'AISI 316',
        enMm: true,
        filas: f(`
079|8
080|6.3
081|5
082|4
297|3.15
083|2.5
348|2.36
084|2
321|1.7
085|1.6
086|1.25
087|1
088|0.8
089|0.63
090|0.5
091|0.4
146|0.315
092|0.25
093|0.2
094|0.16
095|0.125
096|0.1
097|0.08
098|0.063
099|0.05
100|0.04
*435|0.025
*384|0.02`),
      },
      {
        tipo: 'chapa',
        norma: 'ISO 3310-2',
        acero: 'AISI 304',
        enMm: true,
        filas: f(`
065|125
069|100
070|80
071|63
072|50
073|40
074|25
075|20
076|16
077|12.5
078|10`),
      },
    ],
    extras: [
      { codigo: 'PI 066', que: 'fondo' },
      { codigo: 'PI 067', que: 'tapa' },
      { codigo: 'PI 351', que: 'fondoHumeda' },
      { codigo: 'PI 350', que: 'tapaHumeda' },
    ],
  },
  {
    medida: '8″ × 2″ (Ø 203 × 50 mm)',
    normas: 'ASTM',
    tablas: [
      {
        tipo: 'malla',
        norma: 'ASTM E11',
        acero: 'AISI 316',
        enMm: false,
        filas: f(`
169|3/8″
170|5/16″
171|0.265″
172|¼″
173|No. 3 ½
174|No. 4
175|No. 5
176|No. 6
177|No. 7
178|No. 8
179|No. 10
180|No. 12
181|No. 14
182|No. 16
183|No. 18
184|No. 20
185|No. 25
186|No. 30
187|No. 35
188|No. 40
189|No. 45
190|No. 50
191|No. 60
192|No. 70
193|No. 80
194|No. 100
195|No. 120
196|No. 140
197|No. 170
198|No. 200
199|No. 230
200|No. 270
201|No. 325
*250|No. 400|0.038`),
      },
      {
        tipo: 'chapa',
        norma: 'ASTM E323',
        acero: 'AISI 304',
        enMm: false,
        filas: f(`
150|5″
151|4.24″
152|4″
153|3 ½″
154|3″
155|2 ½″
156|2.12″
157|2″
158|1 ¾″
159|1 ½″
160|1 ¼″
161|1.06″
162|1″
163|7/8″
164|¾″
165|5/8″
166|0.53″
167|½″
168|7/16″|11.1`),
      },
    ],
    extras: [
      { codigo: 'PI 203', que: 'fondo' },
      { codigo: 'PI 202', que: 'tapa' },
      { codigo: 'PI 235', que: 'fondoHumeda' },
      { codigo: 'PI 221', que: 'tapaHumeda' },
    ],
  },
];

/** La foto de las tablas de tamices de la web actual, que se cambia por estas tablas */
export const esFotoTamices = (src: string) => /tamices|sieves/i.test(src);

/** Cifra con la coma o el punto decimal de cada idioma */
export const decimal = (lang: Idioma, s: string) => (lang === 'en' ? s : s.replace(/(\d)\.(\d)/g, '$1,$2'));

/** Todas las medidas de bastidor que se fabrican (las tablas son de las dos más pedidas) */
export const medidasTamices = [
  'Ø 200 × 50 mm',
  'Ø 200 × 25 mm',
  'Ø 100 × 50 mm',
  '8″ × 2″ (Ø 203 × 50 mm)',
  '8″ × 1″ (Ø 203 × 25 mm)',
];
