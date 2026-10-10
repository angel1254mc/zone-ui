import { StatGrid, StatRow } from '@angel1254mc/zone-ui';

export default function AgentGrid() {
  return (
    <div
      style={{
        width: '100%',
        minWidth: 'max-content',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: 'var(--zzz-color-surface-agent-info)',
      }}
    >
      <StatGrid columns={2} variant="agent">
        <StatRow label="HP" value="17,066" highlight />
        <StatRow label="ATK" value="2,155" />
        <StatRow label="DEF" value="872" />
        <StatRow label="Impact" value="95" />
        <StatRow label="CRIT Rate" value="45.8%" highlight />
        <StatRow label="CRIT DMG" value="90%" highlight />
        <StatRow label="Anomaly Mastery" value="90" />
        <StatRow label="Anomaly Proficiency" value="152" fit />
        <StatRow label="Energy Regen" value="1.2" />
        <StatRow label="Automatic Adrenaline Accumulation" value="2" fit="wrap" />
      </StatGrid>
    </div>
  );
}
