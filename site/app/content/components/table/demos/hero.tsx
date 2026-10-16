import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  RankCoin,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TableToolbar,
} from '@angel1254mc/zone-ui';
import type { TableSortDirection } from '@angel1254mc/zone-ui';

interface Agent {
  id: string;
  name: string;
  rank: 'S' | 'A';
  specialty: string;
  faction: string;
  level: number;
  atk: number;
}

const AGENTS: Agent[] = [
  {
    id: 'ellen',
    name: 'Ellen',
    rank: 'S',
    specialty: 'Attack',
    faction: 'Victoria Housekeeping',
    level: 60,
    atk: 3284,
  },
  {
    id: 'lycaon',
    name: 'Lycaon',
    rank: 'S',
    specialty: 'Stun',
    faction: 'Victoria Housekeeping',
    level: 60,
    atk: 2912,
  },
  { id: 'rina', name: 'Rina', rank: 'S', specialty: 'Support', faction: 'Victoria Housekeeping', level: 50, atk: 2541 },
  {
    id: 'corin',
    name: 'Corin',
    rank: 'A',
    specialty: 'Attack',
    faction: 'Victoria Housekeeping',
    level: 40,
    atk: 2106,
  },
  { id: 'anby', name: 'Anby', rank: 'A', specialty: 'Stun', faction: 'Cunning Hares', level: 60, atk: 2377 },
  { id: 'nicole', name: 'Nicole', rank: 'A', specialty: 'Support', faction: 'Cunning Hares', level: 50, atk: 1968 },
  { id: 'billy', name: 'Billy', rank: 'A', specialty: 'Attack', faction: 'Cunning Hares', level: 45, atk: 2233 },
  { id: 'nekomata', name: 'Nekomata', rank: 'S', specialty: 'Attack', faction: 'Cunning Hares', level: 60, atk: 3105 },
  {
    id: 'grace',
    name: 'Grace',
    rank: 'S',
    specialty: 'Anomaly',
    faction: 'Belobog Heavy Industries',
    level: 50,
    atk: 2688,
  },
  {
    id: 'koleda',
    name: 'Koleda',
    rank: 'S',
    specialty: 'Stun',
    faction: 'Belobog Heavy Industries',
    level: 55,
    atk: 2754,
  },
  { id: 'soukaku', name: 'Soukaku', rank: 'A', specialty: 'Support', faction: 'Section 6', level: 50, atk: 2044 },
  { id: 'miyabi', name: 'Miyabi', rank: 'S', specialty: 'Anomaly', faction: 'Section 6', level: 60, atk: 3371 },
];

type Key = 'name' | 'specialty' | 'faction' | 'level' | 'atk';
const COLUMNS: { key: Key; label: string; numeric?: boolean }[] = [
  { key: 'name', label: 'Agent' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'faction', label: 'Faction' },
  { key: 'level', label: 'Level', numeric: true },
  { key: 'atk', label: 'ATK', numeric: true },
];

export default function TableHero() {
  const [orderBy, setOrderBy] = useState<Key>('name');
  const [order, setOrder] = useState<TableSortDirection>('ascending');
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['ellen']));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sorted = useMemo(() => {
    const dir = order === 'ascending' ? 1 : -1;
    return [...AGENTS].sort((a, b) => {
      const x = a[orderBy];
      const y = b[orderBy];
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir;
    });
  }, [orderBy, order]);
  const visible = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const sortBy = (key: Key) => {
    setOrder(orderBy === key && order === 'ascending' ? 'descending' : 'ascending');
    setOrderBy(key);
  };
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const all = selected.size === AGENTS.length;

  return (
    <TableContainer style={{ width: '100%' }}>
      <TableToolbar
        title="Agent roster"
        description={selected.size > 3 ? 'A squad takes up to 3 agents.' : 'Pick up to 3 agents for a squad.'}
        selectedCount={selected.size}
      >
        {selected.size > 0 ? (
          <>
            <Button size="sm" disabled={selected.size > 3}>
              Deploy squad
            </Button>
            <Button size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </>
        ) : null}
      </TableToolbar>
      <Table caption="Agent roster" hideCaption>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                aria-label="Select all agents"
                checked={all}
                indeterminate={selected.size > 0 && !all}
                onCheckedChange={(checked) => setSelected(checked ? new Set(AGENTS.map((a) => a.id)) : new Set())}
              />
            </TableCell>
            {COLUMNS.map((c) => (
              <TableCell
                key={c.key}
                align={c.numeric ? 'end' : 'start'}
                sortDirection={orderBy === c.key ? order : false}
              >
                <TableSortLabel
                  active={orderBy === c.key}
                  direction={orderBy === c.key ? order : 'ascending'}
                  onClick={() => sortBy(c.key)}
                >
                  {c.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((a) => (
            <TableRow key={a.id} selected={selected.has(a.id)}>
              <TableCell padding="checkbox">
                <Checkbox
                  aria-label={`Select ${a.name}`}
                  checked={selected.has(a.id)}
                  onCheckedChange={() => toggle(a.id)}
                />
              </TableCell>
              <TableCell scope="row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'calc(14 * var(--zzz-px))' }}>
                  <RankCoin rank={a.rank} />
                  {a.name}
                </span>
              </TableCell>
              <TableCell>{a.specialty}</TableCell>
              <TableCell>{a.faction}</TableCell>
              <TableCell align="end">{a.level}</TableCell>
              <TableCell align="end">{a.atk.toLocaleString('en-US')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        count={AGENTS.length}
        page={page}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
}
