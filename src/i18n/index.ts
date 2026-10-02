// Idiomas de la web. El español va en la raíz (/) y los demás con su prefijo (/en/, /fr/).
// Los textos de cada idioma están en su archivo (es.ts, en.ts, fr.ts), con la misma forma: si a uno
// le falta un texto, `npm run check` avisa.
import { es, type Textos, type TextoSerie } from './es';
import { en } from './en';
import { fr } from './fr';

export type Idioma = 'es' | 'en' | 'fr';

export const idiomas: { codigo: Idioma; nombre: string }[] = [
  { codigo: 'es', nombre: 'Español' },
  { codigo: 'en', nombre: 'English' },
  { codigo: 'fr', nombre: 'Français' },
];

const todos: Record<Idioma, Textos> = { es, en, fr };

/** Idioma de la página que se está generando (Astro lo saca de la dirección) */
export const idioma = (locale: string | undefined): Idioma => (locale === 'en' || locale === 'fr' ? locale : 'es');

export const textos = (lang: Idioma): Textos => todos[lang];

/** Pone el prefijo del idioma a un enlace interno: "/centrifugas/" → "/en/centrifugas/" */
export const ruta = (lang: Idioma, href: string): string =>
  lang === 'es' || !href.startsWith('/') ? href : `/${lang}${href}`;

/** Quita el prefijo del idioma: "/en/centrifugas/" → "/centrifugas/" */
export const sinIdioma = (path: string): string => path.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';

/** Cifras del catálogo ("15.000") con el separador de miles de cada idioma */
export const numero = (lang: Idioma, n: string): string =>
  lang === 'en' ? n.replace(/\./g, ',') : lang === 'fr' ? n.replace(/\./g, ' ') : n;

/** "A", "B" y "C" → "A, B y C" (o "and", "et") */
export const unir = (lang: Idioma, partes: string[]): string =>
  partes.length > 1 ? `${partes.slice(0, -1).join(', ')} ${textos(lang).y} ${partes.at(-1)}` : (partes[0] ?? '');

/** Textos de una serie del catálogo en ese idioma */
export const textoSerie = (lang: Idioma, slug: string): TextoSerie => {
  const t = (textos(lang).series as Record<string, TextoSerie>)[slug];
  if (!t) throw new Error(`i18n: falta el texto de la serie "${slug}" en ${lang}`);
  return t;
};
