import { useState } from 'react';
import { Chip } from '@angel1254mc/zone-ui';

export default function Standalone() {
  const [ownedOnly, setOwnedOnly] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
      <Chip selected={ownedOnly} onSelectedChange={setOwnedOnly}>
        Owned only
      </Chip>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {ownedOnly ? 'Showing 12 of 40 W-Engines' : 'Showing all 40 W-Engines'}
      </output>
    </div>
  );
}
