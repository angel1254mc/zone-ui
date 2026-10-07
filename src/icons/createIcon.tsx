import { useId, type ReactNode } from 'react'
import { cx } from '../utils'
import type { IconComponent, IconProps } from './types'

/** Render callback for glyphs that need document-unique ids (gradients, masks). */
export type IconRender = (uid: string) => ReactNode

/** Turn a number (design units) or CSS length into a CSS size. */
export function iconSize(size: number | string): string {
    return typeof size === 'number'
        ? `calc(${size} * var(--zzz-px, 1px))`
        : size
}

export interface CreateIconOptions {
    /**
     * Width of the viewBox in grid units (default 32). The grid is always 32 units
     * tall; wide glyphs (e.g. the Home dock's Mail / Agents / Inter-Knot) widen it so
     * their footprint keeps its aspect ratio wherever the svg is sized by height.
     */
    viewBoxWidth?: number
}

/**
 * Build an icon component. Glyphs are drawn on a `0 0 32 32` grid (or
 * `0 0 <viewBoxWidth> 32` for wide glyphs) and filled with `currentColor`
 * unless the glyph sets its own palette. `size` is the icon's HEIGHT; the width
 * follows the viewBox aspect ratio.
 *
 * @param displayName  exported component name, e.g. `BackIcon`
 * @param iconName     registry key, e.g. `back` (also the BEM modifier)
 * @param glyph        the SVG children, or a callback receiving a unique id prefix
 * @param options      `viewBoxWidth` for non-square glyphs
 */
export function createIcon(
    displayName: string,
    iconName: string,
    glyph: ReactNode | IconRender,
    options: CreateIconOptions = {}
): IconComponent {
    const vbw = options.viewBoxWidth ?? 32
    const aspect = vbw / 32
    const square = vbw === 32
    function Icon({ size, title, className, style, ...rest }: IconProps) {
        const reactId = useId()
        const uid = `zzz-i${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`
        const hasTitle = title != null && title !== ''
        const named =
            hasTitle ||
            rest['aria-label'] != null ||
            rest['aria-labelledby'] != null
        const titleId = `${uid}-title`
        const dim = size == null ? undefined : iconSize(size)
        const width =
            dim == null || square
                ? dim
                : typeof size === 'number'
                  ? iconSize(size * aspect)
                  : `calc(${dim} * ${aspect})`

        const a11y = named
            ? {
                  role: 'img',
                  ...(hasTitle && rest['aria-labelledby'] == null
                      ? { 'aria-labelledby': titleId }
                      : null),
              }
            : { 'aria-hidden': true as const, focusable: 'false' as const }

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${vbw} 32`}
                width={dim ? undefined : square ? '1em' : `${aspect}em`}
                height={dim ? undefined : '1em'}
                fill="currentColor"
                className={cx('zzz-icon', `zzz-icon--${iconName}`, className)}
                style={dim ? { width, height: dim, ...style } : style}
                {...a11y}
                {...rest}
            >
                {hasTitle ? <title id={titleId}>{title}</title> : null}
                {typeof glyph === 'function' ? glyph(uid) : glyph}
            </svg>
        )
    }
    Icon.displayName = displayName
    Icon.iconName = iconName
    Icon.viewBoxWidth = vbw
    return Icon as IconComponent
}
