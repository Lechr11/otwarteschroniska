// astro.config.mjs
// Konfiguracja Astro 6 dla otwarteschroniska.org.pl.
// Day 0: vercel.app subdomain. Day 1+: otwarteschroniska.org.pl (zmień `site` po rejestracji domeny).

import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://otwarteschroniska.vercel.app',
  output: 'static',
  trailingSlash: 'always',

  build: {
    format: 'directory',
  },

  integrations: [react()],
});