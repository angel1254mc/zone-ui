import { useState } from 'react';
import { IconButton, KeyHint, LockIcon, UnlockIcon } from '@angel1254mc/zone-ui';

export default function WithShortcut() {
  const [locked, setLocked] = useState(false);
  const toggle = () => setLocked((on) => !on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <IconButton
        toggle
        pressedState={locked}
        onPressedStateChange={setLocked}
        icon={<UnlockIcon />}
        iconOn={<LockIcon />}
        tone={locked ? 'lockOn' : 'default'}
        label="Lock"
      />
      <KeyHint keyCap="T" label={locked ? 'Unlock' : 'Lock'} onActivate={toggle} />
    </div>
  );
}
