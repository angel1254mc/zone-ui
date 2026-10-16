import { SectionLabel, StatGrid, StatRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a label above three panel rows, one with a roll count. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(7 * var(--zzz-px))',
        width: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        borderRadius: 'calc(16 * var(--zzz-px))',
        border: 'calc(4 * var(--zzz-px)) solid #1f1f1f',
        background: '#000',
      }}
    >
      <SectionLabel as="div">Sub-Stats</SectionLabel>
      <StatGrid>
        <StatRow label="CRIT Rate" value="7.2%" rollCount={2} />
        <StatRow label="ATK" value="9%" />
        <StatRow label="PEN" value="9" />
      </StatGrid>
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
        A stat row is a capsule with a stat name on the left and its value on the right. Wrap rows in{' '}
        <code>StatGrid</code> for one or two columns with the right gaps, and use <code>EmptyStatRow</code> for a slot
        that has no stat yet. Put a Section Label above each group.
      </p>
      <p>
        Pick the <code>variant</code> for the surface: <code>panel</code> for side panels, <code>grid</code> for large
        panels, <code>agent</code> for character sheets and <code>equip</code> for equipment lists. For big headline
        numbers, use Stat Tiles.
      </p>
    </>
  ),
  usageCode: `import { StatGrid, StatRow } from '@angel1254mc/zone-ui';

<StatGrid>
  <StatRow label="Base ATK" value="684" />
  <StatRow label="CRIT Rate" value="24%" />
</StatGrid>`,
  examples: [
    {
      demo: 'two-column-grid',
      title: 'Two-column grid',
      description: 'A large panel with two columns of rows, where EMPTY rows hold slots that have no stat yet.',
      frame: 'start',
    },
    {
      demo: 'agent-grid',
      title: 'Character sheet',
      description: 'Highlighted stats turn orange, and long names shrink to fit or wrap onto two lines.',
      frame: 'start',
    },
    {
      demo: 'equipment',
      title: 'Equipment list',
      description: 'The equip variant runs flush to the left edge and can lead with a glyph.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Content',
      items: [
        <>
          <code>rollCount</code> adds an orange "+n" after the label: how many times a random sub-stat was upgraded.
        </>,
        <>
          <code>highlight</code> colours the label and value orange for the stats that matter most.
        </>,
        <>
          For long labels, <code>fit</code> shrinks the text to fit, and <code>fit="wrap"</code> sets it on two lines.
        </>,
      ],
    },
    {
      title: 'Semantics',
      items: [
        <>
          A standalone row is its own <code>&lt;dl&gt;</code>. Inside <code>StatGrid</code>, rows become groups of the
          grid's single <code>&lt;dl&gt;</code>, so screen readers read the list as one.
        </>,
        <>
          Rows inside a grid take its <code>variant</code> unless they set their own.
        </>,
      ],
    },
  ],
  related: ['section-label', 'stat-tiles', 'effect-text'],
};

export default doc;
