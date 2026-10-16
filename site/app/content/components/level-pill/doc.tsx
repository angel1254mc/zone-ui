import { LevelPill } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three of the four variants, stacked. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))', justifyItems: 'center' }}>
      <LevelPill variant="agent" level={60} max={60} />
      <LevelPill variant="large" level={60} max={60} rank="S" onInfo={() => {}} />
      <LevelPill level={45} max={50} rank="A" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        A level pill shows a level against its cap, like &ldquo;Lv. 45/50&rdquo;, with an optional rank coin for the
        item&apos;s rarity. Pick the variant for the place it sits: <code>panel</code> in a side detail panel,{' '}
        <code>equip</code> on an equip list row, <code>large</code> in a big item panel with a Details button, and{' '}
        <code>agent</code> on a character screen, where it says MAX at the cap.
      </p>
      <p>
        For refinement stars next to the level, use Stars Pill. For the experience still needed to reach the next level,
        use the XP bar from Progress.
      </p>
    </>
  ),
  usageCode: `import { LevelPill } from '@angel1254mc/zone-ui';

<LevelPill level={45} max={50} rank="A" />`,
  examples: [
    {
      demo: 'detail-panel',
      title: 'Side detail panel',
      description: 'The panel variant sits beside a Stars Pill above the stat rows of an item.',
    },
    {
      demo: 'agent-level',
      title: 'Agent level',
      description: 'The agent variant above an XP bar. Train until it reaches the cap and shows MAX.',
    },
    {
      demo: 'variants',
      title: 'Variants',
      description: 'Panel with each rank coin, then equip, large without the Details button, and agent.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Variant details',
      items: [
        <>
          <code>rank</code> adds the coin to <code>panel</code>, <code>equip</code> and <code>large</code>. The agent
          variant has none.
        </>,
        <>
          Only <code>large</code> holds a control: pass <code>onInfo</code> to show the Details button. Rename it with{' '}
          <code>infoLabel</code>, swap its glyph with <code>infoIcon</code>, or disable it through{' '}
          <code>infoProps</code>.
        </>,
        <>
          The agent variant shows MAX once <code>level</code> reaches <code>max</code>. Force it either way with{' '}
          <code>showMax</code>.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The pill is a group named &ldquo;Level 45 of 50&rdquo;, and the drawn digits are hidden from screen readers.
          Replace the name with <code>label</code>.
        </>,
      ],
    },
  ],
  related: ['stars-pill', 'progress', 'badges'],
};

export default doc;
