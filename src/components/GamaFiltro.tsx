import { useState } from 'react';
import type { Aplicacion, Producto } from '../data/productos';
import './GamaFiltro.css';

type Filtro = 'todas' | Aplicacion;

const filtros: { valor: Filtro; texto: string }[] = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'general', texto: 'Aplicaciones generales' },
  { valor: 'especial', texto: 'Aplicaciones especiales' },
];

export default function GamaFiltro({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const visibles = productos.filter((p) => filtro === 'todas' || p.aplicacion === filtro);

  return (
    <>
      <div className="fam" role="group" aria-label="Filtrar por familia">
        {filtros.map((f) => (
          <button key={f.valor} type="button" aria-pressed={filtro === f.valor} onClick={() => setFiltro(f.valor)}>
            {f.texto}
          </button>
        ))}
      </div>
      <div className="range">
        {visibles.map((p) => (
          <a className="item" href={`#${p.slug}`} id={p.slug} key={p.slug}>
            <div className="shelf">
              {p.imagen && (
                <img src={p.imagen.src} alt={p.nombre} width={p.imagen.ancho} height={p.imagen.alto} loading="lazy" />
              )}
              <em>{p.categoria}</em>
            </div>
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <div className="chips">
              {p.destacados.map((d) => (
                <span key={d}>{d}</span>
              ))}
              {p.tecnologia?.map((t) => (
                <span className="r" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
