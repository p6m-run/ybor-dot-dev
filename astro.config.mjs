// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://redesigned-adventure-8qzrmpk.pages.github.io',
  base: 'p6m-run/ybor-dot-dev',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});