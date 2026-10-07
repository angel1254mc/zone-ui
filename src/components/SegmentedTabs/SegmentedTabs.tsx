import { useRef } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils';
import { useTabList } from './useTabList';
import type { TabListItem } from './useTabList';
import { CAP_PATH, CAP_WIDTH, FILL_HEIGHT } from './geometry';
import './SegmentedTabs.css';

export interface SegmentedTabsItem extends TabListItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Accessible name when `label` is not plain text. */
  'aria-label'?: string;
}

export type SegmentedTabsSurface = 'black' | 'mesh';

/** Control size: sm / md / lg ≈ 32 / 40 / 48 CSS px controls at the default scale (md = the base geometry). */
export type SegmentedTabsSize = 'sm' | 'md' | 'lg';

export interface SegmentedTabsProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange'
> {
  items: readonly SegmentedTabsItem[];
  /** Selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). Default: the first enabled item. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * `black` = pure #000 track (e.g. in a top bar);
   * `mesh` = #090909 dot mesh (e.g. in a bottom bar).
   */
  surface?: SegmentedTabsSurface;
  /**
   * Control size (default `md`). Every length (height 59, active fill, slant caps, ring, pop) scales
   * by the control-size ratio (sm 46/57, lg 69/57); the italic label uses `fontSize.control.{size}`.
   */
  size?: SegmentedTabsSize;
  /**
   * Outer width in design units. Default: 703 (`black`) / 786 (`mesh`), scaled to
   * the item count (234.33 / 262 per tab) and to `size`. An explicit number is literal (not
   * size-scaled). `'fill'` = 100% of the parent.
   */
  width?: number | 'fill';
  /** Force the pressed look on this (inactive) tab: grey label + inflated indicator. Docs / visual tests. */
  pressed?: string;
}

const PER_TAB: Record<SegmentedTabsSurface, number> = {
  black: 703 / 3,
  mesh: 786 / 3,
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Slanted end of the active fill (see geometry.ts); `flip` = the left edge. */
function Cap({ flip }: { flip?: boolean }) {
  return (
    <svg
      className={cx('zzz-segmented-tabs__cap', flip && 'zzz-segmented-tabs__cap--start')}
      viewBox={`0 0 ${CAP_WIDTH} ${FILL_HEIGHT}`}
      preserveAspectRatio="none"
      style={{ aspectRatio: `${CAP_WIDTH} / ${FILL_HEIGHT}` }}
      focusable="false"
      aria-hidden="true"
    >
      <path d={CAP_PATH} />
    </svg>
  );
}

/**
 * Text tab bar (e.g. Craft / Dismantle / Destroy, Base Stats / Skills / Equipment).
 * A tablist with automatic activation; the active tab carries an accent fill (round outer end,
 * 26.5° slanted inner edge; a parallelogram in the middle) that snaps to the new tab and pops.
 */
export function SegmentedTabs({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  surface = 'black',
  size = 'md',
  width,
  pressed,
  id,
  className,
  style,
  ref,
  ...rest
}: SegmentedTabsProps) {
  const { value, selectedIndex, getTabProps, pressedIsInactive } = useTabList({
    items,
    value: valueProp,
    defaultValue,
    onValueChange,
    id,
    pressed,
  });
  // Pop only after the selection changed (never on mount); once set, the attribute stays and the
  // key={value} remount below restarts the animation on every later switch.
  const firstValue = useRef(value);
  const hasSwitched = useRef(false);
  if (value !== firstValue.current) hasSwitched.current = true;

  const n = items.length;
  const shape = selectedIndex <= 0 ? 'start' : selectedIndex >= n - 1 ? 'end' : 'middle';
  const seg = n === 1 ? 'only' : shape;
  const cssWidth =
    width === 'fill'
      ? '100%'
      : typeof width === 'number'
        ? `calc(${round(width)} * var(--zzz-px))`
        : `calc(${round(PER_TAB[surface] * n)} * var(--zzz-seg-u))`;

  const rootStyle = {
    '--zzz-seg-width': cssWidth,
    '--zzz-seg-count': n,
    '--zzz-seg-index': Math.max(0, selectedIndex),
    ...style,
  } as CSSProperties;

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      id={id}
      ref={ref}
      className={cx('zzz-segmented-tabs', 'zzz-mat-pill', className)}
      data-surface={surface}
      data-size={size}
      data-inflating={pressedIsInactive ? '' : undefined}
      style={rootStyle}
      {...rest}
    >
      <div className="zzz-segmented-tabs__track" aria-hidden="true">
        {selectedIndex >= 0 && (
          <span
            key={value}
            className="zzz-segmented-tabs__indicator"
            data-shape={seg}
            data-pop={hasSwitched.current ? '' : undefined}
            aria-hidden="true"
          >
            {(seg === 'middle' || seg === 'end') && <Cap flip />}
            <span className="zzz-segmented-tabs__body" />
            {(seg === 'middle' || seg === 'start') && <Cap />}
          </span>
        )}
      </div>
      <div className="zzz-segmented-tabs__row">
        {items.map((item, index) => {
          const { 'aria-label': ariaLabel } = item;
          return (
            <button
              key={item.value}
              {...getTabProps(item, index)}
              aria-label={ariaLabel}
              className="zzz-segmented-tabs__tab zzz-focusable"
              data-position={n === 1 ? 'only' : index === 0 ? 'start' : index === n - 1 ? 'end' : 'middle'}
            >
              <span className="zzz-segmented-tabs__label zzz-italic">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
