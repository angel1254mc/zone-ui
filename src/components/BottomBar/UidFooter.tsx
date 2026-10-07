import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cx } from '../../utils'
import './BottomBar.css'

export type SignalLevel = 0 | 1 | 2 | 3

export interface SignalBarsProps
    extends Omit<ComponentPropsWithoutRef<'svg'>, 'children'> {
    /** Lit bars (0–3). Default 3. Unlit bars are `color.border.button` grey. */
    signal?: SignalLevel
    /** Hide from assistive tech. */
    decorative?: boolean
    ref?: Ref<SVGSVGElement>
}

/** Bar heights 4 / 10 / 15 on a 6 px pitch, 5 px wide, slightly rounded tops. */
const BARS = [4, 10, 15] as const

/** The 3 green connection bars after the UID (`color.icon.signal`), 17 × 15 design units. */
export function SignalBars({
    signal = 3,
    decorative = false,
    className,
    ref,
    ...rest
}: SignalBarsProps) {
    const a11y = decorative
        ? ({ 'aria-hidden': true } as const)
        : ({ role: 'img', 'aria-label': `Connection ${signal} of 3` } as const)
    return (
        <svg
            {...rest}
            {...a11y}
            ref={ref}
            className={cx('zzz-signal-bars', className)}
            viewBox="0 0 17 15"
            focusable="false"
        >
            {BARS.map((h, i) => (
                <rect
                    key={i}
                    className="zzz-signal-bars__bar"
                    {...(i < signal ? { 'data-on': '' } : null)}
                    x={i * 6}
                    y={15 - h}
                    width={5}
                    height={h + 1}
                    rx={1}
                />
            ))}
        </svg>
    )
}

export interface UidFooterOwnProps {
    /** Player UID, e.g. "1000000001". */
    uid: string
    /** Signal strength shown by the bars. Default 3. */
    signal?: SignalLevel
    /** Hide the signal bars. */
    hideSignal?: boolean
    ref?: Ref<HTMLDivElement>
}

export type UidFooterProps = UidFooterOwnProps &
    Omit<ComponentPropsWithoutRef<'div'>, keyof UidFooterOwnProps | 'children'>

/**
 * "UID: 1000000001" (`fontSize.tiny`, `color.text.uid`, upright) + `SignalBars` 7 px after it.
 * It sits at the bottom-right corner of a screen; `Screen` positions it there.
 */
export function UidFooter({
    uid,
    signal = 3,
    hideSignal = false,
    className,
    ref,
    ...rest
}: UidFooterProps) {
    return (
        <div {...rest} ref={ref} className={cx('zzz-uid-footer', className)}>
            <span className="zzz-uid-footer__text">UID: {uid}</span>
            {hideSignal ? null : (
                <SignalBars
                    signal={signal}
                    className="zzz-uid-footer__signal"
                />
            )}
        </div>
    )
}
