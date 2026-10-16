import { PolychromeIcon, ProgressPill, XpBar } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: an experience bar above a stat pill, with fixed values. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(24 * var(--zzz-px))', justifyItems: 'center' }}>
      <XpBar value={2350} max={6000} />
      <ProgressPill icon={<PolychromeIcon />} label={'Polychrome\nProgress:'} value="19%" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.62,
  usage: (
    <>
      <p>
        Use a progress bar to show how far someone is toward a goal: experience to the next level, the overclock phase
        of an item, or the share of a collection they have finished. An XP bar fills with the value and writes the
        values on it, and it shows MAX when it is full.
      </p>
      <p>
        For a stat that has no goal, such as a total, use Stat Row or Stat Tiles. For a count of steps in a flow, use
        Step Progress. For a timer, use Countdown Bar.
      </p>
    </>
  ),
  usageCode: `import { XpBar } from '@angel1254mc/zone-ui';

<XpBar value={2350} max={6000} />`,
  examples: [
    {
      demo: 'xp-levels',
      title: 'XP levels',
      description: 'An empty bar, a partly filled one and a full one, which shows MAX.',
    },
    {
      demo: 'overclock-phases',
      title: 'Overclock phases',
      description: 'Each bar shows the stars of the current phase, the next phase and a chevron between them.',
    },
    {
      demo: 'progress-pill',
      title: 'Progress pill',
      description: 'A label and a value with an icon. Set isNew to flag a progress track that is just unlocked.',
    },
  ],
  notes: [
    {
      title: 'Values',
      items: [
        <>
          <code>value</code> is clamped between zero and <code>max</code>. A <code>max</code> of zero counts as one.
        </>,
        <>
          The bar text reads &ldquo;value / max&rdquo; by default. Pass <code>label</code> to write your own text, for
          example the percentage.
        </>,
      ],
    },
    {
      title: 'Overclock',
      items: [
        <>
          <code>current</code> and <code>next</code> are the filled stars of each phase, out of <code>max</code>{' '}
          (default 5). Use <code>left</code> or <code>right</code> to replace a star group with your own content.
        </>,
        <>The overclock bar does not animate, and it reads as one image named by its phases.</>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The XP bar is a <code>progressbar</code> with its value, maximum and text. Name it with{' '}
          <code>aria-label</code>.
        </>,
        <>The overclock bar is one image named by its phases, such as &ldquo;Phase 2 → Phase 3&rdquo;.</>,
      ],
    },
  ],
  related: ['step-progress', 'countdown-bar', 'stat-row'],
};

export default doc;
