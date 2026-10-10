import { ScrollArea } from '@angel1254mc/zone-ui';

function Rows({ count }: { count: number }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            height: 41,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderRadius: 21,
            background: 'var(--zzz-color-surface-stat-row)',
          }}
        >
          Row {i + 1}
        </div>
      ))}
    </div>
  );
}

export default function HiddenWhenFits() {
  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      <ScrollArea alwaysShow={false} label="Short list" style={{ height: 300, width: 300 }}>
        <Rows count={3} />
      </ScrollArea>
      <ScrollArea alwaysShow={false} label="Long list" style={{ height: 300, width: 300 }}>
        <Rows count={12} />
      </ScrollArea>
    </div>
  );
}
