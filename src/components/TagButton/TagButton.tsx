import { useId } from 'react'
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref } from 'react'
import { cx, usePressFlash } from '../../utils'
import { BackIcon, CloseIcon } from '../../icons'
import './TagButton.css'

export type TagButtonKind = 'back' | 'close'

/**
 * The shared control scale. `md` is the 90×58 tag; `sm` / `lg` scale the whole tag (ring,
 * glyph, pressed growth) by 46/57 and 69/57 (≈ 73×47 and 109×70 design units; ≈ 32 / 41 / 49 px tall at
 * the default scale), so a tag lines up with Button / IconButton of the same size.
 */
export type TagButtonSize = 'sm' | 'md' | 'lg'

export interface TagButtonOwnProps {
  /** `back`: top-left red outline tag (semicircle right, 30° slant left). `close`: the mirror, red-filled (drawer header). */
  kind: TagButtonKind
  /** Accessible name. Default "Back" / "Close". */
  label?: string
  /** Replace the glyph (default U-turn arrow / ×). */
  icon?: ReactNode
  /** Force the pressed look (stories, tests). */
  pressed?: boolean
  /** `sm` · `md` (default, the 90×58 tag) · `lg` — the shared control scale. */
  size?: TagButtonSize
  ref?: Ref<HTMLButtonElement>
}

export type TagButtonProps = TagButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof TagButtonOwnProps | 'children'>

/**
 * The Back tag outline, viewBox 0 0 90 58, drawn on the stroke centreline 2.5 in from the
 * box: right side a semicircle, left side slanted 30° (skew.backButton) with rounded corners.
 * Close uses the same path mirrored.
 */
export const TAG_BUTTON_PATH =
  'M13 2.5 H62 C76 2.5 87.5 14 87.5 29 C87.5 44 76 55.5 62 55.5 H33 C27 55.5 24 53 22 49 L4 19 C1 11 5 2.5 13 2.5 Z'

/** Dot-mesh lattice of the dark pill material (pattern.dots.sm 4.64) in SVG user units. */
const DOTS = 4.64

/**
 * Back / Close tag button. Pressed: the whole tag fills with the live
 * accent and grows 2.5 px per side (89×57 → 94×62), the ring and interior vanish, the glyph turns
 * black. Hover: nothing.
 */
export function TagButton(props: TagButtonProps) {
  const {
    kind,
    label,
    icon,
    pressed = false,
    size = 'md',
    disabled = false,
    type = 'button',
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props

  const uid = `zzz-tag${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const ariaDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true'
  const inert = disabled || ariaDisabled
  const flash = usePressFlash<HTMLButtonElement>({ disabled: inert, onKeyDown, onKeyUp, onBlur })
  const isPressed = !inert && (pressed || 'data-pressed' in flash)
  const isClose = kind === 'close'

  // aria-disabled keeps the button focusable but must not activate (same guard as Button / IconButton).
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inert) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  const shape = (
    <>
      <path className="zzz-tag-button__fill" d={TAG_BUTTON_PATH} />
      <path d={TAG_BUTTON_PATH} fill={`url(#${uid}-dots)`} />
      {isClose ? (
        <path className="zzz-tag-button__gap" d={TAG_BUTTON_PATH} clipPath={`url(#${uid}-clip)`} />
      ) : null}
      <path className="zzz-tag-button__ring" d={TAG_BUTTON_PATH} />
    </>
  )

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={label ?? rest['aria-label'] ?? (isClose ? 'Close' : 'Back')}
      className={cx('zzz-tag-button', `zzz-tag-button--${kind}`, `zzz-tag-button--${size}`, 'zzz-focusable', className)}
      data-size={size}
      {...(isPressed ? { 'data-pressed': '' } : null)}
      onClick={handleClick}
      onKeyDown={flash.onKeyDown}
      onKeyUp={flash.onKeyUp}
      onBlur={flash.onBlur}
    >
      <svg className="zzz-tag-button__shape" viewBox="0 0 90 58" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={`${uid}-dots`} patternUnits="userSpaceOnUse" width={DOTS} height={DOTS}>
            <circle className="zzz-tag-button__dot" cx={0} cy={0} r={0.75} />
            <circle className="zzz-tag-button__dot" cx={DOTS} cy={0} r={0.75} />
            <circle className="zzz-tag-button__dot" cx={0} cy={DOTS} r={0.75} />
            <circle className="zzz-tag-button__dot" cx={DOTS} cy={DOTS} r={0.75} />
            <circle className="zzz-tag-button__dot" cx={DOTS / 2} cy={DOTS / 2} r={0.75} />
          </pattern>
          <clipPath id={`${uid}-clip`}>
            <path d={TAG_BUTTON_PATH} />
          </clipPath>
        </defs>
        <g transform={isClose ? 'translate(90 0) scale(-1 1)' : undefined}>
          <g className="zzz-tag-button__rest">{shape}</g>
          <path className="zzz-tag-button__press" d={TAG_BUTTON_PATH} />
        </g>
      </svg>
      <span className="zzz-tag-button__glyph" aria-hidden="true">
        {icon ?? (isClose ? <CloseIcon /> : <BackIcon />)}
      </span>
    </button>
  )
}
