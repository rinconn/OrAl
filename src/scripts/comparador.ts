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
  textos: { quitar: string; maximo: string; verFicha: string; mejor: string; tipo: string; fuente: string };
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
  const boton = document.querySelector<HTMLButtonElement>('.filtros .ver-comparar');

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
    if (boton) {
      boton.querySelector('.vc-n')!.textContent = `${elegidas.length}/${MAX}`;
      boton.classList.toggle('con', elegidas.length > 0);
    }
    // La tabla marca sus casillas con la misma elección: una sola comparación en toda la página
    document.dispatchEvent(new CustomEvent('comparar:cambio', { detail: [...elegidas] }));
  };

  const pintarTabla = () => {
    const ms = elegidas.map((s) => [s, datos.maquinas[s]] as const);
    // El mayor de cada fila numérica, si no empatan todas
    const mejor: Record<string, number | undefined> = {};
    for (const k of ['capacidad', 'velocidad', 'fuerza', 'rotores']) {
      const vals = ms.map(([, m]) => m.num[k]).filter((v): v is number => typeof v === 'number');
      if (vals.length > 1 && new Set(vals).size > 1) mejor[k] = Math.max(...vals);
    }
    const cab = ms
      .map(([s, m]) => {
        const quitar = escapar(datos.textos.quitar.replace('{n}', m.nombre));
        const tipo = [m.filas.aplicacion, m.filas.temperatura]
          .filter(Boolean)
          .map((x) => escapar(x!))
          .join(' · ');
        // data-cols: en el PDF y el Excel, la cabecera de la columna es solo el nombre
        return `<th scope="col" data-cols="${escapar(m.nombre)}"><span class="comp-maq"><span class="comp-foto"><img src="${m.img}" alt="" width="640" height="640"></span><button type="button" class="comp-quitar" data-quitar="${s}" aria-label="${quitar}" title="${quitar}">${cruz}</button><span class="comp-nombre">${escapar(m.nombre)}</span><span class="comp-tipo">${tipo}</span></span></th>`;
      })
      .join('');
    // Aplicación y temperatura van bajo el nombre; sus filas quedan para el PDF y el Excel
    const enCab = ['aplicacion', 'temperatura'];
    const filas = datos.filas
      .filter((f) => ms.some(([, m]) => m.filas[f.k]))
      .map((f) => {
        const celdas = ms
          .map(([, m]) => {
            const esMejor = mejor[f.k] !== undefined && m.num[f.k] === mejor[f.k];
            return `<td${esMejor ? ` class="mejor" title="${escapar(datos.textos.mejor)}"` : ''}>${escapar(m.filas[f.k] ?? '—')}</td>`;
          })
          .join('');
        return `<tr${enCab.includes(f.k) ? ' class="en-cab"' : ''}><th scope="row">${escapar(f.nombre)}</th>${celdas}</tr>`;
      })
      .join('');
    const pie = ms
      .map(([, m]) => `<td><a class="comp-ver" href="${m.href}">${escapar(datos.textos.verFicha)}</a></td>`)
      .join('');
    // La esquina: qué es el documento y de dónde salen los datos, y abajo la leyenda del punto rojo
    const tx = datos.textos;
    const leyenda = Object.keys(mejor).length ? `<span class="comp-leyenda">${escapar(tx.mejor)}</span>` : '';
    const esquina = `<td class="comp-esquina" data-cols="${escapar(tx.tipo)}"><span class="comp-esq"><span><b>${escapar(tx.tipo)}</b><span class="comp-fuente">${escapar(tx.fuente)}</span></span>${leyenda}</span></td>`;
    tabla.innerHTML = `<table style="--n:${ms.length}"><thead><tr>${esquina}${cab}</tr></thead><tbody>${filas}</tbody><tfoot><tr><td></td>${pie}</tr></tfoot></table>`;
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

  // Desde la tabla: sus casillas cambian la elección (sin abrir nada); con más de 3, cuentan las 3 primeras
  document.addEventListener('comparar:poner', (ev) => {
    elegidas = ((ev as CustomEvent<string[]>).detail ?? []).filter((s) => datos.maquinas[s]).slice(0, MAX);
    guardar();
    pintarBarra();
    if (dialogo.open && elegidas.length < 2) dialogo.close();
  });
  document.addEventListener('comparar:pedir', pintarBarra);

  // Botón "Comparar" de los filtros: abre una ventana con todas las centrífugas para marcar hasta 3 y compararlas
  // ahí mismo, sin bajar al catálogo. Empieza con las que ya estuvieran elegidas.
  const eleg = document.getElementById('elegir-comp') as HTMLDialogElement | null;
  if (boton && eleg) {
    const ecLista = eleg.querySelector<HTMLElement>('.ec-lista')!;
    const ecBuscar = eleg.querySelector<HTMLInputElement>('.ec-buscar input')!;
    const ecNinguna = eleg.querySelector<HTMLElement>('.ec-ninguna')!;
    const ecCuenta = eleg.querySelector<HTMLElement>('.ec-cuenta')!;
    const ecComparar = eleg.querySelector<HTMLButtonElement>('.ec-comparar')!;
    const ecHuecos = eleg.querySelector<HTMLElement>('.ec-huecos')!;
    const visto =
      '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';
    ecLista.innerHTML = Object.entries(datos.maquinas)
      .map(([s, m]) => {
        const det = [m.filas.capacidad, m.filas.velocidad]
          .filter(Boolean)
          .map((x) => escapar(x!))
          .join(' · ');
        return `<li><button type="button" data-slug="${s}" aria-pressed="false"><span class="ec-foto"><img src="${m.img}" alt="" width="160" height="160"></span><span class="ec-txt"><b>${escapar(m.nombre)}</b><span class="ec-apl">${escapar(m.filas.aplicacion ?? '')} · ${escapar(m.filas.temperatura ?? '')}</span><span class="ec-det">${det}</span></span><span class="ec-marca">${visto}</span></button></li>`;
      })
      .join('');
    const fichas = [...ecLista.querySelectorAll<HTMLButtonElement>('button')];
    let marcadas: string[] = [];
    const pintarEleg = () => {
      for (const f of fichas) {
        const si = marcadas.includes(f.dataset.slug!);
        f.setAttribute('aria-pressed', String(si));
        f.disabled = !si && marcadas.length >= MAX;
      }
      ecCuenta.textContent = `${marcadas.length}/${MAX}`;
      // Los tres huecos de abajo: la foto de cada elegida, en el orden en que se marcaron
      ecHuecos.innerHTML = Array.from({ length: MAX }, (_, i) => {
        const m = datos.maquinas[marcadas[i]];
        return m ? `<li class="lleno"><img src="${m.img}" alt="" width="44" height="44"></li>` : '<li></li>';
      }).join('');
      ecComparar.disabled = marcadas.length < 2;
      ecComparar.textContent = ecComparar.dataset
        .txt!.replace('999', marcadas.length < 2 ? '' : String(marcadas.length))
        .trim();
    };
    ecLista.addEventListener('click', (ev) => {
      const f = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-slug]');
      if (!f) return;
      const s = f.dataset.slug!;
      marcadas = marcadas.includes(s) ? marcadas.filter((x) => x !== s) : [...marcadas, s].slice(0, MAX);
      pintarEleg();
    });
    const normal = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    ecBuscar.addEventListener('input', () => {
      const q = normal(ecBuscar.value.trim());
      let n = 0;
      for (const f of fichas) {
        const si = !q || normal(f.textContent ?? '').includes(q);
        f.parentElement!.hidden = !si;
        if (si) n++;
      }
      ecNinguna.hidden = n > 0;
    });
    boton.addEventListener('click', () => {
      marcadas = [...elegidas];
      ecBuscar.value = '';
      ecBuscar.dispatchEvent(new Event('input'));
      pintarEleg();
      eleg.showModal();
    });
    ecComparar.addEventListener('click', () => {
      eleg.close();
      elegidas = [...marcadas];
      guardar();
      pintarBarra();
      pintarTabla();
      dialogo.showModal();
    });
    eleg.querySelector('.ec-cerrar')!.addEventListener('click', () => eleg.close());
    eleg.addEventListener('click', (ev) => {
      if (ev.target === eleg) eleg.close();
    });
  }

  // Copiar enlace: la dirección de la página con "?comparar=a,b,c", que al abrirla enseña esta misma comparación
  const compartir = dialogo.querySelector<HTMLButtonElement>('.comp-compartir');
  compartir?.addEventListener('click', async () => {
    const url = new URL(location.href);
    url.searchParams.set('comparar', elegidas.join(','));
    url.hash = '';
    try {
      await navigator.clipboard.writeText(url.href);
    } catch {
      // Sin permiso para el portapapeles (algunos navegadores o marcos): la copia de siempre, con un campo oculto
      const campo = document.createElement('textarea');
      campo.value = url.href;
      campo.setAttribute('readonly', '');
      campo.style.cssText = 'position:fixed;opacity:0';
      dialogo.append(campo);
      campo.select();
      const ok = document.execCommand('copy');
      campo.remove();
      if (!ok) return;
    }
    const txt = compartir.querySelector('span')!;
    const antes = txt.textContent;
    txt.textContent = compartir.dataset.copiado!;
    compartir.classList.add('hecho');
    setTimeout(() => {
      txt.textContent = antes;
      compartir.classList.remove('hecho');
    }, 2000);
  });

  // Añadir al presupuesto: las comparadas pasan a la lista de presupuesto de la página, que se abre
  dialogo.querySelector('.comp-presupuesto')?.addEventListener('click', () => {
    dialogo.close();
    document.dispatchEvent(new CustomEvent('presupuesto:anadir', { detail: [...elegidas] }));
  });

  // Si una tarjeta cambia de versión, su casilla pasa a ser la de esa versión
  document.addEventListener('catalogo:version', pintarBarra);

  pintarBarra();

  // Al llegar con un enlace compartido, se abre esa comparación (y el parámetro sale de la dirección)
  const pedidas = (new URL(location.href).searchParams.get('comparar') ?? '')
    .split(',')
    .filter((s) => datos.maquinas[s])
    .slice(0, MAX);
  if (pedidas.length >= 2) {
    const url = new URL(location.href);
    url.searchParams.delete('comparar');
    history.replaceState(history.state, '', url);
    elegidas = pedidas;
    guardar();
    pintarBarra();
    pintarTabla();
    dialogo.showModal();
  }
}
