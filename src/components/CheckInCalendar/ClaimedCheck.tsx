import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../../utils'

export type ClaimedCheckProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'>

/**
 * Static lime "claimed" tick with a black outline (`color.checkIn.claimed` #B6F906, ~35 × 25; the
 * same tick marks a claimed reward on a mission card). Original SVG, decorative
 * (`aria-hidden`): the host states "claimed" in its accessible name. Sized by CSS (default 35 × 25 design units).
 */
export function ClaimedCheck({ className, ...rest }: ClaimedCheckProps) {
  return (
    <svg
      viewBox="0 0 35 25"
      aria-hidden="true"
      focusable="false"
      {...rest}
      className={cx('zzz-claimed-check', className)}
    >
      <path
        d="M5 13.5 L13.5 20.5 L30 5"
        fill="none"
        stroke="var(--zzz-color-bg-base, #000)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13.5 L13.5 20.5 L30 5"
        fill="none"
        stroke="var(--zzz-color-check-in-claimed, #B6F906)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
