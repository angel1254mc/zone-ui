import { useCallback, useLayoutEffect, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import './floating.css'

/*
 * Tiny positioning kit for the floating overlays (Tooltip, DropdownMenu, Modal, Toast).
 * No external library: the floating element is portalled to `<body>` (so `overflow: hidden`
 * ancestors — Table, Panel — never clip it), laid out with `position: fixed`, and placed from
 * getBoundingClientRect() with a simple collision flip + cross-axis clamp.
 *
 * Because the portal leaves the host's `.zzz-theme` wrapper, ThemePortal re-creates the theme
 * context on its root: class `zzz-theme`, the host's resolved `--zzz-px` (a registered `<length>`,
 * so getComputedStyle returns e.g. "2px"), and the nearest pinned accent phase / reduced-motion
 * flag. Without this a portal inside a `--zzz-scale: 2` Stage would render at scale 1.
 */

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export interface ThemeVars {
    px?: string
    accentPhase?: string
    reducedMotion?: boolean
}

/** The theme context a portalled overlay must carry over from its host element. */
export function readThemeVars(host: Element | null | undefined): ThemeVars {
    if (!host || typeof window === 'undefined') return {}
    const px = window.getComputedStyle(host).getPropertyValue('--zzz-px').trim()
    const phaseEl = host.closest('[data-accent-phase]')
    const reduced = host.closest('[data-reduced-motion]') != null
    return {
        px: px && px !== '1px' ? px : undefined,
        accentPhase: phaseEl?.getAttribute('data-accent-phase') ?? undefined,
        reducedMotion: reduced || undefined,
    }
}

/** One design unit (`--zzz-px`) in CSS px at the host (1 when unknown, e.g. jsdom). */
export function readDesignPx(host: Element | null | undefined): number {
    if (!host || typeof window === 'undefined') return 1
    const v = parseFloat(
        window.getComputedStyle(host).getPropertyValue('--zzz-px')
    )
    return Number.isFinite(v) && v > 0 ? v : 1
}

export interface ThemePortalProps {
    /** Element whose theme (scale, pinned accent phase) the portal inherits. */
    host: Element | null | undefined
    children: ReactNode
    className?: string
}

/** Portal to `<body>` wrapped in a `.zzz-theme` that carries the host's scale and accent phase. */
export function ThemePortal({ host, children, className }: ThemePortalProps) {
    const [vars, setVars] = useState<ThemeVars>({})
    useLayoutEffect(() => {
        const next = readThemeVars(host)
        setVars((prev) =>
            prev.px === next.px &&
            prev.accentPhase === next.accentPhase &&
            prev.reducedMotion === next.reducedMotion
                ? prev
                : next
        )
    }, [host])
    if (typeof document === 'undefined') return null
    const style = vars.px
        ? ({ '--zzz-px': vars.px } as CSSProperties)
        : undefined
    return createPortal(
        <div
            className={
                className
                    ? `zzz-theme zzz-portal ${className}`
                    : 'zzz-theme zzz-portal'
            }
            style={style}
            data-accent-phase={vars.accentPhase}
            data-reduced-motion={vars.reducedMotion ? '' : undefined}
        >
            {children}
        </div>,
        document.body
    )
}

export interface Rect {
    top: number
    left: number
    width: number
    height: number
}

export interface PositionResult {
    x: number
    y: number
    side: Side
    /** Arrow centre along the floating element's edge, in CSS px from its start. */
    arrow: number
}

const OPPOSITE: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
}

/**
 * Pure placement maths (unit-tested). Places `floating` on `side` of `anchor` with `gap`,
 * flips to the opposite side when it does not fit but the opposite does, then clamps the
 * cross axis into the viewport with `margin`.
 */
export function computePosition(
    anchor: Rect,
    floating: { width: number; height: number },
    side: Side,
    align: Align,
    gap: number,
    viewport: { width: number; height: number },
    margin = 8
): PositionResult {
    const fits = (s: Side) => {
        switch (s) {
            case 'top':
                return anchor.top - gap - floating.height >= margin
            case 'bottom':
                return (
                    anchor.top + anchor.height + gap + floating.height <=
                    viewport.height - margin
                )
            case 'left':
                return anchor.left - gap - floating.width >= margin
            case 'right':
                return (
                    anchor.left + anchor.width + gap + floating.width <=
                    viewport.width - margin
                )
        }
    }
    let finalSide = side
    if (!fits(side) && fits(OPPOSITE[side])) finalSide = OPPOSITE[side]

    let x: number
    let y: number
    const vertical = finalSide === 'top' || finalSide === 'bottom'
    if (vertical) {
        y =
            finalSide === 'top'
                ? anchor.top - gap - floating.height
                : anchor.top + anchor.height + gap
        x =
            align === 'start'
                ? anchor.left
                : align === 'end'
                  ? anchor.left + anchor.width - floating.width
                  : anchor.left + anchor.width / 2 - floating.width / 2
        const maxX = viewport.width - margin - floating.width
        x = Math.max(margin, Math.min(x, maxX))
    } else {
        x =
            finalSide === 'left'
                ? anchor.left - gap - floating.width
                : anchor.left + anchor.width + gap
        y =
            align === 'start'
                ? anchor.top
                : align === 'end'
                  ? anchor.top + anchor.height - floating.height
                  : anchor.top + anchor.height / 2 - floating.height / 2
        const maxY = viewport.height - margin - floating.height
        y = Math.max(margin, Math.min(y, maxY))
    }
    const arrow = vertical
        ? Math.max(
              0,
              Math.min(floating.width, anchor.left + anchor.width / 2 - x)
          )
        : Math.max(
              0,
              Math.min(floating.height, anchor.top + anchor.height / 2 - y)
          )
    return { x, y, side: finalSide, arrow }
}

export interface FloatingOptions {
    side: Side
    align?: Align
    /** Gap between anchor and floating element, in design units. */
    gap: number
}

export interface FloatingState {
    style: CSSProperties
    side: Side
    arrow: number
}

/**
 * Keeps a `position: fixed` element placed next to its anchor while `open`
 * (updated on scroll / resize). Returns the inline style and the resolved side.
 */
export function useFloatingPosition(
    open: boolean,
    anchorRef: RefObject<HTMLElement | null>,
    floatingRef: RefObject<HTMLElement | null>,
    { side, align = 'center', gap }: FloatingOptions
): FloatingState {
    const [state, setState] = useState<FloatingState>({
        style: { position: 'fixed', top: 0, left: 0 },
        side,
        arrow: 0,
    })

    const update = useCallback(() => {
        const anchor = anchorRef.current
        const floating = floatingRef.current
        if (!anchor || !floating) return
        const a = anchor.getBoundingClientRect()
        // offset* ignore transforms (the menu's scaleY entrance), unlike getBoundingClientRect.
        const f = { width: floating.offsetWidth, height: floating.offsetHeight }
        const r = computePosition(
            { top: a.top, left: a.left, width: a.width, height: a.height },
            { width: f.width, height: f.height },
            side,
            align,
            gap * readDesignPx(anchor),
            { width: window.innerWidth, height: window.innerHeight }
        )
        setState((prev) =>
            prev.side === r.side &&
            prev.arrow === r.arrow &&
            prev.style.top === r.y &&
            prev.style.left === r.x
                ? prev
                : {
                      style: { position: 'fixed', top: r.y, left: r.x },
                      side: r.side,
                      arrow: r.arrow,
                  }
        )
    }, [anchorRef, floatingRef, side, align, gap])

    useLayoutEffect(() => {
        if (!open) return
        update()
        // A second pass after fonts / portal theme vars settle the floating element's size.
        const raf = requestAnimationFrame(update)
        window.addEventListener('resize', update)
        window.addEventListener('scroll', update, true)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', update)
            window.removeEventListener('scroll', update, true)
        }
    }, [open, update])

    return state
}

/** Focusable descendants in DOM order (used by Modal's focus trap and the menu). */
export function getFocusable(root: HTMLElement): HTMLElement[] {
    const sel =
        'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [contenteditable="true"], [tabindex]:not([tabindex="-1"])'
    return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
        (el) =>
            !el.hasAttribute('hidden') &&
            el.getAttribute('aria-hidden') !== 'true' &&
            !el.closest('[hidden]')
    )
}
