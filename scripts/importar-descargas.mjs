// Fecha y peso de cada PDF que enseña la página de Descargas, tal como los sirve ortoalresa.com: la fecha es la de la
// última subida del archivo (cabecera Last-Modified) y el peso, el del archivo (Content-Length). Con eso la página
// separa lo actualizado hace poco de lo anterior, sin poner fechas a mano. Lo guarda en src/data/descargas.json.
//
//   node scripts/importar-descargas.mjs
//
// Se vuelve a ejecutar cuando la empresa suba catálogos nuevos; el resultado se revisa con git diff.
import { readFile, writeFile } from 'node:fs/promises';

const web = JSON.parse(await readFile(new URL('../src/data/web-actual.json', import.meta.url), 'utf8'));
const lab = await readFile(new URL('../src/data/laboratorio.ts', import.meta.url), 'utf8');

const urls = new Set();
for (const c of Object.values(web.centrifugas)) for (const u of Object.values(c.pdf ?? {})) urls.add(u);
for (const [, u] of lab.matchAll(/pdf: '([^']+)'/g)) urls.add(u);

const archivos = {};
for (const url of [...urls].sort()) {
  const r = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  const fecha = r.headers.get('last-modified');
  const bytes = Number(r.headers.get('content-length'));
  if (!r.ok || !fecha || !bytes) {
    console.error(`Sin datos: ${url} (${r.status})`);
    process.exitCode = 1;
    continue;
  }
  archivos[url] = { fecha: new Date(fecha).toISOString().slice(0, 10), bytes };
  console.log(archivos[url].fecha, String(bytes).padStart(8), url.split('/').at(-1));
}

const hoy = new Date().toISOString().slice(0, 10);
await writeFile(
  new URL('../src/data/descargas.json', import.meta.url),
  JSON.stringify({ fuente: 'ortoalresa.com (cabeceras de cada PDF)', fecha: hoy, archivos }, null, 2) + '\n',
);
