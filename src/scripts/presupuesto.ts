// Lista de presupuesto del catálogo: "+ Presupuesto" en cada centrífuga, que al pulsarlo se vuelve un contador
// "− 1 ud. +" (con 1, el "−" la quita), un botón fijo abajo a la derecha con cuántas hay y, al abrirlo, la lista con su foto y "Pedir presupuesto", que abre el correo de ventas con los modelos
// ya escritos y cuántas unidades de cada uno. La lista se guarda en el navegador, así sigue al volver otro día.

interface DatosPresupuesto {
  maquinas: Record<string, { nombre: string; img: string }>;
  correo: string;
  textos: {
    quitar: string;
    asunto: string;
    cuerpo: string;
    boton: string;
    anadir: string;
    quitarDeLista: string;
    corto: string;
    ud: string;
    menos: string;
    mas: string;
  };
}

const CLAVE = 'oa-presupuesto';
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const linea = (d: string) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const cruz =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

export function iniciarPresupuesto() {
  const fuente = document.getElementById('datos-presupuesto');
  const caja = document.getElementById('presupuesto');
  if (!fuente || !caja) return;
  const datos = JSON.parse(fuente.textContent ?? '{}') as DatosPresupuesto;
  const botones = [...document.querySelectorAll<HTMLButtonElement>('.anadir')];
  const abrir = caja.querySelector<HTMLButtonElement>('.pres-abrir')!;
  const lista = caja.querySelector<HTMLElement>('.pres-lista')!;
  const pedir = caja.querySelector<HTMLAnchorElement>('.pres-pedir')!;
  // Junto a cada "+ Presupuesto", su contador de unidades, oculto hasta que se añade
  const pasos = new Map(
    botones.map((b) => {
      const paso = document.createElement('span');
      paso.className = 'paso';
      paso.hidden = true;
      paso.innerHTML = `<button type="button" data-paso="-1">${linea('M5 12h14')}</button><output></output><button type="button" data-paso="1">${linea('M12 5v14M5 12h14')}</button>`;
      b.after(paso);
      return [b, paso];
    }),
  );

  // Lo elegido, en orden, con cuántas unidades de cada uno (antes se guardaba solo la lista de modelos)
  let elegidas: string[] = [];
  const unidades = new Map<string, number>();
  try {
    for (const x of JSON.parse(localStorage.getItem(CLAVE) ?? '[]') as (string | [string, number])[]) {
      const [s, n] = typeof x === 'string' ? [x, 1] : x;
      if (datos.maquinas[s]) {
        elegidas.push(s);
        unidades.set(s, Math.max(1, n));
      }
    }
  } catch {
    elegidas = [];
  }
  const guardar = () => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(elegidas.map((s) => [s, unidades.get(s) ?? 1])));
    } catch {
      /* sin almacenamiento: la lista dura lo que la página */
    }
  };

  const abierto = () => abrir.getAttribute('aria-expanded') === 'true';
  const mostrar = (si: boolean) => abrir.setAttribute('aria-expanded', String(si));

  const pintar = () => {
    for (const b of botones) {
      const s = b.dataset.slug!;
      const nombre = escapar(datos.maquinas[s]?.nombre ?? '');
      const n = unidades.get(s) ?? 1;
      const on = elegidas.includes(s);
      const paso = pasos.get(b)!;
      b.hidden = on;
      paso.hidden = !on;
      b.setAttribute('aria-label', `${datos.textos.anadir}: ${nombre}`);
      paso.querySelector('output')!.innerHTML = `<b>${n}</b> ${escapar(datos.textos.ud)}`;
      const [menos, mas] = paso.querySelectorAll('button');
      menos.setAttribute('aria-label', `${n > 1 ? datos.textos.menos : datos.textos.quitarDeLista}: ${nombre}`);
      mas.setAttribute('aria-label', `${datos.textos.mas}: ${nombre}`);
    }
    caja.hidden = elegidas.length === 0;
    if (!elegidas.length) mostrar(false);
    abrir.querySelector('.n')!.textContent = datos.textos.boton.replace('999', String(elegidas.length));
    lista.innerHTML = elegidas
      .map((s) => {
        const m = datos.maquinas[s];
        const quitar = escapar(datos.textos.quitar.replace('{n}', m.nombre));
        const n = unidades.get(s) ?? 1;
        return `<li><img src="${m.img}" alt="" width="44" height="44"><span>${escapar(m.nombre)}</span><span class="pres-cant"><button type="button" data-menos="${s}" aria-label="${escapar(datos.textos.menos)}: ${escapar(m.nombre)}">−</button><output>${n}</output><button type="button" data-mas="${s}" aria-label="${escapar(datos.textos.mas)}: ${escapar(m.nombre)}">+</button></span><button type="button" data-quitar="${s}" aria-label="${quitar}" title="${quitar}">${cruz}</button></li>`;
      })
      .join('');
    const cuerpo = `${datos.textos.cuerpo}\n\n${elegidas.map((s) => `- ${unidades.get(s) ?? 1} × ${datos.maquinas[s].nombre}`).join('\n')}\n`;
    pedir.href = `mailto:${datos.correo}?subject=${encodeURIComponent(datos.textos.asunto)}&body=${encodeURIComponent(cuerpo)}`;
  };

  const cambiar = (slug: string, si: boolean) => {
    elegidas = si ? [...new Set([...elegidas, slug])] : elegidas.filter((s) => s !== slug);
    if (si && !unidades.has(slug)) unidades.set(slug, 1);
    if (!si) unidades.delete(slug);
    guardar();
    pintar();
  };

  // Al añadir o sumar, el botón de abajo da un pequeño salto para que se vea dónde ha ido
  const saltar = () => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      abrir.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], {
        duration: 360,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
  };
  for (const [b, paso] of pasos) {
    b.addEventListener('click', () => {
      cambiar(b.dataset.slug!, true);
      saltar();
      paso.querySelector<HTMLElement>('[data-paso="1"]')!.focus();
    });
    paso.addEventListener('click', (ev) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-paso]');
      if (!el) return;
      const s = b.dataset.slug!;
      const n = (unidades.get(s) ?? 1) + Number(el.dataset.paso);
      // Con 1, el "−" la quita del presupuesto y vuelve "+ Presupuesto"
      if (n < 1) {
        cambiar(s, false);
        b.focus();
        return;
      }
      unidades.set(s, Math.min(99, n));
      guardar();
      pintar();
      if (n > 1 && el.dataset.paso === '1') saltar();
    });
  }
  lista.addEventListener('click', (ev) => {
    const el = ev.target as HTMLElement;
    const b = el.closest<HTMLElement>('[data-quitar]');
    if (b) return cambiar(b.dataset.quitar!, false);
    // Unidades: de 1 en 1; con 1, el "−" no baja de ahí (para quitar está el aspa)
    const mas = el.closest<HTMLElement>('[data-mas]');
    const menos = el.closest<HTMLElement>('[data-menos]');
    const s = mas?.dataset.mas ?? menos?.dataset.menos;
    if (!s) return;
    unidades.set(s, Math.max(1, Math.min(99, (unidades.get(s) ?? 1) + (mas ? 1 : -1))));
    guardar();
    pintar();
    caja.querySelector<HTMLElement>(`[data-${mas ? 'mas' : 'menos'}="${s}"]`)?.focus();
  });
  abrir.addEventListener('click', () => mostrar(!abierto()));
  caja.querySelector('.pres-cerrar')!.addEventListener('click', () => {
    mostrar(false);
    abrir.focus();
  });
  caja.querySelector('.pres-vaciar')!.addEventListener('click', () => {
    elegidas = [];
    unidades.clear();
    guardar();
    pintar();
  });
  // Si una tarjeta cambia de versión, su botón pasa a hablar de esa versión
  document.addEventListener('catalogo:version', pintar);
  document.addEventListener('click', (ev) => {
    // composedPath: el botón pulsado puede haberse redibujado ya (− y +), y entonces ya no está "dentro" de la caja
    if (abierto() && !ev.composedPath().includes(caja)) mostrar(false);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && abierto()) {
      mostrar(false);
      abrir.focus();
    }
  });

  pintar();
}
