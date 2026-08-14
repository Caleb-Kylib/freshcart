import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dependencies are installed explicitly with npm install/npm ci. Running npm
// from Vite's config corrupts or locks node_modules while Vite is starting.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
