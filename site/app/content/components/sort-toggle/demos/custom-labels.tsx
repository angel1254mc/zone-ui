import { useState } from 'react';
import { SortToggle } from '@angel1254mc/zone-ui';
import type { SortDirection } from '@angel1254mc/zone-ui';

const labels = { asc: 'Oldest first', desc: 'Newest first' };

export default function CustomLabels() {
  const [direction, setDirection] = useState<SortDirection>('desc');
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <SortToggle labels={labels} direction={direction} onDirectionChange={setDirection} />
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{labels[direction]}</output>
    </div>
  );
}
