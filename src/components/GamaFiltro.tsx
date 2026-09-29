import { useLayoutEffect, useRef, useState } from 'react';
import { familias, type Familia, type Serie, type Temperatura } from '../data/productos';
import './GamaFiltro.css';

type Filtro = 'Todas' | Familia;

const temperaturas: { valor: Temperatura; texto: string; resumen: string }[] = [
  { valor: 'refrigerada', texto: 'Refrigeradas', resumen: 'refrigeradas' },
  { valor: 'calefactada', texto: 'Calefactadas', resumen: 'calefactadas' },
];

const nombreTemperatura: Record<Temperatura, string> = {
  ventilada: 'Ventilada',
  refrigerada: 'Refrigerada',
  calefactada: 'Calefactada',
};

interface Props {
  productos: Serie[];
  contacto: string;
}

export default function GamaFiltro({ productos, contacto }: Props) {
  const [familia, setFamilia] = useState<Filtro>('Todas');
  const [temperatura, setTemperatura] = useState<Temperatura | null>(null);
  const pestanas = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  const visibles = productos.filter(
    (p) => (familia === 'Todas' || p.familia === familia) && (!temperatura || p.temperatura.includes(temperatura)),
  );
  const cuenta = (f: Filtro) => (f === 'Todas' ? productos.length : productos.filter((p) => p.familia === f).length);

  // La barra roja se coloca bajo la pestaña activa y se desliza al cambiar
  useLayoutEffect(() => {
    const colocar = () => {
      const activa = pestanas.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!activa || !barra.current) return;
      barra.current.style.transform = `translateX(${activa.offsetLeft}px)`;
      barra.current.style.width = `${activa.offsetWidth}px`;
    };
    colocar();
    void document.fonts?.ready.then(colocar);
    window.addEventListener('resize', colocar);
    return () => window.removeEventListener('resize', colocar);
  }, [familia]);

  const pestana = (f: Filtro) => (
    <button
      key={f}
      type="button"
      aria-pressed={familia === f}
      onClick={(e) => {
        setFamilia(f);
        e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center' });
      }}
    >
      {f}
      <sup>{cuenta(f)}</sup>
    </button>
  );

  const resumen = [
    `${visibles.length} ${visibles.length === 1 ? 'serie' : 'series'}`,
    familia !== 'Todas' && familia,
    temperatura && temperaturas.find((t) => t.valor === temperatura)?.resumen,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <div className="filtros">
        <div className="pestanas" ref={pestanas} role="group" aria-label="Filtrar por familia">
          <div className="grupo">
            <span aria-hidden="true">&nbsp;</span>
            <div>{pestana('Todas')}</div>
          </div>
          <div className="grupo">
            <span>Aplicaciones generales</span>
            <div>{familias.general.map(pestana)}</div>
          </div>
          <div className="grupo especial">
            <span>Especiales</span>
            <div>{familias.especial.map(pestana)}</div>
          </div>
          <span className="barra" ref={barra} aria-hidden="true" />
        </div>
        <div className="temperatura" role="group" aria-label="Filtrar por temperatura">
          {temperaturas.map((t) => (
            <button
              key={t.valor}
              type="button"
              className={t.valor}
              aria-pressed={temperatura === t.valor}
              onClick={() => setTemperatura(temperatura === t.valor ? null : t.valor)}
            >
              <i aria-hidden="true" />
              {t.texto}
            </button>
          ))}
        </div>
      </div>

      <p className="resumen" aria-live="polite">
        {resumen}
      </p>

      <div className="series" key={`${familia}-${temperatura}`}>
        {visibles.map((p, i) => (
          <article className="serie" id={p.slug} key={p.slug} style={{ '--n': i } as React.CSSProperties}>
            <div className="foto">
              <img
                src={p.imagen.src}
                alt={p.nombre}
                width={p.imagen.ancho}
                height={p.imagen.alto}
                loading="lazy"
                decoding="async"
              />
              <span className={p.uso ? 'familia especial' : 'familia'}>{p.familia}</span>
            </div>
            <h3>
              {p.nombre}
              {p.variantes && <span> · {p.variantes}</span>}
            </h3>
            {p.uso && <p className="uso">{p.uso}</p>}
            <dl className="datos">
              <div>
                <dt>capacidad máx.</dt>
                <dd>{p.capacidad}</dd>
              </div>
              <div>
                <dt>rpm</dt>
                <dd>{p.rpm}</dd>
              </div>
              <div>
                <dt>xg</dt>
                <dd>{p.xg}</dd>
              </div>
            </dl>
            <ul className="tipo">
              {p.temperatura.map((t) => (
                <li key={t} className={t}>
                  {nombreTemperatura[t]}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {visibles.length > 0 ? (
          <div className="ayuda">
            <div>
              <b>¿No sabes cuál ofrecer?</b>
              <p>Cuéntanos el laboratorio y los tubos, y te decimos qué modelo encaja. Respondemos en 48 h.</p>
            </div>
            <a className="arrow" href={contacto}>
              Pedir consejo
            </a>
          </div>
        ) : (
          <p className="vacia">Ninguna serie cumple los dos filtros. Prueba a quitar uno.</p>
        )}
      </div>
    </>
  );
}
