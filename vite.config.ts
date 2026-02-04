import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      strictPort: true,
      proxy: {
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    optimizeDeps: {
      include: [
        '@react-pdf/renderer',
        'base64-js',
        'unicode-trie',
        'unicode-properties',
        'brotli',
        'clone',
        'fontkit',
        'restructure',
        'pako',
        'tiny-inflate'
      ]
    },
    plugins: [react()],
    build: {
      target: 'esnext',
      minify: true,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-utils': ['lucide-react', 'clsx', 'tailwind-merge'],
            'vendor-maps': ['leaflet'],
            'vendor-charts': ['recharts'],
          }
        }
      },
      chunkSizeWarningLimit: 1000,
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
