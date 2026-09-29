import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { familias, type Familia, type Serie, type Temperatura } from '../data/productos';
import './GamaFiltro.css';

type Pestana = 'todas' | Familia;

const pestanas: { clave: Pestana; nombre: string }[] = [
  { clave: 'todas', nombre: 'Todas' },
  ...(Object.keys(familias) as Familia[]).map((clave) => ({ clave, nombre: familias[clave].nombre })),
];

/** Series que se ven en "Todas" antes de pulsar "Ver las 17 series" */
const INICIALES = 6;

const temperaturas: Record<Temperatura, { nombre: string; icono: ReactNode }> = {
  ventilada: {
    nombre: 'Ventilada',
    icono: (
      <>
        <path d="M2 5.5h8.5a2 2 0 1 0-2-2" />
        <path d="M2 8.5h11a2 2 0 1 1-2 2" />
        <path d="M2 11.5h5" />
      </>
    ),
  },
  refrigerada: {
    nombre: 'Refrigerada',
    icono: (
      <>
        <path d="M8 1.5v13M2.4 4.75l11.2 6.5M2.4 11.25l11.2-6.5" />
        <path d="M6.3 2.6 8 4.2l1.7-1.6M6.3 13.4 8 11.8l1.7 1.6" />
      </>
    ),
  },
  calefactada: {
    nombre: 'Calefactada',
    icono: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
      </>
    ),
  },
};

const color = (f: Familia) => ({ '--c': familias[f].color }) as CSSProperties;

interface Props {
  productos: Serie[];
}

export default function GamaFiltro({ productos }: Props) {
  const [pestana, setPestana] = useState<Pestana>('todas');
  const [abierta, setAbierta] = useState(false);
  const fija = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const rejilla = useRef<HTMLDivElement>(null);

  const deLaPestana = productos.filter((p) => pestana === 'todas' || p.familia === pestana);
  const visibles = pestana === 'todas' && !abierta ? deLaPestana.slice(0, INICIALES) : deLaPestana;

  // El bloque negro se desliza hasta la pestaña activa
  useLayoutEffect(() => {
    const colocar = () => {
      const activa = tabs.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!activa || !barra.current) return;
      barra.current.style.transform = `translateX(${activa.offsetLeft}px)`;
      barra.current.style.width = `${activa.offsetWidth}px`;
    };
    colocar();
    void document.fonts?.ready.then(colocar);
    window.addEventListener('resize', colocar);
    return () => window.removeEventListener('resize', colocar);
  }, [pestana]);

  // Sombra bajo los filtros cuando se quedan pegados arriba
  useEffect(() => {
    const el = fija.current;
    if (!el) return;
    const mirar = () =>
      el.classList.toggle('pegada', el.getBoundingClientRect().top <= parseFloat(getComputedStyle(el).top) + 1);
    mirar();
    window.addEventListener('scroll', mirar, { passive: true });
    return () => window.removeEventListener('scroll', mirar);
  }, []);

  // Un enlace a /#serie (desde la lupa, por ejemplo) abre la gama entera y lleva a esa ficha
  useEffect(() => {
    const irA = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      if (!productos.some((p) => p.slug === slug) || document.getElementById(slug)) return;
      setPestana('todas');
      setAbierta(true);
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: 'start' }));
    };
    irA();
    window.addEventListener('hashchange', irA);
    return () => window.removeEventListener('hashchange', irA);
  }, [productos]);

  const elegir = (clave: Pestana, boton: HTMLButtonElement) => {
    setPestana(clave);
    tabs.current?.scrollTo({ left: boton.offsetLeft - 40, behavior: 'smooth' });
    // Si los filtros ya van pegados arriba, se vuelve al principio de las fichas
    const el = fija.current;
    if (el?.classList.contains('pegada') && rejilla.current) {
      const arriba =
        rejilla.current.getBoundingClientRect().top + window.scrollY - el.getBoundingClientRect().bottom - 24;
      window.scrollTo({ top: arriba, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="fija" ref={fija}>
        <div className="tabs" ref={tabs} role="group" aria-label="Filtrar la gama por uso">
          {pestanas.map(({ clave, nombre }) => (
            <button
              key={clave}
              type="button"
              aria-pressed={pestana === clave}
              style={clave === 'todas' ? undefined : color(clave)}
              onClick={(e) => elegir(clave, e.currentTarget)}
            >
              {clave !== 'todas' && <i aria-hidden="true" />}
              {nombre}
            </button>
          ))}
          <span className="barra" ref={barra} aria-hidden="true" />
        </div>
      </div>

      <div
        className={deLaPestana.length === 4 && pestana !== 'todas' ? 'rejilla cuatro' : 'rejilla'}
        ref={rejilla}
        key={pestana}
        aria-live="polite"
      >
        {visibles.map((p, i) => (
          <a
            className="serie"
            id={p.slug}
            key={p.slug}
            href={`#${p.slug}`}
            style={{ ...color(p.familia), '--n': i % INICIALES } as CSSProperties}
          >
            <div className="foto">
              <img
                src={p.imagen.src}
                alt={p.nombre}
                width={p.imagen.ancho}
                height={p.imagen.alto}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="cuerpo">
              <span className="familia">{familias[p.familia].nombre}</span>
              <h3>
                {p.nombre}
                {p.variantes && <span>· {p.variantes}</span>}
              </h3>
              <p className="frase">{p.frase}</p>
              <p className="spec">
                <b>{p.capacidad}</b> · {p.rpm} rpm · {p.xg} xg
              </p>
              <div className="temps">
                {p.temperatura.map((t) => (
                  <span key={t} className={`temp ${t}`}>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      {temperaturas[t].icono}
                    </svg>
                    {temperaturas[t].nombre}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {pestana === 'todas' && !abierta && (
        <div className="mas">
          <button type="button" onClick={() => setAbierta(true)}>
            Ver las {productos.length} series
          </button>
        </div>
      )}
    </>
  );
}
