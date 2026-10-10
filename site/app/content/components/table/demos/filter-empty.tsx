import { useState } from 'react';
import { SegmentedTabs, Table } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';

interface Pull {
  no: number;
  name: string;
  kind: 'Agent' | 'W-Engine' | 'Bangboo';
  rank: 'S' | 'A' | 'B';
}

const PULLS: Pull[] = [
  { no: 1, name: 'Banyue', kind: 'Agent', rank: 'S' },
  { no: 2, name: 'Steel Cushion', kind: 'W-Engine', rank: 'S' },
  { no: 3, name: 'Anby', kind: 'Agent', rank: 'A' },
  { no: 4, name: 'Street Superstar', kind: 'W-Engine', rank: 'A' },
];

const columns: TableColumn<Pull>[] = [
  { key: 'no', header: 'No.', width: 100 },
  { key: 'name', header: 'Item', rowHeader: true, align: 'start' },
  { key: 'kind', header: 'Type' },
  { key: 'rank', header: 'Rank' },
];

export default function FilterEmpty() {
  const [kind, setKind] = useState('all');
  const rows = PULLS.filter((p) => kind === 'all' || p.kind === kind);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SegmentedTabs
        aria-label="Type"
        size="sm"
        value={kind}
        onValueChange={setKind}
        items={[
          { value: 'all', label: 'All' },
          { value: 'Agent', label: 'Agents' },
          { value: 'W-Engine', label: 'W-Engines' },
          { value: 'Bangboo', label: 'Bangboo' },
        ]}
      />
      <Table
        caption="Signal Search history"
        hideCaption
        columns={columns}
        rows={rows}
        rowKey={(p) => p.no}
        empty="No records of this type"
      />
    </div>
  );
}
