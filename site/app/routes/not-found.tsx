import type { MetaFunction } from 'react-router';
import { pageMeta } from '../lib/nav';
import { NotFound } from '../pages/NotFound';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = () => pageMeta({ name: 'Page not found', blurb: 'Nothing lives at this address.' });

/** Any other path. */
export default function NotFoundRoute() {
  return <NotFound />;
}
