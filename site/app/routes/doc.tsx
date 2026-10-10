import { Navigate, useParams } from 'react-router';
import type { MetaFunction } from 'react-router';
import { findEntry } from '../catalog';
import { pageMeta } from '../lib/nav';
import { getPageDoc } from '../lib/registry';
import { DocPage } from '../pages/DocPage';
import { NotFound } from '../pages/NotFound';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = ({ params }) => pageMeta(findEntry('docs', params.slug));

/** `/docs/:slug`: Getting started and Foundations pages. */
export default function Doc() {
  const { slug } = useParams();
  if (slug === 'introduction') return <Navigate to="/" replace />;
  const entry = findEntry('docs', slug);
  if (!entry) return <NotFound />;
  return <DocPage key={entry.slug} entry={entry} page={getPageDoc('docs', entry.slug)} />;
}
