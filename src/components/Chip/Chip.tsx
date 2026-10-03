import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react'
import { cx, useControllableState, usePressFlash } from '../../utils'
import { Text } from '../Text'
import './Chip.css'

/** Control size: sm / md / lg (md = 262 × 41 design units; sm / lg scale it by 46/57 and 69/57). */
export type ChipSize = 'sm' | 'md' | 'lg'

export interface ChipProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange'> {
  /** Selected (controlled): accent fill + black label. */
  selected?: boolean
  /** Initial selected state (uncontrolled). */
  defaultSelected?: boolean
  /** Called with the next selected state on click / Enter / Space. */
  onSelectedChange?(selected: boolean): void
  /**
   * Control size (default `md`). Width, height, ring, padding, label and the pressed outset scale by
   * the control-size ratio (sm 46/57, lg 69/57); the label never drops below the `label` text role.
   */
  size?: ChipSize
  /** Force the pressed look (stories / visual tests). */
  pressed?: boolean
  children?: ReactNode
}

/**
 * Filter toggle chip: 262 × 41 pill, `#1B1B1B` fill, 3 px `#2C2C2C` ring, upright
 * `fontSize.label` label in `color.text.primary`. Standalone it is a toggle button (`aria-pressed`);
 * inside `ChipGroup` it becomes a `checkbox` / `radio` (`aria-checked`).
 */
export function Chip({
  selected: selectedProp,
  defaultSelected = false,
  onSelectedChange,
  size = 'md',
  pressed,
  disabled,
  role,
  className,
  children,
  onClick,
  onKeyDown,
  onKeyUp,
  onBlur,
  type = 'button',
  ...rest
}: ChipProps) {
  const [selected, setSelected] = useControllableState(selectedProp, defaultSelected, onSelectedChange)
  const flash = usePressFlash<HTMLButtonElement>({ disabled, onKeyDown, onKeyUp, onBlur })
  const checkable = role === 'checkbox' || role === 'radio'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    setSelected((prev) => !prev)
  }

  return (
    <button
      type={type}
      role={role}
      disabled={disabled}
      aria-pressed={checkable ? undefined : selected}
      aria-checked={checkable ? selected : undefined}
      data-selected={selected ? '' : undefined}
      data-size={size}
      className={cx('zzz-chip', 'zzz-pressable', 'zzz-focusable', className)}
      {...rest}
      {...flash}
      {...(pressed ? { 'data-pressed': '' } : null)}
      onClick={handleClick}
    >
      <Text role="label" className="zzz-chip__label">
        {children}
      </Text>
    </button>
  )
}
