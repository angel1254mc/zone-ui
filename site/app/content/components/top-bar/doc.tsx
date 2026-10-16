import {
  BatteryIcon,
  Button,
  DennyIcon,
  HatchBackground,
  HomeIcon,
  ItemCard,
  PolychromeIcon,
  ResourceBar,
  TopBar,
} from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/** Gallery preview: the top of a screen, with the bar over a hatch and a row of cards, at an explicit width. */
function Thumbnail() {
  return (
    <div style={{ position: 'relative', width: u(1100), height: u(470), overflow: 'hidden', borderRadius: 12 }}>
      <HatchBackground />
      <div style={{ position: 'relative' }}>
        <TopBar
          onBack={() => {}}
          left={
            <Button size="md" width="compact" icon={<HomeIcon />}>
              City
            </Button>
          }
          right={
            <ResourceBar
              items={[
                { label: 'Battery Charge', value: 180, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
                { label: 'Dennies', value: 76418, icon: <DennyIcon />, onAdd: () => {} },
                { label: 'Polychrome', value: 1600, icon: <PolychromeIcon />, onAdd: () => {} },
              ]}
            />
          }
        />
        <div style={{ display: 'flex', gap: u(17), padding: `${u(60)} ${u(68)}` }}>
          {(['s', 'a', 'a', 'b', 'b', 'b', 'b'] as const).map((r, i) => (
            <ItemCard key={i} rarity={r} level={60} interactive={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.23,
  usage: (
    <>
      <p>
        The top bar is the header of a game-style screen: the red Back tag, then where you are (a location button, a
        page title or a profile pill), and on the right the resources or the actions for this screen. Put it in a
        Screen&apos;s <code>topBar</code> slot and it lands in the page&apos;s header.
      </p>
      <p>
        Choose the band with <code>background</code>: solid black for sub-pages, translucent over art, none on agent
        screens. For a website header, use the Nav Bar.
      </p>
    </>
  ),
  usageCode: `import { TopBar } from '@angel1254mc/zone-ui';

<TopBar title="Manage Item" onBack={goBack} right={<ResourceBar items={resources} />} />`,
  examples: [
    {
      demo: 'page-title',
      title: 'Page title',
      description: 'Back and a page title, the header of most sub-pages.',
      frame: 'bleed',
    },
    {
      demo: 'actions',
      title: 'Screen actions',
      description: 'A filter on the left, a key hint, a lock toggle and Recycle on the right.',
      frame: 'bleed',
    },
    {
      demo: 'over-art',
      title: 'Over art',
      description: 'A translucent band over the scene, with a profile pill instead of Back.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Layout',
      items: [
        <>
          The bar keeps one row and does not fold. On narrow screens keep the groups short, or place the whole screen in
          a <code className="d-inline-code">Stage</code> so it scales as one picture.
        </>,
      ],
    },
    {
      title: 'Back',
      items: [
        <>
          The Back tag appears only with <code className="d-inline-code">onBack</code>. Its accessible name is
          &quot;Back&quot;. Change it with <code className="d-inline-code">backLabel</code>.
        </>,
        <>
          Inside a Screen, also pass <code className="d-inline-code">onBack</code> to the Screen so <kbd>Esc</kbd> goes
          back too.
        </>,
      ],
    },
  ],
  related: ['screen', 'currency-pill', 'page-title'],
};

export default doc;
