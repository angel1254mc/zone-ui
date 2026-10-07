import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils'
import { CheckIcon, CloseIcon } from '../../icons'
import './Toast.css'

export type ToastVariant = 'info' | 'success' | 'error'

export interface ToastProps
    extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
    /** Default `info`. Picks the icon disc colour; success / error also tint the pill. */
    variant?: ToastVariant
    /** Glyph in the icon disc (default per variant). `null` hides the disc. */
    icon?: ReactNode
    /** Renders a close button that calls this. */
    onDismiss?(): void
    /** Accessible name of the close button. Default "Dismiss". */
    dismissLabel?: string
    /**
     * Announce itself: `role="status"` (`role="alert"` for error). Default true. ToastProvider
     * turns it off for info / success because its list is already an `aria-live="polite"` region.
     */
    live?: boolean
    /** Play the enter animation (grow + 3× flash). Default true. */
    animate?: boolean
    children?: ReactNode
}

/** Black "i" / "!" glyphs for the icon disc (drawn on the 0 0 32 32 icon grid). */
function DiscGlyph({ kind }: { kind: 'info' | 'error' }) {
    return (
        <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            focusable="false"
            className="zzz-toast__glyph-svg"
        >
            {kind === 'info' ? (
                <>
                    <rect x="12.5" y="3" width="7" height="7" rx="1.5" />
                    <rect x="12.5" y="13" width="7" height="16" rx="1.5" />
                </>
            ) : (
                <>
                    <rect x="12.5" y="3" width="7" height="17" rx="1.5" />
                    <rect x="12.5" y="23" width="7" height="6.5" rx="1.5" />
                </>
            )}
        </svg>
    )
}

const DEFAULT_ICON: Record<ToastVariant, ReactNode> = {
    info: <DiscGlyph kind="info" />,
    success: <CheckIcon />,
    error: <DiscGlyph kind="error" />,
}

/**
 * Toast notification: a 34-tall black full pill, `fontSize.label` white, padding 0 17, with a coloured icon disc
 * (info = `color.icon.recycle` blue, success = `color.icon.confirm` green, error =
 * `color.icon.cancel` red, black glyph). Success / error mix the status colour 50/50 with black
 * (fill) and white (text). Enter: the pill grows from its centre over 630 ms under three 70 ms
 * white/black flashes, the text fades in over 420 ms. Use it through `ToastProvider` + `useToast`.
 */
export function Toast({
    variant = 'info',
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    live = true,
    animate = true,
    className,
    children,
    ...rest
}: ToastProps) {
    const glyph = icon === undefined ? DEFAULT_ICON[variant] : icon
    const role = live ? (variant === 'error' ? 'alert' : 'status') : undefined
    return (
        <div
            role={role}
            {...rest}
            className={cx('zzz-toast', className)}
            data-variant={variant}
            data-animate={animate ? '' : undefined}
        >
            {glyph != null ? (
                <span className="zzz-toast__disc" aria-hidden="true">
                    <span className="zzz-toast__glyph">{glyph}</span>
                </span>
            ) : null}
            <span className="zzz-toast__message">{children}</span>
            {onDismiss ? (
                <button
                    type="button"
                    className="zzz-toast__close zzz-pressable zzz-focusable"
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                >
                    <CloseIcon />
                </button>
            ) : null}
        </div>
    )
}
