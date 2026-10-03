import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { useCountdown } from './useCountdown'
import './CountdownBar.css'

export type CountdownBarState = 'normal' | 'warning' | 'critical' | 'expired'

/** Web size scale: channel 16 / 28 / 40 design units, readout `fontSize.control.{sm,md,lg}`. */
export type CountdownBarSize = 'sm' | 'md' | 'lg'

export interface CountdownBarOwnProps {
  /* ── controlled ── */
  /** Controlled remaining fraction 1 → 0. Passing `fraction` or `secondsLeft` makes the bar controlled. */
  fraction?: number
  /** Controlled remaining seconds (drives the label and the warning state). */
  secondsLeft?: number
  /** Controlled override of the expired state (default: `secondsLeft === 0`, or `fraction === 0`). */
  expired?: boolean
  /** Controlled override of the warning state (default: `secondsLeft <= warnAt`). */
  warning?: boolean

  /* ── self-driven ── */
  /** Self-driven length in ms (also the 100 % reference for a controlled `secondsLeft`). */
  durationMs?: number
  /** Self-driven absolute end instant (instead of `durationMs`). */
  deadline?: Date | number | string
  /** Self-driven: whether the clock runs. Default true. */
  running?: boolean
  /** Self-driven: called once when the time runs out. */
  onExpire?: () => void

  /* ── look ── */
  /** Seconds at or below which the bar turns orange and pulses. Default 10. */
  warnAt?: number
  /** Seconds at or below which it turns red. Default 3 (`0` disables). */
  criticalAt?: number
  /** Label shown in place of the seconds once expired. Default "Time's up". */
  expiredLabel?: ReactNode
  /** Formats the seconds readout. Default `12s`, or `m:ss` from one minute up. */
  formatValue?: (secondsLeft: number) => ReactNode
  /** Show the seconds readout beside the bar. Default true. */
  showValue?: boolean
  /** Black ">" chevron cuts across the fill (overclock-bar texture). Default false. */
  chevrons?: boolean
  /**
   * Bar thickness and readout size. Default `md`. Channel 16 / 28 / 40 design units (≈ 11 / 20 / 28
   * CSS px at the default scale); readout `fontSize.control.{sm,md,lg}` (21 / 26 / 30).
   */
  size?: CountdownBarSize
  /** Accessible name of the progress bar. Default "Time remaining". */
  label?: string
  /**
   * Whole seconds at which the polite live region speaks "N seconds left". Default `[warnAt]`.
   * Expiry is always announced. Pass `[]` (and `announceExpiry={false}`) to stay silent.
   */
  announceAt?: number[]
  /** Announce the expired label. Default true. */
  announceExpiry?: boolean
  ref?: Ref<HTMLDivElement>
}

export type CountdownBarProps = CountdownBarOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof CountdownBarOwnProps | 'children'>

const defaultFormat = (s: number): ReactNode => {
  if (s >= 60) {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${String(r).padStart(2, '0')}`
  }
  return (
    <>
      {s}
      <span className="zzz-countdown-bar__unit">s</span>
    </>
  )
}

const textOf = (node: ReactNode, fallback: string): string => (typeof node === 'string' || typeof node === 'number' ? String(node) : fallback)
const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0)

/**
 * Time-remaining bar: a ringed black pill with a hatched track and an accent fill that shrinks from
 * the right behind a slanted leading edge. At `warnAt` seconds it turns orange and pulses, at
 * `criticalAt` red; when it runs out the readout shows `expiredLabel`. Self-driven
 * (`durationMs` / `deadline` + `running` + `onExpire`, via `useCountdown`) or controlled
 * (`fraction` / `secondsLeft`, e.g. from your own `useCountdown`). Quizzes, cooldowns, sessions, auctions.
 */
export function CountdownBar(props: CountdownBarProps) {
  const {
    fraction: fractionProp,
    secondsLeft: secondsProp,
    expired: expiredProp,
    warning: warningProp,
    durationMs,
    deadline,
    running = true,
    onExpire,
    warnAt = 10,
    criticalAt = 3,
    expiredLabel = "Time's up",
    formatValue = defaultFormat,
    showValue = true,
    chevrons = false,
    size = 'md',
    label = 'Time remaining',
    announceAt,
    announceExpiry = true,
    className,
    style,
    ref,
    ...rest
  } = props

  const controlled = fractionProp !== undefined || secondsProp !== undefined
  // Nothing to count (no controlled value, no durationMs/deadline): a full bar that never expires.
  const idle = !controlled && durationMs === undefined && deadline === undefined
  const cd = useCountdown({
    durationMs,
    deadline,
    running: !controlled && !idle && running,
    onExpire: controlled ? undefined : onExpire,
  })

  let fraction: number
  let seconds: number | undefined
  let totalSeconds: number | undefined
  if (controlled) {
    seconds = secondsProp !== undefined ? Math.max(0, Math.ceil(secondsProp)) : undefined
    totalSeconds = durationMs !== undefined ? Math.ceil(durationMs / 1000) : undefined
    fraction = clamp01(
      fractionProp ?? (seconds !== undefined && durationMs ? (seconds * 1000) / durationMs : seconds === 0 ? 0 : 1),
    )
  } else if (idle) {
    // Nothing to count: render a full, idle bar rather than an instant "Time's up".
    fraction = 1
  } else {
    fraction = cd.fraction
    seconds = cd.secondsLeft
    totalSeconds = Math.ceil(cd.totalMs / 1000)
  }

  const expired = expiredProp ?? (idle ? false : seconds !== undefined ? seconds <= 0 : fraction <= 0)
  const warning = !expired && (warningProp ?? (seconds !== undefined && seconds <= warnAt))
  const critical = warning && criticalAt > 0 && seconds !== undefined && seconds <= criticalAt
  const state: CountdownBarState = expired ? 'expired' : critical ? 'critical' : warning ? 'warning' : 'normal'
  const paused = !controlled && !idle && !cd.ticking && !expired

  // Sparse announcements: only at the listed seconds and at expiry (never every tick).
  const marks = announceAt ?? [warnAt]
  const expiredText = textOf(expiredLabel, "Time's up")
  const [announcement, setAnnouncement] = useState('')
  const prev = useRef<{ seconds: number | undefined; expired: boolean }>({ seconds, expired })
  useEffect(() => {
    const p = prev.current
    prev.current = { seconds, expired }
    if (expired && !p.expired) {
      if (announceExpiry) setAnnouncement(expiredText)
      return
    }
    if (!expired && p.expired) setAnnouncement('')
    if (!expired && seconds !== undefined && seconds !== p.seconds && marks.includes(seconds)) {
      setAnnouncement(`${seconds} ${seconds === 1 ? 'second' : 'seconds'} left`)
    }
  })

  const valueText = expired
    ? expiredText
    : seconds !== undefined
      ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'} left`
      : `${Math.round(fraction * 100)}% left`
  const useSeconds = seconds !== undefined && totalSeconds !== undefined && totalSeconds > 0

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('zzz-countdown-bar', `zzz-countdown-bar--${size}`, className)}
      data-size={size}
      data-state={state}
      {...(paused ? { 'data-paused': '' } : null)}
      style={{ '--zzz-countdown-f': fraction, ...style } as CSSProperties}
    >
      <div
        className="zzz-countdown-bar__track zzz-bg-hatch"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={useSeconds ? totalSeconds : 100}
        aria-valuenow={useSeconds ? seconds : Math.round(fraction * 100)}
        aria-valuetext={valueText}
      >
        <span className="zzz-countdown-bar__fill">{chevrons ? <span className="zzz-countdown-bar__chevrons" /> : null}</span>
      </div>
      {showValue ? (
        <span className="zzz-countdown-bar__value" aria-hidden="true">
          <span className="zzz-italic">{expired ? expiredLabel : seconds !== undefined ? formatValue(seconds) : `${Math.round(fraction * 100)}%`}</span>
        </span>
      ) : null}
      <span className="zzz-sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  )
}
