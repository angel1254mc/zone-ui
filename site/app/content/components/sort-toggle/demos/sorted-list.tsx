import { useState } from 'react';
import { Select, SortToggle, Text } from '@angel1254mc/zone-ui';
import type { SortDirection } from '@angel1254mc/zone-ui';

const agents = [
  { name: 'Anby', level: 50 },
  { name: 'Ellen', level: 60 },
  { name: 'Nicole', level: 45 },
  { name: 'Lycaon', level: 55 },
  { name: 'Billy', level: 30 },
];

export default function SortedList() {
  const [key, setKey] = useState('level');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const sorted = [...agents].sort((a, b) => {
    const diff = key === 'name' ? a.name.localeCompare(b.name) : a.level - b.level;
    return direction === 'asc' ? diff : -diff;
  });

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Select
          aria-label="Sort by"
          width={300}
          value={key}
          onValueChange={setKey}
          options={[
            { value: 'level', label: 'Level' },
            { value: 'name', label: 'Name' },
          ]}
        />
        <SortToggle direction={direction} onDirectionChange={setDirection} />
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
        {sorted.map((agent) => (
          <li key={agent.name}>
            <Text role="body">
              {agent.name} <Text tone="muted">Lv. {agent.level}</Text>
            </Text>
          </li>
        ))}
      </ol>
    </div>
  );
}
