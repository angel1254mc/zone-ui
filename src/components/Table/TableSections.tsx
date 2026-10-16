import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils';
import { TableSectionContext } from './shared';

export type TableHeadProps = ComponentPropsWithRef<'thead'>;
export type TableBodyProps = ComponentPropsWithRef<'tbody'>;
export type TableFooterProps = ComponentPropsWithRef<'tfoot'>;

/** The header rows (`<thead>`). Cells inside render as column headers (`<th scope="col">`). */
export function TableHead({ className, ...rest }: TableHeadProps) {
  return (
    <TableSectionContext.Provider value="head">
      <thead {...rest} className={cx('zzz-table__head', className)} />
    </TableSectionContext.Provider>
  );
}

/** The data rows (`<tbody>`): stat-row capsules (#161616) 8 design units apart (6 when small). */
export function TableBody({ className, ...rest }: TableBodyProps) {
  return (
    <TableSectionContext.Provider value="body">
      <tbody {...rest} className={cx('zzz-table__body', className)} />
    </TableSectionContext.Provider>
  );
}

/** Summary rows (`<tfoot>`): sunken #0D0D0D capsules; the last row, the total, lifts to #222 at a larger size. */
export function TableFooter({ className, ...rest }: TableFooterProps) {
  return (
    <TableSectionContext.Provider value="footer">
      <tfoot {...rest} className={cx('zzz-table__foot', className)} />
    </TableSectionContext.Provider>
  );
}
