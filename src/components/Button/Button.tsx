import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react'
import { cx, usePressFlash } from '../../utils'
import { Text } from '../Text'
import './Button.css'

/** Colour of the disc in the leading icon cap (`color.icon.*`); `plain` = white glyph straight on the black cap. */
export type ButtonIconTone =
  | 'confirm'
  | 'cancel'
  | 'recycle'
  | 'reset'
  | 'compare'
  | 'recommend'
  | 'combat'
  | 'plain'

/**
 * The web control scale shared by every pill control (`size.control.{sm,md,lg}`):
 * `sm` 46 · `md` 57 · `lg` 69 design units ≈ 32 / 40 / 48 CSS px at the default `--zzz-scale` 0.7.
 * Label, icon cap, disc, glyph, padding, ring, bevel, keyline and pressed outset all follow the size.
 *
 * Migration: `lg` used to mean the 59-unit top-bar / dialog pill (`size.control.pillTop`).
 * It now means the web `lg` (69). For the old look use `md` (57 — 2 units, ~1.4 CSS px, shorter).
 * `width="dialog"` no longer implies `lg`.
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/** 233 | 248 | 275 | 282 (`size.control.pillWidth*`), `auto` (fits the label) or a number of design units. */
export type ButtonWidth = 'compact' | 'default' | 'dialog' | 'wide' | 'auto' | number

/**
 * - `default`: the dark pill (View, Recycle, Filter, City, Confirm, Craft…)
 * - `mission`: 174×48 event-mission pill with the 2 px black gap + 4 px teal halo (Go / Claimed / Stay Tuned)
 * - `sub`: the 81×57 icon-only sub-pill (the `>>` enhance chip at the end of the stars pill). Needs `aria-label`.
 */
export type ButtonVariant = 'default' | 'mission' | 'sub'

/** Mission button state: `claimed` (flat grey, dim label) and `locked` ("Stay Tuned") are both disabled. */
export type ButtonMissionState = 'default' | 'claimed' | 'locked'

export interface ButtonOwnProps {
  /** Control size: `sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at the default scale). Default `md`. */
  size?: ButtonSize
  /** Default `auto`. */
  width?: ButtonWidth
  /** Glyph in the leading icon cap (or the centred glyph of `variant="sub"`). */
  icon?: ReactNode
  /** Disc colour behind `icon`. Default `plain` (white glyph on the black cap, e.g. City's house, Filter's funnel). */
  iconTone?: ButtonIconTone
  /** Image in the cap instead of an icon (Special Training Plan). A string renders an `<img>`. */
  avatar?: ReactNode
  /** Two-line label ("Stat / Bonuses"): smaller type, `lineHeight.buttonTwoLine` 22. `\n` in a string breaks the line. */
  twoLine?: boolean
  /**
   * Auto-shrink a long label to the pill (auto-size, e.g. "Recommend").
   * Default: on for fixed widths and mission buttons, off for `auto`/two-line.
   */
  fit?: boolean
  /**
   * Pressed outset in design units. Default: `size.control.pressOutset` (4) scaled with `size`
   * (≈ 3.2 on `sm`, 4.8 on `lg`). Dialog buttons use 0 (the default for `width="dialog"`).
   * An explicit value is absolute (not scaled by `size`).
   */
  pressOutset?: number
  /** Force the pressed look (stories, tests, externally driven presses). */
  pressed?: boolean
  /** Default `default`. */
  variant?: ButtonVariant
  /** `variant="mission"` only. */
  missionState?: ButtonMissionState
  /** Render as `<a href>` (navigation that looks like a button). */
  href?: string
  target?: string
  rel?: string
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>
}

export type ButtonProps = ButtonOwnProps & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonOwnProps>

const WIDTHS = new Set(['compact', 'default', 'dialog', 'wide', 'auto'])
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

/**
 * The kit's dark pill button on the web control scale (`size` sm / md / lg).
 * No hover styling by design; pressed = live accent fill + outset (`:active`, Space held, a 100 ms Enter
 * flash, or `pressed`); disabled greys the label only.
 */
export function Button(props: ButtonProps) {
  const {
    size: sizeProp,
    width = 'auto',
    icon,
    iconTone = 'plain',
    avatar,
    twoLine = false,
    fit: fitProp,
    pressOutset: pressOutsetProp,
    pressed = false,
    variant = 'default',
    missionState = 'default',
    href,
    target,
    rel,
    disabled: disabledProp = false,
    type = 'button',
    className,
    style,
    children,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props

  const isMission = variant === 'mission'
  const isSub = variant === 'sub'
  const missionDisabled = isMission && missionState !== 'default'
  const disabled = disabledProp || missionDisabled
  const ariaDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true'
  const inert = disabled || ariaDisabled

  const size: ButtonSize = sizeProp ?? 'md'
  const pressOutset = pressOutsetProp ?? (width === 'dialog' ? 0 : undefined)
  const fit = fitProp ?? (!twoLine && !isSub && (width !== 'auto' || isMission))

  const flash = usePressFlash<HTMLElement>({
    disabled: inert,
    onKeyDown: onKeyDown as ((e: KeyboardEvent<HTMLElement>) => void) | undefined,
    onKeyUp: onKeyUp as ((e: KeyboardEvent<HTMLElement>) => void) | undefined,
    onBlur: onBlur as never,
  })
  const isPressed = !inert && (pressed || 'data-pressed' in flash)

  const hasCap = !isSub && !isMission && (icon != null || avatar != null)
  const tone = avatar != null ? undefined : hasCap ? iconTone : undefined

  const mergedStyle: CSSProperties & Record<string, string | number | undefined> = { ...style }
  if (typeof width === 'number') mergedStyle.width = gpx(width)
  if (pressOutset !== undefined) mergedStyle['--zzz-press-outset'] = gpx(pressOutset)

  const classes = cx(
    'zzz-button',
    !isMission && 'zzz-mat-pill',
    'zzz-pressable',
    'zzz-focusable',
    `zzz-button--${size}`,
    typeof width === 'string' && WIDTHS.has(width) ? `zzz-button--w-${width}` : 'zzz-button--w-custom',
    variant !== 'default' && `zzz-button--${variant}`,
    isMission && missionState !== 'default' && `zzz-button--${missionState}`,
    hasCap && 'zzz-button--capped',
    twoLine && 'zzz-button--two-line',
    className,
  )

  const cap = hasCap ? (
    <span className="zzz-button__cap" aria-hidden="true">
      {avatar != null ? (
        <span className="zzz-button__avatar">
          {typeof avatar === 'string' ? <img src={avatar} alt="" /> : avatar}
        </span>
      ) : (
        <>
          {tone !== 'plain' ? <span className="zzz-button__disc zzz-pressable__hide" /> : null}
          <span className="zzz-button__glyph">{icon}</span>
        </>
      )}
    </span>
  ) : null

  const content = isSub ? (
    <span className="zzz-button__glyph" aria-hidden="true">
      {icon}
    </span>
  ) : (
    <span className="zzz-button__label">
      <Text role="button" italic fit={fit} className="zzz-button__text">
        {children}
      </Text>
    </span>
  )

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (inert) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    ;(onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event)
  }

  const common = {
    className: classes,
    style: mergedStyle,
    'data-size': size,
    'data-icon-tone': tone,
    ...(isPressed ? { 'data-pressed': '' } : null),
    onKeyDown: flash.onKeyDown,
    onKeyUp: flash.onKeyUp,
    onBlur: flash.onBlur,
    onClick: handleClick,
  }

  if (href !== undefined) {
    const anchorRest = rest as unknown as ComponentPropsWithoutRef<'a'>
    return (
      <a
        {...anchorRest}
        {...common}
        ref={ref as Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        role={disabled ? 'link' : anchorRest.role}
        aria-disabled={disabled ? 'true' : anchorRest['aria-disabled']}
      >
        {cap}
        {content}
      </a>
    )
  }

  return (
    <button {...rest} {...common} ref={ref as Ref<HTMLButtonElement>} type={type} disabled={disabled}>
      {cap}
      {content}
    </button>
  )
}
