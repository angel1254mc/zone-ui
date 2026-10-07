import type { ComponentProps, FC } from 'react'

/**
 * Props shared by every icon component.
 *
 * - `size`: the icon's height (width follows the viewBox aspect ratio, 1:1 for
 *   all but the wide Home-dock glyphs). A number is **design units** and is emitted as
 *   `calc(<n> * var(--zzz-px, 1px))`, so it follows the `--zzz-scale` system;
 *   a string is any CSS length (`'1em'`, `'2rem'`, `calc(...)`). Default `'1em'`
 *   (set as width/height attributes, so plain CSS on the `<svg>` can override it).
 * - `title`: gives the icon an accessible name (`role="img"` + `<title>`);
 *   without it the icon is decorative (`aria-hidden="true"`).
 * - Everything else is forwarded to the `<svg>` (React 19: `ref` included).
 */
export interface IconProps extends Omit<ComponentProps<'svg'>, 'children'> {
    size?: number | string
    title?: string
}

/**
 * An icon component (`BackIcon`, `HomeIcon`, …). `viewBoxWidth` is the glyph grid
 * width (32 for square icons; wider for the wide Home-dock glyphs — the grid is always 32 tall).
 */
export type IconComponent = FC<IconProps> & {
    displayName: string
    iconName: string
    viewBoxWidth: number
}

export type { IconName } from './registry'
