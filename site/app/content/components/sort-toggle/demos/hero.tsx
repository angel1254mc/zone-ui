import { Select, SortToggle } from '@angel1254mc/zone-ui';

export default function SortToggleHero() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Select
        aria-label="Sort by"
        width={300}
        defaultValue="rarity"
        options={[
          { value: 'rarity', label: 'Rarity' },
          { value: 'level', label: 'Level' },
        ]}
      />
      <SortToggle />
    </div>
  );
}
