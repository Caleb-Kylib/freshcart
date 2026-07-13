import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

try {
  console.log("--> STARTING SELF-HEALING NPM INSTALL <--");
  execSync('npm install', { stdio: 'inherit' });
  console.log("--> SELF-HEALING NPM INSTALL COMPLETE <--");
} catch (err) {
  console.error("--> SELF-HEALING NPM INSTALL FAILED:", err);
}
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
