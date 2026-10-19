// Documentos de la página de Descargas: el catálogo en PDF de cada serie de centrífugas (en español e inglés, el
// mismo que enlaza su ficha), el de cada equipo de laboratorio que lo tiene y los documentos de empresa (catálogos
// generales, certificados, servicio técnico y condiciones, de src/data/documentos.json). Fecha y peso de cada archivo, de
// src/data/descargas.json (scripts/importar-descargas.mjs). Los nombres de grupo y los textos, en src/i18n/.

import archivos from './descargas.json';
import empresa from './documentos.json';
import { modelos, productos, type Familia } from './productos';
import { equipos } from './laboratorio';
import { fichaCentrifuga } from './fichas';

export type Grupo = Familia | 'laboratorio';
export type IdiomaPdf = 'es' | 'en';

export interface Archivo {
  url: string;
  /** Día de la última subida del archivo a ortoalresa.com, "2026-06-10" */
  fecha: string;
  bytes: number;
}

export interface Documento {
  /** La serie o el equipo: sirve para el enlace a su ficha y para la foto */
  slug: string;
  /** Serie del catálogo (para su nombre y frase en src/i18n/) o equipo de laboratorio */
  tipo: 'serie' | 'lab';
  nombre: string;
  /** Versiones que cubre el mismo PDF: "22 R", "C-U · C-8" */
  variantes?: string;
  grupo: Grupo;
  imagen: { src: string; ancho: number; alto: number };
  pdf: Partial<Record<IdiomaPdf, Archivo>>;
  /** La más reciente de sus versiones en PDF */
  fecha: string;
}

const datos = archivos.archivos as Record<string, { fecha: string; bytes: number }>;
const archivo = (url?: string): Archivo | undefined => (url && datos[url] ? { url, ...datos[url] } : undefined);
const masReciente = (pdf: Documento['pdf']) =>
  Object.values(pdf)
    .map((a) => a.fecha)
    .sort()
    .at(-1) ?? '';

const series: Documento[] = productos.flatMap((p) => {
  const ficha = modelos
    .filter((m) => m.serie === p.slug)
    .map((m) => fichaCentrifuga(m.slug)?.pdf)
    .find(Boolean);
  if (!ficha) return [];
  const pdf = { es: archivo(ficha.es), en: archivo(ficha.en) };
  const limpio = Object.fromEntries(Object.entries(pdf).filter(([, a]) => a)) as Documento['pdf'];
  if (!Object.keys(limpio).length) return [];
  return [
    {
      slug: p.slug,
      tipo: 'serie' as const,
      nombre: p.nombre,
      variantes: p.variantes,
      grupo: p.familia,
      imagen: p.imagen,
      pdf: limpio,
      fecha: masReciente(limpio),
    },
  ];
});

// Las fichas de laboratorio de la web actual solo tienen el PDF en español
const laboratorio: Documento[] = equipos.flatMap((e) => {
  const es = archivo(e.pdf);
  if (!es) return [];
  return [
    {
      slug: e.slug,
      tipo: 'lab' as const,
      nombre: e.slug,
      grupo: 'laboratorio' as const,
      imagen: e.imagen,
      pdf: { es },
      fecha: es.fecha,
    },
  ];
});

export const documentos: Documento[] = [...series, ...laboratorio];

export type TipoGeneral = 'catalogo' | 'certificado' | 'servicio' | 'condiciones';
export interface General {
  /** Para su nombre y frase en src/i18n/ */
  id: string;
  tipo: TipoGeneral;
  pdf: Partial<Record<IdiomaPdf, Archivo>>;
  fecha: string;
}

/** Catálogos generales, certificados, documentos del servicio técnico y condiciones, tal como los publica la web */
export const generales: General[] = (empresa.documentos as { id: string; tipo: TipoGeneral; es: string; en?: string }[])
  .map((g) => {
    const pdf = Object.fromEntries(
      Object.entries({ es: archivo(g.es), en: archivo(g.en) }).filter(([, a]) => a),
    ) as General['pdf'];
    return { id: g.id, tipo: g.tipo, pdf, fecha: masReciente(pdf) };
  })
  .filter((g) => Object.keys(g.pdf).length);

/** Día en que se comprobaron las fechas de los archivos */
export const comprobado = archivos.fecha;

/** Lo subido en el último año antes de esa comprobación cuenta como reciente */
const limite = new Date(comprobado);
limite.setFullYear(limite.getFullYear() - 1);
export const esReciente = (d: Documento) => d.fecha >= limite.toISOString().slice(0, 10);

/** "1,4 MB" con el separador decimal de cada idioma */
export const peso = (bytes: number, lang: string) =>
  `${(bytes / 1_048_576).toLocaleString(lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MB`;
