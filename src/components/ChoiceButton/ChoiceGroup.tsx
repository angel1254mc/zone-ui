import { useEffect, useId, useRef } from 'react'
import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import {
    ChoiceButton,
    DEFAULT_RESULT_LABELS,
    choiceState,
} from './ChoiceButton'
import type {
    ChoiceCorrectTone,
    ChoiceMediaLayout,
    ChoiceResult,
    ChoiceSize,
} from './ChoiceButton'
import './ChoiceButton.css'

export interface ChoiceItem {
    value: string
    label: ReactNode
    description?: ReactNode
    /** Image / avatar / SVG (decorative). */
    media?: ReactNode
    /** Overrides the automatic badge (any node: letter, number, icon). */
    badge?: ReactNode
    /** Hotkey for this item (one character). Default: the badge when it is a single character. */
    hotkey?: string
    disabled?: boolean
    /** Plain-text label for announcements when `label` is not a string. */
    textValue?: string
}

/** Automatic badges: `letters` A, B, C… (default), `numbers` 1, 2, 3…, `none`. */
export type ChoiceBadges = 'letters' | 'numbers' | 'none'

export type ChoiceLayout = 'grid' | 'list'

export type ChoiceResultLabels = Partial<
    Record<'correct' | 'incorrect' | 'revealed', string>
>

interface ChoiceGroupBaseProps
    extends Omit<
        ComponentPropsWithRef<'div'>,
        'defaultValue' | 'onChange' | 'children' | 'role' | 'results'
    > {
    items: readonly ChoiceItem[]
    /** Visible group label (also the accessible name). Without it pass `aria-label` / `aria-labelledby`. */
    label?: ReactNode
    /** Default `grid`: auto columns (2×2 for four), one column in narrow containers. `list`: one column. */
    layout?: ChoiceLayout
    /** Grid columns on wide containers (default: 1 → 1, multiples of 3 → 3, otherwise 2 — four is 2×2). Narrow containers still collapse. */
    columns?: number
    /** Default `letters`. */
    badges?: ChoiceBadges
    /**
     * Single-key selection by badge (1–9 / A–Z) or `item.hotkey`. `true`: while focus is inside the
     * group. `'global'`: anywhere on the page except text fields. Modifier combos are ignored.
     */
    hotkeys?: boolean | 'global'
    /** Outcome per value; items without an entry keep their normal state. */
    results?: Readonly<Partial<Record<string, ChoiceResult>>>
    /** Freeze the group (typically together with `results`): no selection changes; items stay focusable. */
    locked?: boolean
    /** Disable every item. */
    disabled?: boolean
    /** Default `inline`. */
    mediaLayout?: ChoiceMediaLayout
    /** Default `green`. */
    correctTone?: ChoiceCorrectTone
    /** Size of every choice (`sm` / `md` / `lg`, default `md`); the gaps and the group label scale with it. */
    size?: ChoiceSize
    /** Screen-reader result words (i18n). */
    resultLabels?: ChoiceResultLabels
    /**
     * Polite live-region text. Default: generated from `results` ("Tokyo: Incorrect. Correct answer:
     * Paris."). A string/node replaces it; `false` removes the live region (announce it yourself).
     */
    announcement?: ReactNode | false
}

export interface ChoiceGroupSingleProps extends ChoiceGroupBaseProps {
    selectionMode?: 'single'
    /** Selected value (controlled). `null` = nothing selected. */
    value?: string | null
    defaultValue?: string | null
    onValueChange?(value: string): void
    maxSelected?: never
}

export interface ChoiceGroupMultipleProps extends ChoiceGroupBaseProps {
    selectionMode: 'multiple'
    value?: string[]
    defaultValue?: string[]
    onValueChange?(value: string[]): void
    /** Ignore picks beyond this many. */
    maxSelected?: number
}

export type ChoiceGroupProps = ChoiceGroupSingleProps | ChoiceGroupMultipleProps

const EMPTY: string[] = []
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function autoBadge(kind: ChoiceBadges, index: number): string | undefined {
    if (kind === 'letters') return LETTERS[index]
    if (kind === 'numbers') return String(index + 1)
    return undefined
}

function defaultColumns(count: number): number {
    if (count <= 1) return 1
    if (count % 3 === 0) return 3
    return 2
}

function isTextField(el: EventTarget | null): boolean {
    if (!(el instanceof HTMLElement)) return false
    if (el.isContentEditable) return true
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)
        return true
    if (el instanceof HTMLInputElement) {
        return ![
            'button',
            'checkbox',
            'radio',
            'submit',
            'reset',
            'range',
            'color',
            'file',
            'image',
        ].includes(el.type)
    }
    return false
}

function itemText(item: ChoiceItem): string {
    if (item.textValue != null) return item.textValue
    if (typeof item.label === 'string' || typeof item.label === 'number')
        return String(item.label)
    return item.value
}

/**
 * A set of ChoiceButtons with single (`radiogroup` of `radio`s) or multiple (`group` of
 * `checkbox`es) selection, controlled or uncontrolled. Keyboard: one Tab stop (roving), arrow
 * keys / Home / End move focus (grid-aware, wrapping, skipping disabled items), Space / Enter
 * select; optional single-key hotkeys. `results` + `locked` show outcomes, freeze the group and
 * announce them through a polite live region.
 */
export function ChoiceGroup(props: ChoiceGroupProps) {
    const {
        items,
        label,
        layout = 'grid',
        columns,
        badges = 'letters',
        hotkeys = false,
        results,
        locked = false,
        disabled = false,
        mediaLayout,
        correctTone,
        size = 'md',
        resultLabels,
        announcement,
        selectionMode = 'single',
        value: valueProp,
        defaultValue,
        onValueChange,
        maxSelected,
        className,
        id,
        onKeyDown,
        ref,
        'aria-labelledby': labelledBy,
        ...rest
    } = props

    const multiple = selectionMode === 'multiple'
    const toArray = (
        v: string | string[] | null | undefined
    ): string[] | undefined =>
        v === undefined
            ? undefined
            : v === null
              ? EMPTY
              : Array.isArray(v)
                ? v
                : [v]

    const [selected, setSelected] = useControllableState<string[]>(
        toArray(valueProp),
        toArray(defaultValue) ?? EMPTY,
        (next) => {
            if (multiple)
                (onValueChange as ((v: string[]) => void) | undefined)?.(next)
            else if (next[0] !== undefined)
                (onValueChange as ((v: string) => void) | undefined)?.(next[0])
        }
    )

    const uid = useId()
    const labelId = label != null ? `${uid}-label` : undefined
    const itemsRef = useRef<HTMLDivElement>(null)
    const labels = { ...DEFAULT_RESULT_LABELS, ...resultLabels }

    const entries = items.map((item, index) => {
        const badge =
            item.badge !== undefined ? item.badge : autoBadge(badges, index)
        const key =
            item.hotkey ??
            (typeof badge === 'string' && badge.length === 1
                ? badge
                : undefined)
        return { item, badge, hotkey: key?.toUpperCase() }
    })

    const itemDisabled = (item: ChoiceItem) =>
        disabled || Boolean(item.disabled)

    const select = (item: ChoiceItem) => {
        if (locked || itemDisabled(item)) return
        if (!multiple) {
            if (selected.length === 1 && selected[0] === item.value) return
            setSelected([item.value])
            return
        }
        setSelected((prev) => {
            if (prev.includes(item.value))
                return prev.filter((v) => v !== item.value)
            if (maxSelected !== undefined && prev.length >= maxSelected)
                return prev
            return [...prev, item.value]
        })
    }

    // Roving tab stop: the first selected enabled item, else the first enabled one.
    const enabled = items.filter((item) => !itemDisabled(item))
    const tabStop = (
        enabled.find((item) => selected.includes(item.value)) ?? enabled[0]
    )?.value

    const buttons = () =>
        itemsRef.current
            ? Array.from(
                  itemsRef.current.querySelectorAll<HTMLButtonElement>(
                      '.zzz-choice:not(:disabled)'
                  )
              )
            : []

    /** Columns as laid out: items sharing the first item's top edge (1 when unmeasurable). */
    const layoutColumns = (list: HTMLButtonElement[]) => {
        if (layout === 'list' || list.length < 2) return 1
        const all = itemsRef.current
            ? Array.from(itemsRef.current.children)
            : []
        const top = all[0]?.getBoundingClientRect().top ?? 0
        const n = all.filter(
            (el) => Math.abs(el.getBoundingClientRect().top - top) < 2
        ).length
        return n >= all.length ? 1 : Math.max(1, n)
    }

    const focusByHotkey = (key: string) => {
        const k = key.toUpperCase()
        const hit = entries.find((e) => e.hotkey === k)
        if (!hit || locked || itemDisabled(hit.item)) return false
        select(hit.item)
        buttons()
            .find((el) => el.dataset.value === hit.item.value)
            ?.focus()
        return true
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const list = buttons()
        const current = list.indexOf(
            document.activeElement as HTMLButtonElement
        )
        const { key } = event
        if (
            current >= 0 &&
            [
                'ArrowDown',
                'ArrowUp',
                'ArrowLeft',
                'ArrowRight',
                'Home',
                'End',
            ].includes(key)
        ) {
            event.preventDefault()
            // Grid: Up/Down jump a row when the DOM order maps to rows; otherwise they step like Left/Right.
            const all = itemsRef.current
                ? Array.from(itemsRef.current.children)
                : []
            const cols = layoutColumns(list)
            let next = current
            if (key === 'Home') next = 0
            else if (key === 'End') next = list.length - 1
            else if (key === 'ArrowRight') next = (current + 1) % list.length
            else if (key === 'ArrowLeft')
                next = (current - 1 + list.length) % list.length
            else if (cols > 1 && list.length === all.length) {
                const step = key === 'ArrowDown' ? cols : -cols
                next = (current + step + list.length) % list.length
            } else
                next =
                    (current + (key === 'ArrowDown' ? 1 : -1) + list.length) %
                    list.length
            list[next]?.focus()
            return
        }
        if (
            hotkeys === true &&
            key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
        ) {
            if (focusByHotkey(key)) event.preventDefault()
        }
    }

    // Global hotkeys (anywhere on the page except text fields).
    const hotkeyRef = useRef(focusByHotkey)
    hotkeyRef.current = focusByHotkey
    useEffect(() => {
        if (hotkeys !== 'global') return
        const onDocKey = (event: globalThis.KeyboardEvent) => {
            if (
                event.defaultPrevented ||
                event.key.length !== 1 ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey
            )
                return
            if (isTextField(event.target)) return
            if (hotkeyRef.current(event.key)) event.preventDefault()
        }
        document.addEventListener('keydown', onDocKey)
        return () => document.removeEventListener('keydown', onDocKey)
    }, [hotkeys])

    // Default live announcement from the results.
    let message: ReactNode = null
    if (announcement === undefined) {
        if (results) {
            const parts: string[] = []
            for (const item of items) {
                const r = results[item.value]
                if (!r) continue
                const s = choiceState(true, r)
                if (s === 'revealed')
                    parts.push(`${labels.revealed}: ${itemText(item)}.`)
                else if (s === 'correct' || s === 'incorrect')
                    parts.push(`${itemText(item)}: ${labels[s]}.`)
            }
            // Picks first, then the revealed answer.
            parts.sort(
                (a, b) =>
                    Number(a.startsWith(`${labels.revealed}:`)) -
                    Number(b.startsWith(`${labels.revealed}:`))
            )
            message = parts.join(' ')
        }
    } else if (announcement !== false) {
        message = announcement
    }

    const cols =
        layout === 'list'
            ? 1
            : Math.max(1, Math.min(columns ?? defaultColumns(items.length), 4))

    return (
        <div
            {...rest}
            ref={ref}
            id={id}
            role={multiple ? 'group' : 'radiogroup'}
            aria-labelledby={labelledBy ?? labelId}
            aria-disabled={disabled || locked ? true : undefined}
            data-layout={layout}
            data-size={size}
            data-locked={locked ? '' : undefined}
            className={cx(
                'zzz-choice-group',
                `zzz-choice-group--${layout}`,
                `zzz-choice-group--${size}`,
                className
            )}
            onKeyDown={handleKeyDown}
        >
            {label != null ? (
                <div id={labelId} className="zzz-choice-group__label">
                    {label}
                </div>
            ) : null}
            <div
                ref={itemsRef}
                className="zzz-choice-group__items"
                data-cols={cols}
            >
                {entries.map(({ item, badge, hotkey }) => {
                    const isSelected = selected.includes(item.value)
                    const result = results?.[item.value] ?? null
                    const isDisabled = itemDisabled(item)
                    return (
                        <ChoiceButton
                            key={item.value}
                            role={multiple ? 'checkbox' : 'radio'}
                            value={item.value}
                            selected={isSelected}
                            result={result}
                            badge={badge}
                            description={item.description}
                            media={item.media}
                            mediaLayout={mediaLayout}
                            correctTone={correctTone}
                            size={size}
                            resultLabel={
                                result
                                    ? labels[
                                          choiceState(
                                              true,
                                              result
                                          ) as keyof typeof labels
                                      ]
                                    : undefined
                            }
                            disabled={isDisabled}
                            aria-disabled={
                                locked && !isDisabled ? true : undefined
                            }
                            aria-keyshortcuts={
                                hotkeys && hotkey ? hotkey : undefined
                            }
                            data-dimmed={
                                locked && !isSelected && !result
                                    ? ''
                                    : undefined
                            }
                            tabIndex={item.value === tabStop ? 0 : -1}
                            onClick={() => select(item)}
                        >
                            {item.label}
                        </ChoiceButton>
                    )
                })}
            </div>
            {announcement === false ? null : (
                <div
                    className="zzz-sr-only"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {message}
                </div>
            )}
        </div>
    )
}
