import { StorageMuralBackground, Text } from '@angel1254mc/zone-ui';
import { gameArtUrl, useNamecard } from 'examples/art';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

function Band({ label, src }: { label: string; src?: string }) {
  return (
    <div style={{ position: 'relative', height: u(102), overflow: 'hidden' }}>
      <StorageMuralBackground src={src} />
      <div
        style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: `0 ${u(32)}` }}
      >
        <Text role="title">Storage</Text>
        <span style={{ flex: 1 }} />
        <Text role="label" tone="muted">
          {label}
        </Text>
      </div>
    </div>
  );
}

export default function MuralBand() {
  // Any image URL works; here a namecard loaded by URL.
  const card = useNamecard({ id: 'ImgCardEvent02' });
  return (
    <div style={{ display: 'grid', gap: u(20), padding: `${u(28)} 0` }}>
      <Band label="No src" />
      <Band label="src = image URL" src={card ? gameArtUrl(card.image, 'enka') : undefined} />
    </div>
  );
}
