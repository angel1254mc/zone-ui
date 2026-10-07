import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils'
import './Capsule.css'

export type CapsuleTone = 'default' | 'empty' | 'danger'

export interface CapsuleProps extends ComponentPropsWithRef<'span'> {
    /**
     * `default`: white upright `fontSize.label` ("Lv. 60", "×30", "20/60").
     * `empty`: condensed `condensedSm` "EMPTY" in `color.text.faint`.
     * `danger`: `color.danger.text` (insufficient count). Default `default`.
     */
    tone?: CapsuleTone
    /** Height: `sm` 23 (EMPTY slots), `md` 24 (cards, default), `lg` 27 (ingredient tiles). */
    size?: 'sm' | 'md' | 'lg'
    /** Content. The `empty` tone defaults to "EMPTY". */
    children?: ReactNode
}

/**
 * The black pill under item cards: level / count / EMPTY. It fills its container's
 * width (the card width) and centres one line of text. Not interactive.
 */
export function Capsule({
    tone = 'default',
    size = 'md',
    className,
    children,
    ...rest
}: CapsuleProps) {
    return (
        <span
            {...rest}
            className={cx(
                'zzz-capsule',
                `zzz-capsule--${tone}`,
                `zzz-capsule--${size}`,
                className
            )}
        >
            <span className="zzz-capsule__text">
                {children ?? (tone === 'empty' ? 'EMPTY' : null)}
            </span>
        </span>
    )
}
