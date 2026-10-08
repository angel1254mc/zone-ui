import { useState } from 'react';
import { Button, HatchBackground, ItemCard, ScreenTransition, Text, tileStagger } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const SCREENS = [
  { title: 'S-Rank W-Engines', rarity: 's', ids: ['14102', '14104', '14105', '14107', '14109', '14110'] },
  { title: 'A-Rank W-Engines', rarity: 'a', ids: ['13001', '13002', '13003', '13004', '13005', '13006'] },
  { title: 'B-Rank W-Engines', rarity: 'b', ids: ['12001', '12002', '12003', '12004', '12005', '12006'] },
] as const;

function StorageScreen({ screen }: { screen: (typeof SCREENS)[number] }) {
  return (
    <div style={{ position: 'relative', height: 300, overflow: 'hidden', padding: 24 }}>
      <HatchBackground />
      <Text as="h2" role="title" style={{ position: 'relative', margin: '0 0 20px' }}>
        {screen.title}
      </Text>
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {screen.ids.map((id, i) => {
          const tile = tileStagger(i);
          return (
            <div key={id} className={tile.className} style={tile.style}>
              <ItemCard rarity={screen.rarity} level={60} interactive={false} art={<WEngineImage id={id} alt="" />} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ScreenTransitionHero() {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div style={{ padding: 16 }}>
        <Button onClick={() => setIndex((i) => (i + 1) % SCREENS.length)}>Next screen</Button>
      </div>
      <ScreenTransition screenKey={index}>
        <StorageScreen screen={SCREENS[index]} />
      </ScreenTransition>
    </div>
  );
}
