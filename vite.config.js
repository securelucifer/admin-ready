import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ IMPORTANT: Base path for /admin route
  base: '/admin/',
  
  // ✅ Output to 'dist' (not 'build')
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
  
  server: {
    host: true,
    port: 5174,
  }
})