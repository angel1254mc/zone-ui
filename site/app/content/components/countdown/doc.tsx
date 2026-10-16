import type { CSSProperties } from 'react';
import { Countdown } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/**
 * A countdown frozen at a fixed reading: a target in the past stops the clock after its first check, `format`
 * prints a fixed time, and resetting the accent keeps the reached colour off the digits.
 */
function Frozen({ time, prefix }: { time: string; prefix: string }) {
  return (
    <Countdown
      target={0}
      prefix={prefix}
      format={() => time}
      style={{ '--zzz-accent': 'var(--zzz-color-text-primary)' } as CSSProperties}
    />
  );
}

/** Gallery preview: two timer pills. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(16 * var(--zzz-px))', justifyItems: 'center' }}>
      <Frozen prefix="Next puzzle in" time="07:42:13" />
      <Frozen prefix="Event ends in" time="2d 06:18:40" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.65,
  usage: (
    <>
      <p>
        Countdown shows the time left until a date and ticks every second: the next daily puzzle, the end of an event, a
        sale. It works from the target date, so it stays right after a tab sleeps in the background. Screen readers can
        read it, but it does not announce every tick.
      </p>
      <p>
        For a bar that drains over a short timer, like a quiz answer window, use Countdown bar. Inside a sentence, set{' '}
        <code>variant="plain"</code> so the time takes the surrounding text style.
      </p>
    </>
  ),
  usageCode: `import { Countdown } from '@angel1254mc/zone-ui';

<Countdown target="2026-12-01T04:00:00Z" prefix="Event ends in" />`,
  examples: [
    {
      demo: 'formats',
      title: 'Formats',
      description:
        'Unit labels, the largest unit only, minutes and seconds, or your own function of the remaining parts.',
      frame: 'start',
    },
    {
      demo: 'inline-text',
      title: 'Inside a sentence',
      description: 'The plain variant drops the pill and inherits the font and colour around it.',
    },
    {
      demo: 'when-it-ends',
      title: 'When it reaches zero',
      description: 'reachedLabel replaces the time and onReach unlocks the Claim button, which starts a new countdown.',
    },
  ],
  notes: [
    {
      title: 'Formats',
      items: [
        <>
          <code>auto</code> (default) shows <code>07:42:13</code> and adds days from one day up:{' '}
          <code>2d 07:42:13</code>.
        </>,
        <>
          <code>hms</code> and <code>ms</code> keep counting hours or minutes past their usual limit. <code>dhms</code>{' '}
          always shows days.
        </>,
        <>
          <code>labels</code> reads <code>7h 42m 13s</code>, and <code>compact</code> shows only the largest unit, like{' '}
          <code>66d</code>.
        </>,
      ],
    },
    {
      title: 'Behaviour',
      items: [
        <>
          <code>target</code> takes a Date, a timestamp in milliseconds or a date string. A new target restarts the
          countdown and re-arms <code>onReach</code>.
        </>,
        <>The element has the timer role and is not a live region.</>,
      ],
    },
  ],
  related: ['countdown-bar', 'info-pill', 'mission-card'],
};

export default doc;
