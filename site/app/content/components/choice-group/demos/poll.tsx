import { useState } from 'react';
import { Button, ChoiceGroup } from '@angel1254mc/zone-ui';

const options = [
  { value: 'shiyu', label: 'Shiyu Defense', votes: 41 },
  { value: 'hollow', label: 'Hollow Zero', votes: 27 },
  { value: 'arcade', label: 'Arcade games', votes: 19 },
  { value: 'fishing', label: 'Fishing', votes: 13 },
];

export default function Poll() {
  const [value, setValue] = useState<string[]>([]);
  const [voted, setVoted] = useState(false);
  return (
    <div style={{ width: '100%', maxWidth: 560, display: 'grid', gap: 20, justifyItems: 'start' }}>
      <ChoiceGroup
        style={{ width: '100%' }}
        selectionMode="multiple"
        maxSelected={2}
        layout="list"
        badges="none"
        label="Pick up to two favourite modes"
        items={options.map((option) => ({
          value: option.value,
          label: option.label,
          description: voted ? `${option.votes}% of votes` : undefined,
        }))}
        value={value}
        onValueChange={setValue}
        locked={voted}
        announcement={voted ? 'Thanks for voting. Results are shown under each option.' : undefined}
      />
      <Button disabled={value.length === 0} onClick={() => setVoted(!voted)}>
        {voted ? 'Change vote' : 'Vote'}
      </Button>
    </div>
  );
}
