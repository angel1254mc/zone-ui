import { Select } from '@angel1254mc/zone-ui';

export default function SelectHero() {
  return (
    <div style={{ width: '100%', maxWidth: 340, minHeight: 260 }}>
      <Select
        aria-label="Sort by"
        width="fill"
        defaultValue="rarity"
        defaultOpen
        options={[
          { value: 'rarity', label: 'Rarity' },
          { value: 'level', label: 'Level' },
          { value: 'atk', label: 'Base ATK' },
          { value: 'refinement', label: 'Refinement' },
          { value: 'recent', label: 'Recently Obtained' },
        ]}
      />
    </div>
  );
}
