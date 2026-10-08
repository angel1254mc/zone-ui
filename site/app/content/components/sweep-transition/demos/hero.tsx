import { useState } from 'react';
import { Button, HatchBackground, SweepTransition, Text } from '@angel1254mc/zone-ui';

export default function SweepTransitionHero() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState(1);
  return (
    <div
      ref={setBox}
      style={{ position: 'relative', height: 400, overflow: 'hidden', display: 'grid', placeItems: 'center' }}
    >
      <HatchBackground />
      <div style={{ position: 'relative', display: 'grid', gap: 24, justifyItems: 'center' }}>
        <Text as="h2" role="eventTitle" outline="event" italic style={{ margin: 0 }}>
          Stage {stage}
        </Text>
        <Button onClick={() => setPlaying(true)}>Clear stage</Button>
      </div>
      <SweepTransition
        container={box}
        active={playing}
        label="Stage Clear"
        onMidpoint={() => setStage((s) => s + 1)}
        onDone={() => setPlaying(false)}
      />
    </div>
  );
}
