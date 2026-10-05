import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  root: resolve(import.meta.dirname, 'demo'),
  publicDir: false,
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@angel1254mc/zone-ui': resolve(import.meta.dirname, 'src/index.ts') },
  },
  build: {
    outDir: resolve(import.meta.dirname, 'demo-dist'),
    emptyOutDir: true,
  },
  server: { port: 5173 },
})
