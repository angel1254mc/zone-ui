import type { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react'
import { cx } from '../../utils'

export type AccentPhase = 'live' | 'lime' | 'mid' | 'yellow'

/**
 * The library's default `--zzz-scale` (tokens.css): 1 design unit = 0.7 CSS px at the browser's
 * default 16 px font size, i.e. ~40 px md controls and ~14 px body text, like other web design
 * systems.
 */
export const ZZZ_DEFAULT_SCALE = 0.7

/** `--zzz-px` for a numeric scale: rem-based, so sizes follow the user's font size and zoom. */
const REM_PX = 'calc(1rem / 16 * var(--zzz-scale))'

export interface ZzzThemeProps extends ComponentPropsWithoutRef<'div'> {
    /**
     * UI density. Omit it (the usual case) to inherit the surrounding scale: the page default is
     * `0.7` (`ZZZ_DEFAULT_SCALE`), set on `:root` by tokens.css, so an md control is ~40 px and body
     * text ~14 px at a 16 px root font size. Every length is rem-based (`--zzz-px` =
     * `calc(1rem / 16 * var(--zzz-scale))`), so it follows the browser font size and zoom, not the
     * screen resolution.
     * - a number sets `--zzz-scale` for the subtree: `0.5` compact, `0.7` web default, `1` game
     *   density (57 px pills, 20 px body).
     * - `'viewport'` sets `--zzz-px: calc(100vh / 1080)`, scaling with the window height like a
     *   game screen. Use it only for full-screen game-style scenes (title screens, menus that fill the
     *   window); ordinary pages should not size text by the viewport.
     */
    scale?: number | 'viewport'
    /**
     * Accent clock. Omit to share the page clock. `'lime' | 'mid' | 'yellow'` pin the accent
     * (visual regression, static mocks); `'live'` runs a clock of its own (e.g. inside a pinned
     * ancestor).
     */
    accentPhase?: AccentPhase
    /** Freeze the accent at lime regardless of the OS setting. */
    reducedMotion?: boolean
    ref?: Ref<HTMLDivElement>
}

/**
 * Theme root: a `<div class="zzz-theme">` that scopes the design tokens, the type baseline
 * and the accent clock, and can re-scale everything inside it. Without `scale` it keeps the
 * surrounding density (the 0.7 web default unless an ancestor changed it).
 */
export function ZzzTheme({
    scale,
    accentPhase,
    reducedMotion,
    className,
    style,
    ref,
    ...rest
}: ZzzThemeProps) {
    const scaleVars: Record<string, string> = {}
    if (typeof scale === 'number') {
        scaleVars['--zzz-scale'] = String(scale)
        scaleVars['--zzz-px'] = REM_PX
    } else if (scale === 'viewport') {
        scaleVars['--zzz-px'] = 'calc(100vh / 1080)'
    }

    return (
        <div
            ref={ref}
            className={cx('zzz-theme', className)}
            data-accent-phase={accentPhase}
            data-reduced-motion={reducedMotion ? '' : undefined}
            style={{ ...(scaleVars as CSSProperties), ...style }}
            {...rest}
        />
    )
}
