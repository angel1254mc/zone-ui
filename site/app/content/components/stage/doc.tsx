import type { CSSProperties } from 'react';
import { Stage, Text } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const CORNERS: CSSProperties[] = [
  { left: u(40), top: u(40), borderLeftWidth: u(8), borderTopWidth: u(8) },
  { right: u(40), top: u(40), borderRightWidth: u(8), borderTopWidth: u(8) },
  { left: u(40), bottom: u(40), borderLeftWidth: u(8), borderBottomWidth: u(8) },
  { right: u(40), bottom: u(40), borderRightWidth: u(8), borderBottomWidth: u(8) },
];

/** Gallery preview: a 1920 × 1080 artboard (120-unit grid, corner marks) fitted into a box sized in design units. */
function Thumbnail() {
  return (
    <div style={{ width: u(500), height: u(330), borderRadius: 10, overflow: 'hidden' }}>
      <Stage>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(90deg, #262626 calc(2 * var(--zzz-px)), transparent 0), linear-gradient(#262626 calc(2 * var(--zzz-px)), transparent 0)',
            backgroundSize: `${u(120)} ${u(120)}`,
          }}
        />
        {CORNERS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: u(120),
              height: u(120),
              borderStyle: 'solid',
              borderWidth: 0,
              borderColor: 'var(--zzz-accent)',
              ...c,
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <Text role="eventTitle" outline="event" style={{ fontSize: u(160) }}>
            1920 × 1080
          </Text>
        </div>
      </Stage>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Stage is an artboard for full-screen, game-style scenes: a fixed canvas, 1920 × 1080 design units by default,
        that scales as one picture to fit its box, like a game screen or a slide. Position things inside in design units
        and they keep their layout at any size. Wrap a Screen in it to build a game menu.
      </p>
      <p>
        Ordinary pages don&apos;t need it: components already size themselves with the theme scale and lay out
        responsively. Reach for Stage only when a composition must keep its aspect ratio.
      </p>
    </>
  ),
  usageCode: `import { Stage } from '@angel1254mc/zone-ui';

<div style={{ width: '100vw', height: '100vh' }}>
  <Stage>{scene}</Stage>
</div>`,
  examples: [
    {
      demo: 'letterbox',
      title: 'Letterboxing',
      description: 'Drag the corner of the box: the canvas scales as a whole and the spare space is letterboxed.',
      frame: 'start',
    },
    {
      demo: 'fit-height',
      title: 'Fit the height',
      description: 'With fit="height" the canvas follows the box height, and on a narrow box the sides crop.',
    },
    {
      demo: 'ultrawide',
      title: 'Other aspect ratios',
      description: 'Pass width and height for another canvas, here 21:9.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Sizing',
      items: [
        <>
          Give the Stage&apos;s parent a width and a height. With only a width, the Stage takes the canvas aspect ratio.
        </>,
        <>
          Inside, <code className="d-inline-code">var(--zzz-px)</code> is one design unit of the canvas. Size and place
          everything with it, as in <code className="d-inline-code">calc(120 * var(--zzz-px))</code>.
        </>,
        <>
          <code className="d-inline-code">fit=&quot;none&quot;</code> draws one design unit as one CSS pixel.
        </>,
      ],
    },
  ],
  related: ['screen', 'sweep-transition', 'screen-transition'],
};

export default doc;
