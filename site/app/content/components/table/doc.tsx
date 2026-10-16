import { Table } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

interface Row {
  no: number;
  name: string;
  rank: string;
  color: string;
}

const ROWS: Row[] = [
  { no: 1, name: 'Banyue', rank: 'S', color: 'var(--zzz-color-rarity-s)' },
  { no: 2, name: 'Steel Cushion', rank: 'S', color: 'var(--zzz-color-rarity-s)' },
  { no: 3, name: 'Anby', rank: 'A', color: 'var(--zzz-color-rarity-a)' },
  { no: 4, name: 'Corin', rank: 'A', color: 'var(--zzz-color-rarity-a)' },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: 'no', header: 'No.', sortable: true, width: 110 },
  {
    key: 'name',
    header: 'Item',
    sortable: true,
    align: 'start',
    cell: (r) => <span style={{ color: r.color }}>{r.name}</span>,
  },
  { key: 'rank', header: 'Rank', sortable: true },
];

/** Gallery preview: a short sorted history at an explicit width in design units. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(640 * var(--zzz-px))' }}>
      <Table
        caption="Signal Search history"
        hideCaption
        columns={COLUMNS}
        rows={ROWS}
        defaultSort={{ key: 'no', direction: 'ascending' }}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'start' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.4,
  usage: (
    <>
      <p>
        Use a table for rows of data people compare or scan: a pull history, a leaderboard, stats side by side. It is a
        real <code>&lt;table&gt;</code>, so it reads well with assistive tech. Describe the columns once in{' '}
        <code>columns</code> and pass plain row objects. Mark columns <code>sortable</code> and the headers sort the
        rows for you.
      </p>
      <p>For a few label and value pairs, use Stat Row. For items people pick from, use an Item Grid.</p>
    </>
  ),
  usageCode: `import { Table } from '@angel1254mc/zone-ui';

<Table
  caption="Signal Search history"
  rows={pulls}
  columns={[
    { key: 'name', header: 'Item', align: 'start', rowHeader: true },
    { key: 'rank', header: 'Rank', sortable: true },
  ]}
/>`,
  examples: [
    {
      demo: 'filter-empty',
      title: 'Filter with an empty state',
      description: 'Tabs filter the rows, and empty fills the table when nothing matches.',
      frame: 'start',
    },
    {
      demo: 'stat-comparison',
      title: 'Stat comparison',
      description: 'bordered adds column lines, and end-aligned numbers line up their digits.',
      frame: 'start',
    },
    {
      demo: 'sort-yourself',
      title: 'Sort the data yourself',
      description: 'With manualSort the headers report the sort and you reorder the rows, for example on the server.',
      frame: 'start',
    },
  ],
  types: [
    {
      name: 'TableColumn',
      rows: [
        {
          name: 'key',
          type: 'string',
          required: true,
          description: 'Column id, and the field read from each row by default.',
        },
        { name: 'header', type: 'ReactNode', required: true, description: 'Header cell content.' },
        { name: 'cell', type: '(row, index) => ReactNode', description: 'Custom cell content. Default `row[key]`.' },
        { name: 'align', type: "'start' | 'center' | 'end'", description: 'Cell alignment. Default `center`.' },
        { name: 'sortable', type: 'boolean', description: 'Makes the header a sort button.' },
        {
          name: 'sortValue',
          type: '(row) => string | number',
          description: 'Value to sort by. Numbers sort numerically, text by locale.',
        },
        { name: 'width', type: 'number', description: 'Column width in design units.' },
        { name: 'rowHeader', type: 'boolean', description: 'Renders the cells as row headers, the name of each row.' },
      ],
    },
    {
      name: 'TableSort',
      rows: [
        { name: 'key', type: 'string', required: true, description: 'The sorted column.' },
        { name: 'direction', type: "'ascending' | 'descending'", required: true, description: 'Sort direction.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Sorting',
      items: [
        <>A sortable header switches between ascending and descending. A newly clicked header starts ascending.</>,
        <>
          The sorted header carries <code className="d-inline-code">aria-sort</code>. Rows that tie keep their original
          order.
        </>,
      ],
    },
    {
      title: 'Captions',
      items: [
        <>
          Give every table a <code className="d-inline-code">caption</code>: it names the table. Hide it visually with{' '}
          <code className="d-inline-code">hideCaption</code> when a heading already says the same.
        </>,
      ],
    },
  ],
  related: ['stat-row', 'pagination', 'item-grid'],
};

export default doc;
