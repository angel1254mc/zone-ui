import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref, TdHTMLAttributes } from 'react';
import { cx } from '../../utils';
import { Tooltip } from '../Tooltip';
import { toLength, useTableSection } from './shared';
import type { SortDirection, TableAlign, TableCellOverflow, TableLength } from './shared';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'width'> {
  ref?: Ref<HTMLTableCellElement>;
  /** Text alignment. Default `start`; use `end` for numbers so their digits line up. */
  align?: TableAlign;
  /** `checkbox` sizes a select column (70 design units), `none` removes the padding. Default `normal`. */
  padding?: 'normal' | 'checkbox' | 'none';
  /**
   * `col` in the head (the default there). `row` makes a body or footer cell the row's header, the name
   * of the row; it renders as `<th>`.
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  /** On a header cell: the column's current sort, announced with `aria-sort`. `false` = not sorted. */
  sortDirection?: SortDirection | false;
  /**
   * Column width, set on the header cell (a number is design units, a string any CSS length). With the
   * default layout it is a minimum and long content still widens the column; with `layout="fixed"` it is exact.
   */
  width?: TableLength;
  /**
   * Text longer than the column: `nowrap` (default) keeps one line and widens the column; `truncate` cuts it
   * with an ellipsis and shows the full text in a tooltip on hover or focus; `wrap` breaks it over lines
   * and the row grows taller.
   */
  overflow?: TableCellOverflow;
  children?: ReactNode;
}

/** Ellipsis wrapper: focusable, with a tooltip of the full text, only while the text is actually cut off. */
function Truncated({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setCut(el.scrollWidth > el.clientWidth);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);
  return (
    <Tooltip content={children} disabled={!cut}>
      <span ref={ref} className={cx('zzz-table__truncate', cut && 'zzz-focusable')} tabIndex={cut ? 0 : undefined}>
        {children}
      </span>
    </Tooltip>
  );
}

/**
 * One cell. In TableHead it is a column header (`<th scope="col">`) in the muted label role; elsewhere a data
 * cell (`<td>`) in the body role, or a row header (`<th scope="row">`) with `scope="row"`. Cells take the
 * row's capsule fill, so a row reads as one Stat Row capsule.
 */
export function TableCell({
  align = 'start',
  padding = 'normal',
  scope,
  sortDirection,
  width,
  overflow = 'nowrap',
  className,
  style,
  children,
  ref,
  ...rest
}: TableCellProps) {
  const section = useTableSection();
  const head = section === 'head';
  const Tag = head || scope != null ? 'th' : 'td';
  const w = toLength(width);
  return (
    <Tag
      {...rest}
      ref={ref as Ref<HTMLTableCellElement & HTMLTableDataCellElement>}
      scope={Tag === 'th' ? (scope ?? 'col') : undefined}
      aria-sort={head && sortDirection ? sortDirection : undefined}
      className={cx('zzz-table__cell', className)}
      data-align={align}
      data-padding={padding === 'normal' ? undefined : padding}
      data-overflow={overflow === 'nowrap' ? undefined : overflow}
      style={w ? ({ width: w, ...style } as CSSProperties) : style}
    >
      {overflow === 'truncate' ? <Truncated>{children}</Truncated> : children}
    </Tag>
  );
}
