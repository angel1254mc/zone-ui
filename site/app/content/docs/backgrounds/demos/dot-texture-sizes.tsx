import { DotTexture, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const SIZES = [
  { size: 'sm', background: '#070707' },
  { size: 'md', background: '#1A1A1A' },
  { size: 'lg', background: '#222222' },
] as const;

export default function DotTextureSizes() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${u(260)}, 1fr))`,
        gap: u(28),
        width: '100%',
      }}
    >
      {SIZES.map(({ size, background }) => (
        <figure key={size} style={{ display: 'grid', gap: u(12), margin: 0 }}>
          <div style={{ position: 'relative', height: u(200), overflow: 'hidden', borderRadius: u(12), background }}>
            <DotTexture size={size} alpha={0.05} shade={0.4} />
          </div>
          <figcaption>
            <Text role="label" tone="muted">
              size="{size}"
            </Text>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
