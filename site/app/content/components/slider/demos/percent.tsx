import { useState } from 'react';
import { Slider, Text } from '@angel1254mc/zone-ui';

export default function Percent() {
  const [threshold, setThreshold] = useState(35);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center', width: '100%', maxWidth: 420 }}>
      <Text id="heal-label" role="body" tone="muted">
        Auto-heal threshold
      </Text>
      <Slider
        aria-labelledby="heal-label"
        min={0}
        max={100}
        step={5}
        value={threshold}
        onValueChange={setThreshold}
        formatBound={(n) => `${n}%`}
        getValueText={(n) => `${n} percent`}
        style={{ width: '100%' }}
      />
      <output>Heals below {threshold}% HP</output>
    </div>
  );
}
