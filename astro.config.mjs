// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ortoalresa.com',
  integrations: [react(), sitemap()],
  // Permite la vista previa de desarrollo a través de GitHub Codespaces.
  server: { allowedHosts: ['.app.github.dev'] },
  // jsPDF se carga al pulsar "PDF" (import dinámico). Sin esto, en desarrollo Vite lo descubre tarde, lo
  // vuelve a empaquetar y la página se queda pidiendo la versión vieja (504 "Outdated Optimize Dep").
  vite: { optimizeDeps: { include: ['jspdf', 'jspdf-autotable'] } },
  i18n: {
    locales: ['es', 'en', 'fr'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
});
