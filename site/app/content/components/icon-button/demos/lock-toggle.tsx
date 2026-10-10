import { useState } from 'react';
import { IconButton, LockIcon, UnlockIcon } from '@angel1254mc/zone-ui';

export default function LockToggle() {
  const [locked, setLocked] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton
        toggle
        pressedState={locked}
        onPressedStateChange={setLocked}
        icon={<UnlockIcon />}
        iconOn={<LockIcon />}
        tone={locked ? 'lockOn' : 'default'}
        label="Lock"
      />
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {locked ? 'Locked: it cannot be dismantled' : 'Unlocked'}
      </output>
    </div>
  );
}
