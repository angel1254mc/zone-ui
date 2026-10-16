import { SortToggle } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: descending and ascending side by side, so the mirrored glyph reads at a glance. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 'calc(24 * var(--zzz-px))' }}>
      <SortToggle size="lg" defaultDirection="desc" />
      <SortToggle size="lg" defaultDirection="asc" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.8,
  usage: (
    <>
      <p>
        A sort toggle flips a list between descending and ascending order. Put it right after the Select that picks what
        to sort by, at the same size. Each press switches direction and mirrors the glyph.
      </p>
      <p>For other single-glyph actions, use Icon button. To choose the sort key itself, use Select.</p>
    </>
  ),
  usageCode: `import { SortToggle } from '@angel1254mc/zone-ui';

<SortToggle direction={direction} onDirectionChange={setDirection} />`,
  examples: [
    {
      demo: 'sorted-list',
      title: 'Sorting a list',
      description: 'A Select picks the key and the toggle picks the direction of the list below.',
      frame: 'start',
    },
    {
      demo: 'custom-labels',
      title: 'Custom labels',
      description: 'Name each direction in your own words, such as newest and oldest first.',
    },
    {
      demo: 'sizes-and-states',
      title: 'Sizes and states',
      description: 'Small, medium and large, each descending, ascending, pressed and disabled.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          The accessible name states the current order: "Sort descending" or "Sort ascending" by default. Change both
          with <code>labels</code>.
        </>,
        <>
          There is no <code>aria-pressed</code>. A pressed state would read as if one direction were switched off.
        </>,
      ],
    },
    {
      title: 'States',
      items: [
        <>
          <b>Direction.</b> Descending by default. Start elsewhere with <code>defaultDirection</code> or control it with{' '}
          <code>direction</code>.
        </>,
        <>
          <b>Pressed.</b> The live accent fills the circle while it is held. Force it with <code>pressed</code>.
        </>,
        <>
          <b>Disabled.</b> The glyph greys out.
        </>,
      ],
    },
  ],
  related: ['select', 'icon-button', 'table'],
};

export default doc;
