import { useMemo } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../utils';
import { TableContainerContext, toLength } from './shared';
import type { TableLength } from './shared';
import './Table.css';

export interface TableContainerProps extends ComponentPropsWithRef<'div'> {
  /**
   * Fixed outer height (a number is design units, a string any CSS length). The toolbar and pagination
   * stay put and the table fills the space between them, scrolling what does not fit.
   */
  height?: TableLength;
  /** Maximum outer height: a short table shrinks the panel, a long one scrolls once it reaches the cap. */
  maxHeight?: TableLength;
}

/**
 * The table's panel: the lit panel ring (5-unit #333 ring, 3-unit keyline, outer radius 29) around a black
 * surface that stacks TableToolbar, Table and TablePagination. Inside it the table scrolls in its own
 * region (the kit scrollbar, both axes) while the toolbar and pagination stay in place. With `height` or
 * `maxHeight` the header row is pinned by default.
 *
 * `className`, `style`, `ref` and other div props go to the outer element; `height` / `maxHeight` are its
 * outer size, ring included.
 */
export function TableContainer({ height, maxHeight, className, style, children, ...rest }: TableContainerProps) {
  const bounded: 'height' | 'max' | null = height != null ? 'height' : maxHeight != null ? 'max' : null;
  const context = useMemo(() => ({ bounded }), [bounded]);
  const size = toLength(height ?? maxHeight);
  return (
    <div
      {...rest}
      className={cx('zzz-table-container', className)}
      data-bounded={bounded ?? undefined}
      style={size ? ({ '--zzz-table-container-h': size, ...style } as CSSProperties) : style}
    >
      <div className="zzz-table-container__surface zzz-mat-panel">
        <TableContainerContext.Provider value={context}>{children}</TableContainerContext.Provider>
      </div>
    </div>
  );
}
