import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx, useControllableState } from '../../utils';
import { Pagination } from '../Pagination';
import { Select } from '../Select';
import './Table.css';

/** A rows-per-page choice: a number, or `{ label, value }` (value `-1` puts every row on one page). */
export type TableRowsPerPageOption = number | { label: string; value: number };

export interface TablePaginationProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  /** Total number of rows across all pages. */
  count: number;
  /** Current page, 1-based (controlled), like Pagination. */
  page?: number;
  /** Initial page (uncontrolled). Default 1. */
  defaultPage?: number;
  onPageChange?(page: number): void;
  /** Rows on each page (controlled). `-1` = all rows on one page. */
  rowsPerPage?: number;
  /** Initial rows per page (uncontrolled). Default: the first option. */
  defaultRowsPerPage?: number;
  /** Called with the new size. Changing it also goes back to page 1. */
  onRowsPerPageChange?(rowsPerPage: number): void;
  /** Choices in the rows-per-page select. Default `[10, 25, 50, 100]`. An empty list hides the select. */
  rowsPerPageOptions?: TableRowsPerPageOption[];
  /** Label of the select. Default `Rows per page`. */
  labelRowsPerPage?: ReactNode;
  /** The range text. Default `{from}–{to} of {count}`. */
  labelDisplayedRows?(range: { from: number; to: number; count: number }): ReactNode;
}

const DEFAULT_OPTIONS: TableRowsPerPageOption[] = [10, 25, 50, 100];
const optionValue = (o: TableRowsPerPageOption) => (typeof o === 'number' ? o : o.value);
const defaultDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) =>
  `${from}–${to} of ${count}`;

/**
 * The textured #191919 strip under the table: a rows-per-page Select, the range of rows on show and the
 * game-skin Pagination. It does not slice rows itself; show `rows.slice((page - 1) * rowsPerPage, page *
 * rowsPerPage)` in the TableBody.
 */
export function TablePagination({
  count,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  rowsPerPage: rowsProp,
  defaultRowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = DEFAULT_OPTIONS,
  labelRowsPerPage = 'Rows per page',
  labelDisplayedRows = defaultDisplayedRows,
  className,
  ...rest
}: TablePaginationProps) {
  const labelId = useId();
  const firstOption = rowsPerPageOptions.length > 0 ? optionValue(rowsPerPageOptions[0]) : 10;
  const [rows, setRows] = useControllableState(rowsProp, defaultRowsPerPage ?? firstOption, onRowsPerPageChange);
  const [rawPage, setPage] = useControllableState(pageProp, defaultPage, onPageChange);

  const total = Math.max(0, Math.floor(count));
  const per = rows === -1 ? Math.max(1, total) : Math.max(1, rows);
  const pages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(Math.max(1, rawPage), pages);
  const from = total === 0 ? 0 : (page - 1) * per + 1;
  const to = Math.min(page * per, total);

  const changeRows = (value: string) => {
    setRows(Number(value));
    if (page !== 1) setPage(1);
  };

  return (
    <div {...rest} className={cx('zzz-table-pagination zzz-mat-textured zzz-mat-textured--body', className)}>
      {rowsPerPageOptions.length > 0 ? (
        <div className="zzz-table-pagination__rows">
          <span id={labelId}>{labelRowsPerPage}</span>
          <Select
            aria-labelledby={labelId}
            size="sm"
            width={150}
            value={String(rows)}
            onValueChange={changeRows}
            options={rowsPerPageOptions.map((o) =>
              typeof o === 'number'
                ? { value: String(o), label: String(o) }
                : { value: String(o.value), label: o.label }
            )}
          />
        </div>
      ) : null}
      <div className="zzz-table-pagination__nav">
        <span className="zzz-table-pagination__range">{labelDisplayedRows({ from, to, count: total })}</span>
        <Pagination skin="game" size="sm" count={pages} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}
