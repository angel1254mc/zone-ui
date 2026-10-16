import { useState } from 'react';
import { BatteryIcon, PlusBadge } from '@angel1254mc/zone-ui';

export default function GetMore() {
  const [charge, setCharge] = useState(180);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px 8px 10px',
        borderRadius: 999,
        background: '#000',
        border: '2px solid #333',
      }}
    >
      <BatteryIcon size={40} style={{ color: '#3e8bf0' }} />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{charge}/240</span>
      <PlusBadge
        label="Get more Battery Charge"
        disabled={charge >= 240}
        onClick={() => setCharge((c) => Math.min(240, c + 20))}
      />
    </div>
  );
}
