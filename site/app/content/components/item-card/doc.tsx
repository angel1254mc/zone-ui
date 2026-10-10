import { BatteryIcon, DennyIcon, ItemCard, PolychromeIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three rarities with drawn glyphs as art, the first one selected. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 'calc(17 * var(--zzz-px))' }}>
      <ItemCard interactive={false} rarity="s" art={<PolychromeIcon />} level={60} stars={1} locked selected />
      <ItemCard interactive={false} rarity="a" art={<BatteryIcon />} count={7} />
      <ItemCard interactive={false} rarity="b" art={<DennyIcon />} count={{ owned: 20, required: 60 }} />
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
        The item card is the inventory tile: art on a black panel, a band in the item&apos;s rarity colour, and a level
        or count underneath. W-Engines (weapons), Drive Discs (gear), materials and crafting ingredients all use it,
        with optional stars, a lock, a specialty glyph or the avatar of the agent who has it equipped.
      </p>
      <p>
        On its own the card is a button, and <code>selected</code> makes it a toggle. For a scrolling grid with keyboard
        selection, use Item Grid, which renders these cards for you. To show what someone received, use Reward Tile. For
        the row of rewards on an event page, use Reward Preview.
      </p>
    </>
  ),
  usageCode: `import { ItemCard } from '@angel1254mc/zone-ui';

<ItemCard
  name="The Brimstone"
  rarity="s"
  art={<img src={brimstone} alt="" />}
  level={60}
  stars={1}
/>`,
  examples: [
    {
      demo: 'pick-a-material',
      title: 'Pick a material',
      description: 'Keep the chosen item in state and pass selected to each card. Click a card to select it.',
    },
    {
      demo: 'crafting-cost',
      title: 'Crafting cost',
      description: 'Owned against required counts. A count that falls short turns red.',
    },
    {
      demo: 'drive-disc-slots',
      title: 'Drive Disc slots',
      description: 'The slot number replaces the specialty glyph, and empty slots show a broken X.',
    },
  ],
  types: [
    {
      name: 'ItemCardCount',
      rows: [
        { name: 'owned', type: 'number', required: true, description: 'How many the player has.' },
        {
          name: 'required',
          type: 'number',
          description: 'How many are needed. Shown as `owned/required`, with `owned` in red when it is lower.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'Sizes',
      items: [
        <>
          <code>storage</code> (the default) for W-Engine and Drive Disc storage, <code>list</code> for equip lists,{' '}
          <code>material</code> for material pickers, <code>ingredient</code> for crafting costs.
        </>,
        <>
          <code>slot</code> for upgrade-panel slots, <code>reward</code> for reward dialogs and <code>preview</code> for
          event reward rows.
        </>,
      ],
    },
    {
      title: 'States',
      items: [
        <>
          <b>Selected.</b> A ring in the live accent. Add <code>beat</code> to make it contract like a heartbeat.
        </>,
        <>
          <b>Empty.</b> <code>empty</code> draws an open slot with an EMPTY capsule and hides every decoration.
        </>,
        <>
          <b>Static.</b> <code>interactive={'{false}'}</code> renders a <code>div</code> instead of a button, for
          display-only cards.
        </>,
      ],
    },
    {
      title: 'Capsule',
      items: [
        <>
          The capsule shows <code>caption</code> if given, else the level, else the count.{' '}
          <code>
            caption=
            {'{false}'}
          </code>{' '}
          hides it.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The accessible name is built from the props, for example &ldquo;The Brimstone, Level 60, Rank S, 1 of 5 stars,
          Locked, Equipped by Soldier 11&rdquo;. Keep the art decorative with <code>alt=&quot;&quot;</code>.
        </>,
        <>
          With <code>selected</code> set, the button reports it as pressed. Inside Item Grid the card is a{' '}
          <code>div</code> and the grid cell takes focus.
        </>,
      ],
    },
  ],
  related: ['item-grid', 'reward-tile', 'badges'],
};

export default doc;
