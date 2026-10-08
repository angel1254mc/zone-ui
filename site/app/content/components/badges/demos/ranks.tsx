import { RankBadge, RankCoin } from '@angel1254mc/zone-ui';

export default function Ranks() {
  return (
    <div style={{ display: 'grid', gap: 28, justifyItems: 'center' }}>
      {/* Item rarity: S is the rarest, then A, then B. */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <RankCoin rank="S" />
        <RankCoin rank="A" />
        <RankCoin rank="B" />
        <RankCoin rank="S" size={60} />
      </div>

      {/* Character rank, as shown on a card footer. */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <RankBadge rank="S" />
        <RankBadge rank="A" />
        <RankBadge rank="infinity" />
        <RankBadge rank="S" size={74} />
      </div>
    </div>
  );
}
