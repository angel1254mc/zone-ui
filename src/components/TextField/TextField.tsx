import { useId } from 'react'
import type {
    ChangeEvent,
    ComponentPropsWithRef,
    CSSProperties,
    ReactNode,
} from 'react'
import { cx } from '../../utils'
import { Text } from '../Text'
import './TextField.css'

/** Control size: `sm` / `md` / `lg` = 46 / 57 / 69 design units tall (≈ 32 / 40 / 48 CSS px at the default scale). */
export type TextFieldSize = 'sm' | 'md' | 'lg'

export interface TextFieldProps
    extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
    /** Visible label above the field (also its accessible name). */
    label?: ReactNode
    /** Helper text under the field (described-by). */
    description?: ReactNode
    /** `true` = invalid ring only; a node = invalid ring + the message under the field (described-by). */
    error?: ReactNode
    /** Leading icon cap: a circle as tall as the pill with its own ring, glyph white. Decorative. */
    icon?: ReactNode
    /** Called with the new string on every change (alongside the native `onChange`). */
    onValueChange?(value: string): void
    /** Field width in design units (default: fill the container). */
    width?: number
    /**
     * Height of the field: `sm` 46, `md` 57 (default), `lg` 69 design units — about 32 / 40 / 48 CSS px
     * at the default scale. Value text, label, icon cap and ring scale with it. (Not the native
     * `<input size>` character count; set the width with `width` or CSS.)
     */
    size?: TextFieldSize
}

/**
 * A text input on the dark pill (`.zzz-mat-pill`), value upright white, placeholder
 * `color.text.disabled`, optional leading icon cap. Sizes sm / md / lg = 46 / 57 / 69 design units
 * tall (`--zzz-size-control-{sm,md,lg}`), value text `fontSize.body` / `bodyLg` / `button`.
 * Focus: the ring turns `var(--zzz-accent)`. Error: ring `color.danger.base` + a message.
 * Disabled: fill #2E2E2E, text #808080.
 *
 * `className` / `style` / `width` style the root; `ref` and every other prop go to the `<input>`.
 * Native `value` / `defaultValue` / `onChange` keep working (controlled or uncontrolled).
 */
export function TextField({
    label,
    description,
    error,
    icon,
    onValueChange,
    onChange,
    width,
    size = 'md',
    className,
    style,
    id,
    disabled,
    type = 'text',
    'aria-describedby': ariaDescribedBy,
    ...rest
}: TextFieldProps) {
    const autoId = useId()
    const inputId = id ?? `zzz-tf${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`
    const invalid = error !== undefined && error !== null && error !== false
    const hasMessage = invalid && error !== true
    const descId = description != null ? `${inputId}-desc` : undefined
    const errId = hasMessage ? `${inputId}-err` : undefined
    const describedBy =
        [ariaDescribedBy, descId, errId].filter(Boolean).join(' ') || undefined

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event)
        onValueChange?.(event.target.value)
    }

    const rootStyle =
        width != null
            ? ({
                  '--zzz-text-field-width': `calc(${width} * var(--zzz-px))`,
                  ...style,
              } as CSSProperties)
            : style

    return (
        <div
            className={cx(
                'zzz-text-field',
                `zzz-text-field--${size}`,
                icon != null && 'zzz-text-field--with-icon',
                className
            )}
            style={rootStyle}
            data-size={size}
            data-invalid={invalid ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
        >
            {label != null ? (
                <Text
                    as="label"
                    role="body"
                    tone="muted"
                    htmlFor={inputId}
                    className="zzz-text-field__label"
                >
                    {label}
                </Text>
            ) : null}
            <div className="zzz-text-field__control zzz-mat-pill">
                {icon != null ? (
                    <span className="zzz-text-field__cap" aria-hidden="true">
                        {icon}
                    </span>
                ) : null}
                <input
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                    className="zzz-text-field__input zzz-text-body-lg"
                    onChange={handleChange}
                    {...rest}
                />
            </div>
            {description != null ? (
                <Text
                    id={descId}
                    role="label"
                    tone="muted"
                    className="zzz-text-field__description"
                >
                    {description}
                </Text>
            ) : null}
            {hasMessage ? (
                <Text
                    id={errId}
                    role="body"
                    tone="danger"
                    className="zzz-text-field__error"
                >
                    {error}
                </Text>
            ) : null}
        </div>
    )
}
