import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cx, useControllableState } from '../../utils'
import './Switch.css'

/** `sm` / `md` / `lg`: bezel 61 × 36 / 76 × 45 / 92 × 54 design units (≈ 43 × 25 / 53 × 32 / 64 × 38 CSS px at the default scale). */
export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps
    extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'children'> {
    /** On (controlled). */
    checked?: boolean
    /** Initial state (uncontrolled). */
    defaultChecked?: boolean
    onCheckedChange?(checked: boolean): void
    /** Bezel, track, knob and travel scale together (sm = md × 46/57, lg = md × 69/57). Default `md`. */
    size?: SwitchSize
}

/**
 * Small toggle switch: a 76 × 45 `#161616` bezel with a black keyline, a
 * 62 × 33 grey gradient track and a ~31 px dark knob with a light "LED" dash on its left.
 *
 * On: the knob slides to the right end (120 ms out-expo) and
 * the LED dash turns `var(--zzz-accent)`. `role="switch"` + `aria-checked`; Space / Enter toggle.
 * Name it with `aria-label`, `aria-labelledby` or a `<label htmlFor>`.
 * Sizes `sm` / `md` / `lg` scale the whole control with the web size scale (md = the base geometry).
 */
export function Switch({
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    size = 'md',
    disabled,
    className,
    onClick,
    type = 'button',
    ...rest
}: SwitchProps) {
    const [checked, setChecked] = useControllableState(
        checkedProp,
        defaultChecked,
        onCheckedChange
    )

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented || disabled) return
        setChecked((c) => !c)
    }

    return (
        <button
            type={type}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            data-state={checked ? 'on' : 'off'}
            data-size={size}
            className={cx(
                'zzz-switch',
                `zzz-switch--${size}`,
                'zzz-focusable',
                className
            )}
            {...rest}
            onClick={handleClick}
        >
            <span className="zzz-switch__track" aria-hidden="true">
                <span className="zzz-switch__knob" />
            </span>
        </button>
    )
}
