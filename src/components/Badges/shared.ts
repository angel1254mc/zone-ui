import type { CSSProperties } from 'react'

/** Where a badge sits on its host. The host must be `position: relative` for the corner placements. */
export type BadgePlacement = 'top-left' | 'top-right' | 'inline'

/** `[x, y]` in design units: how far the badge overhangs past the host's corner (positive = outside). */
export type BadgeOffset = readonly [number, number]

/** Props shared by the display-only badges (`role="img"` + label, or decorative). */
export interface BadgeA11yProps {
    /** Accessible name. Every badge has a sensible default. */
    label?: string
    /** Hide from assistive tech when nearby text already says the same thing. */
    decorative?: boolean
}

/** ARIA attributes for a display-only badge. */
export function badgeA11y(label: string, decorative?: boolean) {
    return decorative
        ? ({ 'aria-hidden': true } as const)
        : ({ role: 'img', 'aria-label': label } as const)
}

/** Placement class + offset custom properties (unitless design units, scaled in CSS). */
export function placementProps(
    placement: BadgePlacement,
    offset: BadgeOffset | undefined,
    style: CSSProperties | undefined
): { className: string; style: CSSProperties | undefined } {
    const vars: Record<string, string> = {}
    if (offset && placement !== 'inline') {
        vars['--zzz-badge-dx'] = String(offset[0])
        vars['--zzz-badge-dy'] = String(offset[1])
    }
    return {
        className: `zzz-badge--${placement}`,
        style: Object.keys(vars).length
            ? ({ ...vars, ...style } as CSSProperties)
            : style,
    }
}
