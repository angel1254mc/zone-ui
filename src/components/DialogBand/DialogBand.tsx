import { useId, useRef } from 'react'
import type { ComponentPropsWithRef, ReactNode, RefObject } from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import { Text } from '../Text'
import { GraffitiLayer } from '../Backgrounds'
import { DialogBackdrop } from './DialogBackdrop'
import {
    OverlayPortal,
    prefersReducedMotion,
    useModalLayer,
    usePresence,
} from './overlay'
import './DialogBand.css'

export interface DialogBandProps
    extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children' | 'role'> {
    /** Open state (controlled). */
    open?: boolean
    /** Initial open state (uncontrolled). */
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    /** The question / heading, centred at the top of the band (its accessible name). */
    title: ReactNode
    /** Band content under the title (e.g. a RewardTileGroup). */
    children?: ReactNode
    /** Button row straddling the bottom edge line (e.g. Cancel / Confirm `Button width="dialog"`). */
    actions?: ReactNode
    /** Drifting graffiti watermark inside the band (default true). */
    watermark?: boolean
    /** Blurred, striped scrim behind the band (default true). */
    backdrop?: boolean
    /** ~100 ms pixelated freeze of the page before the band pops in (optional). */
    pixelate?: boolean
    /** Element to focus on open. Default: the last button of `actions` (Confirm), else the first tabbable. */
    initialFocus?: RefObject<HTMLElement | null>
    /** `alertdialog` instead of `dialog` (confirmations). */
    alert?: boolean
    /** Escape closes (default true). */
    closeOnEscape?: boolean
    /** Called on Escape before the dialog closes (ConfirmDialog maps it to cancel). */
    onEscapeKeyDown?(): void
    /** Freeze the page's accent pulse behind the dialog (default true). */
    freezePage?: boolean
    /** Render inside this element (position: absolute) instead of a fixed layer on `<body>`. */
    container?: HTMLElement | null
}

/** Band exit: band 60 ms, stripes fade 100 ms after 60 ms, blur hard-swaps off at ~200 ms. */
const EXIT_MS = 200
const EXIT_MS_REDUCED = 100

/**
 * The kit's modal band: a full-width 390 px black band, vertically centred, with 4 px edge
 * lines, a drifting graffiti watermark, a centred title and a button row centred on the bottom edge line.
 * Portalled to `<body>` (or `container`), `role="dialog"` + `aria-modal`, focus trapped, Escape closes,
 * page scroll locked and page `inert`, focus restored on close.
 *
 * Motion: band scaleY .87 → 1.023 → 1.015 → 1.009 → 1 in 140 ms with a white flash (.34 → 0, 100 ms)
 * and the content fading .27 → 1 in 70 ms; close = band opacity 0 in 60 ms, then the scrim.
 */
export function DialogBand({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title,
    children,
    actions,
    watermark = true,
    backdrop = true,
    pixelate = false,
    initialFocus,
    alert = false,
    closeOnEscape = true,
    onEscapeKeyDown,
    freezePage = true,
    container,
    className,
    ref,
    ...rest
}: DialogBandProps) {
    const [open, setOpen] = useControllableState(
        openProp,
        defaultOpen,
        onOpenChange
    )
    const reduced =
        typeof window !== 'undefined' && prefersReducedMotion(container)
    const { mounted, state } = usePresence(
        open,
        reduced ? EXIT_MS_REDUCED : EXIT_MS
    )
    const titleId = `zzz-dialog${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-title`
    const layerRef = useRef<HTMLDivElement>(null)
    const bandRef = useRef<HTMLDivElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)

    const { onKeyDown } = useModalLayer({
        active: open && mounted,
        layerRef,
        dialogRef: bandRef,
        lockScroll: container == null,
        freezeAccent: freezePage,
        getInitialFocus: () => {
            if (initialFocus?.current) return initialFocus.current
            const buttons = actionsRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href]'
            )
            return buttons && buttons.length > 0
                ? buttons[buttons.length - 1]
                : null
        },
        onEscape: closeOnEscape
            ? () => {
                  onEscapeKeyDown?.()
                  setOpen(false)
              }
            : undefined,
    })

    if (!mounted) return null

    return (
        <OverlayPortal
            container={container}
            state={state}
            layerRef={layerRef}
            className="zzz-dialog-layer"
            data={{ 'data-pixelate': pixelate && !reduced ? '' : undefined }}
        >
            {backdrop ? (
                <DialogBackdrop state={state} pixelate={pixelate && !reduced} />
            ) : null}
            <div
                {...rest}
                ref={mergeRefs(ref, bandRef)}
                role={alert ? 'alertdialog' : 'dialog'}
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                data-state={state}
                className={cx('zzz-dialog-band', className)}
                onKeyDown={(e) => {
                    rest.onKeyDown?.(e)
                    onKeyDown(e)
                }}
            >
                <div className="zzz-dialog-band__fill" aria-hidden="true">
                    {watermark ? (
                        <GraffitiLayer
                            variant="dialog"
                            drift
                            className="zzz-dialog-band__watermark"
                        />
                    ) : null}
                    <div className="zzz-dialog-band__flash" />
                </div>
                <div className="zzz-dialog-band__content">
                    <Text
                        as="h2"
                        id={titleId}
                        role="title"
                        className="zzz-dialog-band__title"
                    >
                        {title}
                    </Text>
                    {children != null ? (
                        <div className="zzz-dialog-band__body">{children}</div>
                    ) : null}
                </div>
                {actions != null ? (
                    <div ref={actionsRef} className="zzz-dialog-band__actions">
                        {actions}
                    </div>
                ) : null}
            </div>
        </OverlayPortal>
    )
}
