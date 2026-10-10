import { BottomBar, Button, ItemCard, Screen, SectionTitleStrip, Stage, TopBar } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: a whole screen on a 1280 × 720 Stage canvas, fitted into a box sized in design units.
 * Cards without art, so nothing loads; no entrance fade.
 */
function Thumbnail() {
  return (
    <div style={{ width: u(560), height: u(315), borderRadius: 10, overflow: 'hidden' }}>
      <Stage width={1280} height={720}>
        <Screen
          background="hatch"
          entrance={false}
          uid="1000000001"
          topBar={<TopBar title="Storage" onBack={() => {}} />}
          sectionStrip={<SectionTitleStrip title="W-Engines" count={[113, 2000]} />}
          bottomBar={
            <BottomBar hints={[{ keyCap: 'T', label: 'Lock' }]} right={<Button width="wide">Confirm</Button>} />
          }
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(7, ${u(118)})`,
              gap: u(17),
              padding: `${u(40)} ${u(68)}`,
            }}
          >
            {Array.from({ length: 14 }, (_, i) => (
              <ItemCard
                key={i}
                rarity={(['s', 'a', 'a', 'b', 'b'] as const)[i % 5]}
                level={60}
                selected={i === 0}
                interactive={false}
              />
            ))}
          </div>
        </Screen>
      </Stage>
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Screen is the frame of one game-style page: a background layer, a header with the Top Bar and an optional
        section strip, your content in the middle and a Bottom Bar or dock at the foot, with the player UID in the
        corner. It fills its container, so place it in a <code>Stage</code> to scale a fixed 1920 × 1080 layout, or in
        any box with a height.
      </p>
      <p>Change screens with Screen Transition. For a website page, use a Nav Bar and Site Footer instead.</p>
    </>
  ),
  usageCode: `import { BottomBar, Button, Screen, Stage, TopBar } from '@angel1254mc/zone-ui';

<Stage>
  <Screen
    background="hatch"
    topBar={<TopBar title="Manage Item" onBack={goBack} />}
    bottomBar={<BottomBar right={<Button>Confirm</Button>} />}
    onBack={goBack}
  >
    {content}
  </Screen>
</Stage>`,
  examples: [
    {
      demo: 'sub-page',
      title: 'Sub-page',
      description: 'A hatch background, a page title, and the cost next to Confirm in the bottom bar.',
      frame: 'bleed',
    },
    {
      demo: 'home-screen',
      title: 'Home screen',
      description: 'Your own art as the background, a translucent top bar and a dock of round buttons.',
      frame: 'bleed',
    },
    {
      demo: 'agent-screen',
      title: 'Agent screen',
      description: 'Graffiti background, no top-bar band and a title pill instead of a page title.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Backgrounds',
      items: [
        <>
          <code className="d-inline-code">black</code> (default), <code className="d-inline-code">hatch</code>,{' '}
          <code className="d-inline-code">flat</code>, <code className="d-inline-code">mural</code> (a band behind the
          top bar) and <code className="d-inline-code">graffiti</code>.
        </>,
        <>Any other node becomes the background: an image, a canvas, a layered scene.</>,
      ],
    },
    {
      title: 'Landmarks and keyboard',
      items: [
        <>
          The top bar sits in a <code className="d-inline-code">&lt;header&gt;</code>, the content in{' '}
          <code className="d-inline-code">&lt;main&gt;</code> and the bottom bar in a{' '}
          <code className="d-inline-code">&lt;footer&gt;</code>.
        </>,
        <>
          With <code className="d-inline-code">onBack</code>, <kbd>Esc</kbd> anywhere in the screen calls it, unless a
          child such as an open Select handled it first.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>No fade from black when the screen mounts. Turn the fade off with entrance=&#123;false&#125;.</>],
    },
  ],
  related: ['top-bar', 'bottom-bar', 'stage'],
};

export default doc;
