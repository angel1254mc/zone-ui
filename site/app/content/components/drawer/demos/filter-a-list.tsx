import { useState } from 'react';
import { Button, FilterDrawer, FilterIcon, ItemCard } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

type Rarity = 's' | 'a' | 'b';

const ENGINES: { id: string; name: string; rarity: Rarity; level: number }[] = [
  { id: '14102', name: 'Steel Cushion', rarity: 's', level: 60 },
  { id: '14104', name: 'The Brimstone', rarity: 's', level: 50 },
  { id: '13001', name: 'Street Superstar', rarity: 'a', level: 60 },
  { id: '13002', name: 'Slice of Time', rarity: 'a', level: 40 },
  { id: '13003', name: 'Weeping Cradle', rarity: 'a', level: 30 },
  { id: '12001', name: '[Lunar] Pleniluna', rarity: 'b', level: 20 },
  { id: '12002', name: '[Lunar] Decrescent', rarity: 'b', level: 10 },
];

export default function FilterAList() {
  const [open, setOpen] = useState(false);
  const [rarity, setRarity] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rarity');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const order = { s: 3, a: 2, b: 1 };
  const shown = ENGINES.filter((e) => rarity.length === 0 || rarity.includes(e.rarity)).sort((x, y) => {
    const diff = sortBy === 'level' ? x.level - y.level : order[x.rarity] - order[y.rarity];
    return direction === 'asc' ? diff : -diff;
  });

  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <Button icon={<FilterIcon />} width="compact" onClick={() => setOpen(true)}>
        Filter
      </Button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {shown.map((e) => (
          <ItemCard
            key={e.id}
            name={e.name}
            rarity={e.rarity}
            level={e.level}
            interactive={false}
            art={<WEngineImage id={e.id} alt="" />}
          />
        ))}
      </div>
      <FilterDrawer
        open={open}
        onOpenChange={setOpen}
        sort={{
          value: sortBy,
          onValueChange: setSortBy,
          direction,
          onDirectionChange: setDirection,
          options: [
            { value: 'rarity', label: 'Rarity' },
            { value: 'level', label: 'Level' },
          ],
        }}
        groups={[
          {
            label: 'Rarity',
            value: rarity,
            onValueChange: setRarity,
            options: [
              { value: 's', label: 'S' },
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
          },
        ]}
        onReset={() => {
          setRarity([]);
          setSortBy('rarity');
          setDirection('desc');
        }}
      />
    </div>
  );
}
