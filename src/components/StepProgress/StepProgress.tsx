import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { CheckIcon, CloseIcon, MinusIcon } from '../../icons'
import './StepProgress.css'

export type StepStatus = 'pending' | 'current' | 'complete' | 'success' | 'error' | 'skipped'

/** Web size scale: `sm` compact, `md` default, `lg` = md × 69/57. */
export type StepProgressSize = 'sm' | 'md' | 'lg'

export interface StepItem {
  /** Visible label (capsules variant). */
  label?: ReactNode
  /** Explicit status; otherwise derived from `current` (before → complete, at → current, after → pending). */
  status?: StepStatus
  /** Accessible text for this step, replacing "{stepName} {n}: {status}". */
  'aria-label'?: string
}

export interface StepProgressOwnProps {
  /** Number of steps, or one item per step. */
  steps: number | StepItem[]
  /** 0-based index of the current step. Default 0. Pass `steps.length` (or -1) when nothing is current. */
  current?: number
  /** 'pips' (default, compact slanted bars), 'capsules' (numbered pills with labels) or 'text' ("Step 3 of 5"). */
  variant?: 'pips' | 'capsules' | 'text'
  /**
   * Default `md`. Pips 28 × 8 / 44 × 12 / 53 × 15, capsules 32 / 41 / 50 tall (capsule label and
   * disc text never below `fontSize.label`, 17.5 units), text
   * `fontSize.control.{sm,md,lg}` (21 / 26 / 30) design units. `lg` scales every md length by 69/57.
   */
  size?: StepProgressSize
  /** Accessible name of the list. Default "Progress". */
  label?: string
  /** Noun used in the text variant and the per-step accessible text. Default "Step" ("Question", "Round"…). */
  stepName?: string
  /** Text variant content. Default `{stepName} {n} of {total}` with n emphasised. */
  formatText?: (step: number, total: number) => ReactNode
  /** Accessible words per status, e.g. `{ success: 'correct', error: 'wrong' }` for a quiz. */
  statusLabels?: Partial<Record<StepStatus, string>>
  ref?: Ref<HTMLElement>
}

export type StepProgressProps = StepProgressOwnProps & Omit<ComponentPropsWithoutRef<'ol'>, keyof StepProgressOwnProps | 'children'>

const DEFAULT_STATUS_LABELS: Record<StepStatus, string> = {
  pending: 'not started',
  current: 'current',
  complete: 'complete',
  success: 'succeeded',
  error: 'failed',
  skipped: 'skipped',
}

const GLYPHS: Partial<Record<StepStatus, ReactNode>> = {
  complete: <CheckIcon />,
  success: <CheckIcon />,
  error: <CloseIcon />,
  skipped: <MinusIcon />,
}

/**
 * Horizontal step indicator for quizzes, wizards, onboarding and checkout. Each step is pending,
 * current (accent, pulsing ring), complete, success (green), error (red) or skipped.
 * Variants: `pips` (slanted bars, compact), `capsules` (numbered pills with labels, ellipsised on
 * narrow screens) and `text` ("Step 3 of 5"). An `<ol>` with `aria-current="step"` and per-step
 * status text; presentational (not interactive).
 */
export function StepProgress(props: StepProgressProps) {
  const {
    steps,
    current = 0,
    variant = 'pips',
    size = 'md',
    label = 'Progress',
    stepName = 'Step',
    formatText,
    statusLabels,
    className,
    ref,
    ...rest
  } = props

  const items: StepItem[] = typeof steps === 'number' ? Array.from({ length: Math.max(0, steps) }, () => ({})) : steps
  const total = items.length
  const words = { ...DEFAULT_STATUS_LABELS, ...statusLabels }
  const statusOf = (item: StepItem, i: number): StepStatus => item.status ?? (i < current ? 'complete' : i === current ? 'current' : 'pending')

  if (variant === 'text') {
    const n = Math.min(total, Math.max(1, current + 1))
    const restP = rest as ComponentPropsWithoutRef<'p'>
    return (
      <p
        {...restP}
        ref={ref as Ref<HTMLParagraphElement>}
        className={cx('zzz-step-progress', 'zzz-step-progress--text', `zzz-step-progress--${size}`, className)}
        data-size={size}
      >
        <span className="zzz-italic">
          {formatText ? (
            formatText(n, total)
          ) : (
            <>
              {stepName} <span className="zzz-step-progress__num">{n}</span>
              <span className="zzz-step-progress__of"> of {total}</span>
            </>
          )}
        </span>
      </p>
    )
  }

  return (
    <ol
      {...rest}
      ref={ref as Ref<HTMLOListElement>}
      aria-label={label}
      className={cx('zzz-step-progress', `zzz-step-progress--${variant}`, `zzz-step-progress--${size}`, className)}
      data-size={size}
    >
      {items.map((item, i) => {
        const status = statusOf(item, i)
        const a11y = item['aria-label'] ?? `${stepName} ${i + 1}${typeof item.label === 'string' ? `, ${item.label}` : ''}: ${words[status]}`
        return (
          <li
            key={i}
            className="zzz-step-progress__step"
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            <span className="zzz-sr-only">{a11y}</span>
            {variant === 'pips' ? (
              <span className="zzz-step-progress__pip" aria-hidden="true" />
            ) : (
              <span className="zzz-step-progress__capsule" aria-hidden="true">
                <span className="zzz-step-progress__disc">{GLYPHS[status] ?? i + 1}</span>
                <span className="zzz-step-progress__label">{item.label ?? `${stepName} ${i + 1}`}</span>
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
