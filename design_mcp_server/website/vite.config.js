import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        component: resolve(__dirname, 'pages/component.html'),
        customize: resolve(__dirname, 'pages/customize.html'),
        'design-system': resolve(__dirname, 'pages/design-system.html'),
        'figma-import': resolve(__dirname, 'pages/figma-import.html'),
        analytics: resolve(__dirname, 'pages/analytics.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@scripts': resolve(__dirname, './src/scripts'),
      '@styles': resolve(__dirname, './src/styles'),
      '@db': resolve(__dirname, './src/db')
    }
  }
});
