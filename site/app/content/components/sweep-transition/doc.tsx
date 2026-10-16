import { useState } from 'react';
import { HatchBackground, SweepTransition, Text } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: the real sweep frozen at 233 ms with `at`, rendered into its own box through `container`
 * (only once the box exists, so it never reaches <body>). No timers run in frozen mode.
 */
function Thumbnail() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setBox}
      style={{ position: 'relative', width: u(720), height: u(450), overflow: 'hidden', borderRadius: 12 }}
    >
      <HatchBackground />
      <Text as="div" role="title" style={{ position: 'absolute', left: u(48), top: u(48) }}>
        Question 2
      </Text>
      {box ? <SweepTransition container={box} at={233} label="Question 3" /> : null}
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.34,
  usage: (
    <>
      <p>
        The sweep transition covers the screen with hatched chevron panels and a label such as &quot;Question 3&quot; or
        &quot;Stage Clear&quot;, then reveals the next step. Use it between questions, levels or routes in game-style
        apps. Swap your content in <code>onMidpoint</code>, while the screen is fully covered.
      </p>
      <p>
        Play it with <code>active</code> (set it back to false in <code>onDone</code>) or with a new <code>runKey</code>{' '}
        each time. For quiet cuts and fades between screens, use Screen Transition.
      </p>
    </>
  ),
  usageCode: `import { SweepTransition } from '@angel1254mc/zone-ui';

<SweepTransition
  runKey={question}
  label={\`Question \${question}\`}
  onMidpoint={() => setShown(question)}
/>`,
  examples: [
    {
      demo: 'quiz-questions',
      title: 'Between quiz questions',
      description: 'Each new runKey plays the sweep, and the next question appears behind it at the midpoint.',
      frame: 'bleed',
    },
    {
      demo: 'full-screen',
      title: 'Full screen',
      description: 'Without container the sweep covers the whole window, here in the accent tone.',
    },
    {
      demo: 'tones',
      title: 'Tones',
      description: 'The default sage and teal, the live accent, one tint colour, or three colours of your own.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          The sweep is decorative and hidden from assistive tech. Announce the new content yourself: move focus to its
          heading or update a live region.
        </>,
        <>It never takes focus or blocks the page underneath.</>,
      ],
    },
    {
      title: 'Timing',
      items: [
        <>
          About a second in total by default, covered from just past the middle.{' '}
          <code className="d-inline-code">duration</code> stretches the whole timeline.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [
        <>
          A short fade replaces the sweep. Force either with <code className="d-inline-code">reducedMotion</code>.
        </>,
      ],
    },
    {
      title: 'Portals',
      items: [
        <>
          The sweep renders in a fixed layer on <code className="d-inline-code">&lt;body&gt;</code>, or inside{' '}
          <code className="d-inline-code">container</code> when you pass one.
        </>,
      ],
    },
  ],
  related: ['screen-transition', 'splash', 'stage'],
};

export default doc;
