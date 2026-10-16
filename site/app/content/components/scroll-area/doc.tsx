import { ScrollArea } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a short list with the bar showing it overflows. */
function Thumbnail() {
  return (
    <ScrollArea
      label="Preview list"
      style={{ height: 'calc(300 * var(--zzz-px))', width: 'calc(460 * var(--zzz-px))' }}
    >
      <div style={{ display: 'grid', gap: 'calc(12 * var(--zzz-px))' }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 'calc(41 * var(--zzz-px))',
              display: 'flex',
              alignItems: 'center',
              padding: '0 calc(16 * var(--zzz-px))',
              borderRadius: 'calc(21 * var(--zzz-px))',
              background: 'var(--zzz-color-surface-stat-row)',
              fontSize: 'var(--zzz-font-size-body)',
            }}
          >
            Row {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Scroll area wraps a list, grid or row that is taller or wider than the space it has. It draws the kit scrollbar,
        so a long list looks the same everywhere. Wheel, touch and keyboard scrolling keep working as they do on any
        page.
      </p>
      <p>
        For a long list of search results or news items, use Pagination instead. When the content always fits, leave out
        the wrapper.
      </p>
    </>
  ),
  usageCode: `import { ScrollArea } from '@angel1254mc/zone-ui';

<ScrollArea label="Missions" style={{ height: 300 }}>
  {missions.map((mission) => (
    <MissionRow key={mission.id} {...mission} />
  ))}
</ScrollArea>`,
  examples: [
    {
      demo: 'horizontal-row',
      title: 'Horizontal row',
      description:
        'With orientation horizontal and the list variant, a row of items scrolls sideways and a chevron shows more content.',
    },
    {
      demo: 'bar-side',
      title: 'Bar on either side',
      description: 'The side prop moves the bar to the left or the right of the content.',
    },
    {
      demo: 'hidden-when-fits',
      title: 'Bar only when it overflows',
      description: 'With alwaysShow off, the bar appears only when the content is taller than the area.',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          The scrolling area is one tab stop. Arrow keys, <kbd>Page Up</kbd>, <kbd>Page Down</kbd>, <kbd>Home</kbd> and{' '}
          <kbd>End</kbd> scroll it.
        </>,
        <>Pressing and holding an arrow cap on the bar keeps scrolling.</>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          Pass <code>label</code> to name the scrolling region. Screen readers announce the name when focus enters the
          area.
        </>,
        <>The drawn bar is hidden from screen readers. The scrolling area itself carries the position.</>,
      ],
    },
    {
      title: 'Variants',
      items: [
        <>
          <code>grid</code> (the default) draws the bar. <code>panel</code> and <code>list</code> draw no bar. They fade
          or clip the edge instead, and <code>hint</code> adds an arrow while more content remains.
        </>,
      ],
    },
  ],
  related: ['pagination', 'scroll-hint', 'item-grid'],
};

export default doc;
