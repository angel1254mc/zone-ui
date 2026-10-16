import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils';

export interface TableRowProps extends ComponentPropsWithRef<'tr'> {
  /** Fills the row's capsule with the live accent and turns its text black. */
  selected?: boolean;
  /** Lift the row to #232323 under the pointer. Overrides the table's `hover` for this row. */
  hover?: boolean;
}

/** One row (`<tr>`). In the body it is one capsule: its first and last cells carry the rounded ends. */
export function TableRow({ selected = false, hover, className, ...rest }: TableRowProps) {
  return (
    <tr
      {...rest}
      className={cx('zzz-table__row', className)}
      data-selected={selected ? '' : undefined}
      data-hover={hover == null ? undefined : hover ? 'on' : 'off'}
    />
  );
}

export interface TableEmptyProps extends Omit<ComponentPropsWithRef<'tr'>, 'children'> {
  /** Number of columns the message spans. */
  colSpan: number;
  /** Say why there are no rows and, when there is one, how to get some back. */
  children: ReactNode;
}

/**
 * The row to show when there is no data: one sunken capsule across every column with the message centred.
 * In a TableContainer with a fixed `height` it fills the space between the header and the pagination.
 */
export function TableEmpty({ colSpan, children, className, ...rest }: TableEmptyProps) {
  return (
    <tr {...rest} className={cx('zzz-table__empty', className)}>
      <td colSpan={colSpan}>{children}</td>
    </tr>
  );
}
