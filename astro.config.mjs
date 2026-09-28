// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ortoalresa.com',
  integrations: [react(), sitemap()],
  i18n: {
    locales: ['es', 'en', 'fr'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
});
