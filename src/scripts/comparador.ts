// Comparador del catálogo: "Comparar" en cada centrífuga (hasta 3), una barra abajo con las elegidas y una ventana
// con ellas lado a lado. Los datos los pone la página en un JSON (#datos-comparar). La elección se guarda en la
// sesión, así sigue al volver de una ficha.

interface Comparable {
  nombre: string;
  img: string;
  href: string;
  filas: Record<string, string | undefined>;
  num: Record<string, number | undefined>;
}
interface DatosComparar {
  maquinas: Record<string, Comparable>;
  filas: { k: string; nombre: string }[];
  textos: { quitar: string; maximo: string; verFicha: string; mejor: string };
}

const MAX = 3;
const CLAVE = 'oa-comparar';
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const cruz =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

export function iniciarComparador() {
  const fuente = document.getElementById('datos-comparar');
  const barra = document.getElementById('barra-comparar');
  const dialogo = document.getElementById('comparador') as HTMLDialogElement | null;
  if (!fuente || !barra || !dialogo) return;
  const datos = JSON.parse(fuente.textContent ?? '{}') as DatosComparar;
  const casillas = [...document.querySelectorAll<HTMLInputElement>('.comparar input')];
  const lista = barra.querySelector<HTMLElement>('.elegidas')!;
  const pista = barra.querySelector<HTMLElement>('.pista-otra')!;
  const abrir = barra.querySelector<HTMLButtonElement>('.abrir-comparar')!;
  const tabla = dialogo.querySelector<HTMLElement>('.comp-tabla')!;

  let elegidas: string[] = [];
  try {
    elegidas = (JSON.parse(sessionStorage.getItem(CLAVE) ?? '[]') as string[]).filter((s) => datos.maquinas[s]);
  } catch {
    elegidas = [];
  }
  const guardar = () => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(elegidas));
    } catch {
      /* sin almacenamiento: la comparación dura lo que la página */
    }
  };

  const pintarBarra = () => {
    for (const c of casillas) {
      c.checked = elegidas.includes(c.value);
      c.disabled = !c.checked && elegidas.length >= MAX;
      c.closest('label')!.title = c.disabled ? datos.textos.maximo : '';
    }
    barra.hidden = elegidas.length === 0;
    lista.innerHTML = elegidas
      .map((s) => {
        const m = datos.maquinas[s];
        const quitar = escapar(datos.textos.quitar.replace('{n}', m.nombre));
        return `<li><img src="${m.img}" alt="${escapar(m.nombre)}" width="40" height="40"><span>${escapar(m.nombre)}</span><button type="button" data-quitar="${s}" aria-label="${quitar}" title="${quitar}">${cruz}</button></li>`;
      })
      .join('');
    pista.hidden = elegidas.length >= 2;
    abrir.disabled = elegidas.length < 2;
    abrir.textContent = abrir.dataset.txt!.replace('999', String(elegidas.length));
  };

  const pintarTabla = () => {
    const ms = elegidas.map((s) => [s, datos.maquinas[s]] as const);
    // El mayor de cada fila numérica, si no empatan todas
    const mejor: Record<string, number | undefined> = {};
    for (const k of ['velocidad', 'fuerza', 'rotores']) {
      const vals = ms.map(([, m]) => m.num[k]).filter((v): v is number => typeof v === 'number');
      if (vals.length > 1 && new Set(vals).size > 1) mejor[k] = Math.max(...vals);
    }
    const cab = ms
      .map(([s, m]) => {
        const quitar = escapar(datos.textos.quitar.replace('{n}', m.nombre));
        return `<th scope="col"><span class="comp-maq"><span class="comp-foto"><img src="${m.img}" alt="" width="640" height="640"></span><span class="comp-nombre">${escapar(m.nombre)}</span><button type="button" class="comp-quitar" data-quitar="${s}" aria-label="${quitar}" title="${quitar}">${cruz}</button></span></th>`;
      })
      .join('');
    const filas = datos.filas
      .filter((f) => ms.some(([, m]) => m.filas[f.k]))
      .map((f) => {
        const celdas = ms
          .map(([, m]) => {
            const esMejor = mejor[f.k] !== undefined && m.num[f.k] === mejor[f.k];
            return `<td${esMejor ? ` class="mejor" title="${escapar(datos.textos.mejor)}"` : ''}>${escapar(m.filas[f.k] ?? '—')}</td>`;
          })
          .join('');
        return `<tr><th scope="row">${escapar(f.nombre)}</th>${celdas}</tr>`;
      })
      .join('');
    const pie = ms
      .map(([, m]) => `<td><a class="comp-ver" href="${m.href}">${escapar(datos.textos.verFicha)}</a></td>`)
      .join('');
    tabla.innerHTML = `<table><thead><tr><td></td>${cab}</tr></thead><tbody>${filas}</tbody><tfoot><tr><td></td>${pie}</tr></tfoot></table>`;
  };

  const cambiar = (slug: string, si: boolean) => {
    elegidas = si ? [...new Set([...elegidas, slug])].slice(0, MAX) : elegidas.filter((s) => s !== slug);
    guardar();
    pintarBarra();
    if (dialogo.open) {
      if (elegidas.length < 2) dialogo.close();
      else pintarTabla();
    }
  };

  for (const c of casillas) c.addEventListener('change', () => cambiar(c.value, c.checked));
  const alQuitar = (ev: Event) => {
    const b = (ev.target as HTMLElement).closest<HTMLElement>('[data-quitar]');
    if (b) cambiar(b.dataset.quitar!, false);
  };
  lista.addEventListener('click', alQuitar);
  tabla.addEventListener('click', alQuitar);
  barra.querySelector('.vaciar')!.addEventListener('click', () => {
    elegidas = [];
    guardar();
    pintarBarra();
  });
  abrir.addEventListener('click', () => {
    pintarTabla();
    dialogo.showModal();
  });
  dialogo.querySelector('.cerrar-comp')!.addEventListener('click', () => dialogo.close());
  // Clic fuera de la ventana: se cierra
  dialogo.addEventListener('click', (ev) => {
    if (ev.target === dialogo) dialogo.close();
  });
  dialogo.addEventListener('close', () => abrir.focus());

  // Desde la tabla: comparar las filas elegidas (hasta 3), sustituyendo a lo que hubiera
  document.addEventListener('comparar:abrir', (ev) => {
    const slugs = ((ev as CustomEvent<string[]>).detail ?? []).filter((s) => datos.maquinas[s]).slice(0, MAX);
    if (slugs.length < 2) return;
    elegidas = slugs;
    guardar();
    pintarBarra();
    pintarTabla();
    dialogo.showModal();
  });

  // Si una tarjeta cambia de versión, su casilla pasa a ser la de esa versión
  document.addEventListener('catalogo:version', pintarBarra);

  pintarBarra();
}
