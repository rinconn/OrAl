// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ortoalresa.com',
  integrations: [react(), sitemap()],
  // Permite la vista previa de desarrollo a través de GitHub Codespaces.
  server: { allowedHosts: ['.app.github.dev'] },
  i18n: {
    locales: ['es', 'en', 'fr'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
});
