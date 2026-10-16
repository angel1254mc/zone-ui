import { useState } from 'react';
import { CountdownBar } from '@angel1254mc/zone-ui';

export default function CountdownBarHero() {
  // A new key remounts the bar, so it starts over each time it runs out.
  const [round, setRound] = useState(0);
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <CountdownBar key={round} durationMs={20_000} chevrons onExpire={() => setRound((r) => r + 1)} />
    </div>
  );
}
