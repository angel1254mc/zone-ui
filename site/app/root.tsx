import type { ReactNode } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';
import { pageTitle } from './lib/nav';

// The root route is rendered at build time (into index.html), so it stays free of the kit: the shell
// route (routes/shell.tsx) brings in the kit, its styles and the site chrome.

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  // Mona Sans comes with the kit's fonts.css; code blocks use Martian Mono.
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@87.5..100,400..600&display=swap',
  },
];

export const meta: MetaFunction = () => [
  { title: pageTitle() },
  { name: 'description', content: 'Zone: a Zenless Zone Zero–inspired React UI kit for game-flavoured web apps.' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark', background: '#000' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, background: '#000', color: '#fff' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Shown in index.html until the app takes over: a black page, so there is no white flash. */
export function HydrateFallback() {
  return null;
}

export default function Root() {
  return <Outlet />;
}

/** Last-resort boundary for errors in the shell itself (page errors are caught inside the shell). */
export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : String(error);
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <h1>Zone docs failed to load</h1>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#c8c8c8' }}>{message}</pre>
    </main>
  );
}
