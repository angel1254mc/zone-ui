import { useState } from 'react';
import { Checkbox } from '@angel1254mc/zone-ui';

const specialties = ['Attack', 'Stun', 'Anomaly', 'Support'];

export default function SelectAll() {
  const [picked, setPicked] = useState<string[]>(['Attack']);
  const allPicked = picked.length === specialties.length;

  const toggle = (name: string, on: boolean) =>
    setPicked((prev) => specialties.filter((s) => (s === name ? on : prev.includes(s))));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox
        checked={allPicked}
        indeterminate={!allPicked && picked.length > 0}
        onCheckedChange={(on) => setPicked(on ? specialties : [])}
      >
        All specialties
      </Checkbox>
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 28 }}>
        {specialties.map((name) => (
          <Checkbox key={name} checked={picked.includes(name)} onCheckedChange={(on) => toggle(name, on)}>
            {name}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}
