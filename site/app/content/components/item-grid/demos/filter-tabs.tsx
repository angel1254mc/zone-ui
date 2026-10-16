import { useState } from 'react';
import { ItemCard, ItemGrid, SegmentedTabs } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

const ITEMS = [
  { id: '100', name: 'Polychrome', rarity: 's', count: 1600 },
  { id: '110', name: 'Master Tape', rarity: 's', count: 12 },
  { id: '103040', name: 'Hi-Fi Master Copy', rarity: 's', count: 3 },
  { id: '501', name: 'Battery Charge', rarity: 'a', count: 240 },
  { id: '502', name: 'Ether Battery', rarity: 'a', count: 18 },
  { id: '511', name: 'Prepaid Power Card', rarity: 'a', count: 5 },
  { id: '301003', name: 'W-Engine Energy Module', rarity: 'a', count: 42 },
  { id: '10', name: 'Denny', rarity: 'b', count: 76418 },
  { id: '303002', name: 'Bangboo Algorithm Module', rarity: 'b', count: 9 },
] as const;

export default function FilterTabs() {
  const [rarity, setRarity] = useState('all');
  const shown = ITEMS.filter((it) => rarity === 'all' || it.rarity === rarity);
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <SegmentedTabs
        aria-label="Rarity"
        size="sm"
        value={rarity}
        onValueChange={setRarity}
        items={[
          { value: 'all', label: 'All' },
          { value: 's', label: 'S' },
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
      <ItemGrid
        aria-label="Materials"
        items={shown}
        getId={(it) => it.id}
        columns={6}
        density="material"
        stagger="slow"
        renderItem={(it) => (
          <ItemCard name={it.name} rarity={it.rarity} count={it.count} art={<ItemImage id={it.id} alt="" />} />
        )}
      />
    </div>
  );
}
