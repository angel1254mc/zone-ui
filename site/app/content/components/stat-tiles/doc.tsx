import { StatTile, StatTiles } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three tiles in a row, the first one highlighted. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(600 * var(--zzz-px))' }}>
      <StatTiles aria-label="Results" columns={3} size="sm">
        <StatTile label="Played" value={42} delta={3} sub="this week" />
        <StatTile label="Streak" value={12} delta={1} sub="best 21" highlight />
        <StatTile label="Best" value="1:42" delta="−8 s" deltaTone="positive" />
      </StatTiles>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.4,
  usage: (
    <>
      <p>
        Use stat tiles for a few big numbers that someone should read at a glance: a results row after a round, the
        totals on a profile, or a dashboard. Each tile has a label, a value, and optionally a change and a note. Mark
        the one stat that matters most with <code>highlight</code>.
      </p>
      <p>
        For a single stat inside a panel, use Stat Row. For a bar per day or per category, use Bar Chart. For a pass or
        fail for each question or day, use Status Grid.
      </p>
    </>
  ),
  usageCode: `import { StatTile, StatTiles } from '@angel1254mc/zone-ui';

<StatTiles aria-label="Results" columns={3}>
  <StatTile label="Played" value={42} delta={3} />
  <StatTile label="Streak" value={12} highlight />
  <StatTile label="Best" value="1:42" />
</StatTiles>`,
  examples: [
    {
      demo: 'dashboard',
      title: 'Dashboard grid',
      description: 'Six tiles in three columns, with icons on some of them and a highlighted rank.',
    },
    {
      demo: 'standalone',
      title: 'Single tile',
      description: 'A StatTile on its own is a complete block, with its own frame.',
    },
    {
      demo: 'small',
      title: 'Small tiles',
      description: 'The sm size fits dense rows and narrow columns such as a phone sidebar.',
    },
  ],
  types: [
    {
      name: 'StatTile',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'What is measured, such as "Played".' },
        { name: 'value', type: 'ReactNode', required: true, description: 'The big number, such as 42 or "87%".' },
        { name: 'sub', type: 'ReactNode', description: 'A line under the value, such as "best 21".' },
        {
          name: 'delta',
          type: 'ReactNode',
          description: 'A change. A number is signed and coloured by its sign: up is green, down is red, zero is grey.',
        },
        {
          name: 'deltaTone',
          type: "'positive' | 'negative' | 'neutral'",
          description: 'Sets the colour of the delta, when the sign is not enough.',
        },
        { name: 'icon', type: 'ReactNode', description: 'A decorative glyph next to the label.' },
        { name: 'highlight', type: 'boolean', description: 'Accent ring and label for the stat to look at first.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Grid',
      items: [
        <>
          <code>columns</code> fixes the number of columns. Without it, the tiles fit as many columns as the width
          allows, each at least <code>minTileWidth</code> wide.
        </>,
        <>
          <code>size</code> is <code>md</code> (the default) for dashboards and results, or <code>sm</code> for dense
          rows.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The grid is a description list. Each label is a term and each value a description, so a screen reader reads
          them as pairs.
        </>,
        <>
          Give the grid an <code>aria-label</code> so the group has a name.
        </>,
      ],
    },
  ],
  related: ['stat-row', 'bar-chart', 'status-grid'],
};

export default doc;
