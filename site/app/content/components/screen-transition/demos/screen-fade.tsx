import { useState } from 'react';
import { Button, GraffitiLayer, ScreenFade, Spinner, Text } from '@angel1254mc/zone-ui';

export default function ScreenFadeDemo() {
  const [black, setBlack] = useState(false);
  const [level, setLevel] = useState(1);

  // Fully black: load the next level, then lift the veil.
  const loadNext = async () => {
    setLevel((n) => n + 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setBlack(false);
  };

  return (
    <div style={{ position: 'relative', height: 280, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <GraffitiLayer />
      <div style={{ position: 'relative', display: 'grid', gap: 20, justifyItems: 'center' }}>
        <Text as="h2" role="eventTitle" outline="event" italic style={{ margin: 0 }}>
          Level {level}
        </Text>
        <Button onClick={() => setBlack(true)}>Load next level</Button>
      </div>
      <ScreenFade active={black} exit="fade" onDone={(state) => state === 'black' && void loadNext()} />
      {black && <Spinner variant="chevrons" style={{ position: 'absolute', right: 24, bottom: 24, zIndex: 100 }} />}
    </div>
  );
}
