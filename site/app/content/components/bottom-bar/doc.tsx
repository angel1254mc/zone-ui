import { BottomBar, Button, FilterIcon, IconButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the foot of a screen, a hatched content area over the black band. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(640 * var(--zzz-px))', borderRadius: 8, overflow: 'hidden' }}>
      <div className="zzz-bg-hatch" style={{ height: 'calc(200 * var(--zzz-px))' }} />
      <BottomBar
        left={<IconButton icon={<FilterIcon />} label="Filter" />}
        right={
          <>
            <Button>Lock</Button>
            <Button width="compact">Enhance</Button>
          </>
        }
      />
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.38,
  usage: (
    <>
      <p>
        The bottom bar is the black band along the foot of a game-style screen. Put actions for the current screen in
        its left and right groups, and list keyboard shortcuts with <code>hints</code>. Inside a Screen it sits in the
        footer landmark, with the player&apos;s UID in the corner.
      </p>
      <p>
        <code>UidFooter</code> prints the player ID with <code>SignalBars</code> after it, and Screen places it for you.
        For the header of the same screen, use Top Bar. On a website, use Site Footer instead.
      </p>
    </>
  ),
  usageCode: `import { BottomBar, Button } from '@angel1254mc/zone-ui';

<BottomBar
  left={<Button width="compact">Compare</Button>}
  right={<Button width="compact">Enhance</Button>}
/>`,
  examples: [
    {
      demo: 'key-hints',
      title: 'Key hints',
      description: 'Shortcuts sit at the right of the band, under a faint separator line.',
      frame: 'bleed',
    },
    {
      demo: 'icon-dock',
      title: 'Icon dock',
      description: 'A row of round buttons on the right turns the band into a home-screen dock.',
      frame: 'bleed',
    },
    {
      demo: 'screen-footer',
      title: 'At the foot of a screen',
      description: 'Screen places the bar in its footer and adds the UID with its signal bars.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Layout',
      items: [
        <>The band fills its container&apos;s width and keeps a fixed height. Both groups keep the control gap.</>,
        <>
          Extra <code>children</code> render between the left and right groups.
        </>,
      ],
    },
    {
      title: 'Key hints',
      items: [
        <>
          Each entry of <code>hints</code> takes the props of Key Hint. The hint only names the shortcut: give it{' '}
          <code>onActivate</code> with the same handler as its control to make the key work.
        </>,
      ],
    },
    {
      title: 'UID and signal',
      items: [
        <>
          <code>signal</code> lights 0 to 3 bars. <code>hideSignal</code> drops them from <code>UidFooter</code>.
        </>,
        <>
          <code>SignalBars</code> is named &ldquo;Connection 2 of 3&rdquo; for screen readers. Pass{' '}
          <code>decorative</code> to hide it.
        </>,
      ],
    },
  ],
  related: ['top-bar', 'screen', 'key-hint'],
};

export default doc;
