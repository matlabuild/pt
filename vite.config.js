import { defineConfig } from 'vite'

export default defineConfig({
  base: '/pt/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    open: true
  }
})
