import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx, usePressFlash } from '../../utils'
import { EnhanceIcon } from '../../icons'
import { StarRating } from '../StarRating'
import './StarsPill.css'

export interface StarsPillProps
    extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
    /** Filled stars (refinement phase), 0–max. */
    value: number
    /** Default 5. */
    max?: number
    /**
     * `panel`: 200 × 44 `color.surface.statRow` capsule in the side DETAIL panel, stars `pill` size, centred.
     * `large`: 297 × 57 `#212121` capsule in the big item panel, stars `large` size. Default `panel`.
     */
    size?: 'panel' | 'large'
    /** Shows the built-in Enhance ">>" sub-pill (81 × 57) at the right end and calls this on activation. */
    onEnhance?: () => void
    /** Accessible name of the built-in Enhance button. Default "Enhance". */
    enhanceLabel?: string
    /** Extra props for the built-in Enhance button (`disabled`, `data-pressed`, …). */
    enhanceProps?: Omit<ComponentPropsWithRef<'button'>, 'children' | 'onClick'>
    /** A custom right-end slot (replaces the built-in Enhance button). */
    action?: ReactNode
    /** Drive discs have no refinement: show a dim condensed "EMPTY" instead of stars. */
    empty?: boolean
    /** Accessible name of the stars. Default "n of max stars". */
    starsLabel?: string
}

function EnhanceButton({
    label,
    onEnhance,
    buttonProps = {},
}: {
    label: string
    onEnhance: () => void
    buttonProps?: StarsPillProps['enhanceProps']
}) {
    const {
        className,
        disabled,
        onKeyDown,
        onKeyUp,
        onBlur,
        type = 'button',
        ...rest
    } = buttonProps
    const press = usePressFlash<HTMLButtonElement>({
        disabled,
        onKeyDown,
        onKeyUp,
        onBlur,
    })
    return (
        <button
            {...press}
            {...rest}
            type={type}
            disabled={disabled}
            aria-label={label}
            onClick={onEnhance}
            className={cx(
                'zzz-stars-pill__enhance',
                'zzz-mat-pill',
                'zzz-pressable',
                'zzz-focusable',
                className
            )}
        >
            <EnhanceIcon className="zzz-stars-pill__chevrons" />
        </button>
    )
}

/**
 * The stat pill that holds the refinement stars, optionally ending in the Enhance
 * ">>" sub-pill (pressed = live accent fill, black chevrons, 88 × 61) or any `action` node.
 */
export function StarsPill({
    value,
    max = 5,
    size = 'panel',
    onEnhance,
    enhanceLabel = 'Enhance',
    enhanceProps,
    action,
    empty = false,
    starsLabel,
    className,
    ...rest
}: StarsPillProps) {
    const slot =
        action ??
        (onEnhance ? (
            <EnhanceButton
                label={enhanceLabel}
                onEnhance={onEnhance}
                buttonProps={enhanceProps}
            />
        ) : null)
    return (
        <div
            {...rest}
            className={cx(
                'zzz-stars-pill',
                `zzz-stars-pill--${size}`,
                slot != null && 'zzz-stars-pill--has-action',
                className
            )}
        >
            <span className="zzz-stars-pill__stars">
                {empty ? (
                    <span className="zzz-stars-pill__empty">EMPTY</span>
                ) : (
                    <StarRating
                        value={value}
                        max={max}
                        size={size === 'large' ? 'large' : 'pill'}
                        label={starsLabel}
                    />
                )}
            </span>
            {slot != null ? (
                <span className="zzz-stars-pill__action">{slot}</span>
            ) : null}
        </div>
    )
}
