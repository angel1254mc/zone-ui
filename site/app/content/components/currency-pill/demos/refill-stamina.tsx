import { useState } from 'react';
import { BatteryIcon, CurrencyPill } from '@angel1254mc/zone-ui';

const MAX = 240;

export default function RefillStamina() {
  const [charge, setCharge] = useState(180);
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <CurrencyPill
        label="Battery Charge"
        value={charge}
        max={MAX}
        icon={<BatteryIcon />}
        addLabel="Refill 60 Battery Charge"
        addProps={{ disabled: charge >= MAX * 2 }}
        onAdd={() => setCharge((c) => c + 60)}
      />
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {charge > MAX ? `${charge - MAX} over the cap` : `${MAX - charge} until full`}
      </output>
    </div>
  );
}
