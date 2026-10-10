import { useState } from 'react';
import { ChoiceButton } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const engines = [
  { id: '14119', badge: 'A', name: 'Deep Sea Visitor' },
  { id: '14102', badge: 'B', name: 'Steel Cushion' },
];

export default function WithMedia() {
  const [picked, setPicked] = useState('14119');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 560 }}>
      {engines.map((engine) => (
        <ChoiceButton
          key={engine.id}
          badge={engine.badge}
          mediaLayout="cover"
          media={<WEngineImage id={engine.id} alt="" />}
          selected={picked === engine.id}
          onClick={() => setPicked(engine.id)}
        >
          {engine.name}
        </ChoiceButton>
      ))}
    </div>
  );
}
