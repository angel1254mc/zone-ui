import type {
    ComponentPropsWithoutRef,
    CSSProperties,
    ReactNode,
    Ref,
} from 'react'
import { cx } from '../../utils'
import { NewBadge } from '../Badges'
import { StarRating } from '../StarRating'
import './Progress.css'

/* ── OverclockBar ──────────────────────────────────────────────────────────────────────── */

export interface OverclockBarOwnProps {
    /** Filled stars of the current phase (left group). */
    current: number
    /** Filled stars of the next phase (right group). */
    next: number
    /** Stars per group. Default 5. */
    max?: number
    /** Replaces the left star group (decorative slot). */
    left?: ReactNode
    /** Replaces the right star group (decorative slot). */
    right?: ReactNode
    /** Accessible name. Default "Phase {current} → Phase {next}". */
    label?: string
    ref?: Ref<HTMLDivElement>
}

export type OverclockBarProps = OverclockBarOwnProps &
    Omit<
        ComponentPropsWithoutRef<'div'>,
        keyof OverclockBarOwnProps | 'children'
    >

/** The 4 black ">" cuts: tips at x 238 + 28·i (bar px), ends 15 px further left. */
const CHEVRONS = [0, 1, 2, 3].map((i) => {
    const tip = 238 + 28 * i
    return `M${tip - 15} -1 L${tip} 28 L${tip - 15} 57`
})

/**
 * Overclock phase bar: a 544 × 56 static lime capsule (`color.progress.overclock`,
 * ramping to `overclockEnd` over the right segment) with the current-phase stars, four black ">"
 * chevrons and the next-phase stars. It does not pulse. `role="img"`.
 */
export function OverclockBar({
    current,
    next,
    max = 5,
    left,
    right,
    label,
    className,
    ref,
    ...rest
}: OverclockBarProps) {
    return (
        <div
            {...rest}
            ref={ref}
            role="img"
            aria-label={label ?? `Phase ${current} → Phase ${next}`}
            className={cx('zzz-overclock-bar', className)}
        >
            <span
                className="zzz-overclock-bar__group zzz-overclock-bar__group--current"
                aria-hidden="true"
            >
                {left ?? <StarRating value={current} max={max} size="onLime" />}
            </span>
            <svg
                className="zzz-overclock-bar__chevrons"
                viewBox="0 0 544 56"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
            >
                {CHEVRONS.map((d) => (
                    <path key={d} d={d} />
                ))}
            </svg>
            <span
                className="zzz-overclock-bar__group zzz-overclock-bar__group--next"
                aria-hidden="true"
            >
                {right ?? <StarRating value={next} max={max} size="onLime" />}
            </span>
        </div>
    )
}

/* ── XpBar ─────────────────────────────────────────────────────────────────────────────── */

export interface XpBarOwnProps {
    value: number
    max: number
    /** Text inside the bar. Default "MAX / MAX" (thin spaces) when full, else "value / max". */
    label?: ReactNode
    /** Accessible name. Default "Level progress". */
    'aria-label'?: string
    ref?: Ref<HTMLDivElement>
}

export type XpBarProps = XpBarOwnProps &
    Omit<ComponentPropsWithoutRef<'div'>, keyof XpBarOwnProps | 'children'>

/**
 * XP bar: 174 × 13 full-round, `color.progress.xp` indigo → cyan gradient (fixed to
 * the bar, the fill reveals it), italic white `micro` label inside, 5 px from the left. `role="progressbar"`.
 * The empty track uses `progress.xpTrack`.
 */
export function XpBar({
    value,
    max,
    label,
    'aria-label': ariaLabel = 'Level progress',
    className,
    style,
    ref,
    ...rest
}: XpBarProps) {
    const safeMax = max > 0 ? max : 1
    const clamped = Math.min(safeMax, Math.max(0, value))
    const full = clamped >= safeMax
    const text = label ?? (full ? 'MAX / MAX' : `${clamped} / ${safeMax}`)
    const pct = (clamped / safeMax) * 100
    return (
        <div
            {...rest}
            ref={ref}
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-valuenow={clamped}
            aria-valuetext={typeof text === 'string' ? text : undefined}
            className={cx('zzz-xp-bar', className)}
            style={{ '--zzz-xp-pct': `${pct}%`, ...style } as CSSProperties}
        >
            <span className="zzz-xp-bar__fill" />
            <span className="zzz-xp-bar__label zzz-italic" aria-hidden="true">
                {text}
            </span>
        </div>
    )
}

/* ── ProgressPill ──────────────────────────────────────────────────────────────────────── */

export interface ProgressPillOwnProps {
    /** Icon in the left well (~62 px disc, overhangs the pill), e.g. the Polychrome film card. Decorative. */
    icon?: ReactNode
    /** Label, typically two lines ("Polychrome\nProgress:"); `\n` breaks the line. */
    label: ReactNode
    /** Right-aligned value ("19%"). */
    value: ReactNode
    /** Shows the NEW! badge over the icon well. */
    isNew?: boolean
    ref?: Ref<HTMLDivElement>
}

export type ProgressPillProps = ProgressPillOwnProps &
    Omit<
        ComponentPropsWithoutRef<'div'>,
        keyof ProgressPillOwnProps | 'children'
    >

/**
 * Stat pill (e.g. "Polychrome Progress: 19%"): ~416 × 56 capsule with the `polychromeTop` →
 * `polychromeBottom` gradient and a 1 px #393939 highlight. It has NO proportional fill.
 */
export function ProgressPill({
    icon,
    label,
    value,
    isNew = false,
    className,
    ref,
    ...rest
}: ProgressPillProps) {
    return (
        <div {...rest} ref={ref} className={cx('zzz-progress-pill', className)}>
            <span className="zzz-progress-pill__well" aria-hidden="true">
                {icon}
            </span>
            {isNew ? (
                <NewBadge placement="top-left" offset={[2, 12]} size="md" />
            ) : null}
            <span className="zzz-progress-pill__label">{label}</span>
            <span className="zzz-progress-pill__value">{value}</span>
        </div>
    )
}
