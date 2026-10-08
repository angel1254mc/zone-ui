import { useState } from 'react';
import { Select } from '@angel1254mc/zone-ui';

const options = [
  { value: 'rarity', label: 'Rarity' },
  { value: 'level', label: 'Level' },
  { value: 'atk', label: 'Base ATK' },
  { value: 'recent', label: 'Recently Obtained' },
];

export default function Controlled() {
  const [sort, setSort] = useState('level');
  const label = options.find((o) => o.value === sort)?.label;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        minHeight: 200,
      }}
    >
      <Select aria-label="Sort by" width={300} options={options} value={sort} onValueChange={setSort} />
      <output style={{ color: 'var(--zzz-color-text-muted)', paddingTop: 10 }}>Sorted by {label}</output>
    </div>
  );
}
