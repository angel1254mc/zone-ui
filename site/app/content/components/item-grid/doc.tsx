import { AnomalyIcon, AttackIcon, ItemCard, ItemGrid, StunIcon, SupportIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const GLYPHS = [<AttackIcon key="a" />, <StunIcon key="s" />, <AnomalyIcon key="n" />, <SupportIcon key="p" />];
const TILES = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i}`,
  rarity: (['s', 'a', 'a', 'b', 'b'] as const)[i % 5],
}));

/** Gallery preview: two rows of cards without art (nothing loads), the first one selected, no entrance stagger. */
function Thumbnail() {
  return (
    <ItemGrid
      aria-label="W-Engines"
      items={TILES}
      getId={(t) => t.id}
      columns={5}
      stagger="none"
      defaultValue="t0"
      renderItem={(t, { index }) => (
        <ItemCard rarity={t.rarity} level={60} stars={1 + (index % 5)} specialty={GLYPHS[index % 4]} />
      )}
    />
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'start' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.36,
  usage: (
    <>
      <p>
        Use the item grid for an inventory: W-Engines, Drive Discs, materials, equipment to pick from. It lays out Item
        Cards at a fixed pitch with one selected item, and the arrow keys move the selection like a game menu. Pick a{' '}
        <code>density</code> for the card size and add <code>scrollbar</code> to scroll a long grid.
      </p>
      <p>For a handful of rewards in a row, use Reward Preview. For rows of text data, use a Table.</p>
    </>
  ),
  usageCode: `import { ItemCard, ItemGrid } from '@angel1254mc/zone-ui';

<ItemGrid
  aria-label="W-Engines"
  items={engines}
  getId={(e) => e.id}
  columns={8}
  value={selected}
  onValueChange={setSelected}
  renderItem={(e) => <ItemCard name={e.name} rarity={e.rarity} level={e.level} />}
/>`,
  examples: [
    {
      demo: 'selection-detail',
      title: 'Selection with details',
      description: 'Control the selection and show the selected item beside the grid.',
      frame: 'start',
    },
    {
      demo: 'filter-tabs',
      title: 'Filter by rarity',
      description: 'Tabs narrow the items, and the tiles fade in again each time the set changes.',
      frame: 'start',
    },
    {
      demo: 'scrolling',
      title: 'A long inventory',
      description: 'Give the grid a height and a scrollbar side. Focusing a tile scrolls it into view.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>The grid is one tab stop. Tab lands on the selected tile.</>,
        <>
          <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> move and select. <kbd>Home</kbd> and <kbd>End</kbd> go to
          the start and end of the row, with <kbd>Ctrl</kbd> to the first and last item.
        </>,
        <>
          <kbd>Enter</kbd> or <kbd>Space</kbd> calls <code className="d-inline-code">onActivate</code>, as a click does.
        </>,
      ],
    },
    {
      title: 'Densities',
      items: [
        <>
          <code className="d-inline-code">storage</code> (default) for storage pages,{' '}
          <code className="d-inline-code">list</code> for equip lists, <code className="d-inline-code">material</code>{' '}
          for materials and <code className="d-inline-code">slot</code> for small upgrade slots.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>Tiles appear at once, without the entrance stagger.</>],
    },
  ],
  related: ['item-card', 'reward-preview', 'scroll-area'],
};

export default doc;
