import { ModifierRow } from '@angel1254mc/zone-ui';

export default function ModifierList() {
  return (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      <ModifierRow label="Buffs" count={4} />
      <ModifierRow label="Debuffs" count={2} />
      <ModifierRow label="Shields" count={1} />
    </div>
  );
}
