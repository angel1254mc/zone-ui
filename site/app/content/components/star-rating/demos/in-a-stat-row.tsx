import { SectionLabel, StarRating, StatRow } from '@angel1254mc/zone-ui';

export default function InAStatRow() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: '#000',
      }}
    >
      <SectionLabel>Refinement</SectionLabel>
      <StatRow
        style={{ marginTop: 'calc(7 * var(--zzz-px))' }}
        label="Phase"
        value={<StarRating value={3} size="pill" outline={false} label="Phase 3 of 5" />}
      />
    </div>
  );
}
