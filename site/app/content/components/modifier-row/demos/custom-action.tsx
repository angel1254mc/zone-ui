import { Button, ModifierRow } from '@angel1254mc/zone-ui';

export default function CustomAction() {
  return (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      <ModifierRow label="Debuffs" count={2} action={<Button width="compact">Cleanse</Button>} />
      <ModifierRow label="Buffs" count={4} />
    </div>
  );
}
