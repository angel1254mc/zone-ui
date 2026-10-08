import { useState } from 'react';
import { Button, Countdown, GiftIcon } from '@angel1254mc/zone-ui';

export default function WhenItEnds() {
  const [target, setTarget] = useState(() => Date.now() + 10_000);
  const [ready, setReady] = useState(false);

  const restart = () => {
    setReady(false);
    setTarget(Date.now() + 10_000);
  };

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
      <Countdown
        target={target}
        format="ms"
        prefix="Supply crate unlocks in"
        reachedLabel="Ready"
        onReach={() => setReady(true)}
      />
      <Button icon={<GiftIcon />} iconTone="confirm" width="auto" disabled={!ready} onClick={restart}>
        Claim
      </Button>
    </div>
  );
}
