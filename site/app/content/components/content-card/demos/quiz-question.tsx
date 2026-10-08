import { useState } from 'react';
import { Button, ChoiceGroup, ClockIcon, ContentCard } from '@angel1254mc/zone-ui';

export default function QuizQuestion() {
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 860 }}>
      <ContentCard
        variant="accent"
        eyebrow="Question 2 / 5"
        trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ClockIcon size={22} /> 0:18
          </span>
        }
        title="Which of these is not an element in the game?"
        footer={<Button disabled={!answer}>Lock in</Button>}
      >
        <ChoiceGroup
          aria-label="Answers"
          value={answer}
          onValueChange={setAnswer}
          items={[
            { value: 'fire', label: 'Fire' },
            { value: 'ether', label: 'Ether' },
            { value: 'wind', label: 'Wind' },
            { value: 'ice', label: 'Ice' },
          ]}
        />
      </ContentCard>
    </div>
  );
}
