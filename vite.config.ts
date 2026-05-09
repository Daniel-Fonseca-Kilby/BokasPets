import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    // globals: true evita tener que importar describe/it/expect en cada test
    globals: true,
    // node es suficiente para tests de utilidades puras (sin DOM)
    // Para tests de componentes React agregar @vitest-environment jsdom en el archivo
    environment: 'node',
  },
})
