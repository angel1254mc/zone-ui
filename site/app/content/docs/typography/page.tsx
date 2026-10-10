import { Link } from 'react-router';
import { TEXT_TONES, Text, tokens } from '@angel1254mc/zone-ui';
import type { TextOutline, TextRole, TextTone } from '@angel1254mc/zone-ui';
import { resolveDemo } from '../../../lib/demos';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { ExampleBlock } from '../../../ui/ExampleBlock';
import { PropsTable } from '../../../ui/PropsTable';
import './typography.css';

const demo = (name: string) => resolveDemo('docs/typography', { demo: name });

/** CSS px at the default scale (0.7) and a 16 px root. */
const toPx = (units: number) => `${Math.round(units * 7) / 10} px`;

/** Font size of a role in design units, read from the `fontSize` tokens. */
function sizeOf(role: TextRole): number {
  if (role.startsWith('condensed')) {
    const key = role.charAt(9).toLowerCase() + role.slice(10);
    return tokens.fontSize.condensed[key as keyof typeof tokens.fontSize.condensed];
  }
  return tokens.fontSize[role as Exclude<TextRole, `condensed${string}`>];
}

interface RoleRow {
  role: TextRole;
  sample: string;
  use: string;
  tone?: TextTone;
  italic?: boolean;
  outline?: TextOutline;
  plate?: string;
}

const ROLES: RoleRow[] = [
  { role: 'nano', sample: 'LEVEL', use: 'HUD captions', tone: 'secondary' },
  { role: 'tiny', sample: 'UID 1000000001', use: 'Footer IDs, small labels', tone: 'secondary' },
  { role: 'micro', sample: 'DETAIL', use: 'Panel header tags', tone: 'secondary' },
  { role: 'caption', sample: 'AGENT INFO', use: 'Captions', tone: 'secondary' },
  { role: 'label', sample: 'Base stats', use: 'Section labels, chips, counts', tone: 'muted' },
  { role: 'body', sample: 'Base ATK 684', use: 'Body copy, stat rows' },
  { role: 'bodyLg', sample: 'Faction overview', use: 'Emphasised rows', tone: 'tertiary' },
  { role: 'bodyXl', sample: 'Active modifiers', use: 'Currency, element tags', tone: 'secondary' },
  { role: 'button', sample: 'Dismantle', use: 'Button and tab labels (italic)', italic: true },
  { role: 'title', sample: 'Daily rewards', use: 'Panel and dialog titles' },
  { role: 'titlePill', sample: 'Lv. 60', use: 'Level pill', italic: true, outline: 'md', plate: '#1D1D1D' },
  { role: 'eventTitle', sample: 'Season finale', use: 'Outlined event titles', outline: 'event', plate: '#3FA7A9' },
  { role: 'displayName', sample: 'Proxy', use: 'Character names' },
  { role: 'ghostLevel', sample: '60', use: 'Large background numbers', italic: true, tone: 'disabled' },
  { role: 'badgeNew', sample: 'NEW!', use: 'The NEW! badge', italic: true, outline: 'new', tone: 'soft' },
  { role: 'condensedSm', sample: 'Empty', use: 'EMPTY under a slot', tone: 'muted' },
  { role: 'condensedMd', sample: 'Empty', use: 'EMPTY in a stat row', tone: 'muted' },
  { role: 'condensedInterstitial', sample: 'Agent select', use: 'Sweep transition label', italic: true },
  { role: 'condensedLg', sample: 'Max', use: 'MAX in the level pill', tone: 'disabled' },
  { role: 'condensedXlHud', sample: 'Events', use: 'HUD caps' },
  { role: 'condensedXl', sample: 'Events', use: 'Screen caps' },
];

/** Tones that fall below WCAG AA contrast on black: decoration only. */
const DECORATIVE: TextTone[] = ['faint', 'ghost', 'engraved'];

function RoleTable() {
  return (
    <div className="ty-roles-wrap zzz-scrollbar" tabIndex={0} role="region" aria-label="Text roles">
      <table className="ty-roles">
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">Size</th>
            <th scope="col">Sample</th>
          </tr>
        </thead>
        <tbody>
          {ROLES.map((r) => {
            const units = sizeOf(r.role);
            const condensed = r.role.startsWith('condensed');
            const sample = (
              <Text role={r.role} tone={r.tone} italic={r.italic} outline={r.outline} className="ty-sample">
                {r.sample}
              </Text>
            );
            return (
              <tr key={r.role}>
                <th scope="row">
                  <span className="ty-role">
                    <code>role="{r.role}"</code>
                    <span className="ty-use">{r.use}</span>
                  </span>
                </th>
                <td>
                  <span className="ty-meta">
                    {units} units · {toPx(units)}
                    <br />
                    {condensed ? 'Condensed' : 'UI face'}
                  </span>
                </td>
                <td>
                  {r.plate ? (
                    <span className="ty-plate" style={{ background: r.plate }}>
                      {sample}
                    </span>
                  ) : (
                    sample
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Tones() {
  return (
    <ul className="ty-tones">
      {TEXT_TONES.map((t) => (
        <li key={t} className={t === 'onAccent' ? 'ty-tone ty-tone--accent' : 'ty-tone'}>
          <Text role="bodyLg" tone={t}>
            Base ATK 684
          </Text>
          <code>tone="{t}"</code>
          {DECORATIVE.includes(t) && <span className="ty-tone__tag">Decorative</span>}
        </li>
      ))}
    </ul>
  );
}

function Typography() {
  return (
    <>
      <section className="d-section d-prose" id="text">
        <h2 className="d-h2">The Text component</h2>
        <p>
          Use <code>Text</code> for every piece of text. Pick a <code>role</code> for the size and face, and a{' '}
          <code>tone</code> for the colour. It renders a <code>span</code> unless you pass <code>as</code>. Without a
          tone, text inherits its colour.
        </p>
        <CodeBlock
          code={`import { Text } from '@angel1254mc/zone-ui';

<Text as="h2" role="title">Daily rewards</Text>
<Text role="label" tone="muted">Base stats</Text>
<Text role="button" italic>Craft</Text>
<Text role="body" ariaRole="status">Saved</Text>`}
        />
        <p>
          <code>role</code> is the text role, not the ARIA attribute. Pass an ARIA role with <code>ariaRole</code>.
        </p>
      </section>

      <section className="d-section d-prose" id="faces">
        <h2 className="d-h2">Typefaces</h2>
        <p>
          Every role uses weight 900 in one of two faces. <code>font-size-adjust: cap-height</code> keeps capitals the
          same height whichever face loads, so sizes never shift.
        </p>
        <div className="ty-faces">
          <div className="ty-face">
            <Text role="displayName">Zone 0123</Text>
            <p className="ty-face__label">
              UI face: <code>--zzz-font-family-ui</code>. Inpin Hongmeng, then Mona Sans at 110 % width. Cap height
              0.84.
            </p>
          </div>
          <div className="ty-face">
            <Text role="condensedXl">Zone 0123</Text>
            <p className="ty-face__label">
              Condensed face: <code>--zzz-font-family-condensed</code>. Impact, then Mona Sans at 75 % width. Always
              uppercase. Cap height 0.79.
            </p>
          </div>
        </div>
        <p>
          Mona Sans (SIL OFL) loads from <code>fonts.css</code>. Inpin Hongmeng is a commercial font and is not
          included. If you hold a web licence, self-host it under that family name and it takes over.
        </p>
        <CodeBlock
          title="fonts.css"
          code={`@font-face {
  font-family: "Inpin Hongmeng";
  src: url("/fonts/inpin-hongmeng.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}`}
        />
        <p>
          There is no italic font. <code>italic</code> shears the upright glyphs by 10° about the baseline (
          <code>.zzz-italic</code>). Never use <code>font-style: italic</code>.
        </p>
      </section>

      <section className="d-section" id="roles">
        <h2 className="d-h2">Roles</h2>
        <p className="d-muted">
          Sizes are design units from the <code className="d-inline-code">fontSize</code> tokens. The px values use the
          default scale of 0.7.
        </p>
        <RoleTable />
      </section>

      <section className="d-section" id="tones">
        <h2 className="d-h2">Tones</h2>
        <p className="d-muted">
          Decorative tones sit below WCAG AA contrast on black. Use them for ornament only, never as the only carrier of
          information.
        </p>
        <Tones />
      </section>

      <section className="d-section" id="modifiers">
        <h2 className="d-h2">Modifiers</h2>
        <p className="d-muted">
          <code className="d-inline-code">italic</code> shears, <code className="d-inline-code">outline</code> draws a
          stroke behind the fill, <code className="d-inline-code">deboss</code> presses text into its surface,{' '}
          <code className="d-inline-code">tracked</code> spaces letters out and{' '}
          <code className="d-inline-code">fit</code> shrinks a single line to its box.
        </p>
        <ExampleBlock example={demo('text-modifiers')} label="Text modifiers" />
      </section>

      <PropsTable component="Text" />

      <section className="d-section" id="figures">
        <h2 className="d-h2">Figures and counters</h2>
        <p className="d-muted">
          Text uses proportional figures. <code className="d-inline-code">tabular</code> turns on tabular figures, but
          in Mona Sans they draw a slashed zero and a footed one. For counters that must line up, use{' '}
          <code className="d-inline-code">Zeros</code>: one fixed cell per digit, with the leading zeros dimmed. Screen
          readers hear the plain number.
        </p>
        <ExampleBlock example={demo('zeros-counters')} label="Zeros" />
      </section>

      <PropsTable component="Zeros" />

      <section className="d-section" id="highlights">
        <h2 className="d-h2">Keywords and values</h2>
        <p className="d-muted">
          <code className="d-inline-code">Keyword</code> marks a term in orange, with an optional icon.{' '}
          <code className="d-inline-code">Value</code> marks a number in green. Both inherit the surrounding size unless
          you pass <code className="d-inline-code">textRole</code>. For whole effect descriptions, use{' '}
          <Link to="/components/effect-text" className="ty-link">
            Effect Text
          </Link>
          .
        </p>
        <ExampleBlock example={demo('keyword-value')} label="Keyword and Value" />
      </section>

      <PropsTable component="Keyword" />
      <PropsTable component="Value" />

      <section className="d-section d-prose" id="classes">
        <h2 className="d-h2">CSS classes</h2>
        <p>
          <code>Text</code> maps <code>role</code> to <code>.zzz-text-&lt;role&gt;</code> in kebab-case and{' '}
          <code>tone</code> to <code>.zzz-tone-&lt;tone&gt;</code>. Use the classes directly on any element inside{' '}
          <code>ZzzTheme</code>.
        </p>
        <CodeBlock
          code={`<h3 className="zzz-text-title zzz-tone-secondary">Daily rewards</h3>
<p className="zzz-text-body-lg">Faction overview</p>
<span className="zzz-text-button zzz-italic">Craft</span>`}
        />
        <p>
          The tokens behind them are <code>--zzz-font-size-*</code>, <code>--zzz-line-height-*</code> and{' '}
          <code>--zzz-color-text-*</code>. See <Link to="/docs/tokens">Tokens</Link>.
        </p>
      </section>
    </>
  );
}

const page: PageDoc = {
  Body: Typography,
  toc: [
    { id: 'text', label: 'The Text component' },
    { id: 'faces', label: 'Typefaces' },
    { id: 'roles', label: 'Roles' },
    { id: 'tones', label: 'Tones' },
    { id: 'modifiers', label: 'Modifiers' },
    { id: 'api-Text', label: 'Text props', sub: true },
    { id: 'figures', label: 'Figures and counters' },
    { id: 'api-Zeros', label: 'Zeros props', sub: true },
    { id: 'highlights', label: 'Keywords and values' },
    { id: 'api-Keyword', label: 'Keyword props', sub: true },
    { id: 'api-Value', label: 'Value props', sub: true },
    { id: 'classes', label: 'CSS classes' },
  ],
};

export default page;
