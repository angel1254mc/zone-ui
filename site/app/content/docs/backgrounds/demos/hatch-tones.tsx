import { HatchBackground, Text } from '@angel1254mc/zone-ui';
import type { HatchTone } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const TONES: { label: string; tone: HatchTone }[] = [
  { label: 'tone="black"', tone: 'black' },
  { label: 'tone="sage"', tone: 'sage' },
  { label: 'tone="teal"', tone: 'teal' },
  { label: 'tone="deep"', tone: 'deep' },
  { label: "tone={{ light: '#5A4A7A', dark: '#3A2A5A' }}", tone: { light: '#5A4A7A', dark: '#3A2A5A' } },
];

export default function HatchTones() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${u(300)}, 1fr))`,
        gap: u(28),
        width: '100%',
      }}
    >
      {TONES.map(({ label, tone }) => (
        <figure key={label} style={{ display: 'grid', gap: u(12), margin: 0 }}>
          <div style={{ position: 'relative', height: u(200), overflow: 'hidden', borderRadius: u(12) }}>
            <HatchBackground tone={tone} />
          </div>
          <figcaption>
            <Text role="label" tone="muted">
              {label}
            </Text>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
