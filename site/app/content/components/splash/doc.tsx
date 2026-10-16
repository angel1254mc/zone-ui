import { GraffitiLayer, Text } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: the gate laid out inline in a 4:3 box, built from the splash's own classes, with the hint
 * pulse frozen. The real splash takes focus and makes its siblings inert, so it never renders in a card.
 */
function Thumbnail() {
  return (
    <div
      data-reduced-motion=""
      style={{ position: 'relative', width: u(720), height: u(540), overflow: 'hidden', borderRadius: 12 }}
    >
      <div className="zzz-splash zzz-splash--contained zzz-splash--bg-graffiti" style={{ animation: 'none' }}>
        <GraffitiLayer className="zzz-splash__bg" />
        <div className="zzz-splash__body">
          <Text role="eventTitle" outline="event" tone="primary" className="zzz-splash__title">
            Proxy Trivia
          </Text>
          <Text role="bodyXl" tone="secondary" className="zzz-splash__subtitle">
            A daily quiz from New Eridu
          </Text>
          <span className="zzz-splash__enter">
            <Text role="button" italic className="zzz-splash__hint">
              Press to enter
            </Text>
          </span>
        </div>
        <Text role="label" tone="muted" className="zzz-splash__footer">
          v1.0
        </Text>
      </div>
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
        A splash is the first screen of a game or kiosk app: a title over a graffiti, hatch or plain background and a
        pulsing &quot;Press to enter&quot;. A click, a tap, <kbd>Enter</kbd> or <kbd>Space</kbd> anywhere dismisses it.
        That gesture is what browsers ask for before a page may play sound, so start your audio in <code>onEnter</code>.
      </p>
      <p>
        Render it as the first child of your app root. It covers the window, or its positioned parent with{' '}
        <code>contained</code>. For a landing section that stays on the page, use a Hero.
      </p>
    </>
  ),
  usageCode: `import { Splash } from '@angel1254mc/zone-ui';

<Splash title="Proxy Trivia" onEnter={startAudio} />`,
  examples: [
    {
      demo: 'unlock-audio',
      title: 'Start sound on enter',
      description: 'onEnter runs inside the dismissing click or key press, so the audio is allowed to play.',
      frame: 'bleed',
    },
    {
      demo: 'full-screen',
      title: 'Full screen',
      description: 'Without contained the splash covers the whole window until someone enters.',
    },
  ],
  notes: [
    {
      title: 'Focus and keyboard',
      items: [
        <>The splash is a modal dialog named by its title. The enter button takes focus and Tab stays inside.</>,
        <>
          <kbd>Enter</kbd> or <kbd>Space</kbd> dismisses it, then focus returns to where it was.
        </>,
        <>
          It starts open. Pass <code className="d-inline-code">open</code> and{' '}
          <code className="d-inline-code">onOpenChange</code> to show it again later.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>No pulse on the hint and no fade when it closes.</>],
    },
  ],
  related: ['hero', 'screen-transition', 'sound-toggle'],
};

export default doc;
