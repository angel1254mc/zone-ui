import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import './KeyHint.css'

/**
 * The shared control scale. `md` is the base hint (38-unit key circle, 17.5 label); `sm` / `lg` scale
 * circle, ring, letter, gap and label by 46/57 and 69/57 (≈ 21 / 27 / 32 px circles at the default scale).
 */
export type KeyHintSize = 'sm' | 'md' | 'lg'

export interface KeyHintOwnProps {
  /** The key shown in the 38 px circle ("T", "R"). */
  keyCap: string
  /** Text after the circle ("Unlock", "Discard"). Omit for a bare key circle. */
  label?: ReactNode
  /**
   * Registers a window keyboard shortcut for the hint. The hint is informational: the real action
   * lives on the associated control, so wire this to the same handler.
   */
  onActivate?: (event: KeyboardEvent) => void
  /** `KeyboardEvent.key` to listen for, when it differs from `keyCap` (e.g. `keyCap="Esc"`, `hotkey="Escape"`). */
  hotkey?: string
  /** Suspend the shortcut. */
  disabled?: boolean
  /** `sm` · `md` · `lg`. Default: the enclosing `KeyHints` row's size, else `md`. */
  size?: KeyHintSize
  ref?: Ref<HTMLSpanElement>
}

export type KeyHintProps = KeyHintOwnProps & Omit<ComponentPropsWithoutRef<'span'>, keyof KeyHintOwnProps>

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag === 'INPUT') {
    const type = (target as HTMLInputElement).type
    return !['button', 'checkbox', 'radio', 'range', 'reset', 'submit', 'color', 'file', 'image'].includes(type)
  }
  return false
}

/**
 * Key hint: a 38 px key circle (3 px `#2F2F2F` ring, black) holding the upright key
 * letter, then an upright white label 14 px later ("T Unlock", "R Discard").
 */
export function KeyHint(props: KeyHintProps) {
  const { keyCap, label, onActivate, hotkey, disabled = false, size, className, ref, ...rest } = props

  const handler = useRef(onActivate)
  handler.current = onActivate
  const key = (hotkey ?? keyCap).toLowerCase()
  const active = onActivate != null && !disabled

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (isEditable(event.target)) return
      if (event.key.toLowerCase() !== key) return
      handler.current?.(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, key])

  return (
    <span {...rest} ref={ref} className={cx('zzz-key-hint', size && `zzz-key-hint--${size}`, className)} data-size={size}>
      <kbd className="zzz-key-hint__cap">{keyCap}</kbd>
      {label != null ? <span className="zzz-key-hint__label">{label}</span> : null}
    </span>
  )
}

export interface KeyHintsOwnProps {
  /** Hints as data; or pass `<KeyHint>` children. */
  hints?: KeyHintProps[]
  /** Row alignment. Default `end` (right-aligned, as in a bottom bar). */
  align?: 'start' | 'end'
  /** Size of every hint in the row (a hint's own `size` wins) and of the gap between them. Default `md`. */
  size?: KeyHintSize
  ref?: Ref<HTMLDivElement>
}

export type KeyHintsProps = KeyHintsOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof KeyHintsOwnProps>

/** A row of key hints, 48 px apart (`space.14`, × the size ratio), right-aligned by default. */
export function KeyHints(props: KeyHintsProps) {
  const { hints, align = 'end', size = 'md', className, children, ref, ...rest } = props
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('zzz-key-hints', `zzz-key-hints--${align}`, `zzz-key-hints--${size}`, className)}
      data-size={size}
    >
      {hints?.map((h, i) => <KeyHint key={`${h.keyCap}-${i}`} {...h} />)}
      {children}
    </div>
  )
}
