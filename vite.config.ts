import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  base: '/app/',
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    outDir: '../static/app',
    emptyOutDir: true,
  },
});
