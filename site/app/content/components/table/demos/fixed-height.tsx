import { useState } from 'react';
import {
  SegmentedTabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmpty,
  TableHead,
  TablePagination,
  TableRow,
  TableToolbar,
} from '@angel1254mc/zone-ui';

const DEPLOYMENTS = [
  { id: 1, agent: 'Ellen', zone: 'Brant Street Construction Site', date: '14 Oct' },
  { id: 2, agent: 'Lycaon', zone: 'Port Elpis', date: '13 Oct' },
  { id: 3, agent: 'Anby', zone: 'Sixth Street', date: '13 Oct' },
  { id: 4, agent: 'Nicole', zone: 'Lumina Square', date: '12 Oct' },
  { id: 5, agent: 'Billy', zone: 'Sixth Street', date: '11 Oct' },
  { id: 6, agent: 'Grace', zone: 'Brant Street Construction Site', date: '10 Oct' },
  { id: 7, agent: 'Koleda', zone: 'Brant Street Construction Site', date: '9 Oct' },
  { id: 8, agent: 'Miyabi', zone: 'Port Elpis', date: '8 Oct' },
  { id: 9, agent: 'Soukaku', zone: 'Lumina Square', date: '7 Oct' },
  { id: 10, agent: 'Corin', zone: 'Sixth Street', date: '6 Oct' },
  { id: 11, agent: 'Rina', zone: 'Lumina Square', date: '5 Oct' },
  { id: 12, agent: 'Nekomata', zone: 'Port Elpis', date: '4 Oct' },
];

const SHOW = { few: 3, all: DEPLOYMENTS.length, none: 0 };

export default function FixedHeight() {
  const [show, setShow] = useState<keyof typeof SHOW>('few');
  const rows = DEPLOYMENTS.slice(0, SHOW[show]);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16, width: '100%' }}>
      <div style={{ maxWidth: 'calc(560 * var(--zzz-px))' }}>
        <SegmentedTabs
          aria-label="Rows to show"
          size="sm"
          width="fill"
          value={show}
          onValueChange={(v) => setShow(v as keyof typeof SHOW)}
          items={[
            { value: 'few', label: '3 rows' },
            { value: 'all', label: '12 rows' },
            { value: 'none', label: 'No rows' },
          ]}
        />
      </div>
      <TableContainer height={640}>
        <TableToolbar title="Deployments" description={`${rows.length} this week`} />
        <Table caption="Deployments" hideCaption>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell align="end">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableEmpty colSpan={3}>No deployments this week</TableEmpty>
            ) : (
              rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell scope="row">{d.agent}</TableCell>
                  <TableCell>{d.zone}</TableCell>
                  <TableCell align="end">{d.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination count={rows.length} rowsPerPage={-1} rowsPerPageOptions={[]} />
      </TableContainer>
    </div>
  );
}
