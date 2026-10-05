// Configuración de Vite y de Vitest (pruebas) para ControlPark-IQ.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/pruebas/configuracion.js',
  },
});
