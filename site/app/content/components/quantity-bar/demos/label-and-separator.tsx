import { QuantityBar } from '@angel1254mc/zone-ui';

export default function LabelAndSeparator() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <QuantityBar label="Select materials to dismantle" style={{ width: '100%' }} />
      <QuantityBar label="Selected" value="3 / 60" separator=":" style={{ width: '100%' }} />
    </div>
  );
}
