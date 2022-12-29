import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import svgr from '@svgr/rollup';

export default defineConfig({
  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    svgr(),
  ],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
