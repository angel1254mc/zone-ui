import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cx, useControllableState, usePressFlash } from '../../utils'
import './SortToggle.css'

export type SortDirection = 'asc' | 'desc'

/** Control size: sm / md / lg = a 46 / 57 / 69 design-unit circle (≈ 32 / 40 / 48 CSS px at the default scale). */
export type SortToggleSize = 'sm' | 'md' | 'lg'

export interface SortToggleProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'children'> {
  /** Current direction (controlled). */
  direction?: SortDirection
  /** Initial direction (uncontrolled). Default `desc` (the drawer lists S before A before B). */
  defaultDirection?: SortDirection
  onDirectionChange?(direction: SortDirection): void
  /** Accessible names per state. Default "Sort ascending" / "Sort descending". */
  labels?: { asc: string; desc: string }
  /**
   * Control size (default `md`): the circle is `size.control.{sm,md,lg}` (46 / 57 / 69); glyph, ring and
   * pressed outset scale with it.
   */
  size?: SortToggleSize
  /** Force the pressed look (stories / visual tests). */
  pressed?: boolean
}

/**
 * The sort glyph: two 5 px bars 3 px
 * apart, each a half-arrow (harpoon). Left: tip up, barb on the left (flat underside at y 17).
 * Right: the same shape turned 180° (tip down, barb on the right). Original SVG, 29 × 26 box.
 * (src/icons SortIcon draws full arrowheads instead.)
 */
function SortGlyph() {
  const d = 'M4.9 0.4 H9.9 Q10.6 0.4 10.6 1.1 V24.9 Q10.6 25.6 9.9 25.6 H6.1 Q5.4 25.6 5.4 24.9 V17.2 H0.9 Q0.1 17.2 0.4 16.4 L4.3 0.9 Q4.4 0.4 4.9 0.4 Z'
  return (
    <svg className="zzz-sort-toggle__glyph" viewBox="0 0 29 26" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={d} />
      <path d={d} transform="rotate(180 14.5 13)" />
    </svg>
  )
}

const DEFAULT_LABELS = { asc: 'Sort ascending', desc: 'Sort descending' }

/**
 * Sort-direction toggle, e.g. beside a Select:
 * a dark `.zzz-mat-pill` circle holding the up/down bar pair (29 × 26).
 *
 * The accessible name states the CURRENT order ("Sort descending" / "Sort ascending"). There is
 * deliberately no `aria-pressed`: a toggle button's name must not change with its pressed state
 * (WAI-ARIA APG), and "Sort ascending, not pressed" would read as if ascending were off.
 * Ascending mirrors the glyph, so the bar with the upward head moves to the left.
 */
export function SortToggle({
  direction: directionProp,
  defaultDirection = 'desc',
  onDirectionChange,
  labels = DEFAULT_LABELS,
  size = 'md',
  pressed,
  disabled,
  className,
  onClick,
  onKeyDown,
  onKeyUp,
  onBlur,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: SortToggleProps) {
  const [direction, setDirection] = useControllableState(directionProp, defaultDirection, onDirectionChange)
  const flash = usePressFlash<HTMLButtonElement>({ disabled, onKeyDown, onKeyUp, onBlur })

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    setDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel ?? labels[direction]}
      data-direction={direction}
      data-size={size}
      className={cx('zzz-sort-toggle', 'zzz-mat-pill', 'zzz-pressable', 'zzz-focusable', className)}
      {...rest}
      {...flash}
      {...(pressed ? { 'data-pressed': '' } : null)}
      onClick={handleClick}
    >
      <SortGlyph />
    </button>
  )
}
