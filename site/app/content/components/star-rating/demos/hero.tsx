import { StarRating } from '@angel1254mc/zone-ui';

export default function StarRatingHero() {
  return (
    <div style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--zzz-color-surface-level-pill)' }}>
      <StarRating value={3} size="large" />
    </div>
  );
}
