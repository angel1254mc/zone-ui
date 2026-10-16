import { useState } from 'react';
import { RewardPreview, Text } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

const REWARDS = [
  { id: '100', name: 'Polychrome', rarity: 's', note: 'Spend it on Signal Search.' },
  { id: '110', name: 'Master Tape', rarity: 's', note: 'One exclusive channel search.' },
  { id: '502', name: 'Ether Battery', rarity: 'a', note: 'A crafting material.' },
  { id: '511', name: 'Prepaid Power Card', rarity: 'a', note: 'Restores Battery Charge.' },
  { id: '10', name: 'Denny', rarity: 'b', note: 'The common currency of New Eridu.' },
] as const;

export default function RewardDetails() {
  const [picked, setPicked] = useState<(typeof REWARDS)[number] | null>(null);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <RewardPreview
        visible={5}
        items={REWARDS.map((r) => ({
          name: r.name,
          rarity: r.rarity,
          art: <ItemImage id={r.id} alt="" />,
          onClick: () => setPicked(r),
        }))}
      />
      <Text role="bodyLg" tone="secondary" aria-live="polite">
        {picked ? `${picked.name}: ${picked.note}` : 'Pick a reward to see what it does.'}
      </Text>
    </div>
  );
}
