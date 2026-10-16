import { useState } from 'react';
import { Button, GraffitiLayer, SweepTransition, Text } from '@angel1254mc/zone-ui';

export default function QuizQuestions() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [next, setNext] = useState<number | null>(null);
  const [shown, setShown] = useState(1);
  return (
    <div
      ref={setBox}
      style={{ position: 'relative', height: 360, overflow: 'hidden', display: 'grid', placeItems: 'center' }}
    >
      <GraffitiLayer />
      <div style={{ position: 'relative', display: 'grid', gap: 24, justifyItems: 'center' }}>
        <Text as="h2" role="title" style={{ margin: 0 }}>
          Question {shown} of 5
        </Text>
        <Button onClick={() => setNext(shown < 5 ? shown + 1 : 1)}>Next question</Button>
      </div>
      <SweepTransition
        container={box}
        runKey={next}
        label={`Question ${next}`}
        onMidpoint={() => next != null && setShown(next)}
      />
    </div>
  );
}
