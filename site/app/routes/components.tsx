import type { MetaFunction } from 'react-router';
import { pageMeta } from '../lib/nav';
import { ComponentsGallery } from '../pages/ComponentsGallery';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = () =>
  pageMeta({ name: 'Components', blurb: 'Every Zone component, from single controls up to full-screen templates.' });

/** `/components`: the gallery. */
export default function Components() {
  return <ComponentsGallery />;
}
