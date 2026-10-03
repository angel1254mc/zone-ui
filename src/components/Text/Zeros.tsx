import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cx } from '../../utils'
import './Text.css'

export interface ZerosProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** The number (non-negative integer). */
  value: number
  /** Total digit count; missing leading digits are drawn as dimmed zeros (default 8). */
  digits?: number
  ref?: Ref<HTMLSpanElement>
}

/** One fixed-pitch cell per digit (see .zzz-zeros__d in Text.css). */
function cells(s: string) {
  return [...s].map((ch, i) => (
    <span key={i} className="zzz-zeros__d">
      {ch}
    </span>
  ))
}

/**
 * Zero-padded counter: "000" in `color.text.zeroPad`, then the significant digits in white
 * (currency "00076418"). Screen readers get the plain number.
 */
export function Zeros({ value, digits = 8, className, ref, ...rest }: ZerosProps) {
  const text = String(Math.max(0, Math.trunc(value)))
  const pad = Math.max(0, digits - text.length)
  return (
    <span ref={ref} role="img" aria-label={text} className={cx('zzz-zeros', className)} {...rest}>
      {pad > 0 && (
        <span className="zzz-zeros__pad" aria-hidden="true">
          {cells('0'.repeat(pad))}
        </span>
      )}
      <span className="zzz-zeros__digits" aria-hidden="true">
        {cells(text)}
      </span>
    </span>
  )
}
