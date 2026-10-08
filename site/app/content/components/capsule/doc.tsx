import type { ReactNode } from 'react';
import { Capsule, DriveDiscCategoryIcon, MaterialsCategoryIcon, WEngineCategoryIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

function ThumbTile({ icon, border, children }: { icon: ReactNode; border: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'calc(10 * var(--zzz-px))', width: 'calc(118 * var(--zzz-px))' }}>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: 'calc(118 * var(--zzz-px))',
          boxSizing: 'border-box',
          borderRadius: 'calc(12 * var(--zzz-px))',
          border: 'calc(4 * var(--zzz-px)) solid #404040',
          borderBottom: `calc(15 * var(--zzz-px)) solid ${border}`,
          background: '#000',
          color: '#fff',
        }}
      >
        {icon}
      </div>
      {children}
    </div>
  );
}

/** Gallery preview: three tiles with a level, a count and an EMPTY capsule under them. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'calc(22 * var(--zzz-px))',
        padding: 'calc(24 * var(--zzz-px))',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: '#1a1a1a',
      }}
    >
      <ThumbTile icon={<WEngineCategoryIcon size={56} />} border="var(--zzz-color-rarity-s)">
        <Capsule>Lv. 60</Capsule>
      </ThumbTile>
      <ThumbTile icon={<MaterialsCategoryIcon size={56} />} border="var(--zzz-color-rarity-a)">
        <Capsule>×30</Capsule>
      </ThumbTile>
      <ThumbTile icon={<DriveDiscCategoryIcon size={56} />} border="#2c2c2c">
        <Capsule tone="empty" size="sm" />
      </ThumbTile>
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
        A capsule is the black pill under an item tile that holds one short line: a level, a count, or EMPTY for an
        unused slot. It stretches to the width of its container, so put it in the same column as the tile.
      </p>
      <p>
        Item Card already draws its own capsule; use Capsule when you build a custom tile. For a label and value pair,
        use Stat Row. For a pill with an icon, use Info Pill.
      </p>
    </>
  ),
  usageCode: `import { Capsule } from '@angel1254mc/zone-ui';

<div style={{ width: 118 }}>
  <Tile />
  <Capsule>Lv. 60</Capsule>
</div>`,
  examples: [
    {
      demo: 'crafting-costs',
      title: 'Crafting costs',
      description: 'Large capsules under material tiles show owned against required, with a short count in red.',
    },
    {
      demo: 'equipment-slots',
      title: 'Equipment slots',
      description: 'Filled slots show their level. The empty tone writes EMPTY for you in a dim, condensed face.',
    },
  ],
  notes: [
    {
      title: 'Tones',
      items: [
        <>
          <code>default</code> is white text for levels and counts.
        </>,
        <>
          <code>empty</code> shows a dim EMPTY when it has no children.
        </>,
        <>
          <code>danger</code> turns all of the text red. To colour only part of it, like the owned number in "20/60",
          wrap that part in a span instead.
        </>,
      ],
    },
    {
      title: 'Sizes',
      items: [
        <>
          <code>md</code> suits item cards, <code>sm</code> the EMPTY capsule under a slot, and <code>lg</code> the
          larger ingredient tiles.
        </>,
      ],
    },
  ],
  related: ['item-card', 'stat-row', 'info-pill'],
};

export default doc;
