import { useState } from 'react';
import { ChoiceButton } from '@angel1254mc/zone-ui';

const answers = [
  { value: 'a', label: 'Ballet Twins Road' },
  { value: 'b', label: 'Lumina Square' },
  { value: 'c', label: 'Sixth Street' },
];

export default function ChoiceButtonHero() {
  const [picked, setPicked] = useState('b');
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 440 }}>
      {answers.map((answer) => (
        <ChoiceButton
          key={answer.value}
          badge={answer.value.toUpperCase()}
          selected={picked === answer.value}
          onClick={() => setPicked(answer.value)}
        >
          {answer.label}
        </ChoiceButton>
      ))}
    </div>
  );
}
