import { documented } from '../lib/docgen';
import type { CatalogEntry, PageDoc } from '../types';
import { PageHead } from '../ui/PageHead';
import { PendingNote } from '../ui/Pending';
import { PropsTable } from '../ui/PropsTable';
import { Toc } from '../ui/Toc';

/** A Docs or Examples page: the standard header plus the module's Body, or a neutral fallback. */
export function DocPage({ entry, page }: { entry: CatalogEntry; page?: PageDoc }) {
  const wide = page?.wide ?? false;
  const Body = page?.Body;
  return (
    <div className={wide ? 'd-page d-page--wide' : 'd-page'}>
      <article className="d-article">
        {page?.ownHeader && Body ? (
          <Body />
        ) : (
          <>
            <PageHead entry={entry} />
            <div className="d-body">
              {Body ? (
                <Body />
              ) : (
                <>
                  <PendingNote>More on {entry.name} soon.</PendingNote>
                  {documented(entry.components).map((c) => (
                    <PropsTable key={c} component={c} />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </article>
      {!wide && <Toc items={page?.toc ?? []} />}
    </div>
  );
}
