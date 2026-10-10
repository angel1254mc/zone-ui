import { LevelPill, SectionLabel, StarsPill, StatRow } from '@angel1254mc/zone-ui';

export default function DetailPanel() {
  return (
    <div style={{ display: 'grid', gap: 12, width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LevelPill level={60} max={60} rank="S" />
        <StarsPill value={1} />
      </div>
      <SectionLabel>Base Stat</SectionLabel>
      <StatRow label="Base ATK" value="684" />
      <SectionLabel>Advanced Stat</SectionLabel>
      <StatRow label="ATK" value="30%" />
    </div>
  );
}
