import { Table } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';
import { AgentImage, WEngineImage } from 'examples/art';

interface Pull {
  no: number;
  id: string;
  name: string;
  kind: 'Agent' | 'W-Engine';
  rank: 'S' | 'A' | 'B';
  time: string;
}

const PULLS: Pull[] = [
  { no: 1, id: '1471', name: 'Banyue', kind: 'Agent', rank: 'S', time: '2024-07-12 20:14' },
  { no: 2, id: '14102', name: 'Steel Cushion', kind: 'W-Engine', rank: 'S', time: '2024-07-12 20:14' },
  { no: 3, id: '1011', name: 'Anby', kind: 'Agent', rank: 'A', time: '2024-07-11 18:02' },
  { no: 4, id: '13001', name: 'Street Superstar', kind: 'W-Engine', rank: 'A', time: '2024-07-11 18:02' },
  { no: 5, id: '1061', name: 'Corin', kind: 'Agent', rank: 'A', time: '2024-07-10 09:40' },
  { no: 6, id: '12007', name: '[Vortex] Revolver', kind: 'W-Engine', rank: 'B', time: '2024-07-10 09:40' },
];

const RANK_COLOR = {
  S: 'var(--zzz-color-rarity-s)',
  A: 'var(--zzz-color-rarity-a)',
  B: 'var(--zzz-color-rarity-b)',
};

const columns: TableColumn<Pull>[] = [
  { key: 'no', header: 'No.', sortable: true, width: 100 },
  {
    key: 'name',
    header: 'Item',
    sortable: true,
    rowHeader: true,
    align: 'start',
    cell: (p) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
          {p.kind === 'Agent' ? (
            <AgentImage id={p.id} crop="circle" alt="" />
          ) : (
            <WEngineImage id={p.id} fit="cover" alt="" />
          )}
        </span>
        <span style={{ color: RANK_COLOR[p.rank] }}>{p.name}</span>
      </span>
    ),
  },
  { key: 'kind', header: 'Type', sortable: true },
  { key: 'rank', header: 'Rank', sortable: true, sortValue: (p) => 'SAB'.indexOf(p.rank) },
  { key: 'time', header: 'Time', align: 'end' },
];

export default function TableHero() {
  return <Table caption="Signal Search history" columns={columns} rows={PULLS} rowKey={(p) => p.no} />;
}
