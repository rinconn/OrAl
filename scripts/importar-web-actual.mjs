// Importa de la web actual (ortoalresa.com, WordPress) todo lo que llevan las fichas de producto, en los tres idiomas:
// descripción, bloques (características, funcionamiento, seguridad…), versiones con código, medidas, peso y consumo,
// rotores compatibles con sus cifras y las configuraciones de tubos de cada rotor. Lo guarda ya limpio (texto, sin
// HTML) en src/data/web-actual.json y baja las fotos de los rotores a public/img/rotores/ en WebP.
//
//   node scripts/importar-web-actual.mjs
//
// Se vuelve a ejecutar cuando la empresa cambie algo en la web actual; el resultado se revisa con git diff.
import { mkdir, writeFile, access } from 'node:fs/promises';
import sharp from 'sharp';

const WP = 'https://wp.ortoalresa.com/wp-json';
const IMG = 'https://ortoalresa.com/imagen_producto';
const PDF = 'https://ortoalresa.com/catalogo_producto';
const idiomas = ['es', 'en', 'fr'];

const json = async (url) => {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    await new Promise((ok) => setTimeout(ok, 800));
  }
  throw new Error(`No se pudo leer ${url}`);
};

// HTML de WordPress → texto. Los párrafos y las líneas ("• …", "– …") quedan como lista de líneas.
const entidades = {
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8217;': '’',
  '&#8216;': '‘',
  '&#8220;': '“',
  '&#8221;': '”',
  '&#8243;': '″',
  '&#8242;': '′',
  '&#038;': '&',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&#215;': '×',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
};
// Primero se quitan las etiquetas y luego se traducen las entidades: así "&lt;40 dB" queda como "<40 dB"
const texto = (html = '') =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(
      /&#?\w+;/g,
      (e) => entidades[e] ?? (e.startsWith('&#') ? String.fromCodePoint(parseInt(e.slice(2), 10)) : e),
    )
    .replace(/\s+/g, ' ')
    .trim();
// Las tablas y los vídeos van aparte; cada elemento de una lista empieza por "• ", para que la ficha también lo pinte
// como lista en la descripción
const lineas = (html = '') =>
  html
    .replace(/<table[\s\S]*?<\/table>|<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<li[^>]*>/gi, '$&• ')
    .replace(/<\/(p|li|h\d)>|<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(texto)
    .filter((l) => l && l !== '•');
/** Las líneas de un bloque, en puntos: "• a" es un punto, "– b" un subpunto del anterior; las demás, un título */
const puntos = (html) => {
  const out = [];
  for (const l of lineas(html)) {
    const t = l.replace(/^[•·]\s*/, '');
    if (/^[–-]\s*/.test(t) && out.length) (out.at(-1).sub ??= []).push(t.replace(/^[–-]\s*/, ''));
    else out.push({ t, punto: /^[•·]/.test(l) || /<li/.test(html) });
  }
  return out;
};

/** Tablas de un bloque (versiones, referencias, accesorios), celda a celda y con sus celdas unidas. La cabecera es el
 * <thead> o, si no lo hay, la primera fila */
const tablas = (html = '') =>
  [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(([t]) => {
    const filas = [...t.matchAll(/<tr[\s\S]*?<\/tr>/gi)]
      .map(([tr]) =>
        [...tr.matchAll(/<t([dh])([^>]*)>([\s\S]*?)<\/t\1>/gi)].map(([, , attrs, c]) => {
          const span = Number(attrs.match(/colspan="(\d+)"/i)?.[1] ?? 1);
          return { t: texto(c.replace(/<br\s*\/?>/gi, ' ')), ...(span > 1 && { span }) };
        }),
      )
      .filter((f) => f.some((c) => c.t));
    const thead = t.match(/<thead[\s\S]*?<\/thead>/i)?.[0];
    const nCab = thead ? (thead.match(/<tr/gi) ?? []).length : 1;
    return { cabecera: filas.slice(0, nCab), filas: filas.slice(nCab) };
  });

/** Fotos de un bloque (la tabla de tamices, la eficacia del destilado); se bajan a public/img/fichas/ en WebP */
const fotos = [];
const imagenes = (html = '') =>
  [...html.matchAll(/<img[^>]*?src="([^"]+)"[^>]*>/gi)].map(([tag, src]) => {
    const nombre = src
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')
      .toLowerCase();
    const foto = { src: `/img/fichas/${nombre}.webp`, alt: texto(tag.match(/alt="([^"]*)"/i)?.[1] ?? '') };
    fotos.push({ src, nombre, foto });
    return foto;
  });

/** Vídeo de YouTube de la descripción, si lo tiene (el del GRS) */
const video = (html = '') => html.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/i)?.[1];

const tipos = ['centrifugas', 'accesorio', 'producto_laboratorio'];
const wp = {};
for (const tipo of tipos) {
  wp[tipo] = {};
  for (const l of idiomas) {
    wp[tipo][l] = await json(`${WP}/wp/v2/${tipo}?per_page=100&lang=${l}&_fields=id,slug,title,acf`);
  }
}
const erp = await json(`${WP}/ank/v1/centrifugaerp`);
const rotoresErp = await json(`${WP}/ank/v1/rotorerp`);

// Cada producto en sus tres idiomas: WPML enlaza las traducciones por "id_asociado" (centrífugas) o por orden
const traducciones = (tipo, clave) =>
  wp[tipo].es.map((es, i) => {
    const otro = (l) => (clave ? wp[tipo][l].find((x) => x.acf[clave] === es.acf[clave]) : wp[tipo][l][i]);
    return { es, en: otro('en'), fr: otro('fr') };
  });

const porIdioma = (trad, f) => Object.fromEntries(idiomas.map((l) => [l, f(trad[l])]));
const bloques = (p) =>
  (p.acf.bloque || []).map((b) => {
    const ts = tablas(b.contenido);
    const fs = imagenes(b.contenido);
    return {
      titulo: texto(b.titulo),
      puntos: puntos(b.contenido),
      ...(ts.length && { tablas: ts }),
      ...(fs.length && { imagenes: fs }),
    };
  });
const textosDe = (p, conNombre = false) =>
  p && {
    ...(conNombre && { nombre: texto(p.title.rendered) }),
    descripcion: lineas(p.acf.descripcion),
    ...(video(p.acf.descripcion) && { video: video(p.acf.descripcion) }),
    bloques: bloques(p),
  };

const numero = (s) => (s == null || s === '' ? undefined : String(s).trim());

// Rotores: cifras y configuraciones de tubos
const rotores = {};
for (const r of rotoresErp) {
  const conf = await json(`${WP}/ank/v1/configuraciones-rotor/${r.id_rotor}`);
  rotores[r.id_rotor] = {
    nombre: r.nombre_rotor,
    tipo: r.tipo_rotor,
    rpm: numero(r.max_velocidad_rpm_rotor),
    xg: numero(r.max_velocidad_rcf_rotor),
    capacidad: numero(r.capacidad_max_rotor),
    radio: numero(r.radio_rotor),
    angulo: numero(r.angulo_rotor),
    tempMin: numero(r.temperatura_min_max_velocidad),
    imagen: r.imagen_rotor,
    tubos: conf.map((c) => ({
      reductor: c.id_reductor === '-' ? undefined : c.id_reductor,
      posiciones: numero(c.num_posiciones),
      tipo: numero(c.tipo_tubo),
      capacidad: numero(c.capacidad_tubo),
      medidas: numero(c.dimensiones_tubo),
    })),
  };
}

// Fotos de los rotores, en WebP a 480 px
await mkdir('public/img/rotores', { recursive: true });
for (const r of Object.values(rotores)) {
  const original = r.imagen;
  const destino = `public/img/rotores/${r.imagen.toLowerCase().replace(/_/g, '-')}.webp`;
  r.imagen = destino.replace('public', '');
  // Las que ya están no se vuelven a bajar
  const yaEsta = await access(destino).then(
    () => true,
    () => false,
  );
  if (yaEsta) continue;
  const res = await fetch(`${IMG}/${original}.avif`);
  if (!res.ok) {
    console.warn('Sin foto:', r.nombre);
    r.imagen = undefined;
    continue;
  }
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destino);
}

const centrifugas = {};
for (const trad of traducciones('centrifugas', 'id_asociado')) {
  const { es } = trad;
  const id = es.acf.id_asociado;
  const e = erp.find((x) => x.id_centrifuga === id);
  const compatibles = await json(`${WP}/ank/v1/rotores-compatibles/${id}`);
  centrifugas[es.slug] = {
    nombre: texto(es.title.rendered),
    temperatura: e?.tipo_centrifuga.toLowerCase(),
    ubicacion: erp.filter((x) => x.id_centrifuga === id).map((x) => x.localizacion_centrifuga.toLowerCase()),
    capacidad: e?.capacidad_max_centrifuga,
    rpm: numero(e?.max_velocidad_rpm_centrifuga),
    xg: numero(e?.max_velocidad_rcf_centrifuga),
    pantalla: es.acf.tipo_de_pantalla,
    pdf: e && {
      es: `${PDF}/${e.catalogo_es_centrifuga}.pdf`,
      en: `${PDF}/${e.catalogo_en_centrifuga}.pdf`,
      fr: `${PDF}/${e.catalogo_fr_centrifuga}.pdf`,
    },
    relacionada: (es.acf.centrifuga_relacionada || [])
      .map((wid) => wp.centrifugas.es.find((x) => x.id === wid)?.slug)
      .filter(Boolean),
    accesorios: (es.acf.accesorios || []).map((wid) => wp.accesorio.es.find((x) => x.id === wid)?.slug).filter(Boolean),
    versiones: (es.acf.versiones?.fila || []).map((v) => ({
      codigo: v.codigo,
      medidas: numero(v.dimensiones),
      peso: numero(v.peso_neto),
      voltaje: numero(v.voltaje),
      frecuencia: numero(v.frecuencia),
      consumo: numero(v.consumo),
      zMax: numero(v.z_max),
      calefaccion: numero(v.calefaccion),
    })),
    rotores: compatibles.map((c) => c.id_rotor).filter((r) => rotores[r]),
    textos: porIdioma(trad, (p) => textosDe(p)),
  };
}

const lab = (tipo) =>
  Object.fromEntries(
    traducciones(tipo).map((trad) => [
      trad.es.slug,
      {
        textos: porIdioma(trad, (p) => textosDe(p, true)),
      },
    ]),
  );

const salida = {
  fuente: 'ortoalresa.com (WordPress de la web actual)',
  fecha: new Date().toISOString().slice(0, 10),
  centrifugas,
  rotores,
  accesorios: lab('accesorio'),
  laboratorio: lab('producto_laboratorio'),
};
// Fotos de los bloques, en WebP a 1400 px como mucho (las que ya están no se vuelven a bajar), con su tamaño
await mkdir('public/img/fichas', { recursive: true });
for (const f of fotos) {
  const destino = `public/img/fichas/${f.nombre}.webp`;
  const yaEsta = await access(destino).then(
    () => true,
    () => false,
  );
  if (!yaEsta) {
    const res = await fetch(f.src);
    if (!res.ok) throw new Error(`No se pudo bajar ${f.src}`);
    await sharp(Buffer.from(await res.arrayBuffer()))
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destino);
  }
  const { width, height } = await sharp(destino).metadata();
  Object.assign(f.foto, { ancho: width, alto: height });
}

await writeFile('src/data/web-actual.json', JSON.stringify(salida, null, 2) + '\n');
console.log(
  `Centrífugas: ${Object.keys(centrifugas).length} · Rotores: ${Object.keys(rotores).length} · Accesorios: ${Object.keys(salida.accesorios).length} · Laboratorio: ${Object.keys(salida.laboratorio).length}`,
);
