import {
    useCallback,
    useEffect,
    useRef,
    type ComponentPropsWithRef,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
    type Ref,
} from 'react'
import { cx, mergeRefs } from '../../utils'
import {
    ScrollHint,
    prefersReducedMotion,
    type ScrollHintDirection,
} from '../ScrollHint/ScrollHint'
import './ScrollArea.css'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'
export type ScrollAreaVariant = 'grid' | 'panel' | 'list'
type Axis = 'y' | 'x'

export interface ScrollAreaProps extends ComponentPropsWithRef<'div'> {
    /** Scroll axis. Default `vertical`. `both` draws a vertical and a horizontal bar. */
    orientation?: ScrollAreaOrientation
    /**
     * Side of the content the bar sits on. Vertical: `right` (default; Storage grids) or `left` (Overclock /
     * Manage / Equip). Horizontal: `bottom` (default) or `top`. With `both`, this is the vertical bar's side
     * and `horizontalSide` places the horizontal one.
     */
    side?: 'left' | 'right' | 'top' | 'bottom'
    /** Horizontal bar side when `orientation="both"`. Default `bottom`. */
    horizontalSide?: 'top' | 'bottom'
    /** Gap between the bar and the content in design units. Default 34 (right) / 14 (left, top, bottom). */
    gap?: number
    /**
     * Surface style:
     * - `grid` (default): the drawn scrollbar (for grids and long lists);
     * - `panel`: no bar (detail panels), a 12 px fade at the edge with more content, and `hint` shows the 32 × 15 ▼;
     * - `list`: no bar, hard clip (sidebars); `hint` shows the 25 × 12.5 ▼ (or a › chevron when horizontal).
     */
    variant?: ScrollAreaVariant
    /**
     * Keep the bar when the content fits (thumb fills the run). Default `true`: grid bars show even when
     * nothing overflows. `false` hides the bar until the content overflows.
     */
    alwaysShow?: boolean
    /**
     * Overflow affordance: `true` renders an auto `ScrollHint` at the viewport's end (down, or right when
     * horizontal) that shows while more content remains; or pass your own node.
     */
    hint?: boolean | ReactNode
    /**
     * Accessible name of the scroll region (the focusable viewport gets `role="region"`). Native `aria-label` /
     * `aria-labelledby` are routed to the viewport too (never the role-less root); `label` wins over `aria-label`.
     */
    label?: string
    /** Ref to the native scrolling element. */
    viewportRef?: Ref<HTMLDivElement>
    /** Extra class on the viewport. */
    viewportClassName?: string
    /** Viewport tabIndex. Default 0 (focusable for keyboard scrolling); -1 when its content has its own tab stops. */
    viewportTabIndex?: number
    /** Scroll distance of an arrow-cap click, in CSS px. Default: 25 % of the viewport (min 40). */
    step?: number
    /** Minimum thumb length in design units. Default 20. */
    minThumb?: number
}

/** Distance of the thumb run from the track's outer ends: arrow inset 8 + arrow 8 + gap 7. */
export const SCROLL_RUN_INSET = 23
/** Track width (size.scrollbar.track). */
const TRACK = 20
/** Hold-to-repeat timing for the arrow caps (OS-like defaults). Repeats step at most 40 px. */
export const SCROLL_REPEAT_DELAY = 400
export const SCROLL_REPEAT_INTERVAL = 60

export interface ThumbMetrics {
    /** visible fraction, 0..1 */
    size: number
    /** scroll progress, 0..1 */
    progress: number
    /** thumb length in px (only when `run` is given) */
    length: number
    /** thumb offset from the run start in px (only when `run` is given) */
    offset: number
    overflow: boolean
}

/**
 * Thumb math: length = visible fraction of the run (at least `min`), offset = progress × the free run.
 * Without a minimum this equals `run × scrollPos / scrollSize` (the thumb maps the content 1:1).
 */
export function thumbMetrics(
    client: number,
    scroll: number,
    pos: number,
    run = 0,
    min = 0
): ThumbMetrics {
    const size = scroll > 0 ? Math.min(1, client / scroll) : 1
    const max = Math.max(0, scroll - client)
    const progress = max > 0 ? Math.min(1, Math.max(0, pos / max)) : 0
    const length = run > 0 ? Math.min(run, Math.max(min, run * size)) : 0
    return {
        size,
        progress,
        length,
        offset: (run - length) * progress,
        overflow: size < 1,
    }
}

function scrollDims(v: HTMLElement, axis: Axis) {
    return axis === 'y'
        ? { client: v.clientHeight, scroll: v.scrollHeight, pos: v.scrollTop }
        : { client: v.clientWidth, scroll: v.scrollWidth, pos: v.scrollLeft }
}

/**
 * Arrow-cap outline in its 9 x 8 box (design units): a bullet shape, not a plain triangle. The tip widens to the full ~7.2 px within ~4.7 rows,
 * then vertical sides run ~2.8 rows down to the flat base.
 */
export const SCROLL_CAP_UP_PATH = 'M4.5 0.3L8.1 5L8.1 7.8L0.9 7.8L0.9 5Z'
/** The up cap, mirrored vertically. */
export const SCROLL_CAP_DOWN_PATH = 'M0.9 0.2L8.1 0.2L8.1 3L4.5 7.7L0.9 3Z'

/* Drawn locally rather than with src/icons ScrollArrowUp/DownIcon, whose plain triangle does not match the
 * bullet-shaped cap. */
function ScrollCap({ dir }: { dir: 'up' | 'down' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 8"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            className={`zzz-scroll-area__arrow zzz-scroll-area__arrow--${dir}`}
        >
            <path
                d={dir === 'up' ? SCROLL_CAP_UP_PATH : SCROLL_CAP_DOWN_PATH}
            />
        </svg>
    )
}

function Bar({
    axis,
    barRef,
    handlers,
}: {
    axis: Axis
    barRef: Ref<HTMLDivElement>
    handlers: BarHandlers
}) {
    return (
        <div
            ref={barRef}
            className={cx(
                'zzz-scroll-area__bar',
                axis === 'x' && 'zzz-scroll-area__bar--horizontal'
            )}
            aria-hidden="true"
            data-axis={axis === 'x' ? 'x' : undefined}
            {...handlers}
        >
            <ScrollCap dir="up" />
            <span className="zzz-scroll-area__thumb" />
            <ScrollCap dir="down" />
        </div>
    )
}

interface BarHandlers {
    onPointerDown(e: ReactPointerEvent<HTMLDivElement>): void
    onPointerMove(e: ReactPointerEvent<HTMLDivElement>): void
    onPointerUp(e: ReactPointerEvent<HTMLDivElement>): void
    onPointerCancel(e: ReactPointerEvent<HTMLDivElement>): void
    onLostPointerCapture(e: ReactPointerEvent<HTMLDivElement>): void
}

/**
 * The kit scrollbar: a 20 px capsule track (`#030303`, 2 px `#2A2A2A` outline) with
 * 9 × 8 arrow caps and a 4 px square-ended `#808080` thumb whose length is the visible fraction (it fills the
 * run when the content fits). It wraps NATIVE scrolling: the viewport keeps wheel, touch and keyboard
 * scrolling (it is focusable, `tabIndex=0`); the drawn bar is `aria-hidden` and synced to it. Arrow caps
 * step (hold to repeat), the track pages, the thumb drags (pointer capture). Vertical, horizontal or both;
 * `panel` / `list` variants draw no bar and use a `ScrollHint` instead.
 */
export function ScrollArea({
    orientation = 'vertical',
    side,
    horizontalSide,
    gap,
    variant = 'grid',
    alwaysShow = true,
    hint,
    label,
    viewportRef,
    viewportClassName,
    step,
    minThumb = 20,
    viewportTabIndex = 0,
    onScroll,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
    children,
    ...rest
}: ScrollAreaProps) {
    const viewport = useRef<HTMLDivElement | null>(null)
    const root = useRef<HTMLDivElement | null>(null)
    const barY = useRef<HTMLDivElement | null>(null)
    const barX = useRef<HTMLDivElement | null>(null)
    const drag = useRef<{
        axis: Axis
        start: number
        pos: number
        id: number
    } | null>(null)
    const repeat = useRef<{
        t?: ReturnType<typeof setTimeout>
        i?: ReturnType<typeof setInterval>
    }>({})

    const hasY = orientation !== 'horizontal'
    const hasX = orientation !== 'vertical'
    const vSide: 'left' | 'right' =
        orientation === 'horizontal'
            ? 'right'
            : side === 'left'
              ? 'left'
              : 'right'
    const hSide: 'top' | 'bottom' =
        orientation === 'horizontal'
            ? side === 'top'
                ? 'top'
                : 'bottom'
            : horizontalSide === 'top'
              ? 'top'
              : 'bottom'
    const drawn = variant === 'grid'

    const sync = useCallback(() => {
        const v = viewport.current
        const r = root.current
        if (!v || !r) return
        for (const [axis, b] of [
            ['y', barY.current],
            ['x', barX.current],
        ] as const) {
            const d = scrollDims(v, axis)
            const m = thumbMetrics(d.client, d.scroll, d.pos)
            if (b) {
                b.style.setProperty('--zzz-thumb-size', String(m.size))
                b.style.setProperty('--zzz-thumb-progress', String(m.progress))
                b.toggleAttribute('data-overflow', m.overflow)
            }
            const before = d.pos > 1
            const after = d.scroll - d.client - d.pos > 1
            r.toggleAttribute(
                axis === 'y' ? 'data-more-up' : 'data-more-left',
                before
            )
            r.toggleAttribute(
                axis === 'y' ? 'data-more-down' : 'data-more-right',
                after
            )
        }
    }, [])

    useEffect(() => {
        const v = viewport.current
        if (!v) return
        sync()
        v.addEventListener('scroll', sync, { passive: true })
        let ro: ResizeObserver | undefined
        let mo: MutationObserver | undefined
        const observeChildren = () => {
            if (ro)
                for (const child of Array.from(v.children)) ro.observe(child)
        }
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(sync)
            ro.observe(v)
            observeChildren()
        }
        if (typeof MutationObserver !== 'undefined') {
            mo = new MutationObserver(() => {
                observeChildren()
                sync()
            })
            mo.observe(v, { childList: true, subtree: true })
        }
        return () => {
            v.removeEventListener('scroll', sync)
            ro?.disconnect()
            mo?.disconnect()
        }
    }, [sync, orientation, variant])

    const stopRepeat = useCallback(() => {
        clearTimeout(repeat.current.t)
        clearInterval(repeat.current.i)
        repeat.current = {}
    }, [])
    useEffect(() => stopRepeat, [stopRepeat])

    const scrollBy = (axis: Axis, d: number, smooth: boolean) => {
        const v = viewport.current
        if (!v) return
        const behavior: ScrollBehavior =
            smooth && !prefersReducedMotion(v) ? 'smooth' : 'auto'
        if (typeof v.scrollBy === 'function')
            v.scrollBy(
                axis === 'y' ? { top: d, behavior } : { left: d, behavior }
            )
        else if (axis === 'y') v.scrollTop += d
        else v.scrollLeft += d
    }
    const stepSize = (axis: Axis) => {
        const v = viewport.current
        const client = v ? (axis === 'y' ? v.clientHeight : v.clientWidth) : 0
        return step ?? Math.max(40, (client || 160) * 0.25)
    }

    /** Content px per thumb px: the scrollable distance mapped onto the free run. */
    const ratio = (axis: Axis, bar: HTMLElement) => {
        const v = viewport.current
        if (!v) return 1
        const box = bar.getBoundingClientRect()
        const cross = axis === 'y' ? box.width : box.height
        const along = axis === 'y' ? box.height : box.width
        const unit = cross > 0 ? cross / TRACK : 1
        const run = along - 2 * SCROLL_RUN_INSET * unit
        const d = scrollDims(v, axis)
        const thumb = bar
            .querySelector('.zzz-scroll-area__thumb')
            ?.getBoundingClientRect()
        const thumbLen = thumb ? (axis === 'y' ? thumb.height : thumb.width) : 0
        const len =
            thumbLen > 0
                ? thumbLen
                : thumbMetrics(d.client, d.scroll, d.pos, run, minThumb * unit)
                      .length
        const free = run - len
        if (free > 0) return (d.scroll - d.client) / free
        return run > 0 ? d.scroll / run : 1
    }

    const up = (e: ReactPointerEvent<HTMLDivElement>) => {
        stopRepeat()
        if (drag.current?.id === e.pointerId) {
            drag.current = null
            e.currentTarget.removeAttribute('data-dragging')
        }
    }

    const handlers = (axis: Axis): BarHandlers => ({
        onPointerDown(e) {
            if (e.button !== 0) return
            const target = e.target as Element
            const v = viewport.current
            if (!v) return
            const cap = target.closest('.zzz-scroll-area__arrow--up')
                ? -1
                : target.closest('.zzz-scroll-area__arrow--down')
                  ? 1
                  : 0
            if (cap) {
                e.preventDefault()
                stopRepeat()
                scrollBy(axis, cap * stepSize(axis), true)
                e.currentTarget.setPointerCapture?.(e.pointerId)
                repeat.current.t = setTimeout(() => {
                    repeat.current.i = setInterval(
                        () =>
                            scrollBy(
                                axis,
                                cap * Math.min(40, stepSize(axis)),
                                false
                            ),
                        SCROLL_REPEAT_INTERVAL
                    )
                }, SCROLL_REPEAT_DELAY)
                return
            }
            const client = axis === 'y' ? e.clientY : e.clientX
            if (target.closest('.zzz-scroll-area__thumb')) {
                e.preventDefault()
                drag.current = {
                    axis,
                    start: client,
                    pos: axis === 'y' ? v.scrollTop : v.scrollLeft,
                    id: e.pointerId,
                }
                e.currentTarget.setPointerCapture?.(e.pointerId)
                e.currentTarget.setAttribute('data-dragging', '')
                return
            }
            // track: page towards the pointer
            const thumb = e.currentTarget.querySelector(
                '.zzz-scroll-area__thumb'
            )
            const r = thumb?.getBoundingClientRect()
            if (!r) return
            const page = (axis === 'y' ? v.clientHeight : v.clientWidth) * 0.9
            const startEdge = axis === 'y' ? r.top : r.left
            scrollBy(axis, client < startEdge ? -page : page, true)
        },
        onPointerMove(e) {
            const d = drag.current
            const v = viewport.current
            if (!d || !v || d.id !== e.pointerId || d.axis !== axis) return
            const client = axis === 'y' ? e.clientY : e.clientX
            const next =
                d.pos + (client - d.start) * ratio(axis, e.currentTarget)
            if (axis === 'y') v.scrollTop = next
            else v.scrollLeft = next
        },
        onPointerUp: up,
        onPointerCancel: up,
        onLostPointerCapture: up,
    })

    const vars = {
        '--zzz-scroll-gap':
            gap ??
            (orientation === 'horizontal' ? 14 : vSide === 'left' ? 14 : 34),
        '--zzz-scroll-min-thumb': minThumb,
        ...style,
    } as CSSProperties

    const hintDir: ScrollHintDirection =
        orientation === 'horizontal' ? 'right' : 'down'
    const hintNode =
        hint === true ? (
            <ScrollHint
                target={viewport}
                direction={hintDir}
                size={variant === 'list' ? 'list' : 'panel'}
            />
        ) : hint === false || hint == null ? null : (
            hint
        )

    const orientationClasses =
        orientation === 'vertical'
            ? [`zzz-scroll-area--${vSide}`]
            : orientation === 'horizontal'
              ? ['zzz-scroll-area--horizontal', `zzz-scroll-area--${hSide}`]
              : [
                    'zzz-scroll-area--both',
                    `zzz-scroll-area--${vSide}`,
                    `zzz-scroll-area--h-${hSide}`,
                ]

    return (
        <div
            {...rest}
            ref={mergeRefs(root, rest.ref)}
            className={cx(
                'zzz-scroll-area',
                ...orientationClasses,
                variant !== 'grid' && `zzz-scroll-area--${variant}`,
                !alwaysShow && 'zzz-scroll-area--auto-hide',
                hintNode != null && 'zzz-scroll-area--with-hint',
                className
            )}
            style={vars}
        >
            <div
                ref={mergeRefs(viewport, viewportRef)}
                className={cx('zzz-scroll-area__viewport', viewportClassName)}
                tabIndex={viewportTabIndex}
                role={
                    label || ariaLabel || ariaLabelledBy ? 'region' : undefined
                }
                aria-label={label || ariaLabel}
                aria-labelledby={ariaLabelledBy}
                onScroll={onScroll}
            >
                {children}
            </div>
            {drawn && hasY && (
                <Bar axis="y" barRef={barY} handlers={handlers('y')} />
            )}
            {drawn && hasX && (
                <Bar axis="x" barRef={barX} handlers={handlers('x')} />
            )}
            {drawn && hasX && hasY && (
                <span className="zzz-scroll-area__corner" aria-hidden="true" />
            )}
            {hintNode}
        </div>
    )
}
