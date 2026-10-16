import type { ReactNode } from 'react';
import { GraffitiLayer, HatchBackground, ItemCard, Text } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

function Frame({ x, y, children }: { x: number; y: number; children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: u(x),
        top: u(y),
        width: u(560),
        height: u(315),
        overflow: 'hidden',
        isolation: 'isolate',
        borderRadius: u(16),
        border: `${u(3)} solid #3a3a3a`,
        background: '#000',
      }}
    >
      {children}
    </div>
  );
}

function MockScreen({ title, rarity }: { title: string; rarity: 's' | 'a' | 'b' }) {
  return (
    <>
      <Text as="div" role="title" style={{ position: 'relative', margin: `${u(28)} ${u(32)} ${u(20)}` }}>
        {title}
      </Text>
      <div style={{ position: 'relative', display: 'flex', gap: u(17), padding: `0 ${u(32)}` }}>
        {[0, 1, 2].map((i) => (
          <ItemCard key={i} rarity={i ? 'b' : rarity} level={60} interactive={false} />
        ))}
      </div>
    </>
  );
}

/** Gallery preview: a still of a change as a cascade: the outgoing screen, the same screen fading to black, the new screen. */
function Thumbnail() {
  return (
    <div style={{ position: 'relative', width: u(800), height: u(555) }}>
      <Frame x={0} y={0}>
        <HatchBackground />
        <MockScreen title="Storage" rarity="s" />
      </Frame>
      <Frame x={120} y={120}>
        <HatchBackground />
        <MockScreen title="Storage" rarity="s" />
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: '#000', opacity: 0.8 }} />
      </Frame>
      <Frame x={240} y={240}>
        <GraffitiLayer />
        <MockScreen title="Materials" rarity="a" />
      </Frame>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.32,
  usage: (
    <>
      <p>
        Wrap the screen your app shows in a screen transition and give it a <code>screenKey</code>. When the key
        changes, the old screen fades to black, holds, and the new one cuts in, like a game menu. Give each tile of a
        grid <code>tileStagger(i)</code> and the tiles fade in one after another after the cut.
      </p>
      <p>
        Use <code>ScreenFade</code> when you drive the change yourself, for example while a level loads. For a louder,
        labelled change between steps, use the Sweep Transition.
      </p>
    </>
  ),
  usageCode: `import { ScreenTransition } from '@angel1254mc/zone-ui';

<ScreenTransition screenKey={route}>
  <CurrentScreen />
</ScreenTransition>`,
  examples: [
    {
      demo: 'modes',
      title: 'Modes',
      description: 'A hard cut, a fade through black, a fade from black, or a quick blur of the old screen.',
      frame: 'bleed',
    },
    {
      demo: 'screen-fade',
      title: 'Fade while loading',
      description: 'ScreenFade fades to black and tells you when it is black, so you can load and then lift it.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Focus',
      items: [
        <>
          After the change, focus moves to the new screen&apos;s heading: an element with{' '}
          <code className="d-inline-code">data-screen-heading</code>, else the first{' '}
          <code className="d-inline-code">h1</code> or <code className="d-inline-code">h2</code>. Turn it off with{' '}
          <code className="d-inline-code">focusOnEnter=&#123;false&#125;</code>.
        </>,
        <>The outgoing screen stays visible but inert until the cut.</>,
      ],
    },
    {
      title: 'Timing',
      items: [
        <>
          A cut takes about a third of a second: the fade out, then the black{' '}
          <code className="d-inline-code">hold</code>. Lengthen the hold to cover a short load.
        </>,
        <>
          <code className="d-inline-code">appear</code> fades the first screen in from black on mount.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>Every mode becomes a short cross-fade, and tiles appear without the stagger.</>],
    },
  ],
  related: ['sweep-transition', 'screen', 'item-grid'],
};

export default doc;
