import { useState } from 'react';
import { Button, ChoiceButton, ResetIcon, Text } from '@angel1254mc/zone-ui';
import type { ChoiceResult } from '@angel1254mc/zone-ui';

const answers = [
  { value: 'a', label: 'Ballet Twins Road' },
  { value: 'b', label: 'Sixth Street' },
  { value: 'c', label: 'Lumina Square' },
];
const correct = 'b';

export default function ShowTheAnswer() {
  const [picked, setPicked] = useState<string | null>(null);

  const resultFor = (value: string): ChoiceResult | undefined => {
    if (picked === null) return undefined;
    if (value === picked) return value === correct ? 'correct' : 'incorrect';
    return value === correct ? 'revealed' : undefined;
  };

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 440 }}>
      <Text role="bodyLg">Which street is Random Play on?</Text>
      {answers.map((answer) => (
        <ChoiceButton
          key={answer.value}
          badge={answer.value.toUpperCase()}
          result={resultFor(answer.value)}
          onClick={() => picked === null && setPicked(answer.value)}
        >
          {answer.label}
        </ChoiceButton>
      ))}
      <div>
        <Button icon={<ResetIcon />} iconTone="reset" disabled={picked === null} onClick={() => setPicked(null)}>
          Try again
        </Button>
      </div>
    </div>
  );
}
