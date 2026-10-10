import type { ReactNode } from 'react';
import { StarRating } from '@angel1254mc/zone-ui';

function Surface({ background, children }: { background: string; children: ReactNode }) {
  return <div style={{ padding: '8px 14px', borderRadius: 999, background }}>{children}</div>;
}

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
      {/* On an item tile's rarity band. */}
      <Surface background="var(--zzz-color-rarity-s)">
        <StarRating value={1} size="card" />
      </Surface>
      {/* In the side panel's stars pill. */}
      <Surface background="var(--zzz-color-surface-stat-row)">
        <StarRating value={2} size="pill" />
      </Surface>
      {/* In an equipment list bar. */}
      <Surface background="#000">
        <StarRating value={3} size="bar" />
      </Surface>
      {/* In the large panel's stars pill. */}
      <Surface background="var(--zzz-color-surface-level-pill)">
        <StarRating value={4} size="large" />
      </Surface>
      {/* On the lime upgrade bar, with a heavier outline. */}
      <Surface background="#a2e808">
        <StarRating value={5} size="onLime" />
      </Surface>
    </div>
  );
}
