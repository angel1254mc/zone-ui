import { reactRouter } from '@react-router/dev/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const repo = resolve(import.meta.dirname, '..');

export default defineConfig({
  root: import.meta.dirname,
  plugins: [reactRouter()],
  resolve: {
    // The docs render the kit from source, so every page shows the current components.
    alias: {
      '@angel1254mc/zone-ui': resolve(repo, 'src/index.ts'),
      // Demos that need game art import the example helpers as `examples/art`.
      'examples/art': resolve(repo, 'examples/art/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rolldownOptions: {
      output: {
        // Named chunks: the highlighter (loaded on first code view), third-party code, the kit, the generated
        // props tables and the content modules. A module goes to the first group that matches it.
        codeSplitting: {
          groups: [
            { name: 'shiki', test: /[\\/]node_modules[\\/](shiki|@shikijs)[\\/]/ },
            { name: 'vendor', test: /[\\/]node_modules[\\/]/ },
            { name: 'zone-ui', test: /^(?!.*node_modules).*[\\/]src[\\/](components|icons|utils|styles|index\.ts)/ },
            { name: 'props', test: /[\\/]generated[\\/]props\.json/ },
            { name: 'content', test: /[\\/]site[\\/]app[\\/]content[\\/]/ },
          ],
        },
      },
    },
  },
  server: { port: 5180, fs: { allow: [repo] } },
  preview: { port: 5181 },
});
