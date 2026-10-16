import { useState } from 'react';
import { Radio, RadioGroup } from '@angel1254mc/zone-ui';

const levels: Record<string, string> = {
  normal: 'Enemies follow their usual patterns.',
  hard: 'Enemies hit harder and stagger less.',
  hell: 'One mistake ends the run.',
};

export default function Controlled() {
  const [level, setLevel] = useState('hard');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <RadioGroup label="Difficulty" value={level} onValueChange={setLevel}>
        <Radio value="normal">Normal</Radio>
        <Radio value="hard">Hard</Radio>
        <Radio value="hell">Hell</Radio>
      </RadioGroup>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{levels[level]}</output>
    </div>
  );
}
