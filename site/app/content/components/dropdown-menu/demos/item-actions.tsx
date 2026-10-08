import { useState } from 'react';
import { Button, DropdownMenu } from '@angel1254mc/zone-ui';

export default function ItemActions() {
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useState('Pick an action');
  return (
    <div style={{ minHeight: 230 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <DropdownMenu
          trigger={<Button width="compact">Build</Button>}
          aria-label="Build actions"
          items={[
            {
              id: 'save',
              label: saved ? 'Saved' : 'Save build',
              disabled: saved,
              onSelect: () => {
                setSaved(true);
                setLog('Build saved');
              },
            },
            { id: 'share', label: 'Share', onSelect: () => setLog('Share link created') },
            { id: 'duplicate', label: 'Duplicate', onSelect: () => setLog('Copy added to your builds') },
            {
              id: 'reset',
              label: 'Reset',
              onSelect: () => {
                setSaved(false);
                setLog('Build reset');
              },
            },
          ]}
        />
        <output style={{ color: 'var(--zzz-color-text-muted)' }}>{log}</output>
      </div>
    </div>
  );
}
