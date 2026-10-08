import { useParams } from 'react-router';
import type { MetaFunction } from 'react-router';
import { findEntry } from '../catalog';
import { pageMeta } from '../lib/nav';
import { getPageDoc } from '../lib/registry';
import { DocPage } from '../pages/DocPage';
import { NotFound } from '../pages/NotFound';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = ({ params }) => pageMeta(findEntry('examples', params.slug));

/** `/examples/:slug`: one example app. */
export default function Example() {
  const { slug } = useParams();
  const entry = findEntry('examples', slug);
  if (!entry) return <NotFound />;
  return <DocPage key={entry.slug} entry={entry} page={getPageDoc('examples', entry.slug)} />;
}
