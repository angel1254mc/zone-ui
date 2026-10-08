import { useState } from 'react';
import { ItemCard } from '@angel1254mc/zone-ui';
import type { Rarity } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

const materials: { id: string; name: string; rarity: Rarity; count: number }[] = [
  { id: '103040', name: 'Hi-Fi Master Copy', rarity: 's', count: 3 },
  { id: '502', name: 'Ether Battery', rarity: 'a', count: 7 },
  { id: '300003', name: 'Senior Investigator Log', rarity: 'a', count: 12 },
  { id: '303002', name: 'Bangboo Algorithm Module', rarity: 'b', count: 1 },
  { id: '100110', name: 'Basic Physical Chip', rarity: 'c', count: 5 },
];

export default function PickAMaterial() {
  const [picked, setPicked] = useState(materials[1].id);
  const current = materials.find((m) => m.id === picked);

  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 13 }}>
        {materials.map((m) => (
          <ItemCard
            key={m.id}
            size="material"
            name={m.name}
            rarity={m.rarity}
            count={m.count}
            art={<ItemImage id={m.id} alt="" />}
            selected={m.id === picked}
            onClick={() => setPicked(m.id)}
          />
        ))}
      </div>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {current?.name} × {current?.count}
      </output>
    </div>
  );
}
