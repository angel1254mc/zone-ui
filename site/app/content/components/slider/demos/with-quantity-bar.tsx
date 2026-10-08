import { useState } from 'react';
import { QuantityBar, Slider } from '@angel1254mc/zone-ui';

export default function WithQuantityBar() {
  const [quantity, setQuantity] = useState(1);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <Slider
        min={1}
        max={5}
        value={quantity}
        onValueChange={setQuantity}
        aria-label="Craft quantity"
        style={{ width: '100%' }}
      />
      <QuantityBar label="Craft Quantity" value={quantity} style={{ width: '100%' }} />
    </div>
  );
}
