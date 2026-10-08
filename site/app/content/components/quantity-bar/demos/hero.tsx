import { QuantityBar } from '@angel1254mc/zone-ui';

export default function QuantityBarHero() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <QuantityBar label="Craft Quantity" value={12} style={{ width: '100%' }} />
    </div>
  );
}
