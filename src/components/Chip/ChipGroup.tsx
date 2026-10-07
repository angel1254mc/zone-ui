import { useId, useRef } from 'react'
import type {
    ComponentPropsWithRef,
    CSSProperties,
    KeyboardEvent,
    ReactNode,
} from 'react'
import { cx, useControllableState } from '../../utils'
import { Text } from '../Text'
import { Chip } from './Chip'
import type { ChipSize } from './Chip'
import './Chip.css'

export interface ChipGroupOption {
    value: string
    label: ReactNode
    disabled?: boolean
}

export interface ChipGroupProps
    extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
    /** Section label shown above the grid ("Rarity", "Agent Specialties"); also the group's accessible name. */
    label: ReactNode
    /** Hide the visible label (it still names the group). */
    hideLabel?: boolean
    options: ChipGroupOption[]
    /** Selected values (controlled). Always an array, also in single mode; kept in option order. */
    value?: string[]
    /** Initial selected values (uncontrolled). */
    defaultValue?: string[]
    onValueChange?(value: string[]): void
    /** Grid columns (default 2, the drawer layout). */
    columns?: number
    /** Multi-select (default, checkboxes) or single-select (`false`, radios). */
    multiple?: boolean
    /** Size of every chip (default `md`); the grid's column width and gaps scale with it. */
    size?: ChipSize
}

const EMPTY: string[] = []

/**
 * Filter section: a muted section label above a grid of `Chip`s,
 * 2 columns, 262 × 41 chips, 19–20 px column gap, 57 px row pitch.
 *
 * - `multiple` (default): `role="group"`, chips are `checkbox`es; every chip is tabbable and
 *   ←/→/↑/↓/Home/End also move focus.
 * - `multiple={false}`: `role="radiogroup"`, chips are `radio`s with a roving tab stop; arrows
 *   move focus AND select (WAI-ARIA radio group).
 */
export function ChipGroup({
    label,
    hideLabel = false,
    options,
    value: valueProp,
    defaultValue = EMPTY,
    onValueChange,
    columns = 2,
    multiple = true,
    size = 'md',
    className,
    style,
    id,
    ...rest
}: ChipGroupProps) {
    const [value, setValue] = useControllableState(
        valueProp,
        defaultValue,
        onValueChange
    )
    const autoId = useId()
    const labelId = `${id ?? autoId}-label`
    const gridRef = useRef<HTMLDivElement>(null)

    const inOrder = (set: Set<string>) =>
        options.map((o) => o.value).filter((v) => set.has(v))

    const toggle = (optionValue: string, next: boolean) => {
        if (multiple) {
            const set = new Set(value)
            if (next) set.add(optionValue)
            else set.delete(optionValue)
            setValue(inOrder(set))
        } else if (next) {
            setValue([optionValue])
        }
    }

    const enabled = options.filter((o) => !o.disabled)
    const firstChecked = enabled.find((o) => value.includes(o.value))
    const tabStop = multiple ? undefined : (firstChecked ?? enabled[0])?.value

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const keys = [
            'ArrowRight',
            'ArrowDown',
            'ArrowLeft',
            'ArrowUp',
            'Home',
            'End',
        ]
        if (!keys.includes(event.key) || !gridRef.current) return
        const chips = Array.from(
            gridRef.current.querySelectorAll<HTMLButtonElement>(
                '.zzz-chip:not(:disabled)'
            )
        )
        const current = chips.indexOf(
            document.activeElement as HTMLButtonElement
        )
        if (current < 0 || chips.length === 0) return
        event.preventDefault()
        let next = current
        if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = chips.length - 1
        else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
            next = (current + 1) % chips.length
        else next = (current - 1 + chips.length) % chips.length
        const target = chips[next]
        target.focus()
        if (!multiple) {
            const v = target.dataset.value
            if (v !== undefined) setValue([v])
        }
    }

    return (
        <div
            id={id}
            role={multiple ? 'group' : 'radiogroup'}
            aria-labelledby={labelId}
            className={cx('zzz-chip-group', className)}
            data-size={size}
            style={style}
            {...rest}
        >
            <Text
                id={labelId}
                role="body"
                tone="muted"
                className={cx(
                    'zzz-chip-group__label',
                    hideLabel && 'zzz-sr-only'
                )}
            >
                {label}
            </Text>
            <div
                ref={gridRef}
                className="zzz-chip-group__grid"
                style={
                    { '--zzz-chip-columns': String(columns) } as CSSProperties
                }
                onKeyDown={handleKeyDown}
            >
                {options.map((option) => {
                    const checked = value.includes(option.value)
                    return (
                        <Chip
                            key={option.value}
                            role={multiple ? 'checkbox' : 'radio'}
                            size={size}
                            data-value={option.value}
                            disabled={option.disabled}
                            selected={checked}
                            onSelectedChange={(next) =>
                                toggle(option.value, next)
                            }
                            tabIndex={
                                multiple
                                    ? undefined
                                    : option.value === tabStop
                                      ? 0
                                      : -1
                            }
                        >
                            {option.label}
                        </Chip>
                    )
                })}
            </div>
        </div>
    )
}
