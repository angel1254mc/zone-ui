import type { CSSProperties } from 'react';
import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const MESHES = [
  { label: 'sm · alpha 0.025 · shade 0.75', size: 'sm', alpha: 0.025, shade: 0.75, base: '#090909' },
  { label: 'md · alpha 0.02 · shade 0.2', size: 'md', alpha: 0.02, shade: 0.2, base: '#1A1A1A' },
  { label: 'lg · alpha 0.022 · shade 0.18', size: 'lg', alpha: 0.022, shade: 0.18, base: '#222222' },
  { label: 'sm, exaggerated: alpha 0.3 · shade 1', size: 'sm', alpha: 0.3, shade: 1, base: '#333333' },
];

export default function DotLattice() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${u(260)}, 1fr))`,
        gap: u(28),
        width: '100%',
      }}
    >
      {MESHES.map((m) => (
        <figure key={m.label} style={{ display: 'grid', gap: u(12), margin: 0 }}>
          <div
            className="zzz-dots"
            style={
              {
                height: u(170),
                borderRadius: u(12),
                backgroundColor: m.base,
                '--zzz-dots-size': `var(--zzz-pattern-dots-${m.size})`,
                '--zzz-dots-alpha': m.alpha,
                '--zzz-dots-shade': m.shade,
              } as CSSProperties
            }
          />
          <figcaption>
            <Text role="label" tone="muted">
              {m.label}
            </Text>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
