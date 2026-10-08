import { useState } from 'react';
import { CountdownBar } from '@angel1254mc/zone-ui';

export default function Deadline() {
  // In an app the deadline usually comes from the server, e.g. when a cooldown ends.
  const [endsAt] = useState(() => Date.now() + 125_000);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <span style={{ color: 'var(--zzz-color-text-muted)' }}>Next free draw in</span>
      <CountdownBar deadline={endsAt} size="sm" label="Cooldown" warnAt={30} criticalAt={0} />
    </div>
  );
}
