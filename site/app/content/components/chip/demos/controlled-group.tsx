import { useState } from 'react';
import { ChipGroup } from '@angel1254mc/zone-ui';

const specialties = [
  { value: 'attack', label: 'Attack' },
  { value: 'stun', label: 'Stun' },
  { value: 'anomaly', label: 'Anomaly' },
  { value: 'support', label: 'Support' },
  { value: 'defense', label: 'Defense' },
  { value: 'rupture', label: 'Rupture' },
];

export default function ControlledGroup() {
  const [value, setValue] = useState(['attack', 'support']);
  const names = specialties.filter((s) => value.includes(s.value)).map((s) => s.label);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <ChipGroup label="Agent Specialties" options={specialties} value={value} onValueChange={setValue} />
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {names.length ? `Showing ${names.join(', ')}` : 'Showing every agent'}
      </output>
    </div>
  );
}
