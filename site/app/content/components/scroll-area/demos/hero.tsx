import { ScrollArea } from '@angel1254mc/zone-ui';

const missions = Array.from({ length: 10 }, (_, i) => `Mission ${i + 1}`);

export default function ScrollAreaHero() {
  return (
    <ScrollArea label="Missions" style={{ height: 300, width: 320 }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {missions.map((mission) => (
          <li
            key={mission}
            style={{
              height: 41,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: 21,
              background: 'var(--zzz-color-surface-stat-row)',
            }}
          >
            {mission}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
