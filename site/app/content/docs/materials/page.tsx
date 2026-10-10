import { Link } from 'react-router';
import { Table } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';
import { resolveDemo } from '../../../lib/demos';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { ExampleBlock } from '../../../ui/ExampleBlock';
import './materials.css';

const demo = (name: string) => resolveDemo('docs/materials', { demo: name });

interface ClassRow {
  name: string;
  draws: string;
}

const CLASSES: ClassRow[] = [
  {
    name: '.zzz-mat-pill',
    draws:
      'The dark pill: a near-black fill with a fine dot mesh, a 5-unit #333 ring lit on its top left, a black keyline and a pill radius.',
  },
  {
    name: '.zzz-mat-panel',
    draws: 'A panel: a lit #333 ring and a keyline drawn outside the box, a black body and a 29-unit outer radius.',
  },
  { name: '.zzz-mat-panel--large', draws: 'The large panel: a 4-unit #2D2D2D ring and a 33-unit radius.' },
  { name: '.zzz-mat-textured', draws: 'A panel header: #222 with a coarse dot mesh. Add --body for #191919.' },
  { name: '.zzz-mat-drawer', draws: 'A drawer body: #1A1A1A with a medium dot mesh.' },
  { name: '.zzz-dots', draws: 'The dot mesh on its own, over any background colour.' },
  { name: '.zzz-bg-hatch', draws: 'A 39.8° white hatch over --zzz-hatch-base (black by default).' },
  { name: '.zzz-accent-fill', draws: 'The live accent as the background, with black text.' },
  { name: '.zzz-accent-ring', draws: 'The live accent as the border colour.' },
  { name: '.zzz-pressable', draws: 'The pressed look: an accent fill while the element is held.' },
  { name: '.zzz-focusable', draws: 'The keyline and accent focus ring on :focus-visible.' },
];

const classColumns: TableColumn<ClassRow>[] = [
  {
    key: 'name',
    header: 'Class',
    align: 'start',
    rowHeader: true,
    width: 300,
    cell: (r) => (
      <span className="d-prop-name">
        <code>{r.name}</code>
      </span>
    ),
  },
  {
    key: 'draws',
    header: 'Draws',
    align: 'start',
    cell: (r) => <span className="d-prop-desc">{r.draws}</span>,
  },
];

function Materials() {
  return (
    <>
      <section className="d-section d-prose mt-prose" id="overview">
        <h2 className="d-h2">Classes, not components</h2>
        <p>
          Materials are the surfaces the components are made of. They are CSS classes from the kit&apos;s stylesheet:
          put them on any element inside <code>ZzzTheme</code> to give your own parts the same look.
        </p>
        <div className="d-table-wrap zzz-scrollbar" tabIndex={0} role="region" aria-label="Material classes">
          <Table caption="Material classes" hideCaption columns={classColumns} rows={CLASSES} rowKey={(r) => r.name} />
        </div>
      </section>

      <section className="d-section d-prose mt-prose" id="pill">
        <h2 className="d-h2">Dark pill</h2>
        <p>
          <code>.zzz-mat-pill</code> is the surface of Button, Icon Button, Select and the segmented tabs. Give it a
          size and content; the radius rounds any height into a capsule. Set <code>--zzz-mat-ring</code> to change the
          ring width, or <code>--zzz-mat-bevel: none</code> to drop the lit edge.
        </p>
        <ExampleBlock example={demo('pill-samples')} label="Dark pill" />
        <p>
          The pill draws its lit edge in <code>::after</code>. Leave that pseudo-element to the material.
        </p>
      </section>

      <section className="d-section d-prose mt-prose" id="panel">
        <h2 className="d-h2">Panel</h2>
        <p>
          <code>.zzz-mat-panel</code> draws its ring and keyline as outer shadows, so <code>overflow: hidden</code>{' '}
          clips the content to the inner curve and never cuts the ring. The element&apos;s box is the inner area: for a
          panel W × H overall with a 5-unit ring, size the element W − 10 by H − 10 and leave 5 units of room around it.
        </p>
        <ExampleBlock example={demo('panel-samples')} label="Panels" />
        <p>
          For a ready-made container with header and body slots, use <Link to="/components/panel">Panel</Link>.
        </p>
      </section>

      <section className="d-section d-prose mt-prose" id="surfaces">
        <h2 className="d-h2">Textured surfaces and hatch</h2>
        <p>
          <code>.zzz-mat-textured</code> is a panel header and <code>.zzz-mat-textured--body</code> the darker lower
          body. <code>.zzz-mat-drawer</code> fills a drawer. <code>.zzz-bg-hatch</code> is the striped page background;
          set <code>--zzz-hatch-base</code> to hatch over another colour.
        </p>
        <ExampleBlock example={demo('surface-swatches')} label="Textured surfaces and hatch" />
        <p>
          The <Link to="/docs/backgrounds">Hatch Background</Link> component draws the same hatch as a full-bleed layer.
        </p>
      </section>

      <section className="d-section d-prose mt-prose" id="dots">
        <h2 className="d-h2">Dot mesh</h2>
        <p>
          <code>.zzz-dots</code> draws a diamond lattice of soft light dots, with optional dark dots between them. Tune
          it with three custom properties on the element or an ancestor:
        </p>
        <ul className="d-note__list">
          <li>
            <code>--zzz-dots-size</code>: the lattice pitch. The kit uses <code>--zzz-pattern-dots-sm</code>,{' '}
            <code>-md</code> and <code>-lg</code> (4.64, 5.2 and 7 units).
          </li>
          <li>
            <code>--zzz-dots-alpha</code>: the white alpha of the light dots (default 0.035).
          </li>
          <li>
            <code>--zzz-dots-shade</code>: the black alpha of the dark dots (default 0).
          </li>
        </ul>
        <ExampleBlock example={demo('dot-lattice')} label="Dot mesh" />
      </section>

      <section className="d-section d-prose mt-prose" id="accent">
        <h2 className="d-h2">Accent</h2>
        <p>
          <code>.zzz-accent-fill</code> and <code>.zzz-accent-ring</code> mark selected and active elements with the
          live accent, so they pulse in step with every component on screen.
        </p>
        <ExampleBlock example={demo('accent-states')} label="Accent" />
      </section>

      <section className="d-section d-prose mt-prose" id="pressed">
        <h2 className="d-h2">Pressed</h2>
        <p>
          Add <code>.zzz-pressable</code> to anything you press. While it is held (<code>:active</code>) or carries{' '}
          <code>data-pressed</code>, an accent fill grows 4 units past the border box, over the ring and keyline. The
          label and glyphs turn black, and children marked <code>.zzz-pressable__hide</code>, such as icon caps,
          disappear. There is no transition.
        </p>
        <ExampleBlock example={demo('pressable-button')} label="Pressed" />
        <ul className="d-note__list">
          <li>
            <code>--zzz-press-outset</code> sets how far the fill grows. Dialog buttons set it to 0.
          </li>
          <li>
            Pointer presses use <code>:active</code>. For the keyboard, spread <code>usePressFlash()</code> on the
            element: Enter flashes the pressed look and Space holds it.
          </li>
          <li>
            The pressed fill lives in <code>::before</code>. Leave that pseudo-element to the material.
          </li>
        </ul>
        <CodeBlock
          code={`import { usePressFlash } from '@angel1254mc/zone-ui';

function HoldButton() {
  const press = usePressFlash<HTMLButtonElement>();
  return (
    <button type="button" className="zzz-mat-pill zzz-pressable zzz-focusable" {...press}>
      Hold me
    </button>
  );
}`}
        />
      </section>

      <section className="d-section d-prose mt-prose" id="focus">
        <h2 className="d-h2">Focus</h2>
        <p>
          <code>.zzz-focusable</code> draws <code>--zzz-focus-ring</code>, a black keyline and an accent ring, on{' '}
          <code>:focus-visible</code>. In forced-colors mode a system outline replaces it. Tab to the Hold me button
          above to see it.
        </p>
      </section>
    </>
  );
}

const page: PageDoc = {
  Body: Materials,
  toc: [
    { id: 'overview', label: 'Classes, not components' },
    { id: 'pill', label: 'Dark pill' },
    { id: 'panel', label: 'Panel' },
    { id: 'surfaces', label: 'Textured surfaces and hatch' },
    { id: 'dots', label: 'Dot mesh' },
    { id: 'accent', label: 'Accent' },
    { id: 'pressed', label: 'Pressed' },
    { id: 'focus', label: 'Focus' },
  ],
};

export default page;
