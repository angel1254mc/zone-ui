import { EmptyStatRow, SectionLabel, StatGrid, StatRow } from '@angel1254mc/zone-ui';

export default function TwoColumnGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(10 * var(--zzz-px))',
        width: '100%',
        minWidth: 'max-content',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: 'var(--zzz-color-surface-raised)',
      }}
    >
      <SectionLabel>Base Stat</SectionLabel>
      <StatGrid columns={2} variant="grid">
        <StatRow label="Base ATK" value="684" />
        <EmptyStatRow />
      </StatGrid>
      <SectionLabel>Advanced Stat</SectionLabel>
      <StatGrid columns={2} variant="grid">
        <StatRow label="ATK" value="30%" />
        <EmptyStatRow />
        <EmptyStatRow />
        <EmptyStatRow />
      </StatGrid>
    </div>
  );
}
