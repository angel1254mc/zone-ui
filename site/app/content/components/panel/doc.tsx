import { Panel, StatGrid, StatRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a detail panel with a title and three short rows. */
function Thumbnail() {
  return (
    <Panel height={300} headerLabel="DETAIL" title="The Brimstone">
      <StatGrid>
        <StatRow label="ATK" value="684" />
        <StatRow label="HP" value="2,330" />
        <StatRow label="Crit Rate" value="5%" />
      </StatGrid>
    </Panel>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.38,
  usage: (
    <>
      <p>
        A panel is a framed container with a header strip and a body. Put a list of stats, a short description or a set
        of buttons inside it. Use the side variant for a detail view next to a list, the tool variant for a crafting or
        upgrade screen, and the large variant for a full-width item view with an art stage and a side column.
      </p>
      <p>
        For a single stat in a row, use Stat Row inside a panel. For a grid of big numbers, use Stat Tiles. For a tile
        that holds one item, use Item Card.
      </p>
    </>
  ),
  usageCode: `import { Panel, StatGrid, StatRow } from '@angel1254mc/zone-ui';

<Panel headerLabel="DETAIL" title="The Brimstone">
  <StatGrid>
    <StatRow label="ATK" value="684" />
    <StatRow label="Crit Rate" value="5%" />
  </StatGrid>
</Panel>`,
  examples: [
    {
      demo: 'tool-panel',
      title: 'Tool panel',
      description: 'The tool variant has a textured header and a lower section for summaries or actions.',
    },
    {
      demo: 'large-panel',
      title: 'Large item panel',
      description: 'The large variant has a title band, an art stage and a raised side column through aside.',
    },
  ],
  notes: [
    {
      title: 'Variants',
      items: [
        <>
          <code>side</code> (the default) is a detail panel with a small header label. <code>tool</code> has a larger
          header for crafting and upgrade screens. <code>large</code> is a full-width item view with a title band.{' '}
          <code>drawerInner</code> is the dark inner panel of a filter drawer, with no frame.
        </>,
        <>
          <code>width</code> and <code>height</code> set the outer size. Each variant has its own default.
        </>,
      ],
    },
    {
      title: 'Parts',
      items: [
        <>
          <code>headerLabel</code> sets the header strip. <code>title</code> sets the heading, and on the large variant
          it fills the title band.
        </>,
        <>
          <code>footer</code> holds buttons under the body. <code>lower</code> adds a textured section to the tool
          variant, starting at <code>lowerTexturedFrom</code>.
        </>,
        <>
          <code>aside</code> on the large variant holds the raised right column, and <code>asideWidth</code> sets its
          width.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The panel is a <code>section</code> named by its title, or by its header label when there is no title.
        </>,
      ],
    },
  ],
  related: ['stat-row', 'item-card', 'stat-tiles'],
};

export default doc;
