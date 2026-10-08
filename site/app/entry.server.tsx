import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import type { EntryContext } from 'react-router';

// Used at build time only: renders the root route into index.html (and each page, once `prerender` is
// on). Always waits for the full tree, because the output is a static file rather than a live response.
export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  context: EntryContext
): Promise<Response> {
  const body = await renderToReadableStream(<ServerRouter context={context} url={request.url} />, {
    onError(error: unknown) {
      status = 500;
      console.error(error);
    },
  });
  await body.allReady;
  headers.set('Content-Type', 'text/html');
  return new Response(body, { headers, status });
}
