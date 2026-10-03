import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Standalone demo app that renders the example pages with the library source.
// No public folder: the demo serves and ships no static assets. Game art is loaded BY URL at runtime
// (examples/art/art-manifest.json -> static.nanoka.cc / Enka.Network), so demo-dist/ holds no image file.
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
