import type { MetaFunction } from 'react-router';
import { findEntry } from '../catalog';
import { pageMeta } from '../lib/nav';
import { ComponentRoute } from '../pages/ComponentPage';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = ({ params }) => pageMeta(findEntry('components', params.slug));

/** `/components/:slug`: Overview tab. */
export default function ComponentOverview() {
  return <ComponentRoute tab="overview" />;
}
