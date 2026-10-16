import { ScrollHint, StatRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a clipped panel of stat rows with the triangle forced visible on its bottom edge. */
function Thumbnail() {
  return (
    <div
      style={{
        width: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px)) calc(20 * var(--zzz-px)) 0',
        boxSizing: 'border-box',
        borderRadius: 'calc(20 * var(--zzz-px))',
        border: 'calc(4 * var(--zzz-px)) solid #1f1f1f',
        background: '#000',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'grid',
          alignContent: 'start',
          gap: 'calc(10 * var(--zzz-px))',
          height: 'calc(200 * var(--zzz-px))',
          overflow: 'hidden',
        }}
      >
        <StatRow label="HP" value="7,673" />
        <StatRow label="ATK" value="938" />
        <StatRow label="DEF" value="606" />
        <StatRow label="Impact" value="93" />
        <StatRow label="CRIT Rate" value="19.4%" />
        <ScrollHint visible />
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        A scroll hint tells people a container holds more than it shows, for panels and rows that hide their scrollbar.
        The triangle sits on a panel's bottom edge; the chevron ends a horizontal row.
      </p>
      <p>
        Pass the scroll container as <code>target</code> and the hint hides itself once the end is reached. Make it{' '}
        <code>interactive</code> to let a click scroll further. When a visible scrollbar is fine, use Scroll Area, which
        can also host the hint.
      </p>
    </>
  ),
  usageCode: `import { useRef } from 'react';
import { ScrollHint } from '@angel1254mc/zone-ui';

const viewport = useRef(null);

<div style={{ position: 'relative' }}>
  <div ref={viewport} style={{ height: 240, overflowY: 'auto' }}>…</div>
  <ScrollHint target={viewport} />
</div>`,
  examples: [
    {
      demo: 'reward-row',
      title: 'Paging a row',
      description: 'An interactive chevron at the end of a reward row scrolls it a page further on each click.',
      frame: 'start',
    },
    {
      demo: 'glyphs',
      title: 'Glyphs and directions',
      description: 'The panel and list triangles, and the chevron for sideways rows. Up and left are mirrors.',
    },
  ],
  notes: [
    {
      title: 'Visibility',
      items: [
        <>
          With <code>target</code>, the hint shows only while there is more to scroll in its <code>direction</code>. It
          follows scrolling, resizing and content changes.
        </>,
        <>
          Without <code>target</code> it is always shown. Force it either way with <code>visible</code>.
        </>,
      ],
    },
    {
      title: 'Placement',
      items: [
        <>
          By default the hint is absolutely positioned on the edge it points at, so wrap the scroll container and the
          hint in an element with <code>position: relative</code>.
        </>,
        <>
          <code>placement="static"</code> puts it in the normal flow instead.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>A plain hint is hidden from assistive tech; the scroll container itself should be focusable.</>,
        <>
          An interactive hint is a button named "Scroll down", "Scroll right" and so on. Rename it with{' '}
          <code>label</code>. It leaves the tab order while hidden.
        </>,
      ],
    },
  ],
  related: ['scroll-area', 'reward-preview', 'panel'],
};

export default doc;
