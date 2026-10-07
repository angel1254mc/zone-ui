/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { copyFileSync, mkdirSync } from 'node:fs'

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'zzz-copy-tokens',
            closeBundle() {
                mkdirSync(resolve(import.meta.dirname, 'dist'), {
                    recursive: true,
                })
                copyFileSync(
                    resolve(import.meta.dirname, 'src/styles/tokens.css'),
                    resolve(import.meta.dirname, 'dist/tokens.css')
                )
                copyFileSync(
                    resolve(import.meta.dirname, 'src/styles/fonts.css'),
                    resolve(import.meta.dirname, 'dist/fonts.css')
                )
            },
        },
    ],
    resolve: {
        alias: {
            '@angel1254mc/zone-ui': resolve(
                import.meta.dirname,
                'src/index.ts'
            ),
        },
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'ZzzUI',
            formats: ['es', 'cjs'],
            fileName: (format) =>
                format === 'es' ? 'zone-ui.js' : 'zone-ui.cjs',
            cssFileName: 'zone-ui',
        },
        cssCodeSplit: false,
        // No source maps: the package ships compiled code and .d.ts files only.
        sourcemap: false,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react-dom/client',
            ],
            output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: [
            'src/**/*.test.{ts,tsx}',
            'examples/**/*.test.{ts,tsx}',
            'demo/**/*.test.{ts,tsx}',
            'scripts/**/*.test.mjs',
        ],
        css: false,
        // Full example pages render hundreds of components in jsdom; give them room under parallel load.
        testTimeout: 30000,
    },
})
