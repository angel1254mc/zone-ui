import { NewBadge, RankBadge, RankCoin, SlotHexBadge, StorageIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a menu tile with NEW! on its corner, then the rank sun, a rarity coin and a slot hexagon. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(30 * var(--zzz-px))' }}>
      <div
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          width: 'calc(150 * var(--zzz-px))',
          height: 'calc(150 * var(--zzz-px))',
          borderRadius: 'calc(12 * var(--zzz-px))',
          background: '#292929',
          color: '#fff',
        }}
      >
        <StorageIcon size={80} />
        <NewBadge />
      </div>
      <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))', justifyItems: 'center' }}>
        <RankBadge rank="S" size={74} />
        <div style={{ display: 'flex', gap: 'calc(20 * var(--zzz-px))', alignItems: 'center' }}>
          <RankCoin rank="S" size={52} />
          <SlotHexBadge slot={2} />
        </div>
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.85,
  usage: (
    <>
      <p>
        Badges are small markers on the corner of a tile, card or icon. <code>NewBadge</code> flags something people
        haven't seen yet. <code>RankCoin</code> shows an item's rarity and <code>RankBadge</code> a character's rank,
        with S as the top tier. <code>SlotHexBadge</code> numbers a gear slot, <code>CombatBadge</code> marks a combat
        rating, and <code>StatusCheck</code> and <code>RecommendBadge</code> mark list entries as done or suggested.
      </p>
      <p>
        Only <code>PlusBadge</code> is interactive: it is the small "get more" button next to a currency. For a whole
        inventory tile with its badges built in, use Item Card. For a level readout with a rank coin, use Level Pill.
      </p>
    </>
  ),
  usageCode: `import { NewBadge } from '@angel1254mc/zone-ui';

<div style={{ position: 'relative' }}>
  <MenuTile />
  <NewBadge />
</div>`,
  examples: [
    {
      demo: 'on-corners',
      title: 'On corners',
      description: 'Corner badges hang past the edge of a host with position: relative, and offset nudges them.',
    },
    {
      demo: 'ranks',
      title: 'Ranks',
      description: 'Rarity coins for items and the gold rank sun for characters, at their default and larger sizes.',
    },
    {
      demo: 'list-rows',
      title: 'List rows',
      description:
        'A thumbs-up marks a suggested entry and a green tick a finished one, on the top-left of the row icon.',
    },
    {
      demo: 'get-more',
      title: 'Get more',
      description:
        'Put PlusBadge after a currency amount and handle onClick. It needs a label, since it only shows a +.',
    },
  ],
  notes: [
    {
      title: 'Placement',
      items: [
        <>
          <code>top-left</code> and <code>top-right</code> position the badge absolutely over the host's corner. Give
          the host <code>position: relative</code>.
        </>,
        <>
          <code>offset</code> is <code>[x, y]</code> in design units; positive values push the badge further outside the
          corner.
        </>,
        <>
          <code>inline</code> keeps the badge in the text flow. It is the default for every badge except{' '}
          <code>NewBadge</code>.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          Display badges are images with a default name, like "Rank S", "Slot 2" or "Completed". Change it with{' '}
          <code>label</code>.
        </>,
        <>
          Pass <code>decorative</code> when the text next to the badge already says the same thing, so screen readers
          don't repeat it.
        </>,
        <>
          <code>PlusBadge</code> is a <code>&lt;button&gt;</code>. Its <code>label</code> is required and becomes the
          accessible name.
        </>,
      ],
    },
  ],
  related: ['item-card', 'level-pill', 'currency-pill'],
};

export default doc;
