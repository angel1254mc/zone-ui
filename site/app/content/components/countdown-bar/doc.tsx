import { CountdownBar } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: frozen at 22 of 30 seconds through controlled props, so nothing ticks in the card. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(470 * var(--zzz-px))' }}>
      <CountdownBar durationMs={30_000} secondsLeft={22} size="lg" chevrons announceAt={[]} announceExpiry={false} />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.55,
  usage: (
    <>
      <p>
        A countdown bar shows how much time is left on something short: a quiz question, a cooldown, a session. The fill
        shrinks from the right. Near the end it turns orange and pulses, then red, and the readout says when time is up.
      </p>
      <p>
        Give it <code>durationMs</code> or <code>deadline</code> and it runs by itself. To pause, restart or read the
        time elsewhere, run the clock with the <code>useCountdown</code> hook and pass its values in. For a countdown to
        a date days away, use Countdown instead.
      </p>
    </>
  ),
  usageCode: `import { CountdownBar } from '@angel1254mc/zone-ui';

<CountdownBar durationMs={30_000} onExpire={submitAnswer} />`,
  examples: [
    {
      demo: 'with-use-countdown',
      title: 'Driven by useCountdown',
      description: 'The hook owns the clock, so buttons can pause, resume and restart it while the bar only draws.',
    },
    {
      demo: 'states',
      title: 'Warning and expiry',
      description: 'Frozen with secondsLeft: normal, orange from 10 seconds, red from 3, and a custom expired label.',
    },
    {
      demo: 'deadline',
      title: 'Counting to a deadline',
      description: 'Pass an end time instead of a duration. From one minute up, the readout switches to minutes.',
    },
  ],
  types: [
    {
      name: 'UseCountdownOptions',
      rows: [
        { name: 'durationMs', type: 'number', description: 'Length of the countdown in ms.' },
        {
          name: 'deadline',
          type: 'Date | number | string',
          description: 'End time. Takes precedence over `durationMs`.',
        },
        { name: 'running', type: 'boolean', description: 'Whether the clock runs. Default true.' },
        { name: 'onExpire', type: '() => void', description: 'Called once when the time reaches 0.' },
        { name: 'intervalMs', type: 'number', description: 'How often the values update. Default 250.' },
      ],
    },
    {
      name: 'UseCountdownResult',
      rows: [
        { name: 'secondsLeft', type: 'number', description: 'Whole seconds left, rounded up.' },
        { name: 'msLeft', type: 'number', description: 'Milliseconds left.' },
        { name: 'fraction', type: 'number', description: 'Time left as a fraction, from 1 down to 0.' },
        { name: 'totalMs', type: 'number', description: 'The length `fraction` is measured against.' },
        { name: 'expired', type: 'boolean', description: 'The time has run out.' },
        { name: 'ticking', type: 'boolean', description: 'Running, not paused and not expired.' },
        { name: 'idle', type: 'boolean', description: 'No `durationMs` or `deadline` yet, so nothing to count.' },
        {
          name: 'reset',
          type: '(nextDurationMs?: number) => void',
          description: 'Starts over, optionally with a new length.',
        },
        { name: 'pause', type: '() => void', description: 'Freezes the time left.' },
        { name: 'resume', type: '() => void', description: 'Continues from where it was paused.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Self-driven or controlled',
      items: [
        <>
          With <code>durationMs</code> or <code>deadline</code> the bar keeps its own clock. <code>running</code> pauses
          it and <code>onExpire</code> fires once at zero.
        </>,
        <>
          Passing <code>secondsLeft</code> or <code>fraction</code> makes it controlled: it draws what you give it. Pass{' '}
          <code>durationMs</code> too, so it knows what a full bar means.
        </>,
        <>
          The clock is computed from the end time on every tick, so it stays right after a background tab or a sleeping
          laptop.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The track is a progress bar named by <code>label</code>, with "12 seconds left" as its value.
        </>,
        <>
          A polite live region speaks at <code>warnAt</code> and when time is up. Change the moments with{' '}
          <code>announceAt</code>, or pass <code>[]</code> and <code>announceExpiry=&#123;false&#125;</code> to stay
          silent.
        </>,
        <>The warning pulse stops for people who prefer reduced motion.</>,
      ],
    },
  ],
  related: ['countdown', 'progress', 'quantity-bar'],
};

export default doc;
