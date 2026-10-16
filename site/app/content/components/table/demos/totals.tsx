import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@angel1254mc/zone-ui';

const ITEMS = [
  { item: 'Ether battery', qty: 6, price: 1200 },
  { item: 'Hollow data chip', qty: 3, price: 2500 },
  { item: 'W-Engine energy module', qty: 12, price: 300 },
];

const n = (v: number) => v.toLocaleString('en-US');

export default function Totals() {
  const subtotal = ITEMS.reduce((sum, i) => sum + i.qty * i.price, 0);
  const fee = Math.round(subtotal * 0.08);
  return (
    <Table caption="Commission payout" size="small" style={{ maxWidth: 'calc(900 * var(--zzz-px))' }}>
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="end">Qty</TableCell>
          <TableCell align="end">Unit price</TableCell>
          <TableCell align="end">Sum</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ITEMS.map((i) => (
          <TableRow key={i.item}>
            <TableCell scope="row">{i.item}</TableCell>
            <TableCell align="end">{i.qty}</TableCell>
            <TableCell align="end">{n(i.price)}</TableCell>
            <TableCell align="end">{n(i.qty * i.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell scope="row" colSpan={3}>
            Subtotal
          </TableCell>
          <TableCell align="end">{n(subtotal)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row" colSpan={2}>
            Express fee
          </TableCell>
          <TableCell align="end">8%</TableCell>
          <TableCell align="end">{n(fee)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row" colSpan={3}>
            Total
          </TableCell>
          <TableCell align="end">{n(subtotal + fee)} Dennies</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
