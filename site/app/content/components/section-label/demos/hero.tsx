import { SectionLabel, StatRow } from '@angel1254mc/zone-ui';

export default function SectionLabelHero() {
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
      <SectionLabel>Base Stat</SectionLabel>
      <StatRow label="Base ATK" value="684" style={{ marginTop: 'calc(7 * var(--zzz-px))' }} />
      <SectionLabel style={{ marginTop: 'calc(10 * var(--zzz-px))' }}>Advanced Stat</SectionLabel>
      <StatRow label="ATK" value="30%" style={{ marginTop: 'calc(7 * var(--zzz-px))' }} />
    </div>
  );
}
