import { useState } from 'react';
import { Button, GraffitiLayer, HatchBackground, ScreenTransition, SegmentedTabs, Text } from '@angel1254mc/zone-ui';
import type { ScreenTransitionMode } from '@angel1254mc/zone-ui';

const MODES = [
  { value: 'cut', label: 'Cut' },
  { value: 'fadeThroughBlack', label: 'Fade' },
  { value: 'fadeFromBlack', label: 'From black' },
  { value: 'blurThrough', label: 'Blur' },
];

export default function Modes() {
  const [mode, setMode] = useState('cut');
  const [screen, setScreen] = useState(1);
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', padding: 16 }}>
        <SegmentedTabs aria-label="Mode" size="sm" value={mode} onValueChange={setMode} items={MODES} />
        <Button size="sm" onClick={() => setScreen((s) => s + 1)}>
          Next screen
        </Button>
      </div>
      <ScreenTransition screenKey={screen} mode={mode as ScreenTransitionMode}>
        <div style={{ position: 'relative', height: 260, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          {screen % 2 ? <HatchBackground /> : <GraffitiLayer />}
          <Text as="h2" role="eventTitle" outline="event" italic style={{ position: 'relative', margin: 0 }}>
            Screen {screen}
          </Text>
        </div>
      </ScreenTransition>
    </div>
  );
}
