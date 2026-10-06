// Catálogo de Productos: filtros (texto, temperatura y aplicación) que reordenan las máquinas con una animación suave,
// panel de filtros que sube desde abajo en móvil y comparador de 2 o 3 centrífugas. Sin JS se ve el catálogo entero.

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
const ease = 'cubic-bezier(0.2, 0.6, 0.2, 1)';
const plano = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const cruz =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

export function iniciarCatalogo() {
  const catalogo = document.getElementById('catalogo');
  const barra = document.getElementById('filtros');
  const cont = document.getElementById('capitulos');
  if (!catalogo || !barra || !cont) return;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  catalogo.classList.add('con-js');
  barra.hidden = false;

  // ——— Fotos: aparecen suaves al terminar de cargar ———
  for (const img of catalogo.querySelectorAll<HTMLImageElement>('.maquina img')) {
    const listo = () => img.classList.add('cargada');
    if (img.complete) listo();
    else {
      img.addEventListener('load', listo, { once: true });
      img.addEventListener('error', listo, { once: true });
    }
  }

  // ——— Filtros ———
  const form = barra.querySelector('form')!;
  const q = form.querySelector<HTMLInputElement>('input[name=q]')!;
  const temps = [...form.querySelectorAll<HTMLButtonElement>('.temp')];
  const cats = [...form.querySelectorAll<HTMLButtonElement>('.cat')];
  const aplic = form.querySelector<HTMLElement>('.aplic')!;
  const aplicBtn = form.querySelector<HTMLButtonElement>('.aplic-btn')!;
  const aplicTxt = form.querySelector<HTMLElement>('.aplic-txt')!;
  const totalEl = form.querySelector<HTMLElement>('.total')!;
  const quitar = [...document.querySelectorAll<HTMLButtonElement>('.limpiar')];
  const verRes = form.querySelector<HTMLButtonElement>('.ver-res')!;
  const cuenta = form.querySelector<HTMLElement>('.abrir-panel .cuenta')!;
  const fichas = [...cont.querySelectorAll<HTMLElement>('.ficha')];
  const caps = [...cont.querySelectorAll<HTMLElement>('.capitulo')].map((el) => ({
    el,
    cab: el.querySelector<HTMLElement>('.cap-cab')!,
    cuenta: el.querySelector<HTMLElement>('.cap-cuenta')!,
    fichas: [...el.querySelectorAll<HTMLElement>('.ficha')],
  }));
  const vacio = cont.querySelector<HTMLElement>('.vacio')!;
  const resultados = (n: number) =>
    n === 1 ? totalEl.dataset.uno! : totalEl.dataset.varios!.replace('999', String(n));
  const modelosTxt = (n: number) => (n === 1 ? cont.dataset.modelo! : cont.dataset.modelos!.replace('999', String(n)));

  let cat = '';
  const elegidas = new Set<string>();
  const cumple = (el: HTMLElement, c = cat, ts: Set<string> = elegidas) => {
    if (c && el.dataset.cat !== c) return false;
    if (ts.size && !ts.has(el.dataset.t ?? '')) return false;
    const texto = plano(q.value);
    return !texto || texto.split(/\s+/).every((p) => (el.dataset.texto ?? '').includes(p));
  };

  // Reordenar con animación: cada máquina que se queda se desliza a su sitio nuevo y las que entran aparecen
  const aplicar = (animar = true) => {
    const anima = animar && !reducido;
    const antes = new Map<HTMLElement, DOMRect>();
    if (anima) {
      for (const el of [...fichas, ...caps.map((c) => c.cab)]) {
        if (el.offsetParent) antes.set(el, el.getBoundingClientRect());
      }
    }

    let total = 0;
    for (const el of fichas) {
      const ver = cumple(el);
      el.hidden = !ver;
      if (ver) {
        total++;
        // Al filtrar, las que quedan ya no esperan a la entrada al bajar
        if (animar) el.classList.add('visto');
      }
    }
    for (const c of caps) {
      const n = c.fichas.filter((el) => !el.hidden).length;
      c.el.hidden = n === 0;
      c.cuenta.textContent = modelosTxt(n);
    }
    vacio.hidden = total > 0;

    // Cuántas quedarían con cada aplicación y con cada temperatura
    for (const b of cats) {
      const c = b.dataset.c ?? '';
      const n = fichas.filter((el) => cumple(el, c)).length;
      b.setAttribute('aria-pressed', String(c === cat));
      b.disabled = c !== cat && n === 0;
      b.querySelector('.n')!.textContent = String(n);
    }
    for (const b of temps) {
      const v = b.dataset.v!;
      const activa = elegidas.has(v);
      b.setAttribute('aria-pressed', String(activa));
      b.disabled = !activa && fichas.filter((el) => cumple(el, cat, new Set([v]))).length === 0;
    }
    const elegida = cats.find((b) => b.dataset.c === cat);
    aplicTxt.textContent = elegida?.dataset.nombre ?? '';
    aplic.classList.toggle('elegida', !!cat);
    const nFiltros = (cat ? 1 : 0) + elegidas.size;
    const hay = nFiltros > 0 || !!q.value.trim();
    for (const b of quitar) if (b.classList.contains('quitar')) b.hidden = !hay;
    totalEl.textContent = resultados(total);
    verRes.textContent = total === 1 ? verRes.dataset.uno! : verRes.dataset.ver!.replace('999', String(total));
    cuenta.hidden = nFiltros === 0;
    cuenta.textContent = String(nFiltros);

    // La búsqueda queda en la dirección para poder compartirla
    const url = new URL(location.href);
    const poner = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    poner('c', cat);
    poner('t', [...elegidas].join(','));
    poner('q', q.value.trim());
    history.replaceState(history.state, '', url);

    if (!anima) return;
    let i = 0;
    for (const el of [...fichas, ...caps.map((c) => c.cab)]) {
      if (!el.offsetParent) continue;
      const a = antes.get(el);
      const b = el.getBoundingClientRect();
      const dx = a ? a.left - b.left : 0;
      const dy = a ? a.top - b.top : 0;
      if (a && Math.abs(dy) < window.innerHeight * 0.8) {
        if (dx || dy)
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
            duration: 520,
            easing: ease,
          });
      } else {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 460,
            delay: Math.min(i++, 8) * 35,
            easing: ease,
            fill: 'backwards',
          },
        );
      }
    }
  };

  // Tras cambiar un filtro, si se está más abajo, el catálogo vuelve a su principio
  const arriba = () => {
    const y = cont.getBoundingClientRect().top + window.scrollY - barra.offsetHeight - 90;
    if (window.scrollY > y + 10) window.scrollTo({ top: y, behavior: reducido ? 'auto' : 'smooth' });
  };

  // Estado inicial desde la dirección; si se llega a una máquina concreta (lupa, Tecnología), se ve todo y se enciende
  const url = new URL(location.href);
  const destino = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  if (!destino?.classList.contains('ficha')) {
    cat = url.searchParams.get('c') ?? '';
    if (!cats.some((b) => b.dataset.c === cat)) cat = '';
    for (const v of url.searchParams.get('t')?.split(',') ?? [])
      if (temps.some((b) => b.dataset.v === v)) elegidas.add(v);
    q.value = url.searchParams.get('q') ?? '';
  } else {
    const m = destino.querySelector('.maquina');
    m?.classList.add('marcada');
    setTimeout(() => m?.classList.remove('marcada'), 2600);
  }
  aplicar(false);

  // Aplicación: lista desplegable
  const cerrarMenu = (foco = false) => {
    aplic.classList.remove('abierta');
    aplicBtn.setAttribute('aria-expanded', 'false');
    if (foco) aplicBtn.focus();
  };
  aplicBtn.addEventListener('click', () => {
    const abrir = !aplic.classList.contains('abierta');
    aplic.classList.toggle('abierta', abrir);
    aplicBtn.setAttribute('aria-expanded', String(abrir));
    if (abrir) form.querySelector<HTMLButtonElement>('.cat[aria-pressed="true"]')?.focus();
  });
  document.addEventListener('click', (ev) => {
    if (aplic.classList.contains('abierta') && !aplic.contains(ev.target as Node)) cerrarMenu();
  });
  aplic.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && aplic.classList.contains('abierta')) {
      ev.stopPropagation();
      cerrarMenu(true);
    }
    // Flechas para moverse por la lista
    if ((ev.key === 'ArrowDown' || ev.key === 'ArrowUp') && aplic.classList.contains('abierta')) {
      ev.preventDefault();
      const activos = cats.filter((b) => !b.disabled);
      const i = activos.indexOf(document.activeElement as HTMLButtonElement);
      const j = ev.key === 'ArrowDown' ? Math.min(i + 1, activos.length - 1) : Math.max(i - 1, 0);
      activos[j]?.focus();
    }
  });
  const enPanel = () => matchMedia('(max-width: 900px)').matches;
  for (const b of cats) {
    b.addEventListener('click', () => {
      cat = b.dataset.c ?? '';
      aplicar();
      if (!enPanel()) {
        cerrarMenu(true);
        arriba();
      }
    });
  }
  for (const b of temps) {
    b.addEventListener('click', () => {
      const v = b.dataset.v!;
      if (elegidas.has(v)) elegidas.delete(v);
      else elegidas.add(v);
      aplicar();
      if (!enPanel()) arriba();
    });
  }
  let espera = 0;
  q.addEventListener('input', () => {
    clearTimeout(espera);
    espera = window.setTimeout(() => aplicar(), 140);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    q.blur();
    arriba();
  });
  for (const b of quitar) {
    b.addEventListener('click', () => {
      cat = '';
      elegidas.clear();
      q.value = '';
      aplicar();
      if (!enPanel()) arriba();
    });
  }

  // ——— Móvil: panel de filtros que sube desde abajo ———
  const panel = form.querySelector<HTMLElement>('.panel')!;
  const abrirPanel = form.querySelector<HTMLButtonElement>('.abrir-panel')!;
  const velo = catalogo.querySelector<HTMLElement>('.velo')!;
  const cerrarPanel = () => {
    if (!panel.classList.contains('abierto')) return;
    panel.classList.remove('abierto');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    velo.hidden = true;
    abrirPanel.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('panel-abierto');
    abrirPanel.focus();
    arriba();
  };
  abrirPanel.addEventListener('click', () => {
    panel.classList.add('abierto');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    velo.hidden = false;
    abrirPanel.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.classList.add('panel-abierto');
    panel.querySelector<HTMLButtonElement>('.cerrar-panel')!.focus();
  });
  velo.addEventListener('click', cerrarPanel);
  panel.querySelector('.cerrar-panel')!.addEventListener('click', cerrarPanel);
  verRes.addEventListener('click', cerrarPanel);
  panel.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') cerrarPanel();
    // El foco no se escapa del panel mientras está abierto
    if (ev.key === 'Tab' && panel.classList.contains('abierto')) {
      const foco = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled)')].filter((x) => x.offsetParent);
      const [primero, ultimo] = [foco[0], foco[foco.length - 1]];
      if (ev.shiftKey && document.activeElement === primero) {
        ev.preventDefault();
        ultimo.focus();
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault();
        primero.focus();
      }
    }
  });
  matchMedia('(max-width: 900px)').addEventListener('change', (e) => !e.matches && cerrarPanel());

  // La barra marca su borde cuando se queda pegada arriba
  let pidiendo = false;
  const pegada = () => {
    pidiendo = false;
    const top = parseFloat(getComputedStyle(barra).top) || 0;
    barra.classList.toggle('pegada', barra.getBoundingClientRect().top <= top + 1 && window.scrollY > 0);
  };
  addEventListener(
    'scroll',
    () => {
      if (!pidiendo) {
        pidiendo = true;
        requestAnimationFrame(pegada);
      }
    },
    { passive: true },
  );
  pegada();

  // ——— Entrada al bajar: las máquinas suben un poco y aparecen, escalonadas ———
  if (!reducido && 'IntersectionObserver' in window) {
    cont.classList.add('revela');
    const io = new IntersectionObserver(
      (entradas) => {
        entradas
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement;
            el.style.setProperty('--d', `${i * 80}ms`);
            el.classList.add('visto');
            io.unobserve(el);
          });
      },
      { rootMargin: '0px 0px -6% 0px' },
    );
    for (const el of fichas) io.observe(el);
  }

  iniciarComparador();
}

// ——— Comparador ———
function iniciarComparador() {
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

  pintarBarra();
}
