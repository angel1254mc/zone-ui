import { QuantityBar } from '@angel1254mc/zone-ui';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <QuantityBar size="sm" label="Craft Quantity" value={3} style={{ width: '100%' }} />
      <QuantityBar size="md" label="Craft Quantity" value={3} style={{ width: '100%' }} />
      <QuantityBar size="lg" label="Craft Quantity" value={3} style={{ width: '100%' }} />
    </div>
  );
}
