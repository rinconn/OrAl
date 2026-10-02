// Tecnología propia: textos y modelos sacados del Catálogo General 2025 (págs. 28-29, 58 y 60)
// y de la web actual. Inventario completo con fuentes: /mnt/project-files/analisis/tecnologia-contenido.md
// Confirmado por la empresa (30-09-2026): 175 rampas; REI solo Digicen 22/22 R y Cyto 22 (la Plasma 22 no);
// la Biocen 22 R no lleva ULS. El catálogo 2025 se equivoca en esos dos últimos puntos.
import { productos } from './productos';

export interface Modelo {
  href: string;
  nombre: string;
}

/** Enlaza cada modelo con su ficha del catálogo (/centrifugas/#slug) y le pone su nombre con variantes */
const modelos = (...slugs: string[]): Modelo[] =>
  slugs.map((slug) => {
    const p = productos.find((x) => x.slug === slug);
    if (!p) throw new Error(`Tecnología: no existe la serie "${slug}"`);
    // "Digtor 22 C" + "C-U · C-8" → "Digtor 22 C, C-U y C-8"
    const v = p.variantes?.split(' · ') ?? [];
    const todas = [p.nombre, ...v];
    const nombre = todas.length > 1 ? `${todas.slice(0, -1).join(', ')} y ${todas.at(-1)}` : p.nombre;
    return { href: `/centrifugas/#${slug}`, nombre };
  });

export const rei = {
  nombre: 'REI System',
  frase: ['Cambiar de rotor en ', 'segundos, con una mano', ' y sin herramientas.'],
  pasos: [
    'Se coloca en el eje del motor y queda anclado solo.',
    'Si no ha quedado bien puesto, la pantalla avisa.',
    'Para sacarlo, se levanta el tirador rojo.',
  ],
  video: 'https://www.youtube.com/watch?v=QbAcmM_jnyI',
  modelos: modelos('digicen-22', 'cyto-22'),
};

export const smartconnect = {
  nombre: 'SmartConnect',
  frase: ['Las centrífugas del laboratorio, ', 'vigiladas desde el móvil', '.'],
  puntos: [
    'App gratuita: se conecta a la WiFi y se consulta desde PC, tablet o móvil.',
    'Histórico de programas y descarga de datos en CSV.',
    'Usuarios con distintos niveles de acceso y registro de quién hizo qué.',
    'Avisos de seguridad y mantenimiento, y diagnóstico a distancia del servicio técnico.',
  ],
  modelos: modelos('digicen-22', 'cyto-22'),
};

const tactiles = [
  'digicen-22',
  'consul-22',
  'digtor-22',
  'magnus-22',
  'dilitcen-22-r',
  'digtor-22-c',
  'digtor-22-col',
  'cyto-22',
];

export const sistemas = [
  {
    id: 'pantalla',
    nombre: 'Pantalla táctil',
    texto: 'A color, fácil de leer y de programar. FCR real según el adaptador y hasta 8 programas enlazados.',
    cifra: '100',
    unidad: 'memorias',
    modelos: modelos(...tactiles),
  },
  {
    id: 'pcbs',
    nombre: 'PCBS',
    texto: 'Frenado progresivo para que la muestra no se vuelva a mezclar tras la separación.',
    cifra: '175',
    unidad: 'rampas de frenado',
    // Todas las de pantalla táctil y las LCD con PCBS (tabla comparativa del catálogo, pág. 30-31)
    antes: 'todas las de pantalla táctil, y',
    modelos: modelos('biocen-22-r', 'bioprocen-22-r', 'lacter-21', 'plasma-22'),
  },
  {
    id: 'uls',
    nombre: 'ULS',
    texto: 'Si la centrífuga para por desequilibrio, la pantalla dice qué vaso lo ha causado.',
    cifra: 'Nº',
    unidad: 'del vaso, en pantalla',
    modelos: modelos('consul-22', 'digtor-22', 'dilitcen-22-r', 'magnus-22', 'digtor-22-c', 'digtor-22-col'),
  },
] as const;

/** Lo demás, según el modelo (fichas del catálogo) */
export const ademas = [
  { titulo: 'Reconoce el rotor', texto: 'Lo identifica solo y protege ante exceso de velocidad.' },
  { titulo: 'Tapa segura', texto: 'Cierre motorizado, bloqueo en marcha y apertura de emergencia.' },
  { titulo: 'De −20 a 80 °C', texto: 'En refrigeradas y calefactadas, en pasos de 1 °C.' },
  { titulo: 'Menos de 60 dB', texto: 'Motor de inducción sin escobillas y sin mantenimiento.' },
];
