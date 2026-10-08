import { useState } from 'react';
import { Pagination } from '@angel1254mc/zone-ui';

const PAGE_SIZE = 4;
const notices = Array.from({ length: 22 }, (_, i) => ({
  id: 22 - i,
  title: `Patch notes ${(1 + (22 - i) / 10).toFixed(1)}`,
}));

export default function WithList() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(notices.length / PAGE_SIZE);
  const visible = notices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'center', width: '100%', maxWidth: 520 }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', display: 'grid', gap: 8 }}>
        {visible.map((notice) => (
          <li
            key={notice.id}
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              background: 'var(--zzz-color-surface-stat-row)',
            }}
          >
            {notice.title}
          </li>
        ))}
      </ol>
      <Pagination aria-label="Patch notes pages" count={pageCount} page={page} onPageChange={setPage} />
    </div>
  );
}
