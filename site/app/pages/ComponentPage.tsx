import { Link, useNavigate, useParams } from 'react-router';
import { WebTabs } from '@angel1254mc/zone-ui';
import { entryHref, findEntry } from '../catalog';
import { documented } from '../lib/docgen';
import { getComponentDoc } from '../lib/registry';
import { slugify } from '../lib/nav';
import type { CatalogEntry, ResolvedComponentDoc, TocItem } from '../types';
import { CodeBlock } from '../ui/CodeBlock';
import { ExampleBlock } from '../ui/ExampleBlock';
import { PageHead } from '../ui/PageHead';
import { PendingNote } from '../ui/Pending';
import { PropsTable, TypeTable } from '../ui/PropsTable';
import { Related } from '../ui/Related';
import { Toc } from '../ui/Toc';
import { NotFound } from './NotFound';

export type ComponentTab = 'overview' | 'properties';

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'properties', label: 'Properties' },
];

function Overview({ entry, doc }: { entry: CatalogEntry; doc?: ResolvedComponentDoc }) {
  const api = documented(entry.components);
  if (!doc) {
    return (
      <div className="d-body">
        <section id="usage" className="d-section">
          <PendingNote>
            The <Link to={entryHref(entry, 'properties')}>Properties</Link> tab lists every prop of {entry.name}.
          </PendingNote>
          {api.length > 0 && (
            <CodeBlock code={`import { ${api.join(', ')} } from '@angel1254mc/zone-ui';`} title="Import" />
          )}
        </section>
      </div>
    );
  }
  return (
    <div className="d-body">
      <ExampleBlock example={doc.hero} label={entry.name} />
      <section id="usage" className="d-section">
        <h2 className="d-h2">Usage</h2>
        <div className="d-prose">{doc.usage}</div>
        <CodeBlock code={doc.usageCode} title="Import" />
      </section>
      {doc.examples.length > 0 && (
        <section id="examples" className="d-section">
          <h2 className="d-h2">Examples</h2>
          {doc.examples.map((x) => (
            <ExampleBlock key={x.id} example={x} />
          ))}
        </section>
      )}
      {doc.related?.length ? (
        <section id="related" className="d-section">
          <h2 className="d-h2">Related</h2>
          <Related slugs={doc.related} />
        </section>
      ) : null}
    </div>
  );
}

function Properties({ entry, doc }: { entry: CatalogEntry; doc?: ResolvedComponentDoc }) {
  const Playground = doc?.playground;
  return (
    <div className="d-body">
      {Playground && (
        <section id="playground" className="d-section">
          <h2 className="d-h2">Playground</h2>
          <p className="d-muted">Change a prop and the preview and its code update.</p>
          <Playground />
        </section>
      )}
      {documented(entry.components).map((c) => (
        <PropsTable key={c} component={c} />
      ))}
      {doc?.types?.map((t) => (
        <TypeTable key={t.name} name={t.name} rows={t.rows} />
      ))}
      {doc?.notes?.map((n) => (
        <section key={n.title} id={`note-${slugify(n.title)}`} className="d-section d-note">
          <h2 className="d-h2">{n.title}</h2>
          <ul className="d-note__list">
            {n.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function tocFor(entry: CatalogEntry, doc: ResolvedComponentDoc | undefined, tab: ComponentTab): TocItem[] {
  if (tab === 'overview') {
    if (!doc) return [];
    return [
      { id: 'usage', label: 'Usage' },
      ...(doc.examples.length ? [{ id: 'examples', label: 'Examples' }] : []),
      ...doc.examples.map((x) => ({ id: x.id, label: x.title, sub: true })),
      ...(doc.related?.length ? [{ id: 'related', label: 'Related' }] : []),
    ];
  }
  return [
    ...(doc?.playground ? [{ id: 'playground', label: 'Playground' }] : []),
    ...documented(entry.components).map((c) => ({ id: `api-${c}`, label: c })),
    ...(doc?.types ?? []).map((t) => ({ id: `type-${t.name}`, label: t.name })),
    ...(doc?.notes ?? []).map((n) => ({ id: `note-${slugify(n.title)}`, label: n.title })),
  ];
}

/** A component page: header, Overview | Properties tabs. Works with or without a doc module. */
export function ComponentPage({
  entry,
  doc,
  tab,
}: {
  entry: CatalogEntry;
  doc?: ResolvedComponentDoc;
  tab: ComponentTab;
}) {
  const navigate = useNavigate();
  return (
    <div className={doc?.wide ? 'd-page d-page--wide' : 'd-page'}>
      <article className="d-article">
        <PageHead entry={entry}>
          <div className="d-tabs">
            <WebTabs
              aria-label={`${entry.name} documentation`}
              items={TABS}
              value={tab}
              onValueChange={(v) => navigate(entryHref(entry, v as ComponentTab), { preventScrollReset: true })}
            />
          </div>
        </PageHead>
        {tab === 'overview' ? <Overview entry={entry} doc={doc} /> : <Properties entry={entry} doc={doc} />}
      </article>
      {!doc?.wide && <Toc items={tocFor(entry, doc, tab)} />}
    </div>
  );
}

/** Route body for `/components/:slug` and `/components/:slug/properties`. */
export function ComponentRoute({ tab }: { tab: ComponentTab }) {
  const { slug } = useParams();
  const entry = findEntry('components', slug);
  if (!entry) return <NotFound />;
  return <ComponentPage key={entry.slug} entry={entry} doc={getComponentDoc(entry.slug)} tab={tab} />;
}
