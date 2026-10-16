import { useState } from 'react';
import { ModifierRow } from '@angel1254mc/zone-ui';

export default function ModifierRowHero() {
  const [active, setActive] = useState(false);
  return (
    <div style={{ width: 560 }}>
      <ModifierRow count={8} action={{ pressed: active, onClick: () => setActive((on) => !on) }} />
    </div>
  );
}
