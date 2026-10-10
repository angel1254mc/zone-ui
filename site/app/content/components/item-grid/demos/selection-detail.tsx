import { useState } from 'react';
import { ItemCard, ItemGrid, Text } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const ENGINES = [
  { id: '14102', name: 'Steel Cushion', rarity: 's', atk: 684 },
  { id: '14104', name: 'The Brimstone', rarity: 's', atk: 684 },
  { id: '13001', name: 'Street Superstar', rarity: 'a', atk: 594 },
  { id: '13002', name: 'Slice of Time', rarity: 'a', atk: 594 },
  { id: '13003', name: 'Weeping Cradle', rarity: 'a', atk: 594 },
  { id: '12001', name: '[Lunar] Pleniluna', rarity: 'b', atk: 475 },
  { id: '12002', name: '[Lunar] Decrescent', rarity: 'b', atk: 475 },
  { id: '12003', name: '[Lunar] Noviluna', rarity: 'b', atk: 475 },
] as const;

export default function SelectionDetail() {
  const [selected, setSelected] = useState<string | null>('14102');
  const engine = ENGINES.find((e) => e.id === selected);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <ItemGrid
        aria-label="W-Engines"
        items={ENGINES}
        getId={(e) => e.id}
        columns={4}
        value={selected}
        onValueChange={setSelected}
        renderItem={(e) => (
          <ItemCard name={e.name} rarity={e.rarity} level={60} art={<WEngineImage id={e.id} alt="" />} />
        )}
      />
      <div style={{ display: 'grid', gap: 8, minWidth: 200 }} aria-live="polite">
        <Text role="title">{engine?.name ?? 'Nothing selected'}</Text>
        {engine && (
          <Text role="bodyLg" tone="secondary">
            Rank {engine.rarity.toUpperCase()} · Base ATK {engine.atk}
          </Text>
        )}
      </div>
    </div>
  );
}
