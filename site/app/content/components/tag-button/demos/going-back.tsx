import { useState } from 'react';
import { Button, TagButton, Text } from '@angel1254mc/zone-ui';

const start = ['City', 'Agents', 'Ellen'];

export default function GoingBack() {
  const [screens, setScreens] = useState(start);
  const atRoot = screens.length === 1;
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <TagButton kind="back" aria-disabled={atRoot} onClick={() => setScreens((s) => s.slice(0, -1))} />
        <Text role="bodyLg" italic>
          {screens[screens.length - 1]}
        </Text>
      </div>
      <Text role="body" tone="muted">
        {screens.join(' / ')}
      </Text>
      <Button size="sm" disabled={screens.length === start.length} onClick={() => setScreens(start)}>
        Start over
      </Button>
    </div>
  );
}
