import { useRef } from 'react';
import { ScrollHint, SectionLabel, StatRow } from '@angel1254mc/zone-ui';

const stats = [
  ['HP', '7,673'],
  ['ATK', '938'],
  ['DEF', '606'],
  ['Impact', '93'],
  ['CRIT Rate', '19.4%'],
  ['CRIT DMG', '50%'],
  ['PEN Ratio', '0%'],
  ['Energy Regen', '1.2'],
];

export default function ScrollHintHero() {
  const viewport = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        borderRadius: 'calc(20 * var(--zzz-px))',
        border: 'calc(4 * var(--zzz-px)) solid #1f1f1f',
        background: '#000',
      }}
    >
      {/* The hint sits on the bottom edge of the nearest positioned ancestor. */}
      <div style={{ position: 'relative' }}>
        <div
          ref={viewport}
          tabIndex={0}
          role="region"
          aria-label="Agent stats"
          style={{
            display: 'grid',
            gap: 'calc(10 * var(--zzz-px))',
            height: 'calc(240 * var(--zzz-px))',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <SectionLabel>Base Stats</SectionLabel>
          {stats.map(([label, value]) => (
            <StatRow key={label} label={label} value={value} />
          ))}
        </div>
        <ScrollHint target={viewport} />
      </div>
    </div>
  );
}
