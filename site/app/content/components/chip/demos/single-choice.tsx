import { ChipGroup } from '@angel1254mc/zone-ui';

export default function SingleChoice() {
  return (
    <ChipGroup
      label="Rarity"
      multiple={false}
      defaultValue={['s']}
      options={[
        { value: 's', label: 'S' },
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]}
    />
  );
}
