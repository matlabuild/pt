import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pt/',
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html')
    }
  }
}) 