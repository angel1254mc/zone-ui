import type { MetaFunction } from 'react-router';
import { findEntry } from '../catalog';
import { pageMeta } from '../lib/nav';
import { getPageDoc } from '../lib/registry';
import { DocPage } from '../pages/DocPage';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = () => pageMeta();

/** `/`: the Introduction. */
export default function Home() {
  return <DocPage entry={findEntry('docs', 'introduction')!} page={getPageDoc('docs', 'introduction')} />;
}
