import { isRouteErrorResponse, useRouteError } from 'react-router';
import { NotFound } from './NotFound';

/** Error boundary for page routes: keeps the header and sidebar, replaces the page. */
export function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="d-page">
      <article className="d-article">
        <header className="d-head">
          <h1 className="d-h1">Something broke</h1>
          <p className="d-lede">This page failed to render.</p>
        </header>
        <pre className="d-error">{message}</pre>
      </article>
    </div>
  );
}
