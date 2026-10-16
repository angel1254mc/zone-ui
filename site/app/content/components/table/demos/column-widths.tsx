import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@angel1254mc/zone-ui';

const COMMISSIONS = [
  {
    id: 'c1',
    name: 'Clear the Ethereal nest under the Brant Street construction site',
    client: 'Belobog Heavy Industries',
    reward: 18000,
    notes: 'Bring a Stun agent: the nest guards take a long time to break.',
  },
  {
    id: 'c2',
    name: 'Escort the delivery',
    client: 'Random Play',
    reward: 6500,
    notes: 'Short run.',
  },
  {
    id: 'c3',
    name: 'Recover the lost data chip from the old subway line',
    client: 'Victoria Housekeeping Co.',
    reward: 12400,
    notes: 'The client asks for no damage to the chip casing, so avoid Fire agents near the vault.',
  },
];

export default function ColumnWidths() {
  return (
    <TableContainer style={{ width: '100%' }}>
      <Table caption="Open commissions" hideCaption layout="fixed" minWidth={1000}>
        <TableHead>
          <TableRow>
            <TableCell width={360}>Commission</TableCell>
            <TableCell width={260}>Client</TableCell>
            <TableCell width={150} align="end">
              Reward
            </TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {COMMISSIONS.map((c) => (
            <TableRow key={c.id}>
              <TableCell scope="row" overflow="truncate">
                {c.name}
              </TableCell>
              <TableCell overflow="truncate">{c.client}</TableCell>
              <TableCell align="end">{c.reward.toLocaleString('en-US')}</TableCell>
              <TableCell overflow="wrap">{c.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
