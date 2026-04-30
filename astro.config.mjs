// astro.config.mjs
// Konfiguracja Astro 6 dla otwarteschroniska.org.pl.

import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://otwarteschroniska.org.pl',
  output: 'static',
  trailingSlash: 'ignore',  // 'always' powoduje 404 dla /api/v1/*.json (dev vs prod inconsistency)

  build: {
    format: 'directory',
  },

  integrations: [react()],
});