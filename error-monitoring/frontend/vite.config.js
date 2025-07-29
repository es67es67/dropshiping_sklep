import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🔧 Konfiguracja Vite dla Error Monitoring Frontend
// Zależności: @vitejs/plugin-react
// Wpływ: Build i development serwer
// Jeśli się zepsuje: aplikacja nie działa
// Używane w: package.json scripts

export default defineConfig({
  plugins: [react()],
  
  // Konfiguracja serwera deweloperskiego
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Konfiguracja build
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['axios', 'date-fns']
        }
      }
    }
  },
  
  // Konfiguracja preview
  preview: {
    port: 3001,
    host: true
  },
  
  // Zmienne środowiskowe
  define: {
    'process.env': {}
  },
  
  // Optymalizacja zależności
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'styled-components',
      'axios',
      'chart.js',
      'react-chartjs-2',
      'date-fns',
      'react-icons',
      'react-query',
      'react-hot-toast',
      'framer-motion'
    ]
  }
}); 