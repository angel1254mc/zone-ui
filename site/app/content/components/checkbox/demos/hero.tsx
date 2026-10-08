import { Checkbox } from '@angel1254mc/zone-ui';

export default function CheckboxHero() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox defaultChecked>Show locked items</Checkbox>
      <Checkbox>Hide duplicates</Checkbox>
      <Checkbox defaultChecked>Remember my filters</Checkbox>
    </div>
  );
}
