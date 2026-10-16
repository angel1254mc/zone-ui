import { ScrollArea } from '@angel1254mc/zone-ui';

const rewards = Array.from({ length: 10 }, (_, i) => `Reward ${i + 1}`);

export default function HorizontalRow() {
  return (
    <ScrollArea orientation="horizontal" variant="list" hint label="Rewards" style={{ width: 420, paddingRight: 40 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {rewards.map((reward) => (
          <div
            key={reward}
            style={{
              flex: '0 0 auto',
              width: 110,
              height: 110,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 12,
              background: 'var(--zzz-color-surface-stat-row)',
            }}
          >
            {reward}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
