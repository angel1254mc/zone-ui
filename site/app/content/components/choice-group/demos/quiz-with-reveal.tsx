import { useState } from 'react';
import { Button, ChoiceGroup, ClockIcon, ContentCard } from '@angel1254mc/zone-ui';
import type { ChoiceResult } from '@angel1254mc/zone-ui';

const answers = [
  { value: 'ballet', label: 'Ballet Twins Road' },
  { value: 'lumina', label: 'Lumina Square' },
  { value: 'sixth', label: 'Sixth Street' },
  { value: 'blazewood', label: 'Blazewood' },
];
const correct = 'sixth';

export default function QuizWithReveal() {
  const [value, setValue] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  let results: Record<string, ChoiceResult> | undefined;
  if (checked && value === correct) results = { [correct]: 'correct' };
  else if (checked && value) results = { [value]: 'incorrect', [correct]: 'revealed' };

  return (
    <div style={{ width: '100%', maxWidth: 860 }}>
      <ContentCard
        eyebrow="Question 3 / 5"
        trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ClockIcon size={22} /> 0:24
          </span>
        }
        title="Which street is the Random Play store on?"
        footer={
          checked ? (
            <Button
              onClick={() => {
                setChecked(false);
                setValue(null);
              }}
            >
              Try again
            </Button>
          ) : (
            <Button disabled={!value} onClick={() => setChecked(true)}>
              Lock in
            </Button>
          )
        }
      >
        <ChoiceGroup
          aria-label="Answers"
          items={answers}
          value={value}
          onValueChange={setValue}
          results={results}
          locked={checked}
          hotkeys
        />
      </ContentCard>
    </div>
  );
}
