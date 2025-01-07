import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pt/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html')
    }
  },
  server: {
    open: true
  }
}) 