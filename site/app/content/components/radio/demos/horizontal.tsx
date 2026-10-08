import { Radio, RadioGroup } from '@angel1254mc/zone-ui';

export default function Horizontal() {
  return (
    <RadioGroup label="Text speed" orientation="horizontal" defaultValue="normal">
      <Radio value="slow">Slow</Radio>
      <Radio value="normal">Normal</Radio>
      <Radio value="fast">Fast</Radio>
    </RadioGroup>
  );
}
