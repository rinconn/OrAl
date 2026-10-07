// Lista de presupuesto del catálogo: "+ Presupuesto" en cada centrífuga, que al pulsarlo se vuelve un contador
// "− 1 ud. +" (con 1, el "−" es una papelera y la quita); al añadir, un aviso breve junto al botón fijo de abajo a la
// derecha, que dice cuántas hay y, al abrirlo, la lista con su foto y "Pedir presupuesto", que abre el correo de ventas con los modelos
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
    aviso: string;
  };
}

const CLAVE = 'oa-presupuesto';
const escapar = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const linea = (d: string) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
// Papelera: con 1 unidad, el "−" la quita del presupuesto, y así se ve
const papelera =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const menosIco = linea('M5 12h14');
const masIco = linea('M12 5v14M5 12h14');

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
      paso.innerHTML = `<button type="button" data-paso="-1">${menosIco}</button><output></output><button type="button" data-paso="1">${linea('M12 5v14M5 12h14')}</button>`;
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
      menos.innerHTML = n > 1 ? menosIco : papelera;
      menos.classList.toggle('borrar', n === 1);
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
        // Con 1 unidad, el "−" es la papelera que la quita (como en la tarjeta)
        const menos =
          n > 1
            ? `<button type="button" data-menos="${s}" aria-label="${escapar(datos.textos.menos)}: ${escapar(m.nombre)}">${menosIco}</button>`
            : `<button type="button" class="borrar" data-quitar="${s}" aria-label="${quitar}" title="${quitar}">${papelera}</button>`;
        return `<li><img src="${m.img}" alt="" width="44" height="44"><span>${escapar(m.nombre)}</span><span class="pres-cant">${menos}<output>${n}</output><button type="button" data-mas="${s}" aria-label="${escapar(datos.textos.mas)}: ${escapar(m.nombre)}">${masIco}</button></span></li>`;
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

  // Al añadir, un aviso breve encima del botón de abajo: "Añadido al presupuesto: Minicen"
  const aviso = document.createElement('p');
  aviso.className = 'pres-aviso';
  aviso.setAttribute('role', 'status');
  caja.prepend(aviso);
  let quitarAviso = 0;
  const avisar = (nombre: string) => {
    aviso.textContent = `${datos.textos.aviso}: ${nombre}`;
    aviso.classList.add('visto');
    clearTimeout(quitarAviso);
    quitarAviso = window.setTimeout(() => aviso.classList.remove('visto'), 1800);
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
      if (!abierto()) avisar(datos.maquinas[b.dataset.slug!]?.nombre ?? '');
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
    // Unidades: de 1 en 1 (con 1, en su sitio está la papelera, que va por data-quitar)
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
