import type { Config } from '@react-router/dev/config';

// SPA output: the root route is rendered once at build time into build/client/index.html and every
// page renders in the browser. Switch on `prerender` here to emit static HTML per route later.
export default {
  appDirectory: 'app',
  buildDirectory: 'build',
  ssr: false,
} satisfies Config;
