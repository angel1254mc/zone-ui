import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Button, SearchIcon, Table, TextField, tokens } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import './tokens.css';

/* ── Token helpers (same naming rule as the generated tokens.css) ─────────────────────────── */

type Tree = { readonly [key: string]: unknown };

const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
const cssVar = (path: string[]) => `--zzz-${path.map(kebab).join('-')}`;

/** Flattens a token subtree into [path, value] leaves. */
function leaves(node: Tree, path: string[]): [string[], unknown][] {
  return Object.entries(node).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? leaves(v as Tree, [...path, k]) : [[[...path, k], v]]
  ) as [string[], unknown][];
}

/** CSS px at the default scale (0.7) and a 16 px root. */
const toPx = (units: number) => `${Math.round(units * 7) / 10} px`;
const unitsLabel = (n: number) => `${n} ${n === 1 ? 'unit' : 'units'}`;

interface LengthRow {
  name: string;
  units: number;
}
const lengths = (node: Tree, path: string[]): LengthRow[] =>
  leaves(node, path)
    .filter(([, v]) => typeof v === 'number')
    .map(([p, v]) => ({ name: cssVar(p), units: v as number }));

/* ── Colours ─────────────────────────────────────────────────────────────────────────────── */

const isColour = (v: unknown): v is string =>
  typeof v === 'string' && /^(#|rgba?\(|hsla?\(|linear-gradient\()/i.test(v.trim());

interface Swatch {
  name: string;
  value: string;
}

const COLOUR_GROUPS: { id: string; title: string; groups: string[]; note?: ReactNode }[] = [
  { id: 'colors-accent', title: 'Accent', groups: ['accent', 'progress'] },
  { id: 'colors-rarity', title: 'Rarity', groups: ['rarity', 'rarityCoin', 'rank', 'star'] },
  {
    id: 'colors-semantic',
    title: 'Semantic',
    groups: ['danger', 'highlight', 'sage', 'badge', 'icon', 'checkIn', 'event', 'element', 'agentTheme', 'content'],
  },
  {
    id: 'colors-neutrals',
    title: 'Backgrounds, surfaces and borders',
    groups: ['bg', 'surface', 'border', 'interstitial', 'watermark'],
  },
  {
    id: 'colors-text',
    title: 'Text',
    groups: ['text'],
    note: (
      <>
        <code>faint</code>, <code>ghost</code>, <code>engraved</code> and <code>uid</code> sit below WCAG AA contrast on
        black. Use them for decoration only, never as the only carrier of information.
      </>
    ),
  },
];

const colourTree = tokens.color as unknown as Tree;
const swatchesOf = (groups: string[]): Swatch[] =>
  groups.flatMap((g) =>
    leaves(colourTree[g] as Tree, ['color', g])
      // the pulse ends are shown with the live accent
      .filter(([p, v]) => isColour(v) && !p.includes('pulse'))
      .map(([p, v]) => ({ name: cssVar(p), value: v as string }))
  );
const COLOURS = COLOUR_GROUPS.map((g) => ({ ...g, swatches: swatchesOf(g.groups) }));
const COLOUR_TOTAL = COLOURS.reduce((n, g) => n + g.swatches.length, 0);

function SwatchItem({ name, value }: Swatch) {
  return (
    <li className="tk-swatch">
      <span className="tk-chip" aria-hidden="true">
        <span style={{ background: `var(${name})` }} />
      </span>
      <span className="tk-swatch__text">
        <code className="tk-name">{name}</code>
        <span className="tk-value">{value}</span>
      </span>
    </li>
  );
}

function Colours() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const match = (s: Swatch) => !q || s.name.includes(q) || s.value.toLowerCase().includes(q);
  const groups = COLOURS.map((g) => ({ ...g, shown: g.swatches.filter(match) }));
  const shown = groups.reduce((n, g) => n + g.shown.length, 0);
  return (
    <>
      <ul className="d-jump" aria-label="Colour groups">
        {groups.map((g) => (
          <li key={g.id}>
            <a href={`#${g.id}`} className="d-jump__link">
              {g.title}
              <span className="d-jump__count">{g.swatches.length}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="tk-filter">
        <TextField
          label="Filter colours"
          size="sm"
          icon={<SearchIcon />}
          value={query}
          onValueChange={setQuery}
          placeholder="danger, surface, #FDB402…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <p className="tk-count" role="status">
        {q ? `${shown} of ${COLOUR_TOTAL} colours match “${query.trim()}”.` : `${COLOUR_TOTAL} colours.`}
      </p>

      {(!q || '--zzz-accent live'.includes(q)) && (
        <div className="tk-group">
          <h3 className="d-h3 tk-group__head">Live accent</h3>
          <ul className="tk-swatches">
            <li className="tk-swatch">
              <span className="tk-chip tk-chip--live" aria-hidden="true">
                <span style={{ background: 'var(--zzz-accent)' }} />
              </span>
              <span className="tk-swatch__text">
                <code className="tk-name">--zzz-accent</code>
                <span className="tk-value">
                  {tokens.color.accent.pulse.from} ↔ {tokens.color.accent.pulse.to}, {tokens.color.accent.pulse.period}
                </span>
              </span>
            </li>
          </ul>
        </div>
      )}

      {groups.map((g) =>
        g.shown.length ? (
          <div key={g.id} className="tk-group">
            <div className="tk-group__head">
              <h3 className="d-h3" id={g.id}>
                {g.title}
              </h3>
              <span className="tk-group__count">{g.shown.length}</span>
            </div>
            {g.note && <p className="tk-group__note">{g.note}</p>}
            <ul className="tk-swatches">
              {g.shown.map((s) => (
                <SwatchItem key={s.name} {...s} />
              ))}
            </ul>
          </div>
        ) : (
          // keep the jump target when a filter hides the whole group
          <span key={g.id} id={g.id} hidden />
        )
      )}
      {q && shown === 0 && <p className="tk-empty">No colour token matches “{query.trim()}”.</p>}
    </>
  );
}

/* ── Tables ──────────────────────────────────────────────────────────────────────────────── */

const nameCol = <T extends { name: string }>(header = 'Token'): TableColumn<T> => ({
  key: 'name',
  header,
  align: 'start',
  rowHeader: true,
  width: 420,
  cell: (r) => <code className="tk-name tk-cell">{r.name}</code>,
});

const unitsCol: TableColumn<LengthRow> = {
  key: 'units',
  header: 'Value',
  align: 'start',
  width: 230,
  cell: (r) => (
    <span className="tk-value tk-cell">
      {unitsLabel(r.units)} · {toPx(r.units)}
    </span>
  ),
};

function TokenTable<T extends { name: string }>({
  label,
  columns,
  rows,
}: {
  label: string;
  columns: TableColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="d-table-wrap zzz-scrollbar" tabIndex={0} role="region" aria-label={label}>
      <Table caption={label} hideCaption columns={columns} rows={rows} rowKey={(r) => r.name} />
    </div>
  );
}

const SPACE = lengths(tokens.space as unknown as Tree, ['space']);
const BORDERS = lengths(tokens.borderWidth as unknown as Tree, ['borderWidth']);
const RADII = lengths(tokens.radius as unknown as Tree, ['radius']);
const SKEWS = Object.entries(tokens.skew).map(([k, v]) => ({ name: cssVar(['skew', k]), value: v as string }));
const LAYERS = Object.entries(tokens.zIndex).map(([k, v]) => ({ name: cssVar(['zIndex', k]), value: v as number }));

const barCol: TableColumn<LengthRow> = {
  key: 'bar',
  header: 'Sample',
  align: 'start',
  cell: (r) => (
    <span className="tk-bar-track" aria-hidden="true">
      <span className="tk-bar" style={{ width: `var(${r.name})` }} />
    </span>
  ),
};

const lineCol: TableColumn<LengthRow> = {
  key: 'line',
  header: 'Sample',
  align: 'start',
  cell: (r) => <span className="tk-line" aria-hidden="true" style={{ height: `var(${r.name})` }} />,
};

const skewColumns: TableColumn<(typeof SKEWS)[number]>[] = [
  nameCol(),
  {
    key: 'value',
    header: 'Value',
    align: 'start',
    width: 230,
    cell: (r) => <span className="tk-value tk-cell">{r.value}</span>,
  },
  {
    key: 'sample',
    header: 'As skewX()',
    align: 'start',
    cell: (r) => <span className="tk-skew" aria-hidden="true" style={{ transform: `skewX(var(${r.name}))` }} />,
  },
];

const layerColumns: TableColumn<(typeof LAYERS)[number]>[] = [
  nameCol(),
  {
    key: 'value',
    header: 'Value',
    align: 'start',
    cell: (r) => <span className="tk-value tk-cell">{r.value}</span>,
  },
];

/* ── Control scale ───────────────────────────────────────────────────────────────────────── */

type Size = 'sm' | 'md' | 'lg';
const SIZES: Size[] = ['sm', 'md', 'lg'];
const control = tokens.size.control;
const CONTROL_ROWS: { name: string; prefix: string; units: Record<Size, number> }[] = [
  { name: 'Height', prefix: '--zzz-size-control', units: { sm: control.sm, md: control.md, lg: control.lg } },
  { name: 'Label size', prefix: '--zzz-font-size-control', units: tokens.fontSize.control },
  { name: 'Icon cap', prefix: '--zzz-size-control-cap', units: control.cap },
  { name: 'Cap disc', prefix: '--zzz-size-control-disc', units: control.disc },
  { name: 'Glyph', prefix: '--zzz-size-control-icon', units: control.icon },
  { name: 'Inline padding', prefix: '--zzz-size-control-padding-x', units: control.paddingX },
];
const controlColumns: TableColumn<(typeof CONTROL_ROWS)[number]>[] = [
  {
    key: 'name',
    header: 'Part',
    align: 'start',
    rowHeader: true,
    width: 470,
    cell: (r) => (
      <span className="tk-sizes tk-cell">
        <span className="d-prop-desc">{r.name}</span>
        <code className="tk-name">{r.prefix}-sm | md | lg</code>
      </span>
    ),
  },
  ...SIZES.map(
    (s): TableColumn<(typeof CONTROL_ROWS)[number]> => ({
      key: s,
      header: s,
      align: 'start',
      cell: (r) => (
        <span className="tk-sizes tk-cell">
          <span className="tk-value">{unitsLabel(r.units[s])}</span>
          <span className="tk-value">{toPx(r.units[s])}</span>
        </span>
      ),
    })
  ),
];

/* ── Page ────────────────────────────────────────────────────────────────────────────────── */

function Tokens() {
  return (
    <>
      <section className="d-section d-prose" id="naming">
        <h2 className="d-h2">Naming</h2>
        <p>
          Every token is a CSS custom property named <code>--zzz-</code> plus its path in kebab-case:{' '}
          <code>color.text.muted</code> is <code>--zzz-color-text-muted</code>, <code>size.control.pillTop</code> is{' '}
          <code>--zzz-size-control-pill-top</code>. They are set on <code>:root</code> and on every{' '}
          <code>ZzzTheme</code>, so your own CSS can read them anywhere.
        </p>
        <CodeBlock
          title="styles.css"
          code={`.stat-card {
  padding: var(--zzz-space-9);
  border-radius: var(--zzz-radius-card);
  background: var(--zzz-color-surface-panel);
  color: var(--zzz-color-text-secondary);
}`}
        />
      </section>

      <section className="d-section d-prose" id="units">
        <h2 className="d-h2">Design units</h2>
        <p>
          Lengths are written in design units. One unit renders as <code>var(--zzz-px)</code>, which is{' '}
          <code>1rem / 16 × --zzz-scale</code>. At the default scale of 0.7 and a 16 px root font size, one unit is 0.7
          CSS px. The px values on this page use that default. <Link to="/docs/theming#density">Theming</Link> shows how
          to change the scale.
        </p>
        <p>
          Each length exists twice: the scaled length for CSS, and the raw number of units with an <code>-n</code>{' '}
          suffix for your own <code>calc()</code>.
        </p>
        <CodeBlock
          title="styles.css"
          code={`/* --zzz-space-4:   calc(8 * var(--zzz-px)) */
/* --zzz-space-4-n: 8 */

.half-pill {
  width: calc(var(--zzz-size-control-pill-width-n) / 2 * var(--zzz-px));
}`}
        />
      </section>

      <section className="d-section d-prose" id="javascript">
        <h2 className="d-h2">In JavaScript</h2>
        <p>
          The same values are exported as the typed <code>tokens</code> object. Lengths are numbers of design units;
          colours, durations and angles are strings. A few structured values exist only here, such as{' '}
          <code>tokens.color.accent.pulse</code>.
        </p>
        <CodeBlock
          code={`import { tokens } from '@angel1254mc/zone-ui';

tokens.color.rarity.s;           // '#FDB402'
tokens.size.control.md;          // 57 (design units)
tokens.motion.duration.drawerIn; // '200ms'`}
        />
      </section>

      <section className="d-section" id="colors">
        <h2 className="d-h2">Colours</h2>
        <p className="d-muted">
          Selected, active and pressed states use the live accent, <code className="d-inline-code">--zzz-accent</code>.
          Everything else is a fixed colour.
        </p>
        <Colours />
      </section>

      <section className="d-section" id="spacing">
        <h2 className="d-h2">Spacing</h2>
        <p className="d-muted">
          A numbered scale from 0 to 66 units, plus named gaps for common layouts such as the dialog buttons.
        </p>
        <TokenTable label="Spacing tokens" columns={[nameCol<LengthRow>(), unitsCol, barCol]} rows={SPACE} />
      </section>

      <section className="d-section" id="controls">
        <h2 className="d-h2">Control sizes</h2>
        <p className="d-muted">
          Buttons, fields, selects and tabs share three sizes. <code className="d-inline-code">md</code> is the default.
        </p>
        <div className="tk-controls">
          {SIZES.map((s) => (
            <Button key={s} size={s} width="auto">
              {s.toUpperCase()} button
            </Button>
          ))}
        </div>
        <TokenTable label="Control size tokens" columns={controlColumns} rows={CONTROL_ROWS} />
      </section>

      <section className="d-section" id="radii">
        <h2 className="d-h2">Radii</h2>
        <p className="d-muted">
          <code className="d-inline-code">radius.pill</code> rounds any height into a capsule. The rest are named after
          the part that uses them.
        </p>
        <ul className="tk-radii">
          {RADII.map((r) => (
            <li key={r.name} className="tk-radius">
              <span className="tk-radius__box" aria-hidden="true" style={{ borderRadius: `var(${r.name})` }} />
              <code className="tk-name">{r.name}</code>
              <span className="tk-value">
                {unitsLabel(r.units)}
                {r.units < 1000 ? ` · ${toPx(r.units)}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="d-section" id="borders">
        <h2 className="d-h2">Border widths</h2>
        <p className="d-muted">
          The dark pill ring is <code className="d-inline-code">--zzz-border-width-ring</code>; the black outline around
          it is <code className="d-inline-code">--zzz-border-width-keyline</code>.
        </p>
        <TokenTable label="Border width tokens" columns={[nameCol<LengthRow>(), unitsCol, lineCol]} rows={BORDERS} />
      </section>

      <section className="d-section" id="angles">
        <h2 className="d-h2">Angles</h2>
        <p className="d-muted">
          <code className="d-inline-code">skew.italic</code> is the shear of italic text.{' '}
          <code className="d-inline-code">skew.hatch</code> is the stripe angle of the hatch background, and{' '}
          <code className="d-inline-code">skew.watermarkRotate</code> tilts the graffiti and film strip layers.
        </p>
        <TokenTable label="Angle tokens" columns={skewColumns} rows={SKEWS} />
      </section>

      <section className="d-section" id="layers">
        <h2 className="d-h2">Layers</h2>
        <p className="d-muted">
          The stacking order of backgrounds, drawers, dialogs and toasts. Place your own overlays between these values
          so they stack correctly with the kit.
        </p>
        <TokenTable label="Layer tokens" columns={layerColumns} rows={LAYERS} />
      </section>

      <section className="d-section d-prose" id="more">
        <h2 className="d-h2">Other groups</h2>
        <ul className="d-note__list tk-more">
          <li>
            <code>font.*</code>, <code>fontSize.*</code>, <code>lineHeight.*</code> and <code>letterSpacing.*</code>:
            the type system, covered in <Link to="/docs/typography">Typography</Link>.
          </li>
          <li>
            <code>pattern.*</code>, <code>shadow.*</code>, <code>opacity.*</code>, <code>blur.*</code> and{' '}
            <code>effect.*</code>: the dot mesh, hatch, bevels and scrims behind the{' '}
            <Link to="/docs/materials">materials</Link>.
          </li>
          <li>
            <code>motion.duration.*</code> and <code>motion.easing.*</code>: animation timings and curves.
          </li>
          <li>
            <code>size.*</code>: component dimensions. <code>layout.*</code>: offsets on the full-screen 1920 × 1080
            canvas.
          </li>
        </ul>
      </section>
    </>
  );
}

const page: PageDoc = {
  Body: Tokens,
  toc: [
    { id: 'naming', label: 'Naming' },
    { id: 'units', label: 'Design units' },
    { id: 'javascript', label: 'In JavaScript' },
    { id: 'colors', label: 'Colours' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'controls', label: 'Control sizes' },
    { id: 'radii', label: 'Radii' },
    { id: 'borders', label: 'Border widths' },
    { id: 'angles', label: 'Angles' },
    { id: 'layers', label: 'Layers' },
    { id: 'more', label: 'Other groups' },
  ],
};

export default page;
