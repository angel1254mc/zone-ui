import { useState } from 'react';
import { Countdown } from '@angel1254mc/zone-ui';

export default function InlineText() {
  const [closesAt] = useState(() => Date.now() + 7 * 3_600_000 + 42 * 60_000);
  return (
    <p style={{ margin: 0, maxWidth: 520, textAlign: 'center' }}>
      Today’s puzzle closes in <Countdown variant="plain" target={closesAt} format="labels" />. Come back tomorrow for a
      new one.
    </p>
  );
}
