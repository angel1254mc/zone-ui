import { AttackIcon, DefenseIcon, StatGrid, StatRow } from '@angel1254mc/zone-ui';

export default function Equipment() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(600 * var(--zzz-px))', padding: 'calc(20 * var(--zzz-px)) 0' }}>
      <StatGrid variant="equip">
        <StatRow label="Base ATK" value="594" icon={<AttackIcon />} />
        <StatRow label="DEF" value="15%" icon={<DefenseIcon />} />
      </StatGrid>
    </div>
  );
}
