import { useState } from 'react';
import { Countdown } from '@angel1254mc/zone-ui';

const HOUR = 3_600_000;

export default function CountdownHero() {
  // A fixed target for this demo. In an app, pass the real date: target="2026-12-01T04:00:00Z".
  const [nextPuzzle] = useState(() => Date.now() + 7 * HOUR + 42 * 60_000 + 13_000);
  const [eventEnd] = useState(() => Date.now() + 54 * HOUR + 18 * 60_000);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
      <Countdown target={nextPuzzle} prefix="Next puzzle in" />
      <Countdown target={eventEnd} prefix="Event ends in" />
    </div>
  );
}
