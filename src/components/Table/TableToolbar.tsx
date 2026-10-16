import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils';
import './Table.css';

export interface TableToolbarProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** The table's title. Replaced by the selected count while rows are selected. */
  title?: ReactNode;
  /** A short line under the title: what the rows are, or what the actions will do. */
  description?: ReactNode;
  /** Rows currently selected. Above 0 the title becomes the count on an accent chip. */
  selectedCount?: number;
  /** Word after the count. Default `selected`. */
  selectedLabel?: ReactNode;
  /** Actions for the table or the selected rows, at the right end (Buttons, a Select…). */
  children?: ReactNode;
}

/**
 * The textured #222 strip above the table: a title in the title role with an optional description, and the
 * table's actions. While rows are selected the title becomes the count on the accent parallelogram (the
 * selected look every control in the kit shares). Title and description are a polite live region, so the
 * count is announced as it changes.
 */
export function TableToolbar({
  title,
  description,
  selectedCount = 0,
  selectedLabel = 'selected',
  className,
  children,
  ...rest
}: TableToolbarProps) {
  const selecting = selectedCount > 0;
  return (
    <div
      {...rest}
      className={cx('zzz-table-toolbar zzz-mat-textured', className)}
      data-selecting={selecting ? '' : undefined}
    >
      <div className="zzz-table-toolbar__lead" aria-live="polite">
        <p className="zzz-table-toolbar__title">
          {selecting ? (
            <>
              <span className="zzz-table-toolbar__count">{selectedCount}</span> {selectedLabel}
            </>
          ) : (
            title
          )}
        </p>
        {description != null ? <p className="zzz-table-toolbar__description">{description}</p> : null}
      </div>
      {children != null ? <div className="zzz-table-toolbar__actions">{children}</div> : null}
    </div>
  );
}
