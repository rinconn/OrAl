# Orto Alresa · web nueva

Web de Orto Alresa (Álvarez Redondo, S.A.), fabricantes de centrífugas de laboratorio desde 1949.
Hecha con [Astro](https://astro.build) y React para las partes interactivas.

## Abrir en GitHub Codespaces (recomendado en equipos de empresa)

En el repositorio: **Code → Codespaces → Create codespace on main**. Se abre VS Code en el navegador,
instala todo solo y arranca la web; cuando termine, se abre una pestaña con la vista previa.
Si la cierras, está en la pestaña **Ports** (puerto 4321).

## Arrancar en local

Necesitas Node 22 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:4321. Los cambios se ven al guardar.

| Comando           | Qué hace                                          |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Servidor local con recarga automática             |
| `npm run build`   | Revisa tipos y genera la web estática en `dist/`  |
| `npm run preview` | Sirve `dist/` para verla como en producción       |
| `npm run format`  | Da formato a todo el código                       |
| `npm run verify`  | Formato, lint y build: lo mismo que revisa GitHub |

## Cómo trabajamos

Cada mejora llega en una rama con su PR. GitHub comprueba automáticamente formato, errores y que la web compile.
Cuando se acepta la PR, en tu copia local basta con:

```bash
git pull
npm install   # solo si cambiaron dependencias
npm run dev
```

## Documentación

Todo está en [`docs/`](docs/README.md): objetivo y alcance, hoja de ruta, arquitectura y carpetas, marca,
reglas de contenido, antes y después, lo pendiente de la empresa y el registro de decisiones.
Los cambios de cada versión están en el [CHANGELOG](CHANGELOG.md).
