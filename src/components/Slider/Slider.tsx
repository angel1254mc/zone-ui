import { useRef } from 'react'
import type { ComponentPropsWithRef, CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { cx, useControllableState, usePressFlash } from '../../utils'
import { MinusIcon, PlusIcon } from '../../icons'
import { Text } from '../Text'
import './Slider.css'

/** `sm` / `md` / `lg`: steppers 38 / 47 / 57, thumb 27 / 34 / 41 design units; numbers `fontSize.control.{sm,md,lg}`. */
export type SliderSize = 'sm' | 'md' | 'lg'

export interface SliderProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  min: number
  max: number
  /** Step for arrows, steppers and snapping (default 1). */
  step?: number
  /** PageUp / PageDown step (default max(step, range / 10)). */
  pageStep?: number
  /** Value (controlled). */
  value?: number
  /** Initial value (uncontrolled; default `min`). */
  defaultValue?: number
  onValueChange?(value: number): void
  /** Show the − / + stepper circles (default true). */
  showSteppers?: boolean
  /** Show the min / max numbers (default true). */
  showBounds?: boolean
  /** Formats the min / max numbers (default: the number). */
  formatBound?(value: number): ReactNode
  /** `aria-valuetext` for the thumb. */
  getValueText?(value: number): string
  disabled?: boolean
  /** Total width in design units (default 581), at every size. */
  width?: number
  /**
   * Steppers, thumb, track, number slots and the press outset scale with the web size scale
   * (sm = md × 46/57, lg = md × 69/57); the min / max numbers use `fontSize.control.{sm,md,lg}`
   * (21 / 26 / 30). Default `md`.
   */
  size?: SliderSize
  /** Accessible names of the steppers. */
  decrementLabel?: string
  incrementLabel?: string
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** Round to the step grid anchored at `min`, without float noise (2.5 * 3 = 7.5, not 7.500000001). */
function snap(n: number, min: number, step: number) {
  const decimals = (String(step).split('.')[1] ?? '').length
  const snapped = min + Math.round((n - min) / step) * step
  return Number(snapped.toFixed(decimals))
}

interface StepperProps {
  kind: 'dec' | 'inc'
  label: string
  /** The whole slider is disabled: native `disabled` (not focusable). */
  disabled: boolean
  /** The value sits at this stepper's bound: `aria-disabled`, still focusable, click is a no-op. */
  atBound: boolean
  onStep(): void
}

function Stepper({ kind, label, disabled, atBound, onStep }: StepperProps) {
  const inactive = disabled || atBound
  const flash = usePressFlash<HTMLButtonElement>({ disabled: inactive })
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      // At a bound the button stays focusable (native `disabled` would drop keyboard focus to
      // <body> under a user pressing Enter / Space on it), so it is only aria-disabled.
      aria-disabled={!disabled && atBound ? true : undefined}
      className={cx('zzz-slider__stepper', `zzz-slider__stepper--${kind}`, 'zzz-dots', 'zzz-pressable', 'zzz-focusable')}
      {...flash}
      onClick={inactive ? undefined : onStep}
    >
      {kind === 'dec' ? <MinusIcon className="zzz-slider__glyph" /> : <PlusIcon className="zzz-slider__glyph" />}
    </button>
  )
}

/**
 * Quantity slider:
 * − stepper (47) · min number · 12 px `#373737` track with a 34 px metallic thumb (no filled
 * portion; the thumb centre travels from the track's left end to its right end) · max number · + stepper.
 *
 * The thumb is `role="slider"` (←/↓ −step, →/↑ +step, PageUp/PageDown, Home/End); steppers are
 * buttons ("Decrease" / "Increase") that clamp and turn `aria-disabled` at their bound (they
 * stay focusable so keyboard focus is not lost; `disabled` makes them natively disabled). `min === max` disables
 * both and parks the thumb at the right end. `aria-label` / `aria-labelledby` /
 * `aria-describedby` go to the thumb; other props to the root.
 */
export function Slider({
  min,
  max,
  step = 1,
  pageStep,
  value: valueProp,
  defaultValue,
  onValueChange,
  showSteppers = true,
  showBounds = true,
  formatBound = (n) => n,
  getValueText,
  disabled = false,
  width,
  size = 'md',
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SliderProps) {
  const hi = Math.max(min, max)
  const [rawValue, setRawValue] = useControllableState(valueProp, defaultValue ?? min, onValueChange)
  const value = clamp(rawValue, min, hi)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<number | null>(null)

  const commit = (next: number) => {
    if (disabled) return
    setRawValue(clamp(snap(next, min, step), min, hi))
  }

  const range = hi - min
  const fraction = range > 0 ? (value - min) / range : 1
  const bigStep = pageStep ?? Math.max(step, range / 10)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    let next: number | null = null
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - step
        break
      case 'PageUp':
        next = value + bigStep
        break
      case 'PageDown':
        next = value - bigStep
        break
      case 'Home':
        next = min
        break
      case 'End':
        next = hi
        break
    }
    if (next === null) return
    event.preventDefault()
    commit(next)
  }

  const valueAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width <= 0) return value
    return min + clamp((clientX - rect.left) / rect.width, 0, 1) * range
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || range <= 0) return
    dragging.current = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true })
    event.preventDefault()
    commit(valueAt(event.clientX))
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current !== event.pointerId) return
    commit(valueAt(event.clientX))
  }
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current !== event.pointerId) return
    dragging.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const rootStyle = {
    '--zzz-slider-fraction': String(fraction),
    ...(width != null ? { '--zzz-slider-width': `calc(${width} * var(--zzz-px))` } : null),
    ...style,
  } as CSSProperties

  return (
    <div
      className={cx(
        'zzz-slider',
        `zzz-slider--${size}`,
        !showSteppers && 'zzz-slider--no-steppers',
        !showBounds && 'zzz-slider--no-bounds',
        className,
      )}
      style={rootStyle}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      {...rest}
    >
      {showSteppers ? (
        <Stepper kind="dec" label={decrementLabel} disabled={disabled} atBound={value <= min} onStep={() => commit(value - step)} />
      ) : null}
      {showBounds ? (
        <span className="zzz-slider__bound zzz-slider__bound--min" aria-hidden="true">
          <Text role="button">{formatBound(min)}</Text>
        </span>
      ) : null}
      <div
        className="zzz-slider__rail"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="zzz-slider__track" />
        <div
          role="slider"
          tabIndex={disabled ? undefined : 0}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={value}
          aria-valuetext={getValueText?.(value)}
          aria-orientation="horizontal"
          aria-disabled={disabled || undefined}
          className="zzz-slider__thumb zzz-focusable"
          onKeyDown={handleKeyDown}
        />
      </div>
      {showBounds ? (
        <span className="zzz-slider__bound zzz-slider__bound--max" aria-hidden="true">
          <Text role="button">{formatBound(hi)}</Text>
        </span>
      ) : null}
      {showSteppers ? (
        <Stepper kind="inc" label={incrementLabel} disabled={disabled} atBound={value >= hi} onStep={() => commit(value + step)} />
      ) : null}
    </div>
  )
}
