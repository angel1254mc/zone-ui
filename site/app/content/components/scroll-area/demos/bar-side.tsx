import { ScrollArea } from '@angel1254mc/zone-ui';

const entries = Array.from({ length: 8 }, (_, i) => `Entry ${i + 1}`);

function List({ side }: { side: 'left' | 'right' }) {
  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <ScrollArea side={side} label={`Entries, bar on the ${side}`} style={{ height: 240, width: 260 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
          {entries.map((entry) => (
            <li
              key={entry}
              style={{
                height: 41,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                borderRadius: 21,
                background: 'var(--zzz-color-surface-stat-row)',
              }}
            >
              {entry}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <code>side=&quot;{side}&quot;</code>
    </div>
  );
}

export default function BarSide() {
  return (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
      <List side="left" />
      <List side="right" />
    </div>
  );
}
