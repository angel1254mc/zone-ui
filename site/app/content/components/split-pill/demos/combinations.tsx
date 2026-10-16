import { AnomalyIcon, SnowflakeIcon, SplitPill, StarSparkIcon, StunIcon } from '@angel1254mc/zone-ui';

const specialty = { color: 'var(--zzz-color-icon-specialty)' };

export default function Combinations() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        justifyItems: 'start',
        padding: 24,
        borderRadius: 16,
        background: 'var(--zzz-color-surface-agent-info)',
      }}
    >
      <SplitPill
        items={[
          { icon: <StarSparkIcon />, label: 'Ether' },
          { icon: <AnomalyIcon style={specialty} />, label: 'Anomaly' },
        ]}
      />
      <SplitPill
        items={[
          { icon: <SnowflakeIcon />, label: 'Ice' },
          { icon: <StunIcon style={specialty} />, label: 'Stun' },
        ]}
      />
      {/* Icons are optional. */}
      <SplitPill items={[{ label: 'Fire' }, { label: 'Support' }]} />
    </div>
  );
}
