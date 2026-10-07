import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import './ContentCard.css'

/**
 * - `default`: panel material (5 px lit `#333` ring, black body, 3 px keyline) with a textured header strip
 * - `accent`: the same with a pulsing accent edge down the left side and an accent eyebrow (featured / current item)
 * - `compact`: tighter paddings, smaller title and header (lists, sidebars, phones)
 */
export type ContentCardVariant = 'default' | 'accent' | 'compact'

/** `top`: full-bleed media under the header. `side`: media column beside the body on wide containers (stacks on narrow ones). */
export type ContentCardMediaPosition = 'top' | 'side'

export type ContentCardElement = 'article' | 'section' | 'div' | 'li'
export type ContentCardHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'

export interface ContentCardProps
    extends Omit<ComponentPropsWithRef<'article'>, 'title' | 'ref'> {
    /** Small label at the left of the header strip ("Question 3 / 5", "Daily", "Settings"). */
    eyebrow?: ReactNode
    /** Right end of the header strip: a tag, timer, counter, icon button… */
    trailing?: ReactNode
    /** Large heavy title; also the card's accessible name. */
    title?: ReactNode
    /** Heading element for `title`. Default `h2`. */
    titleAs?: ContentCardHeading
    /** Image / art / SVG slot (sized with CSS: `object-fit: cover`). */
    media?: ReactNode
    /** Default `top`. */
    mediaPosition?: ContentCardMediaPosition
    /** Footer actions (right-aligned, wrapping). */
    footer?: ReactNode
    /** Default `default`. */
    variant?: ContentCardVariant
    /** Root element. Default `article`. */
    as?: ContentCardElement
    ref?: Ref<HTMLElement>
}

/**
 * A general content card on the panel material: header strip (eyebrow + trailing slot), large
 * heavy title, optional media (top or side), body and footer actions. Fluid width; a container
 * query moves side media under the title in narrow cards. Composed from the side / tool panel
 * materials.
 */
export function ContentCard({
    eyebrow,
    trailing,
    title,
    titleAs: TitleTag = 'h2',
    media,
    mediaPosition = 'top',
    footer,
    variant = 'default',
    as: Root = 'article',
    className,
    children,
    ref,
    'aria-labelledby': labelledBy,
    ...rest
}: ContentCardProps) {
    const uid = useId()
    const titleId = `${uid}-title`
    const has = (n: ReactNode) => n !== undefined && n !== null && n !== false
    const hasHeader = has(eyebrow) || has(trailing)
    const hasTitle = has(title)
    const hasMedia = has(media)
    const hasFooter = has(footer)
    const named = rest['aria-label'] != null

    return (
        <Root
            {...rest}
            ref={ref as Ref<never>}
            aria-labelledby={
                labelledBy ?? (hasTitle && !named ? titleId : undefined)
            }
            className={cx(
                'zzz-content-card',
                `zzz-content-card--${variant}`,
                hasMedia && `zzz-content-card--media-${mediaPosition}`,
                className
            )}
        >
            <div className="zzz-content-card__surface zzz-mat-panel">
                {variant === 'accent' ? (
                    <span
                        className="zzz-content-card__edge"
                        aria-hidden="true"
                    />
                ) : null}
                {hasHeader ? (
                    <div className="zzz-content-card__header zzz-mat-textured">
                        <span className="zzz-content-card__eyebrow">
                            {eyebrow}
                        </span>
                        {has(trailing) ? (
                            <span className="zzz-content-card__trailing">
                                {trailing}
                            </span>
                        ) : null}
                    </div>
                ) : null}
                <div className="zzz-content-card__main">
                    {hasMedia ? (
                        <div className="zzz-content-card__media">{media}</div>
                    ) : null}
                    <div className="zzz-content-card__body">
                        {hasTitle ? (
                            <TitleTag
                                id={titleId}
                                className="zzz-content-card__title"
                            >
                                {title}
                            </TitleTag>
                        ) : null}
                        {has(children) ? (
                            <div className="zzz-content-card__content">
                                {children}
                            </div>
                        ) : null}
                    </div>
                </div>
                {hasFooter ? (
                    <div className="zzz-content-card__footer zzz-mat-textured zzz-mat-textured--body">
                        {footer}
                    </div>
                ) : null}
            </div>
        </Root>
    )
}
