import type { MetaFunction } from 'react-router';
import { findEntry } from '../catalog';
import { pageMeta } from '../lib/nav';
import { ComponentRoute } from '../pages/ComponentPage';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = ({ params }) => {
  const entry = findEntry('components', params.slug);
  return pageMeta(entry && { name: `${entry.name} properties`, blurb: entry.blurb });
};

/** `/components/:slug/properties`: Properties tab. */
export default function ComponentProperties() {
  return <ComponentRoute tab="properties" />;
}
