import { useState } from 'react';
import { SoundToggle } from '@angel1254mc/zone-ui';

export default function MutedByDefault() {
  const [muted, setMuted] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SoundToggle muted={muted} onMutedChange={setMuted} />
      <p style={{ margin: 0 }}>{muted ? 'Sound is off' : 'Sound is on'}</p>
    </div>
  );
}
