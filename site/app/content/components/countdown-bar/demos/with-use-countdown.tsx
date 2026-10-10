import { useState } from 'react';
import { Button, CountdownBar, useCountdown } from '@angel1254mc/zone-ui';

export default function WithUseCountdown() {
  const [question, setQuestion] = useState(1);
  const [message, setMessage] = useState('');
  const clock = useCountdown({
    durationMs: 15_000,
    onExpire: () => setMessage(`Question ${question}: time ran out`),
  });

  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 560 }}>
      <CountdownBar durationMs={clock.totalMs} secondsLeft={clock.secondsLeft} fraction={clock.fraction} warnAt={5} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Button onClick={() => (clock.ticking ? clock.pause() : clock.resume())} disabled={clock.expired}>
          {clock.ticking ? 'Pause' : 'Resume'}
        </Button>
        <Button
          onClick={() => {
            setQuestion((q) => q + 1);
            setMessage('');
            clock.reset();
          }}
        >
          Next question
        </Button>
      </div>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {message || `Question ${question} · ${clock.secondsLeft}s left`}
      </output>
    </div>
  );
}
