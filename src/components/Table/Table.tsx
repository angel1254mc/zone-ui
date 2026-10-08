import { useMemo } from 'react';
import type { ComponentPropsWithRef, CSSProperties, Key, ReactNode } from 'react';
import { cx, useControllableState } from '../../utils';
import './Table.css';

export type TableAlign = 'start' | 'center' | 'end';
export type SortDirection = 'ascending' | 'descending';

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
  /** Column width in design units. */
  width?: number;
  /** Render this column's body cells as `<th scope="row">` (the row's name). */
  rowHeader?: boolean;
}

export interface TableProps<Row> extends Omit<ComponentPropsWithRef<'table'>, 'children'> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Row key. Default: the row index. */
  rowKey?(row: Row, index: number): Key;
  /** Table caption (its accessible name). */
  caption?: ReactNode;
  /** Keep the caption for assistive tech only. */
  hideCaption?: boolean;
  /** Current sort (controlled; `null` = unsorted). */
  sort?: TableSort | null;
  /** Initial sort (uncontrolled). */
  defaultSort?: TableSort | null;
  onSortChange?(sort: TableSort | null): void;
  /** Do not reorder `rows` (the caller sorts, e.g. server-side); headers still report the sort. */
  manualSort?: boolean;
  /** Column dividers as well as row dividers. */
  bordered?: boolean;
  /** Shown in a full-width row when `rows` is empty. */
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
 * Data table for web data lists (history, leaderboards, results). Semantic `<table>`: radius 10, header row #1C1C1C with `label` in
 * `color.text.muted`, body rows #000 with 2 px #232323 dividers, cells padding 10, centred,
 * tabular numbers. Optional sortable headers (button + `aria-sort`), controlled or uncontrolled.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  hideCaption = false,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  bordered = false,
  empty,
  className,
  ...rest
}: TableProps<Row>) {
  const [sort, setSort] = useControllableState<TableSort | null>(sortProp, defaultSort, onSortChange);

  const sorted = useMemo(() => {
    if (!sort || manualSort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const get = col.sortValue ?? ((r: Row) => readField(r, col.key) as string | number | null | undefined);
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return rows
      .map((row, i) => ({ row, i }))
      .sort((x, y) => compare(get(x.row), get(y.row)) * dir || x.i - y.i)
      .map((x) => x.row);
  }, [rows, columns, sort, manualSort]);

  const toggle = (key: string) => {
    setSort((prev) =>
      prev && prev.key === key
        ? {
            key,
            direction: prev.direction === 'ascending' ? 'descending' : 'ascending',
          }
        : { key, direction: 'ascending' }
    );
  };

  const colStyle = (c: TableColumn<Row>): CSSProperties | undefined =>
    c.width != null ? { width: `calc(${c.width} * var(--zzz-px))` } : undefined;

  return (
    <table {...rest} className={cx('zzz-table', bordered && 'zzz-table--bordered', className)}>
      {caption != null ? (
        <caption className={cx('zzz-table__caption', hideCaption && 'zzz-sr-only')}>{caption}</caption>
      ) : null}
      <thead>
        <tr>
          {columns.map((c) => {
            const active = sort?.key === c.key ? sort.direction : undefined;
            return (
              <th
                key={c.key}
                scope="col"
                className="zzz-table__th"
                data-align={c.align ?? 'center'}
                aria-sort={c.sortable && active ? active : undefined}
                style={colStyle(c)}
              >
                {c.sortable ? (
                  <button
                    type="button"
                    className="zzz-table__sort zzz-pressable zzz-focusable"
                    data-direction={active}
                    onClick={() => toggle(c.key)}
                  >
                    <span>{c.header}</span>
                    <svg className="zzz-table__sort-glyph" viewBox="0 0 10 14" aria-hidden="true" focusable="false">
                      <path className="zzz-table__sort-up" d="M5 0 L10 5.5 H0 Z" />
                      <path className="zzz-table__sort-down" d="M5 14 L0 8.5 H10 Z" />
                    </svg>
                  </button>
                ) : (
                  c.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 && empty != null ? (
          <tr className="zzz-table__empty">
            <td colSpan={columns.length}>{empty}</td>
          </tr>
        ) : (
          sorted.map((row, i) => (
            <tr key={rowKey ? rowKey(row, i) : i} className="zzz-table__row">
              {columns.map((c) => {
                const content = c.cell ? c.cell(row, i) : (readField(row, c.key) as ReactNode);
                const Cell = c.rowHeader ? 'th' : 'td';
                return (
                  <Cell
                    key={c.key}
                    scope={c.rowHeader ? 'row' : undefined}
                    className="zzz-table__td"
                    data-align={c.align ?? 'center'}
                  >
                    {content}
                  </Cell>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
