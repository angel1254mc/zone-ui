import { useRef } from 'react';
import { GiftIcon, ItemCard, ScrollHint } from '@angel1254mc/zone-ui';

const rewards = Array.from({ length: 10 }, (_, i) => ({
  name: `Reward ${i + 1}`,
  rarity: (['s', 'a', 'b'] as const)[i % 3],
  count: (i + 1) * 10,
}));

export default function RewardRow() {
  const viewport = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 640, paddingRight: 'calc(36 * var(--zzz-px))' }}>
      <div ref={viewport} style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 'calc(20 * var(--zzz-px))', width: 'max-content', padding: 4 }}>
          {rewards.map((r) => (
            <ItemCard
              key={r.name}
              size="preview"
              interactive={false}
              name={r.name}
              rarity={r.rarity}
              count={r.count}
              art={<GiftIcon style={{ color: '#fff' }} />}
            />
          ))}
        </div>
      </div>
      {/* Interactive: a click scrolls the row a page further. */}
      <ScrollHint direction="right" target={viewport} interactive label="More rewards" />
    </div>
  );
}
