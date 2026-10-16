import { useState } from 'react';
import { Button, HatchBackground, SweepTransition } from '@angel1254mc/zone-ui';
import type { SweepTone } from '@angel1254mc/zone-ui';

const TONES: { label: string; tone: SweepTone }[] = [
  { label: 'Default', tone: 'default' },
  { label: 'Accent', tone: 'accent' },
  { label: 'Tint', tone: '#3A7BD5' },
  { label: 'Custom', tone: ['#F168A3', '#5A2E4A', '#24161F'] },
];

export default function Tones() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [tone, setTone] = useState<SweepTone>('default');
  const [playing, setPlaying] = useState(false);
  return (
    <div
      ref={setBox}
      style={{ position: 'relative', height: 300, overflow: 'hidden', display: 'grid', placeItems: 'center' }}
    >
      <HatchBackground />
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {TONES.map((t) => (
          <Button
            key={t.label}
            width="compact"
            onClick={() => {
              setTone(t.tone);
              setPlaying(true);
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <SweepTransition container={box} active={playing} tone={tone} label="Round 2" onDone={() => setPlaying(false)} />
    </div>
  );
}
