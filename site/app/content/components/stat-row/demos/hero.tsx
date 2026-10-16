import { SectionLabel, StatGrid, StatRow } from '@angel1254mc/zone-ui';

export default function StatRowHero() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(7 * var(--zzz-px))',
        width: '100%',
        maxWidth: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: '#000',
      }}
    >
      <SectionLabel>Main Stat</SectionLabel>
      <StatRow label="CRIT DMG" value="48%" />
      <SectionLabel style={{ marginTop: 'calc(3 * var(--zzz-px))' }}>Sub-Stats</SectionLabel>
      <StatGrid>
        <StatRow label="CRIT Rate" value="7.2%" rollCount={2} />
        <StatRow label="ATK" value="9%" rollCount={1} />
        <StatRow label="PEN" value="9" />
        <StatRow label="Anomaly Proficiency" value="18" fit />
      </StatGrid>
    </div>
  );
}
