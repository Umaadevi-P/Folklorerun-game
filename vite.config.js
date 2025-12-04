import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  base: '/Folklorerun-game/',
  server: {
    port: 3000,
    strictPort: false, // If port 3000 is taken, try the next available port
    open: true, // Automatically open browser
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
