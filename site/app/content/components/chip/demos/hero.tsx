import { ChipGroup } from '@angel1254mc/zone-ui';

export default function ChipHero() {
  return (
    <ChipGroup
      label="Agent Specialties"
      defaultValue={['attack', 'anomaly']}
      options={[
        { value: 'attack', label: 'Attack' },
        { value: 'stun', label: 'Stun' },
        { value: 'anomaly', label: 'Anomaly' },
        { value: 'support', label: 'Support' },
        { value: 'defense', label: 'Defense' },
        { value: 'rupture', label: 'Rupture' },
      ]}
    />
  );
}
