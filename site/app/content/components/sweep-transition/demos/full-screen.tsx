import { useState } from 'react';
import { Button, SweepTransition } from '@angel1254mc/zone-ui';

export default function FullScreen() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <Button onClick={() => setPlaying(true)}>Play full screen</Button>
      <SweepTransition active={playing} tone="accent" label="Loading" onDone={() => setPlaying(false)} />
    </>
  );
}
