import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils';
import type { SortDirection } from './shared';

export interface TableSortLabelProps extends ComponentPropsWithRef<'button'> {
  /** This column is the one the rows are sorted by: its arrow for `direction` takes the accent. */
  active?: boolean;
  /** Direction shown while active. Default `ascending`. */
  direction?: SortDirection;
}

/**
 * The sort control inside a header cell: the label and two stacked triangles. While `active`, the triangle
 * for `direction` is on the live accent. Put `sortDirection` on the header cell too, so the sort is
 * announced. Pressing fills it with the accent, like every pressable control in the kit.
 */
export function TableSortLabel({
  active = false,
  direction = 'ascending',
  className,
  children,
  type = 'button',
  ...rest
}: TableSortLabelProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx('zzz-table__sort zzz-pressable zzz-focusable', className)}
      data-direction={active ? direction : undefined}
    >
      <span>{children}</span>
      <svg className="zzz-table__sort-glyph" viewBox="0 0 10 14" aria-hidden="true" focusable="false">
        <path className="zzz-table__sort-up" d="M5 0 L10 5.5 H0 Z" />
        <path className="zzz-table__sort-down" d="M5 14 L0 8.5 H10 Z" />
      </svg>
    </button>
  );
}
