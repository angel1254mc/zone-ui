import { useId, useState } from 'react';
import { Switch, Text } from '@angel1254mc/zone-ui';

export default function SwitchHero() {
  const id = useId();
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Switch id={id} checked={on} onCheckedChange={setOn} />
      <Text as="label" htmlFor={id} role="body" style={{ cursor: 'pointer' }}>
        Show locked items
      </Text>
    </div>
  );
}
