import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { SearchIcon, TextField } from '@angel1254mc/zone-ui';
import { COMPONENT_TIERS, entriesOf, entryHref, TIERS } from '../catalog';
import type { CatalogEntry, Section } from '../types';

/** Overview pages are exact matches; entry pages also match their sub-pages (Properties). */
function isCurrent(pathname: string, href: string, exact: boolean) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || (!exact && path.startsWith(href + '/'));
}

function SideLink({
  href,
  exact = false,
  onNavigate,
  children,
}: {
  href: string;
  exact?: boolean;
  onNavigate?: () => void;
  children: string;
}) {
  const { pathname } = useLocation();
  return (
    <Link
      to={href}
      className="d-side__link"
      aria-current={isCurrent(pathname, href, exact) ? 'page' : undefined}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

function Group({
  label,
  count,
  entries,
  onNavigate,
}: {
  label: string;
  count?: number;
  entries: CatalogEntry[];
  onNavigate?: () => void;
}) {
  return (
    <section className="d-side__group">
      <h2 className="d-side__label">
        <span>{label}</span>
        {count !== undefined && <span className="d-side__count">{count}</span>}
      </h2>
      <ul className="d-side__list">
        {entries.map((c) => (
          <li key={c.slug}>
            <SideLink href={entryHref(c)} exact={c.slug === 'introduction'} onNavigate={onNavigate}>
              {c.name}
            </SideLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const docs = entriesOf('docs');
  return (
    <div className="d-side__groups">
      {(['start', 'foundations'] as const).map((tier) => (
        <Group
          key={tier}
          label={TIERS.find((t) => t.id === tier)!.label}
          entries={docs.filter((c) => c.tier === tier)}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

function ComponentsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    const all = entriesOf('components');
    return COMPONENT_TIERS.map((tier) => ({
      tier: TIERS.find((t) => t.id === tier)!,
      entries: all.filter((c) => c.tier === tier && (!q || c.name.toLowerCase().includes(q))),
    })).filter((g) => g.entries.length);
  }, [q]);

  return (
    <>
      <div className="d-side__search">
        <TextField
          aria-label="Filter components"
          placeholder="Filter"
          icon={<SearchIcon />}
          size="sm"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      <div className="d-side__groups">
        {!q && (
          <ul className="d-side__list d-side__list--top">
            <li>
              <SideLink href="/components" exact onNavigate={onNavigate}>
                Overview
              </SideLink>
            </li>
          </ul>
        )}
        {groups.map(({ tier, entries }) => (
          <Group key={tier.id} label={tier.label} count={entries.length} entries={entries} onNavigate={onNavigate} />
        ))}
        {!groups.length && (
          <p className="d-side__empty" role="status">
            No component matches “{query}”.
          </p>
        )}
      </div>
    </>
  );
}

function ExamplesSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="d-side__groups">
      <ul className="d-side__list d-side__list--top">
        <li>
          <SideLink href="/examples" exact onNavigate={onNavigate}>
            Overview
          </SideLink>
        </li>
      </ul>
      <Group label="Examples" entries={entriesOf('examples')} onNavigate={onNavigate} />
    </div>
  );
}

const LABELS: Record<Section, string> = { docs: 'Docs', components: 'Components', examples: 'Examples' };

/** The sidebar of one section. Docs, Components and Examples each have their own. */
export function Sidebar({ section, onNavigate }: { section: Section; onNavigate?: () => void }) {
  return (
    <nav className="d-side" aria-label={LABELS[section]}>
      {section === 'docs' && <DocsSidebar onNavigate={onNavigate} />}
      {section === 'components' && <ComponentsSidebar onNavigate={onNavigate} />}
      {section === 'examples' && <ExamplesSidebar onNavigate={onNavigate} />}
    </nav>
  );
}

export const sectionLabel = (section: Section) => LABELS[section];
