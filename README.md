# Orto Alresa · web nueva

Web de Orto Alresa (Álvarez Redondo, S.A.), fabricantes de centrífugas de laboratorio desde 1949.
Hecha con [Astro](https://astro.build) y React para las partes interactivas.

## Arrancar en local

Necesitas Node 22 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:4321. Los cambios se ven al guardar.

| Comando           | Qué hace                                        |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Servidor local con recarga automática           |
| `npm run build`   | Revisa tipos y genera la web estática en `dist/` |
| `npm run preview` | Sirve `dist/` para verla como en producción     |

## Estructura

```
src/
  pages/index.astro        Portada
  layouts/Base.astro       Cabecera, pie, pestaña roja lateral y botón "antes y después"
  components/              Una sección por archivo (Hero, Cifras, Gama, Tecnologia...)
  components/GamaFiltro.tsx  Filtro de la gama (React, se carga solo al verse)
  data/productos.ts        Datos de cada centrífuga
  styles/global.css        Colores, tipografía y utilidades de marca
public/
  fonts/                   Helvetica Neue Condensed (marca)
  img/                     Productos, fotos y logos, optimizados para web
```

## Marca

Los colores, la tipografía y los patrones salen del sistema de diseño de Orto Alresa
(rojo `#DD040A`, grises en porcentaje de negro, Helvetica Neue Condensed ligera y negrita,
titulares en dos pesos y enlaces con `»`). Se usan como base y se modernizan donde mejora el resultado.

El botón **Ver antes y después** muestra en cada sección qué había en la web anterior y por qué el cambio es mejor.
Sirve para presentar la propuesta y se quitará antes de publicar.

## Pendiente

- Confirmar la licencia web de Helvetica Neue Condensed. Si no la hay, `Roboto Condensed` ya está como alternativa en `--f`.
- Modelo 3D de la Digicen 22 cuando lleguen los CAD (STEP por piezas).
- Resto de páginas: fichas de producto, Elegir centrífuga, Distribuidores, Servicio técnico, Empresa.
- Versiones en inglés y francés (el enrutado por idioma ya está configurado).
- Redirecciones 301 de las URLs de la web antigua.
