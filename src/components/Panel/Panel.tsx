import {
    useId,
    type ComponentPropsWithRef,
    type CSSProperties,
    type ReactNode,
} from 'react'
import { cx } from '../../utils'
import './Panel.css'

/**
 * `side`: 460 × 670 DETAIL panel (5 px `#333` ring, outer radius 29, 35 px black header strip,
 * hero gradient body). `tool`: 626 × 820 Crafting / W-ENGINE UPGRADE panel (44 px textured
 * header, black body, optional textured lower section). `large`: full-width item panel (4 px
 * `#2D2D2D` ring + 3 px black, outer radius 33, 70 px title band, art stage + raised right
 * column). `drawerInner`: the `#030303` radius-12 panel inside the filter drawer (no ring).
 */
export type PanelVariant = 'side' | 'tool' | 'large' | 'drawerInner'

export interface PanelProps
    extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
    /** Default `side`. */
    variant?: PanelVariant
    /** Header strip label: "DETAIL" (side, `micro` in `text.faint`) or "Crafting" (tool, `bodyLg` in `text.panelTab`). */
    headerLabel?: ReactNode
    /** Title in the 70 px title band (`large`). On other variants it is rendered as the first body line. */
    title?: ReactNode
    /** Footer (buttons). */
    footer?: ReactNode
    /** `tool`: textured lower section (`color.surface.panelBodyTextured` + dots lg) filling the rest of the body. */
    lower?: ReactNode
    /** `tool`: start the textured lower background at this y (design units from the top of the body), with a hard edge. */
    lowerTexturedFrom?: number
    /** `large`: the raised right column (`color.surface.raised`). The children fill the art stage on the left. */
    aside?: ReactNode
    /** `large`: right column width in design units. Default 725. */
    asideWidth?: number
    /** Outer width in design units (ring included). Defaults: side 460, tool 626, others fluid. */
    width?: number
    /** Outer height in design units (ring included). Defaults: side 670, tool 820, others auto. */
    height?: number
}

/**
 * Framed container. `width` / `height` are the OUTER size: the ring and
 * keyline of `.zzz-mat-panel` are drawn outside the surface box, so the root reserves them as
 * padding. Renders `<section aria-labelledby>` pointing at the header label or title.
 */
export function Panel({
    variant = 'side',
    headerLabel,
    title,
    footer,
    lower,
    lowerTexturedFrom,
    aside,
    asideWidth,
    width,
    height,
    className,
    style,
    children,
    'aria-labelledby': labelledBy,
    ...rest
}: PanelProps) {
    const uid = useId()
    const headerId = `${uid}-header`
    const titleId = `${uid}-title`
    const isLarge = variant === 'large'
    const showHeader =
        !isLarge && headerLabel !== undefined && headerLabel !== null
    const showTitle = title !== undefined && title !== null
    const autoLabel = showTitle ? titleId : showHeader ? headerId : undefined

    const vars = {
        ...(width !== undefined ? { '--zzz-panel-w': width } : null),
        ...(height !== undefined ? { '--zzz-panel-h': height } : null),
        ...(asideWidth !== undefined
            ? { '--zzz-panel-aside-w': asideWidth }
            : null),
        ...(lowerTexturedFrom !== undefined
            ? { '--zzz-panel-lower-from': lowerTexturedFrom }
            : null),
        ...style,
    } as CSSProperties

    const body = isLarge ? (
        <div className="zzz-panel__body zzz-panel__split">
            <div className="zzz-panel__stage">{children}</div>
            {aside !== undefined && aside !== null ? (
                <div className="zzz-panel__aside">{aside}</div>
            ) : null}
        </div>
    ) : (
        <div className="zzz-panel__body">
            {lowerTexturedFrom !== undefined ? (
                <div
                    className="zzz-panel__lower-bg zzz-mat-textured zzz-mat-textured--body"
                    aria-hidden="true"
                />
            ) : null}
            <div className="zzz-panel__content">
                {showTitle ? (
                    <h2 id={titleId} className="zzz-panel__heading">
                        {title}
                    </h2>
                ) : null}
                {children}
            </div>
            {lower !== undefined && lower !== null ? (
                <div className="zzz-panel__lower zzz-mat-textured zzz-mat-textured--body">
                    {lower}
                </div>
            ) : null}
        </div>
    )

    return (
        <section
            {...rest}
            aria-labelledby={labelledBy ?? autoLabel}
            className={cx(
                'zzz-panel',
                `zzz-panel--${variant === 'drawerInner' ? 'drawer-inner' : variant}`,
                className
            )}
            style={vars}
        >
            <div
                className={cx(
                    'zzz-panel__surface',
                    variant !== 'drawerInner' && 'zzz-mat-panel',
                    isLarge && 'zzz-mat-panel--large'
                )}
            >
                {showHeader ? (
                    <div
                        className={cx(
                            'zzz-panel__header',
                            variant === 'tool' && 'zzz-mat-textured'
                        )}
                    >
                        <span id={headerId} className="zzz-panel__label">
                            {headerLabel}
                        </span>
                    </div>
                ) : null}
                {isLarge && showTitle ? (
                    <div className="zzz-panel__title-band zzz-dots">
                        <h2 id={titleId} className="zzz-panel__title">
                            {title}
                        </h2>
                    </div>
                ) : null}
                {body}
                {footer !== undefined && footer !== null ? (
                    <div className="zzz-panel__footer">{footer}</div>
                ) : null}
            </div>
        </section>
    )
}
