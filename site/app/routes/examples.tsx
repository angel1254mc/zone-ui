import type { MetaFunction } from 'react-router';
import { pageMeta } from '../lib/nav';
import { ExamplesOverview } from '../pages/ExamplesOverview';

export { RouteError as ErrorBoundary } from '../pages/RouteError';

export const meta: MetaFunction = () =>
  pageMeta({ name: 'Examples', blurb: 'Complete apps built only from the Zone kit.' });

/** `/examples`: the examples overview. */
export default function Examples() {
  return <ExamplesOverview />;
}
