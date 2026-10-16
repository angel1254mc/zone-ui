import { useState } from 'react';
import { NavBar } from '@angel1254mc/zone-ui';

export default function ClientRouting() {
  const [page, setPage] = useState('home');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <NavBar
        logo={<strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 22 }}>ZONE</strong>}
        value={page}
        onValueChange={setPage}
        items={[
          { value: 'home', label: 'Home' },
          { value: 'agents', label: 'Agents' },
          { value: 'news', label: 'News' },
        ]}
      />
      <p style={{ margin: 0, padding: '0 20px 20px', color: 'var(--zzz-color-text-muted)' }}>Current page: {page}</p>
    </div>
  );
}
