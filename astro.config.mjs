// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ortoalresa.com',
  integrations: [react(), sitemap()],
  // Permite la vista previa de desarrollo a través de GitHub Codespaces.
  server: { allowedHosts: ['.app.github.dev'] },
  // jsPDF y three (escenas 3D de Productos y Empresa) se cargan con import dinámico. Sin esto, en desarrollo
  // Vite los descubre tarde, los vuelve a empaquetar y la página se queda pidiendo la versión vieja
  // (504 "Outdated Optimize Dep") y no aparece el modelo.
  vite: {
    optimizeDeps: {
      // Rehace la caché de dependencias en cada arranque: una caché vieja dejaba escenas sin cargar.
      force: true,
      include: [
        'jspdf',
        'jspdf-autotable',
        'three',
        'three/examples/jsm/loaders/GLTFLoader.js',
        'three/examples/jsm/loaders/DRACOLoader.js',
        'three/examples/jsm/controls/OrbitControls.js',
        'three/examples/jsm/math/MeshSurfaceSampler.js',
        'three/examples/jsm/environments/RoomEnvironment.js',
      ],
    },
  },
  i18n: {
    locales: ['es', 'en', 'fr'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
});
