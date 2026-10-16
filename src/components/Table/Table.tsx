import { useId, useMemo } from 'react';
import type { ComponentPropsWithRef, CSSProperties, Key, ReactNode } from 'react';
import { cx, useControllableState } from '../../utils';
import { ScrollArea } from '../ScrollArea';
import { TableCell } from './TableCell';
import { TableEmpty, TableRow } from './TableRow';
import { TableBody, TableHead } from './TableSections';
import { TableSortLabel } from './TableSortLabel';
import { toLength, useTableContainer } from './shared';
import type { SortDirection, TableAlign, TableCellOverflow, TableLength, TableSize } from './shared';
import './Table.css';

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<Row> {
  /** Column id (also the default field read from each row). */
  key: string;
  header: ReactNode;
  /** Cell content. Default: `row[key]`. */
  cell?(row: Row, index: number): ReactNode;
  /** Default `center` (cells centred). */
  align?: TableAlign;
  /** Clickable header that sorts by this column (`aria-sort` on the header cell). */
  sortable?: boolean;
  /** Value used for sorting. Default: `row[key]`. Numbers sort numerically, the rest by locale. */
  sortValue?(row: Row): string | number | null | undefined;
  /** Column width: a number is design units, a string any CSS length. */
  width?: TableLength;
  /** Text longer than the column: `wrap` (default here), `nowrap` or `truncate`. See TableCell. */
  overflow?: TableCellOverflow;
  /** Render this column's body cells as `<th scope="row">` (the row's name). */
  rowHeader?: boolean;
}

export interface TableProps<Row = unknown> extends Omit<ComponentPropsWithRef<'table'>, 'children'> {
  /** TableHead, TableBody and TableFooter. Leave out when you pass `columns` and `rows`. */
  children?: ReactNode;
  /** Row height: `medium` 57 design units (default), `small` 46. */
  size?: TableSize;
  /** Body rows lift to #232323 under the pointer. Default `false` (`true` with `columns`). */
  hover?: boolean;
  /**
   * Keep the header row in view while the body scrolls. Default: on inside a TableContainer with a
   * `height` or `maxHeight`, off otherwise.
   */
  stickyHeader?: boolean;
  /**
   * `auto` (default) sizes columns from their content. `fixed` takes widths only from the header cells and
   * splits what is left between columns without one, so columns never move as you page or sort.
   */
  layout?: 'auto' | 'fixed';
  /** Below this width the table scrolls sideways instead of squeezing its columns (number = design units). */
  minWidth?: TableLength;
  /** A black divider between the cells of each capsule. */
  bordered?: boolean;
  /** Table caption (its accessible name, and the name of its scroll region in a TableContainer). */
  caption?: ReactNode;
  /** Keep the caption for assistive tech only. */
  hideCaption?: boolean;
  /** Ready-made table: describe the columns once and pass plain row objects instead of children. */
  columns?: TableColumn<Row>[];
  /** Rows for `columns`. */
  rows?: Row[];
  /** Row key. Default: the row index. */
  rowKey?(row: Row, index: number): Key;
  /** Current sort (controlled; `null` = unsorted). With `columns`. */
  sort?: TableSort | null;
  /** Initial sort (uncontrolled). With `columns`. */
  defaultSort?: TableSort | null;
  onSortChange?(sort: TableSort | null): void;
  /** Do not reorder `rows` (the caller sorts, e.g. server-side); headers still report the sort. */
  manualSort?: boolean;
  /** With `columns`: shown in a full-width row when `rows` is empty. */
  empty?: ReactNode;
}

function readField<Row>(row: Row, key: string): unknown {
  return row != null && typeof row === 'object' ? (row as Record<string, unknown>)[key] : undefined;
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

/**
 * Data table in the kit's capsule style: each body row is a Stat Row capsule (#161616, 57 design units, 8
 * apart), the header is a row of muted labels with no fill, and a selected row fills with the live accent.
 * Compose it from TableHead, TableBody, TableFooter, TableRow and TableCell, or pass `columns` and `rows`
 * for a ready-made sortable table. Inside a TableContainer it scrolls in its own region.
 */
export function Table<Row>({
  children,
  size = 'medium',
  hover,
  stickyHeader,
  layout = 'auto',
  minWidth,
  bordered = false,
  caption,
  hideCaption = false,
  columns,
  rows,
  rowKey,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  empty,
  className,
  style,
  ...rest
}: TableProps<Row>) {
  const container = useTableContainer();
  const captionId = useId();
  const [sort, setSort] = useControllableState<TableSort | null>(sortProp, defaultSort, onSortChange);

  const sorted = useMemo(() => {
    const list = rows ?? [];
    if (!sort || manualSort || !columns) return list;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return list;
    const get = col.sortValue ?? ((r: Row) => readField(r, col.key) as string | number | null | undefined);
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return list
      .map((row, i) => ({ row, i }))
      .sort((x, y) => compare(get(x.row), get(y.row)) * dir || x.i - y.i)
      .map((x) => x.row);
  }, [rows, columns, sort, manualSort]);

  const toggle = (key: string) => {
    setSort((prev) =>
      prev && prev.key === key
        ? { key, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' }
        : { key, direction: 'ascending' }
    );
  };

  const sticky = stickyHeader ?? container?.bounded != null;
  const min = toLength(minWidth);

  const table = (
    <table
      {...rest}
      className={cx('zzz-table', bordered && 'zzz-table--bordered', className)}
      data-size={size}
      data-hover={(hover ?? columns != null) ? '' : undefined}
      data-sticky={sticky ? '' : undefined}
      data-layout={layout === 'fixed' ? 'fixed' : undefined}
      style={min ? ({ minWidth: min, ...style } as CSSProperties) : style}
    >
      {caption != null ? (
        <caption id={captionId} className={cx('zzz-table__caption', hideCaption && 'zzz-sr-only')}>
          {caption}
        </caption>
      ) : null}
      {columns ? (
        <>
          <TableHead>
            <TableRow>
              {columns.map((c) => {
                const active = sort?.key === c.key ? sort.direction : undefined;
                return (
                  <TableCell
                    key={c.key}
                    align={c.align ?? 'center'}
                    width={c.width}
                    sortDirection={c.sortable && active ? active : false}
                  >
                    {c.sortable ? (
                      <TableSortLabel active={active != null} direction={active} onClick={() => toggle(c.key)}>
                        {c.header}
                      </TableSortLabel>
                    ) : (
                      c.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.length === 0 && empty != null ? (
              <TableEmpty colSpan={columns.length}>{empty}</TableEmpty>
            ) : (
              sorted.map((row, i) => (
                <TableRow key={rowKey ? rowKey(row, i) : i}>
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      scope={c.rowHeader ? 'row' : undefined}
                      align={c.align ?? 'center'}
                      overflow={c.overflow ?? 'wrap'}
                    >
                      {c.cell ? c.cell(row, i) : (readField(row, c.key) as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </>
      ) : (
        children
      )}
    </table>
  );

  if (!container) return table;
  return (
    <ScrollArea
      orientation="both"
      alwaysShow={false}
      gap={12}
      className="zzz-table-scroll"
      viewportClassName="zzz-table-scroll__viewport"
      aria-labelledby={caption != null ? captionId : undefined}
      aria-label={caption == null ? rest['aria-label'] : undefined}
    >
      {table}
    </ScrollArea>
  );
}
