import {
    useEffect,
    useState,
    type ComponentPropsWithRef,
    type MouseEvent as ReactMouseEvent,
    type Ref,
    type RefObject,
} from 'react'
import { cx } from '../../utils'
import './ScrollHint.css'

export type ScrollHintDirection = 'down' | 'up' | 'right' | 'left'
export type ScrollHintGlyph = 'triangle' | 'chevron'
export type ScrollHintSize = 'panel' | 'list'

type HintElementProps = Omit<
    ComponentPropsWithRef<'span'>,
    'onClick' | 'ref' | 'children'
>

export interface ScrollHintProps extends HintElementProps {
    /** Which way more content lies. Default `down`. */
    direction?: ScrollHintDirection
    /**
     * Glyph. `triangle` = the solid white ▼ over a panel / list bottom edge;
     * `chevron` = the heavy white › that ends a horizontal row. Default: triangle for up/down,
     * chevron for left/right.
     */
    glyph?: ScrollHintGlyph
    /** Triangle size: `panel` 32 × 15 (detail panels) or `list` 25 × 12.5 (lists). Default `panel`. */
    size?: ScrollHintSize
    /** Force visibility. When omitted and `target` is given, the hint shows while more content remains that way. */
    visible?: boolean
    /**
     * Scroll container to watch (auto mode): a ref object or the element itself (e.g. from a state
     * callback ref). The ref is re-read after every render, so a container that mounts after the hint,
     * or is swapped for another node, is picked up; `null` means auto mode with nothing to watch (hidden).
     */
    target?: RefObject<HTMLElement | null> | HTMLElement | null
    /** Remaining distance (CSS px) below which the direction counts as fully scrolled. Default 1. */
    threshold?: number
    /**
     * Makes the hint a `<button>`. Called on click; unless the handler calls `preventDefault()`, the hint
     * then scrolls `target` a page (90 %) further in its direction.
     */
    onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void
    /** Render as a button even without `onClick` (clicking scrolls `target`). */
    interactive?: boolean
    /** Accessible name of the interactive hint. Default "Scroll down" / "Scroll right" / … */
    label?: string
    /**
     * `end` (default): absolutely positioned on the edge of the nearest positioned ancestor that the
     * direction points at (bottom-centre for down, right-middle for right). `static`: inline in the flow.
     */
    placement?: 'end' | 'static'
    ref?: Ref<HTMLElement>
}

/** How far the element can still scroll in `direction` (CSS px). */
export function remainingScroll(
    el: HTMLElement,
    direction: ScrollHintDirection
): number {
    switch (direction) {
        case 'down':
            return el.scrollHeight - el.clientHeight - el.scrollTop
        case 'up':
            return el.scrollTop
        case 'right':
            return el.scrollWidth - el.clientWidth - el.scrollLeft
        case 'left':
            return el.scrollLeft
    }
}

/** Whether the reduced-motion preference applies to `el` (media query or a `[data-reduced-motion]` ancestor). */
export function prefersReducedMotion(el?: Element | null): boolean {
    if (el?.closest?.('[data-reduced-motion]')) return true
    if (
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
    )
        return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type ScrollTarget = ScrollHintProps['target']

function resolveTarget(target: ScrollTarget): HTMLElement | null {
    if (!target) return null
    return 'current' in target ? target.current : target
}

/**
 * Subscribe to scroll + size changes of `target` and report whether content remains in `direction`.
 * The watched element lives in state, re-synced from the ref after every render, so a late-mounting or
 * swapped container (re)subscribes instead of leaving the hint stuck on the first (or a stale) node.
 * A passive effect (not a layout effect): it runs after the whole commit, so refs of containers rendered
 * after the hint in tree order are already attached.
 */
function useRemaining(
    target: ScrollTarget,
    direction: ScrollHintDirection,
    threshold: number
) {
    const [more, setMore] = useState(false)
    const [el, setEl] = useState<HTMLElement | null>(null)
    useEffect(() => {
        const next = resolveTarget(target)
        setEl((prev) => (prev === next ? prev : next))
    })
    useEffect(() => {
        if (!el) {
            setMore(false)
            return
        }
        const update = () => setMore(remainingScroll(el, direction) > threshold)
        update()
        el.addEventListener('scroll', update, { passive: true })
        let ro: ResizeObserver | undefined
        let mo: MutationObserver | undefined
        const observeChildren = () => {
            if (ro)
                for (const child of Array.from(el.children)) ro.observe(child)
        }
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(update)
            ro.observe(el)
            observeChildren()
        }
        if (typeof MutationObserver !== 'undefined') {
            mo = new MutationObserver(() => {
                observeChildren()
                update()
            })
            mo.observe(el, { childList: true, subtree: true })
        }
        return () => {
            el.removeEventListener('scroll', update)
            ro?.disconnect()
            mo?.disconnect()
        }
    }, [el, direction, threshold])
    return more
}

const LABELS: Record<ScrollHintDirection, string> = {
    down: 'Scroll down',
    up: 'Scroll up',
    right: 'Scroll right',
    left: 'Scroll left',
}

/*
 * Glyphs, drawn pointing down (triangle) / right (chevron) and rotated by CSS for the other
 * directions:
 * - panel triangle 32 × 15: ~1.5 px rounded top corners, blunt tip;
 * - list triangle 25 × 12.5;
 * - both triangles keep their full width for the top ~3 rows, then narrow ~2.5 px per row to a blunt tip;
 * - chevron 19 × 32: arms ~12.4 px thick horizontally,
 *   square-cut ends with a vertical left edge for ~3 px, tip at mid-height.
 */
function TriangleGlyph({ size }: { size: ScrollHintSize }) {
    return size === 'list' ? (
        <svg
            className="zzz-scroll-hint__glyph"
            viewBox="0 0 25 12.5"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M0.6 0H24.4Q25 0 24.9 0.7L24.6 2.1L13.4 12.1Q12.5 12.8 11.6 12.1L0.4 2.1L0.1 0.7Q0 0 0.6 0Z" />
        </svg>
    ) : (
        <svg
            className="zzz-scroll-hint__glyph"
            viewBox="0 0 32 15"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M0.7 0H31.3Q32 0 31.9 0.8L31.6 2.8L17.1 14.6Q16 15.4 14.9 14.6L0.4 2.8L0.1 0.8Q0 0 0.7 0Z" />
        </svg>
    )
}

function ChevronGlyph() {
    return (
        <svg
            className="zzz-scroll-hint__glyph"
            viewBox="0 0 19 32"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M0.6 0.5H11.1Q11.6 0.5 11.8 0.9L18.6 15.4Q18.9 16 18.6 16.6L11.8 31.1Q11.6 31.5 11.1 31.5H0.6Q0.2 31.5 0.2 31.1V28.7L6.9 16L0.2 3.3V0.9Q0.2 0.5 0.6 0.5Z" />
        </svg>
    )
}

/**
 * Overflow affordance: the white ▼ that overlaps a detail panel's bottom edge, the smaller
 * ▼ over a list's clipped last row, and the heavy › that ends a horizontal row (e.g. RewardPreview).
 * Decorative (`aria-hidden`) unless `onClick` / `interactive`, then a `<button>` "Scroll down/right".
 * Pass `target` (a scroll container ref) and it shows only while more content remains that way.
 */
export function ScrollHint({
    direction = 'down',
    glyph,
    size = 'panel',
    visible,
    target,
    threshold = 1,
    onClick,
    interactive,
    label,
    placement = 'end',
    className,
    ref,
    ...rest
}: ScrollHintProps) {
    const more = useRemaining(
        visible === undefined ? target : undefined,
        direction,
        threshold
    )
    const shown = visible ?? (target !== undefined ? more : true)
    const kind =
        glyph ??
        (direction === 'down' || direction === 'up' ? 'triangle' : 'chevron')
    const classes = cx(
        'zzz-scroll-hint',
        `zzz-scroll-hint--${direction}`,
        `zzz-scroll-hint--${kind}`,
        kind === 'triangle' && `zzz-scroll-hint--${size}`,
        placement === 'end' && 'zzz-scroll-hint--end',
        className
    )
    const content =
        kind === 'triangle' ? <TriangleGlyph size={size} /> : <ChevronGlyph />

    if (onClick || interactive) {
        const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
            onClick?.(e)
            if (e.defaultPrevented) return
            const el = resolveTarget(target)
            if (!el) return
            const vertical = direction === 'down' || direction === 'up'
            const sign = direction === 'down' || direction === 'right' ? 1 : -1
            const dist =
                sign * 0.9 * (vertical ? el.clientHeight : el.clientWidth)
            const behavior: ScrollBehavior = prefersReducedMotion(el)
                ? 'auto'
                : 'smooth'
            if (typeof el.scrollBy === 'function')
                el.scrollBy(
                    vertical
                        ? { top: dist, behavior }
                        : { left: dist, behavior }
                )
            else if (vertical) el.scrollTop += dist
            else el.scrollLeft += dist
        }
        return (
            <button
                {...(rest as ComponentPropsWithRef<'button'>)}
                ref={ref as Ref<HTMLButtonElement>}
                type="button"
                className={cx(classes, 'zzz-scroll-hint--interactive')}
                aria-label={label ?? LABELS[direction]}
                data-visible={shown}
                tabIndex={shown ? undefined : -1}
                onClick={handleClick}
            >
                {content}
            </button>
        )
    }

    return (
        <span
            {...rest}
            ref={ref as Ref<HTMLSpanElement>}
            className={classes}
            aria-hidden="true"
            data-visible={shown}
        >
            {content}
        </span>
    )
}
