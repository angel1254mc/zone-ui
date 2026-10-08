import { Select } from '@angel1254mc/zone-ui';

const options = [
  { value: 'rarity', label: 'Rarity' },
  { value: 'level', label: 'Level' },
];

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 380 }}>
      <Select size="sm" width="fill" aria-label="Sort by (small)" options={options} defaultValue="rarity" />
      <Select size="md" width="fill" aria-label="Sort by (medium)" options={options} defaultValue="rarity" />
      <Select size="lg" width="fill" aria-label="Sort by (large)" options={options} defaultValue="rarity" />
      <Select width="fill" aria-label="Sort by (disabled)" options={options} defaultValue="level" disabled />
    </div>
  );
}
