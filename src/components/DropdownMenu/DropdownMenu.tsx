import {
    cloneElement,
    isValidElement,
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import type {
    ComponentPropsWithRef,
    CSSProperties,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
    Ref,
} from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import { ThemePortal, useFloatingPosition } from '../Tooltip/floating'
import type { Align, Side } from '../Tooltip/floating'
import './DropdownMenu.css'

export interface DropdownMenuItem {
    /** Unique id, passed to `onSelect`. */
    id: string
    label: ReactNode
    /** Text used for typeahead when `label` is not a string. */
    textValue?: string
    /** Leading glyph (decorative). */
    icon?: ReactNode
    disabled?: boolean
    /** Called when this item is chosen (before the menu's `onSelect`). */
    onSelect?(): void
}

export type DropdownMenuPlacement =
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'top-start'
    | 'top'
    | 'top-end'

type TriggerProps = {
    ref?: Ref<HTMLElement>
    id?: string
    onClick?(e: MouseEvent<HTMLElement>): void
    onKeyDown?(e: KeyboardEvent<HTMLElement>): void
}

export interface DropdownMenuProps
    extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'onSelect'> {
    /** The menu button: ONE button element. It gets `aria-haspopup`, `aria-expanded`, `aria-controls`. */
    trigger: ReactElement
    items: DropdownMenuItem[]
    /** Called with the chosen item's id. */
    onSelect?(id: string): void
    /** Controlled open state. */
    open?: boolean
    /** Initial open state (uncontrolled). */
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    /** Default `bottom-start`; flips vertically when it does not fit. */
    placement?: DropdownMenuPlacement
    /** The 7.5 px accent bar across the top. Default true. */
    topBar?: boolean
    /** Panel min-width in design units. Default 260. */
    width?: number
}

const TYPEAHEAD_MS = 500

function itemText(item: DropdownMenuItem): string {
    if (item.textValue) return item.textValue
    return typeof item.label === 'string' || typeof item.label === 'number'
        ? String(item.label)
        : ''
}

/**
 * Dropdown menu. Panel #111 with a 3 px #323232 ring, radius 24, padding 4; items are 40-tall
 * full pills (padding 0 30) with a 4 px gap; the active item takes the live accent with a black
 * label; a 7.5 px accent bar runs across the top in the live accent.
 *
 * WAI-ARIA menu button: Enter / Space / ↓ open on the first item, ↑ on the last; ↑ ↓ Home End move
 * (disabled items are skipped); typing jumps to a matching item; Enter / Space choose; Escape
 * closes and returns focus to the trigger; Tab / Shift+Tab close and move on from the trigger
 * (to the next / previous tabbable after it); a click outside closes.
 * `className` / `style` / `ref` / other div props go to the menu panel (`role="menu"`).
 */
export function DropdownMenu({
    trigger,
    items,
    onSelect,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom-start',
    topBar = true,
    width,
    className,
    style,
    id,
    ref,
    'aria-label': ariaLabel,
    onKeyDown,
    ...rest
}: DropdownMenuProps) {
    const autoId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const menuId = id ?? `zzz-menu${autoId}`
    const [open, setOpen] = useControllableState(
        openProp,
        defaultOpen,
        onOpenChange
    )
    const [active, setActive] = useState(-1)
    const triggerRef = useRef<HTMLElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const pendingFocus = useRef<'first' | 'last' | null>(null)
    const typeahead = useRef({ text: '', at: 0 })

    const [sidePart, alignPart] = placement.split('-') as [
        Side,
        Align | undefined,
    ]
    const pos = useFloatingPosition(open, triggerRef, menuRef, {
        side: sidePart,
        align: alignPart ?? 'center',
        gap: 8,
    })

    const enabled = useCallback(
        (i: number) => i >= 0 && i < items.length && !items[i].disabled,
        [items]
    )
    const step = useCallback(
        (from: number, dir: 1 | -1) => {
            const n = items.length
            for (let k = 1; k <= n; k++) {
                const i = (((from + dir * k) % n) + n) % n
                if (enabled(i)) return i
            }
            return -1
        },
        [items.length, enabled]
    )
    const first = useCallback(() => step(-1, 1), [step])
    const last = useCallback(() => step(items.length, -1), [step, items.length])

    const close = useCallback(
        (returnFocus: boolean) => {
            setOpen(false)
            setActive(-1)
            if (returnFocus) triggerRef.current?.focus()
        },
        [setOpen]
    )

    // Focus the requested item once the menu has mounted. A menu that is open on first render
    // (defaultOpen / controlled, e.g. a docs page) does not steal focus.
    const mounted = useRef(false)
    useLayoutEffect(() => {
        const initial = !mounted.current
        mounted.current = true
        if (!open) return
        const want = pendingFocus.current
        pendingFocus.current = null
        if (initial && want == null) return
        const i =
            want === 'last'
                ? last()
                : want === 'first' || active === -1
                  ? first()
                  : active
        if (i !== -1) {
            setActive(i)
            itemRefs.current[i]?.focus()
        } else {
            menuRef.current?.focus()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Click / tap outside closes.
    useEffect(() => {
        if (!open) return
        const onDown = (e: PointerEvent) => {
            const t = e.target as Node
            if (menuRef.current?.contains(t) || triggerRef.current?.contains(t))
                return
            close(false)
        }
        document.addEventListener('pointerdown', onDown)
        return () => document.removeEventListener('pointerdown', onDown)
    }, [open, close])

    const move = (i: number) => {
        if (i === -1) return
        setActive(i)
        itemRefs.current[i]?.focus()
    }

    const choose = (i: number) => {
        const item = items[i]
        if (!item || item.disabled) return
        item.onSelect?.()
        onSelect?.(item.id)
        close(true)
    }

    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // A consumer handler on the panel runs first; preventDefault() opts out of the built-in keys.
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                move(step(active, 1))
                return
            case 'ArrowUp':
                e.preventDefault()
                move(step(active === -1 ? items.length : active, -1))
                return
            case 'Home':
                e.preventDefault()
                move(first())
                return
            case 'End':
                e.preventDefault()
                move(last())
                return
            case 'Escape':
                e.preventDefault()
                e.stopPropagation()
                close(true)
                return
            case 'Tab':
                // The menu is portalled to the end of `<body>`. Put focus back on the trigger synchronously
                // and let the default run, so the browser tabs to the element after (or, with Shift, before)
                // the trigger instead of continuing from the end of the document.
                close(true)
                return
            case 'Enter':
            case ' ':
                e.preventDefault()
                choose(active)
                return
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const now = Date.now()
            const ta = typeahead.current
            ta.text =
                now - ta.at > TYPEAHEAD_MS
                    ? e.key.toLowerCase()
                    : ta.text + e.key.toLowerCase()
            ta.at = now
            const n = items.length
            // A repeated single letter cycles; otherwise search from the current item.
            const start =
                ta.text.length === 1 ? active + 1 : Math.max(active, 0)
            for (let k = 0; k < n; k++) {
                const i = (start + k) % n
                if (
                    enabled(i) &&
                    itemText(items[i]).toLowerCase().startsWith(ta.text)
                ) {
                    move(i)
                    break
                }
            }
        }
    }

    if (!isValidElement<TriggerProps>(trigger)) return null
    const tp = trigger.props
    const triggerId = tp.id ?? `${menuId}-trigger`

    const triggerEl = cloneElement(trigger, {
        ref: mergeRefs(tp.ref, triggerRef),
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (e: MouseEvent<HTMLElement>) => {
            tp.onClick?.(e)
            if (e.defaultPrevented) return
            if (open) close(false)
            else {
                pendingFocus.current = 'first'
                setOpen(true)
            }
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            tp.onKeyDown?.(e)
            if (e.defaultPrevented) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                pendingFocus.current = e.key === 'ArrowUp' ? 'last' : 'first'
                if (open)
                    move(pendingFocus.current === 'last' ? last() : first())
                else setOpen(true)
            }
        },
    } as Partial<TriggerProps> & Record<string, unknown>)

    const panelStyle = {
        ...pos.style,
        ...(width != null
            ? { '--zzz-dropdown-width': `calc(${width} * var(--zzz-px))` }
            : null),
        ...style,
    } as CSSProperties

    return (
        <>
            {triggerEl}
            {open ? (
                <ThemePortal host={triggerRef.current}>
                    <div
                        {...rest}
                        ref={mergeRefs(ref, menuRef)}
                        id={menuId}
                        role="menu"
                        aria-orientation="vertical"
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabel ? undefined : triggerId}
                        tabIndex={-1}
                        className={cx('zzz-dropdown', className)}
                        data-side={pos.side}
                        data-top-bar={topBar ? '' : undefined}
                        style={panelStyle}
                        onKeyDown={onMenuKeyDown}
                    >
                        {topBar ? (
                            <span
                                className="zzz-dropdown__bar"
                                aria-hidden="true"
                            />
                        ) : null}
                        {items.map((item, i) => (
                            <div
                                key={item.id}
                                ref={(n) => {
                                    itemRefs.current[i] = n
                                }}
                                role="menuitem"
                                tabIndex={-1}
                                aria-disabled={item.disabled || undefined}
                                className="zzz-dropdown__item"
                                data-active={i === active ? '' : undefined}
                                onPointerMove={() => {
                                    if (!item.disabled && i !== active) move(i)
                                }}
                                onClick={() => choose(i)}
                            >
                                {item.icon != null ? (
                                    <span
                                        className="zzz-dropdown__icon"
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </span>
                                ) : null}
                                <span className="zzz-dropdown__label">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </ThemePortal>
            ) : null}
        </>
    )
}
