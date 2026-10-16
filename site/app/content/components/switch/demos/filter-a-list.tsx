import { useState } from 'react';
import { LockIcon, Switch, Text } from '@angel1254mc/zone-ui';

const engines = [
  { name: 'Steel Cushion', locked: true },
  { name: 'Starlight Engine', locked: false },
  { name: 'Deep Sea Visitor', locked: true },
  { name: 'Street Superstar', locked: false },
];

export default function FilterAList() {
  const [showLocked, setShowLocked] = useState(false);
  const visible = engines.filter((e) => showLocked || !e.locked);
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Switch aria-labelledby="locked-label" checked={showLocked} onCheckedChange={setShowLocked} />
        <Text id="locked-label" role="body">
          Show locked items
        </Text>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {visible.map((engine) => (
          <li key={engine.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text role="body" tone="muted">
              {engine.name}
            </Text>
            {engine.locked && <LockIcon aria-label="Locked" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
