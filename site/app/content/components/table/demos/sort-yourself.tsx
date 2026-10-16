import { useMemo, useState } from 'react';
import { Table } from '@angel1254mc/zone-ui';
import type { TableColumn, TableSort } from '@angel1254mc/zone-ui';

interface Score {
  player: string;
  score: number;
  streak: number;
}

const SCORES: Score[] = [
  { player: 'Proxy', score: 4820, streak: 12 },
  { player: 'Belle', score: 5120, streak: 7 },
  { player: 'Wise', score: 3990, streak: 21 },
  { player: 'Eous', score: 4410, streak: 3 },
];

const columns: TableColumn<Score>[] = [
  { key: 'player', header: 'Player', rowHeader: true, align: 'start' },
  { key: 'score', header: 'Score', sortable: true, align: 'end' },
  { key: 'streak', header: 'Streak', sortable: true, align: 'end' },
];

export default function SortYourself() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'score', direction: 'descending' });

  // Sort in your own code, for example where the data is fetched. The table only shows the sort.
  const rows = useMemo(() => {
    if (!sort) return SCORES;
    const key = sort.key as 'score' | 'streak';
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return [...SCORES].sort((a, b) => (a[key] - b[key]) * dir);
  }, [sort]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Table
        caption="Leaderboard"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.player}
        manualSort
        sort={sort}
        onSortChange={setSort}
      />
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {sort ? `Sorted by ${sort.key}, ${sort.direction}` : 'Not sorted'}
      </output>
    </div>
  );
}
