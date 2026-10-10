import { Slider } from '@angel1254mc/zone-ui';

export default function SliderHero() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Slider min={1} max={10} defaultValue={4} aria-label="Craft quantity" style={{ width: '100%' }} />
    </div>
  );
}
