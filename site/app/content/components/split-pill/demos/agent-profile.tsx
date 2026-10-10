import { AttackIcon, LevelPill, SnowflakeIcon, SplitPill, StatGrid, StatRow, Text } from '@angel1254mc/zone-ui';

export default function AgentProfile() {
  return (
    <section
      aria-labelledby="agent-name"
      style={{
        display: 'grid',
        gap: 'calc(20 * var(--zzz-px))',
        justifyItems: 'start',
        minWidth: 'max-content',
        padding: 'calc(28 * var(--zzz-px))',
        borderRadius: 16,
        background: 'var(--zzz-color-surface-agent-info)',
      }}
    >
      <Text as="h2" id="agent-name" role="title" style={{ margin: 0 }}>
        Mira
      </Text>
      <SplitPill
        aria-label="Element and specialty"
        items={[
          { icon: <SnowflakeIcon />, label: 'Ice' },
          { icon: <AttackIcon style={{ color: 'var(--zzz-color-icon-specialty)' }} />, label: 'Attack' },
        ]}
      />
      <LevelPill variant="agent" level={60} max={60} />
      <StatGrid columns={2} variant="agent">
        <StatRow label="HP" value="8,437" highlight />
        <StatRow label="ATK" value="2,155" />
        <StatRow label="DEF" value="612" />
        <StatRow label="CRIT Rate" value="45.8%" highlight />
      </StatGrid>
    </section>
  );
}
