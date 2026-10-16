import { RankCoin, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const ROWS = [
  { name: 'Ellen', rank: 'S', level: 60, selected: true },
  { name: 'Anby', rank: 'A', level: 60, selected: false },
  { name: 'Corin', rank: 'A', level: 40, selected: false },
] as const;

/** Gallery preview: a short roster in its panel, one row selected, at an explicit width in design units. */
function Thumbnail() {
  return (
    <TableContainer style={{ width: 'calc(600 * var(--zzz-px))' }}>
      <Table caption="Agent roster" hideCaption>
        <TableHead>
          <TableRow>
            <TableCell>Agent</TableCell>
            <TableCell align="end">Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r.name} selected={r.selected}>
              <TableCell scope="row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'calc(14 * var(--zzz-px))' }}>
                  <RankCoin rank={r.rank} decorative />
                  {r.name}
                </span>
              </TableCell>
              <TableCell align="end">{r.level}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const code = (s: string) => <code className="d-inline-code">{s}</code>;

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'start' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.4,
  usage: (
    <>
      <p>
        Use a table for rows of data people compare or scan: a roster, a history, results side by side. Every row is a
        capsule like a Stat Row, and a selected row fills with the accent. Build it from <code>TableHead</code>,{' '}
        <code>TableBody</code>, <code>TableRow</code> and <code>TableCell</code> when you need selection, custom cells
        or paging; put it in a <code>TableContainer</code> with a <code>TableToolbar</code> and{' '}
        <code>TablePagination</code> for the full panel. For a quick sortable table, pass <code>columns</code> and{' '}
        <code>rows</code> instead of children.
      </p>
      <p>For a few label and value pairs, use Stat Row. For items people pick from by their art, use an Item Grid.</p>
    </>
  ),
  usageCode: `import { Table, TableBody, TableCell, TableHead, TableRow } from '@angel1254mc/zone-ui';

<Table caption="Agent roster">
  <TableHead>
    <TableRow>
      <TableCell>Agent</TableCell>
      <TableCell align="end">Level</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {agents.map((agent) => (
      <TableRow key={agent.id}>
        <TableCell scope="row">{agent.name}</TableCell>
        <TableCell align="end">{agent.level}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
  examples: [
    {
      demo: 'fixed-height',
      title: 'Fixed height',
      description:
        'With height the panel keeps its size: fewer rows leave room, more rows scroll under the pinned header.',
      frame: 'start',
    },
    {
      demo: 'column-widths',
      title: 'Column widths and long text',
      description:
        'layout="fixed" takes widths from the header cells, truncate cuts long text, wrap lets a row grow, and minWidth scrolls the table sideways on narrow screens.',
      frame: 'start',
    },
    {
      demo: 'totals',
      title: 'Totals and spanning cells',
      description:
        'TableFooter holds the totals, label cells span columns with colSpan, and size="small" packs the rows.',
      frame: 'start',
    },
    {
      demo: 'columns-and-rows',
      title: 'Columns and rows',
      description: 'Describe the columns once and pass plain row objects; sortable headers sort the rows for you.',
      frame: 'start',
    },
    {
      demo: 'filter-empty',
      title: 'Filter with an empty state',
      description: 'Tabs filter the rows, and empty fills the table when nothing matches.',
      frame: 'start',
    },
    {
      demo: 'stat-comparison',
      title: 'Stat comparison',
      description: 'bordered splits each capsule into cells, and end-aligned numbers line up their digits.',
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
        {
          name: 'width',
          type: 'number | string',
          description: 'Column width: a number is design units, a string any CSS length.',
        },
        {
          name: 'overflow',
          type: "'nowrap' | 'truncate' | 'wrap'",
          description: 'Text longer than the column. Default `wrap`, so long text never widens the table.',
        },
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
    {
      name: 'TableRowsPerPageOption',
      rows: [
        { name: 'number', type: 'number', description: 'A page size, shown as itself.' },
        {
          name: '{ label, value }',
          type: '{ label: string; value: number }',
          description: 'A page size with its own label. Value `-1` puts every row on one page, for example `All`.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'Column widths',
      items: [
        <>
          Set a column&rsquo;s {code('width')} on its header cell. A number is design units, like every size in the kit;
          a string is any CSS length.
        </>,
        <>
          With the default layout a width is a minimum: long content still widens the column, and columns can shift as
          you page or sort. {code('layout="fixed"')} makes header widths exact and splits what is left between the
          columns without one, so nothing moves.
        </>,
        <>
          {code('minWidth')} on the table is the width below which it scrolls sideways instead of squeezing its columns.
        </>,
      ],
    },
    {
      title: 'Long text',
      items: [
        <>
          A cell keeps its text on one line by default and its column grows to fit. With {code('columns')}, text wraps
          by default instead.
        </>,
        <>
          {code('overflow="truncate"')} cuts the text with an ellipsis. When it is actually cut, the cell becomes a tab
          stop and a tooltip shows the full text on hover or focus; screen readers always read the full text.
        </>,
        <>
          {code('overflow="wrap"')} breaks the text over lines and the capsule grows into a rounded rectangle. Keep it
          for description columns.
        </>,
      ],
    },
    {
      title: 'Height and scrolling',
      items: [
        <>
          Inside a {code('TableContainer')} the table scrolls in its own region with the kit scrollbar, named by its
          caption, while the toolbar and pagination stay in place.
        </>,
        <>
          {code('height')} keeps the panel one size whatever the row count; {code('maxHeight')} lets a short table
          shrink it. Either one pins the header row unless you pass {code('stickyHeader={false}')}. With a fixed height
          and no rows, {code('TableEmpty')} fills the space.
        </>,
        <>
          On a phone the toolbar and pagination wrap and take more of a fixed height, so pass a length that grows with
          the screen, such as {code('height="min(70dvh, 640px)"')}.
        </>,
      ],
    },
    {
      title: 'Sorting and selection',
      items: [
        <>
          Put a {code('TableSortLabel')} in each sortable header cell and the column&rsquo;s {code('sortDirection')} on
          the cell, so the sort is announced with {code('aria-sort')}. With {code('columns')}, a newly clicked header
          starts ascending and rows that tie keep their order.
        </>,
        <>
          Select rows with a Checkbox in a {code('padding="checkbox"')} cell and {code('selected')} on the row. A
          checkbox on a selected row turns black so it stays visible. Pass the count to {code('TableToolbar')}; it is
          announced as it changes.
        </>,
      ],
    },
    {
      title: 'Captions',
      items: [
        <>
          Give every table a {code('caption')}: it names the table. Hide it visually with {code('hideCaption')} when a
          heading or toolbar already says the same.
        </>,
      ],
    },
  ],
  related: ['pagination', 'scroll-area', 'stat-row', 'checkbox', 'item-grid'],
};

export default doc;
