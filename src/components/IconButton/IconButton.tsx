import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent, ReactNode, Ref } from 'react'
import { cx, useControllableState, usePressFlash } from '../../utils'
import './IconButton.css'

/** The web control scale shared with Button: `sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at scale 0.7). */
export type IconButtonScaleSize = 'sm' | 'md' | 'lg'

/**
 * Fixed presets outside the scale (their own diameter, ring and fill):
 * `stepper` 47 (slider −/+, flat #0C0C0C, 4 ring) · `key` 38 (bare "T" key circle, 3 ring, black)
 * · `mission` 48 (event mission search circle with the teal halo).
 * `sort` 56 (drawer sort toggle) is **deprecated**: it is the dark circle 1 unit smaller than `md`; use `md`.
 */
export type IconButtonPreset = 'sort' | 'stepper' | 'key' | 'mission'

/**
 * `sm` 46 · `md` 57 (filter, trash, lock, star, info) · `lg` 69 — the shared control scale; circle,
 * glyph, ring, bevel, keyline and pressed outset follow it. Or one of the fixed presets
 * (`stepper`, `key`, `mission`; `sort` deprecated → `md`).
 */
export type IconButtonSize = IconButtonScaleSize | IconButtonPreset

/** `lockOn`: the locked padlock look — light fill `#8E8E8E`, black glyph. */
export type IconButtonTone = 'default' | 'lockOn'

export interface IconButtonOwnProps {
  /** The glyph (an icon from the Zone icon set, or any SVG using `currentColor`). */
  icon: ReactNode
  /** Glyph shown while a toggle is on (e.g. `LockIcon` vs `UnlockIcon`). Defaults to `icon`. */
  iconOn?: ReactNode
  /** Accessible name (rendered as `aria-label`; an explicit `aria-label` prop wins). Required: the button has no visible text. */
  label: string
  /** `sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at the default scale), or a fixed preset. Default `md`. */
  size?: IconButtonSize
  /** Default `default`. The caller picks the look for each toggle state (e.g. `pressedState ? 'lockOn' : 'default'`). */
  tone?: IconButtonTone
  /** Make it a toggle button (`aria-pressed`). */
  toggle?: boolean
  /** Controlled toggle state. */
  pressedState?: boolean
  /** Uncontrolled initial toggle state. */
  defaultPressedState?: boolean
  onPressedStateChange?: (pressed: boolean) => void
  /** Force the momentary pressed look (accent fill + outset), for stories and tests. */
  pressed?: boolean
  /** Pressed outset in design units. Default `size.control.pressOutset` (4) × the size ratio (sm ≈ 3.2, lg ≈ 4.8); an explicit value is absolute. */
  pressOutset?: number
  ref?: Ref<HTMLButtonElement>
}

export type IconButtonProps = IconButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof IconButtonOwnProps | 'children' | 'aria-pressed'>

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

/**
 * Round icon-only button: the dark pill material as a circle. Pressed follows the pill
 * rule (accent + outset). Disabled greys the glyph (#666).
 */
export function IconButton(props: IconButtonProps) {
  const {
    icon,
    iconOn,
    label,
    size = 'md',
    tone = 'default',
    toggle = false,
    pressedState,
    defaultPressedState = false,
    onPressedStateChange,
    pressed = false,
    pressOutset,
    disabled = false,
    type = 'button',
    className,
    style,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props

  const [on, setOn] = useControllableState(pressedState, defaultPressedState, onPressedStateChange)
  const ariaDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true'
  const inert = disabled || ariaDisabled
  const flash = usePressFlash<HTMLButtonElement>({ disabled: inert, onKeyDown, onKeyUp, onBlur })
  const isPressed = !inert && (pressed || 'data-pressed' in flash)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inert) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (toggle && !event.defaultPrevented) setOn((prev) => !prev)
  }

  const mergedStyle: CSSProperties & Record<string, string | number | undefined> = { ...style }
  if (pressOutset !== undefined) mergedStyle['--zzz-press-outset'] = gpx(pressOutset)

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={rest['aria-label'] ?? label}
      aria-pressed={toggle ? on : undefined}
      className={cx(
        'zzz-icon-button',
        'zzz-mat-pill',
        'zzz-pressable',
        'zzz-focusable',
        `zzz-icon-button--${size}`,
        tone === 'lockOn' && 'zzz-icon-button--lock-on',
        className,
      )}
      style={mergedStyle}
      data-size={size}
      {...(isPressed ? { 'data-pressed': '' } : null)}
      onKeyDown={flash.onKeyDown}
      onKeyUp={flash.onKeyUp}
      onBlur={flash.onBlur}
      onClick={handleClick}
    >
      <span className="zzz-icon-button__glyph" aria-hidden="true">
        {toggle && on && iconOn != null ? iconOn : icon}
      </span>
    </button>
  )
}
