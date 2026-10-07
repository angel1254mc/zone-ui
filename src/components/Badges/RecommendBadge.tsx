import { useId, type ComponentPropsWithRef } from 'react'
import { cx } from '../../utils'
import {
    badgeA11y,
    placementProps,
    type BadgeA11yProps,
    type BadgeOffset,
} from './shared'
import './Badges.css'

export interface RecommendBadgeProps
    extends Omit<ComponentPropsWithRef<'span'>, 'children'>,
        BadgeA11yProps {
    /** `top-left`: overhangs the host icon's top-left (host `position: relative`). Default `inline`. */
    placement?: 'top-left' | 'inline'
    /** Overhang `[x, y]` in design units. Default `[10, 5]`. */
    offset?: BadgeOffset
}

/** Four-point sparkle with pinched (concave) sides. */
function sparkle(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    pinch = 0.18
): string {
    const px = rx * pinch
    const py = ry * pinch
    return (
        `M${cx} ${cy - ry} Q${cx + px} ${cy - py} ${cx + rx} ${cy} ` +
        `Q${cx + px} ${cy + py} ${cx} ${cy + ry} Q${cx - px} ${cy + py} ${cx - rx} ${cy} ` +
        `Q${cx - px} ${cy - py} ${cx} ${cy - ry} Z`
    )
}

/* Thumbs-up drawn on a 32 × 22-unit grid (original drawing). */
const HAND =
    'M12.6 8.4 H15.2 L16 2.6 C16.3 0.9 18 0.3 19.4 1 C20.7 1.7 21 3 20.8 4.4 L20.3 7.6 H25 ' +
    'C26.6 7.6 27.6 8.8 27.4 10.3 L26.4 19 C26.2 20.5 25.1 21.4 23.6 21.4 H12.6 ' +
    'C11.7 21.4 11 20.7 11 19.8 V10 C11 9.1 11.7 8.4 12.6 8.4 Z'
const KNUCKLES = 'M20.6 11.6 H26.4 M20.4 14.9 H26 M20.2 18.1 H25.6'

/**
 * "Recommended" badge: a yellow `color.badge.recommend` thumbs-up
 * with two four-point sparkles and a thin dark outline, ~32 × 22 incl. sparkles, for list rows.
 * Static (does not pulse).
 */
export function RecommendBadge({
    placement = 'inline',
    offset,
    label = 'Recommended',
    decorative,
    className,
    style,
    ...rest
}: RecommendBadgeProps) {
    const uid = `zzz-rb${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const pos = placementProps(placement, offset, style)
    return (
        <span
            {...rest}
            {...badgeA11y(label, decorative)}
            className={cx('zzz-recommend-badge', pos.className, className)}
            style={pos.style}
        >
            <svg
                className="zzz-recommend-badge__svg"
                viewBox="0 0 32 22"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <linearGradient
                        id={`${uid}-hand`}
                        x1="0"
                        y1="1"
                        x2="0"
                        y2="21.4"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#FFEF4A" />
                        <stop
                            offset="0.45"
                            stopColor="var(--zzz-color-badge-recommend, #FAD70C)"
                        />
                        <stop offset="1" stopColor="#F29A05" />
                    </linearGradient>
                    <radialGradient
                        id={`${uid}-glint`}
                        cx="5.2"
                        cy="11.5"
                        r="8"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#FFFFFF" />
                        <stop offset="0.45" stopColor="#FFF3C4" />
                        <stop offset="1" stopColor="#F8D548" />
                    </radialGradient>
                </defs>
                <g
                    stroke="#2A1800"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                    paintOrder="stroke"
                >
                    <path
                        d={sparkle(5.2, 11.5, 5, 9)}
                        fill={`url(#${uid}-glint)`}
                    />
                    <path d={HAND} fill={`url(#${uid}-hand)`} />
                    <path
                        d={sparkle(28.6, 4.6, 3.8, 4.2)}
                        fill="var(--zzz-color-badge-recommend, #FAD70C)"
                    />
                </g>
                <path
                    d={KNUCKLES}
                    stroke="#E08A00"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </span>
    )
}
