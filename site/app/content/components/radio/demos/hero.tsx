import { Radio, RadioGroup } from '@angel1254mc/zone-ui';

export default function RadioHero() {
  return (
    <RadioGroup label="Difficulty" defaultValue="normal">
      <Radio value="normal">Normal</Radio>
      <Radio value="hard">Hard</Radio>
      <Radio value="hell" disabled>
        Hell (locked)
      </Radio>
    </RadioGroup>
  );
}
