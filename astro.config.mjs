// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://redesigned-adventure-8qzrmpk.pages.github.io',
  base: '',

  vite: {
    plugins: [tailwind()]
  },

  integrations: [react()],
  adapter: vercel()
});