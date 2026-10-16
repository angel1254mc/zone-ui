import { index, layout, route } from '@react-router/dev/routes';
import type { RouteConfig } from '@react-router/dev/routes';

// Every page lives inside the shell (header, section sidebar). Content is not routed by file: the route
// modules look the slug up in catalog.ts and the content registry.
export default [
  layout('routes/shell.tsx', [
    index('routes/home.tsx'),
    route('docs/:slug', 'routes/doc.tsx'),
    route('components', 'routes/components.tsx'),
    route('components/:slug', 'routes/component-overview.tsx'),
    route('components/:slug/properties', 'routes/component-properties.tsx'),
    route('examples', 'routes/examples.tsx'),
    route('examples/:slug', 'routes/example.tsx'),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
