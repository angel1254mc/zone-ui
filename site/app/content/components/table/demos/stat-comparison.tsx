import { Table } from '@angel1254mc/zone-ui';

interface Stat {
  stat: string;
  base: string;
  bonus: string;
  total: string;
}

const STATS: Stat[] = [
  { stat: 'HP', base: '7,673', bonus: '+9,393', total: '17,066' },
  { stat: 'ATK', base: '863', bonus: '+1,292', total: '2,155' },
  { stat: 'DEF', base: '606', bonus: '+266', total: '872' },
  { stat: 'CRIT Rate', base: '5%', bonus: '+40.8%', total: '45.8%' },
];

export default function StatComparison() {
  return (
    <Table<Stat>
      caption="Stat comparison"
      hideCaption
      bordered
      rows={STATS}
      rowKey={(s) => s.stat}
      columns={[
        { key: 'stat', header: 'Stat', rowHeader: true, align: 'start' },
        { key: 'base', header: 'Base', align: 'end' },
        {
          key: 'bonus',
          header: 'Bonus',
          align: 'end',
          cell: (s) => <span style={{ color: 'var(--zzz-color-highlight-value)' }}>{s.bonus}</span>,
        },
        {
          key: 'total',
          header: 'Total',
          align: 'end',
          cell: (s) => <span style={{ color: 'var(--zzz-color-text-primary)' }}>{s.total}</span>,
        },
      ]}
    />
  );
}
