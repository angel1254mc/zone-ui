import { RankCoin, SectionLabel, StarRating } from '@angel1254mc/zone-ui';

export default function Flush() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, padding: 20, background: '#000' }}>
      <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
        <SectionLabel flush>Rarity</SectionLabel>
        <RankCoin rank="S" />
      </div>
      <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
        <SectionLabel flush>Refinement</SectionLabel>
        <StarRating value={3} size="bar" />
      </div>
    </div>
  );
}
