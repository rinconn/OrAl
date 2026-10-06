// Tecnología propia: modelos sacados del Catálogo General 2025 (págs. 28-29, 58 y 60) y de la web actual.
// Los textos, por idioma, en src/i18n/ (`tecnologia`). Inventario completo con fuentes:
// /mnt/project-files/analisis/tecnologia-contenido.md
// Confirmado por la empresa (30-09-2026): 175 rampas; REI solo Digicen 22/22 R y Cyto 22 (la Plasma 22 no);
// la Biocen 22 R no lleva ULS. El catálogo 2025 se equivoca en esos dos últimos puntos.
import { productos } from './productos';

export interface Modelo {
  href: string;
  /** "Digtor 22 C", "C-U", "C-8": se unen con la "y" de cada idioma */
  nombres: string[];
}

/** Enlaza cada modelo con su ficha (/centrifugas/slug/) y le pone su nombre con variantes */
const modelos = (...slugs: string[]): Modelo[] =>
  slugs.map((slug) => {
    const p = productos.find((x) => x.slug === slug);
    if (!p) throw new Error(`Tecnología: no existe la serie "${slug}"`);
    return { href: `/centrifugas/${slug}/`, nombres: [p.nombre, ...(p.variantes?.split(' · ') ?? [])] };
  });

export const rei = {
  nombre: 'REI System',
  video: 'https://www.youtube.com/watch?v=QbAcmM_jnyI',
  modelos: modelos('digicen-22', 'cyto-22'),
};

/** Configurador de 6 pasos: su página aún no existe, de momento el botón se queda en la propia tarjeta */
export const configurador = {
  nombre: 'Configurador',
  href: '#configurador',
  /** Icono de la marca de cada paso, en el orden de las preguntas */
  iconos: ['centrifuge', 'icono-mesa-movil', 'ico-tubos', 'ico-velocidad', 'ico-capacidad', 'rotor-add'],
};

export const smartconnect = {
  nombre: 'SmartConnect',
  /** El panel de la app, el mismo al que lleva "Iniciar sesión" en la web antigua */
  acceso: 'https://ortoalresa-frontend-j56qpltrua-ew.a.run.app/login',
  modelos: modelos('digicen-22', 'cyto-22'),
};
