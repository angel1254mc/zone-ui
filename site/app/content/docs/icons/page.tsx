import { Fragment, useEffect, useId, useRef, useState } from 'react';
import * as zone from '@angel1254mc/zone-ui';
import { SearchIcon, Select, Text, TextField, iconNames, icons } from '@angel1254mc/zone-ui';
import type { IconComponent, IconName } from '@angel1254mc/zone-ui';
import { resolveDemo } from '../../../lib/demos';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { ExampleBlock } from '../../../ui/ExampleBlock';
import './icons.css';

const PACKAGE = '@angel1254mc/zone-ui';
const demo = (name: string) => resolveDemo('docs/icons', { demo: name });

/** The name each glyph is exported under (e.g. the decorative signal bars ship as `SignalBarsIcon`). */
const exportNames = new Map<unknown, string>();
for (const [name, value] of Object.entries(zone)) {
  if (typeof value === 'function' && !exportNames.has(value)) exportNames.set(value, name);
}

/** Families in registry order: each starts at its first icon name. */
const FAMILIES: { id: string; label: string; first: IconName }[] = [
  { id: 'actions', label: 'Actions and navigation', first: 'back' },
  { id: 'categories', label: 'Storage categories', first: 'wEngineCategory' },
  { id: 'dock', label: 'Home dock', first: 'more' },
  { id: 'events', label: 'Events', first: 'gift' },
  { id: 'specialties', label: 'Specialties', first: 'attack' },
  { id: 'elements', label: 'Elements', first: 'fire' },
  { id: 'rank', label: 'Rank, rarity and badges', first: 'rankLetterS' },
  { id: 'currency', label: 'Currency and resources', first: 'battery' },
  { id: 'decorative', label: 'Decorative', first: 'emptySlotX' },
];

interface Glyph {
  key: IconName;
  exportName: string;
  family: (typeof FAMILIES)[number];
  Component: IconComponent;
  search: string;
}

const GLYPHS: Glyph[] = (() => {
  let family = FAMILIES[0];
  return iconNames.map((key) => {
    family = FAMILIES.find((f) => f.first === key) ?? family;
    const Component = icons[key] as IconComponent;
    const exportName = exportNames.get(Component) ?? Component.displayName;
    return { key, exportName, family, Component, search: `${exportName} ${key} ${family.label}`.toLowerCase() };
  });
})();

/** Lets a long camelCase name wrap between its words instead of mid-word. */
function Breakable({ text }: { text: string }) {
  const parts = text.split(/(?=[A-Z])/);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {p}
        </Fragment>
      ))}
    </>
  );
}

const importLine = (name: string) => `import { ${name} } from '${PACKAGE}';`;

/** Clipboard write with a fallback for browsers without the async API. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    if (!ok) throw new Error('copy failed');
  }
}

const FAMILY_OPTIONS = [
  { value: 'all', label: 'All families' },
  ...FAMILIES.map((f) => ({ value: f.id, label: f.label })),
];

function Gallery() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [copied, setCopied] = useState<IconName | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const familyLabel = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  const q = query.trim().toLowerCase();
  const shown = GLYPHS.filter((g) => (family === 'all' || g.family.id === family) && (!q || g.search.includes(q)));
  const groups = FAMILIES.map((f) => ({ ...f, glyphs: shown.filter((g) => g.family.id === f.id) })).filter(
    (f) => f.glyphs.length
  );

  const copy = (g: Glyph) => {
    copyText(importLine(g.exportName)).then(
      () => {
        setCopied(g.key);
        setAnnouncement(`Copied the ${g.exportName} import.`);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), 1600);
      },
      () => setAnnouncement(`Could not copy the ${g.exportName} import.`)
    );
  };

  return (
    <>
      <div className="ic-controls">
        <div className="ic-controls__search">
          <TextField
            label="Search icons"
            size="sm"
            icon={<SearchIcon />}
            value={query}
            onValueChange={setQuery}
            placeholder="arrow, rank, currency…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="ic-controls__family">
          <Text role="label" id={familyLabel} className="ic-label">
            Family
          </Text>
          <Select
            aria-labelledby={familyLabel}
            size="sm"
            width="fill"
            options={FAMILY_OPTIONS}
            value={family}
            onValueChange={setFamily}
          />
        </div>
      </div>
      <p className="ic-count" role="status">
        {shown.length === GLYPHS.length
          ? `${GLYPHS.length} icons. Select one to copy its import.`
          : `${shown.length} of ${GLYPHS.length} icons.`}
      </p>
      <p className="d-sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {groups.map((f) => (
        <div key={f.id} className="ic-family">
          <div className="ic-family__head">
            <h3 className="d-h3">{f.label}</h3>
            <span className="ic-family__count">{f.glyphs.length}</span>
          </div>
          <ul className="ic-grid">
            {f.glyphs.map((g) => (
              <li key={g.key}>
                <button
                  type="button"
                  className="ic-tile"
                  data-copied={copied === g.key ? '' : undefined}
                  aria-label={`${g.exportName}, copy import`}
                  onClick={() => copy(g)}
                >
                  <span className="ic-tile__glyph">
                    <g.Component size={48} />
                  </span>
                  <span className="ic-tile__name">
                    <Breakable text={g.exportName} />
                  </span>
                  {copied === g.key ? (
                    <span className="ic-tile__copied">Import copied</span>
                  ) : (
                    <span className="ic-tile__key">
                      {'name="'}
                      <wbr />
                      <Breakable text={g.key} />
                      {'"'}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {shown.length === 0 && <p className="ic-empty">No icon matches “{query.trim()}”.</p>}
    </>
  );
}

function Icons() {
  return (
    <>
      <section className="d-section d-prose" id="usage">
        <h2 className="d-h2">Usage</h2>
        <p>
          Every glyph is a React component drawn on a 32-unit grid and filled with <code>currentColor</code>. Import it
          by name, or render any glyph by its registry name with <code>Icon</code>.
        </p>
        <CodeBlock
          code={`import { BackIcon, Icon } from '@angel1254mc/zone-ui';

<BackIcon size={34} />
<Icon name="filter" size="1.5em" title="Filter" />`}
        />
        <p>
          A registry name is the export name without <code>Icon</code>, in camelCase: <code>BackIcon</code> is{' '}
          <code>back</code>, <code>RankLetterS</code> is <code>rankLetterS</code>. <code>icons</code> maps each name to
          its component, <code>iconNames</code> lists them in order and <code>IconName</code> is their type.
        </p>
      </section>

      <section className="d-section" id="gallery">
        <h2 className="d-h2">Gallery</h2>
        <p className="d-muted">Every icon in the kit. Select a tile to copy its import line.</p>
        <Gallery />
      </section>

      <section className="d-section" id="size">
        <h2 className="d-h2">Size</h2>
        <p className="d-muted">
          <code className="d-inline-code">size</code> sets the height. A number is in design units and follows the
          scale; a string is any CSS length. The default is <code className="d-inline-code">1em</code>, so an icon
          matches the text around it. Wide glyphs such as the dock&apos;s Mail and Agents keep their aspect ratio.
        </p>
        <ExampleBlock example={demo('icon-sizes')} label="Icon sizes" />
      </section>

      <section className="d-section" id="color">
        <h2 className="d-h2">Colour</h2>
        <p className="d-muted">
          Icons take the text colour, so set <code className="d-inline-code">color</code> on the icon or its parent.
          Inside a pressed or selected control they turn black on the accent. Element, currency and a few rank and dock
          glyphs carry their own palette. Icons are never skewed, even inside italic buttons.
        </p>
        <ExampleBlock example={demo('icon-colors')} label="Icon colours" />
      </section>

      <section className="d-section d-prose" id="accessibility">
        <h2 className="d-h2">Accessibility</h2>
        <p>
          Without a <code>title</code> an icon is decorative: it gets <code>aria-hidden</code> and never takes focus.
          Pass <code>title</code> when the icon carries meaning on its own, and it becomes an image with that name. In
          an icon-only button, name the button instead.
        </p>
        <CodeBlock
          code={`<LockIcon />                      // decorative
<LockIcon title="Locked" />       // role="img", named "Locked"
<IconButton icon={<FilterIcon />} label="Filter" />`}
        />
      </section>
    </>
  );
}

const page: PageDoc = {
  Body: Icons,
  toc: [
    { id: 'usage', label: 'Usage' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'size', label: 'Size' },
    { id: 'color', label: 'Colour' },
    { id: 'accessibility', label: 'Accessibility' },
  ],
};

export default page;
