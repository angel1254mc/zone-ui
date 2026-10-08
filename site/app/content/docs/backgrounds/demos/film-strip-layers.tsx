import { FilmStripBackground, GraffitiLayer, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const LETTERS = ['A', 'B', 'C'];

export default function FilmStripLayers() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${u(440)}, 1fr))` }}>
      {/* Three strips over the graffiti, as beside a character */}
      <div style={{ position: 'relative', height: u(760), overflow: 'hidden', background: '#000' }}>
        <GraffitiLayer />
        <FilmStripBackground />
        <div style={{ position: 'absolute', right: u(24), bottom: u(20) }}>
          <Text role="label" tone="muted">
            Default
          </Text>
        </div>
      </div>
      {/* Two strips with custom posters */}
      <div style={{ position: 'relative', height: u(760), overflow: 'hidden', background: '#000' }}>
        <FilmStripBackground
          strips={2}
          frames={LETTERS.map((letter) => (
            <svg key={letter} viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <text x="50" y="80" textAnchor="middle" fontSize="90" fontWeight="900" fill="#000">
                {letter}
              </text>
            </svg>
          ))}
        />
        <div style={{ position: 'absolute', right: u(24), bottom: u(20) }}>
          <Text role="label" tone="muted">
            Two strips, custom posters
          </Text>
        </div>
      </div>
    </div>
  );
}
