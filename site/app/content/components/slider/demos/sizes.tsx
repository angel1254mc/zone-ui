import { Slider } from '@angel1254mc/zone-ui';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 420 }}>
      <Slider size="sm" min={1} max={5} defaultValue={3} aria-label="Quantity (small)" style={{ width: '100%' }} />
      <Slider size="md" min={1} max={5} defaultValue={3} aria-label="Quantity (medium)" style={{ width: '100%' }} />
      <Slider size="lg" min={1} max={5} defaultValue={3} aria-label="Quantity (large)" style={{ width: '100%' }} />
      <Slider min={1} max={5} defaultValue={2} disabled aria-label="Quantity (disabled)" style={{ width: '100%' }} />
    </div>
  );
}
