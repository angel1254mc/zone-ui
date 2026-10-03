import { createContext, useContext, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import { Text } from '../Text'
import './Radio.css'

/** `sm` / `md` / `lg`: circle 19 / 24 / 29 and row 32 / 40 / 48 design units. */
export type RadioSize = 'sm' | 'md' | 'lg'

interface RadioGroupContextValue {
  name: string
  size: RadioSize
  value: string | undefined
  disabled: boolean
  /** Value of the radio that is the group's single Tab stop (undefined before layout). */
  tabStop: string | undefined
  select(value: string): void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Group label (visible, muted; also the accessible name). */
  label?: ReactNode
  /** Selected value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  onValueChange?(value: string): void
  /** Shared `name` of the native radios (default: generated). */
  name?: string
  disabled?: boolean
  /** Layout of the options (default vertical). */
  orientation?: 'vertical' | 'horizontal'
  /** Size of every radio in the group (a radio's own `size` wins). Default `md`. */
  size?: RadioSize
  children?: ReactNode
}

/**
 * A `radiogroup` of native radios sharing one name.
 * Arrow keys move focus and select (wrapping, skipping disabled radios), as in WAI-ARIA.
 */
export function RadioGroup({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  orientation = 'vertical',
  size = 'md',
  className,
  children,
  onKeyDown,
  id,
  ...rest
}: RadioGroupProps) {
  const [value, setValue] = useControllableState<string | undefined>(valueProp, defaultValue, onValueChange as (v: string | undefined) => void)
  const autoId = useId()
  const baseId = id ?? `zzz-rg${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const labelId = label != null ? `${baseId}-label` : undefined
  const listRef = useRef<HTMLDivElement>(null)

  // Roving tab stop: the checked radio if it is enabled, otherwise the first enabled radio
  // (covers value '' / a stale value / a value pointing at a disabled option). Recomputed after
  // every render so radios added, removed or (un)disabled are picked up; set only on change.
  const [tabStop, setTabStop] = useState<string | undefined>(undefined)
  useLayoutEffect(() => {
    const enabled = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'))
      : []
    const next = (enabled.find((radio) => radio.value === value) ?? enabled[0])?.value
    setTabStop((prev) => (prev === next ? prev : next))
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const back = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
    if (event.defaultPrevented || (!forward && !back) || !listRef.current) return
    const radios = Array.from(listRef.current.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'))
    const current = radios.indexOf(document.activeElement as HTMLInputElement)
    if (current < 0 || radios.length === 0) return
    event.preventDefault()
    const next = radios[(current + (forward ? 1 : -1) + radios.length) % radios.length]
    next.focus()
    setValue(next.value)
  }

  return (
    <div
      id={id}
      role="radiogroup"
      aria-labelledby={labelId}
      aria-disabled={disabled || undefined}
      className={cx('zzz-radio-group', `zzz-radio-group--${orientation}`, `zzz-radio-group--${size}`, className)}
      data-size={size}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {label != null ? (
        <Text id={labelId} role="body" tone="muted" className="zzz-radio-group__label">
          {label}
        </Text>
      ) : null}
      <div ref={listRef} className="zzz-radio-group__options">
        <RadioGroupContext.Provider value={{ name: name ?? baseId, size, value, disabled, tabStop, select: setValue }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    </div>
  )
}

export interface RadioProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children' | 'value' | 'checked' | 'defaultChecked'> {
  value: string
  /** Standalone use only (inside a RadioGroup the group decides). */
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?(checked: boolean): void
  /**
   * Circle, ring, dot and row height scale with the control scale (sm = md × 46/57, lg = md × 69/57);
   * the label is `fontSize.label` / `body` / `bodyLg`. Default: the group's size, else `md`.
   */
  size?: RadioSize
  children?: ReactNode
}

/**
 * A native radio drawn as a 24 px circle (3 px
 * `color.border.button` ring, 1 px black keyline). Checked: accent fill + black dot, label white.
 * `className` / `style` go to the root `<label>`; `ref` and other props to the `<input>`.
 */
export function Radio({
  value,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  size: sizeProp,
  children,
  className,
  style,
  disabled: disabledProp,
  name: nameProp,
  onChange,
  tabIndex,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext)
  const [ownChecked, setOwnChecked] = useControllableState(checkedProp, defaultChecked, onCheckedChange)
  const checked = group ? group.value === value : ownChecked
  const disabled = Boolean(disabledProp || group?.disabled)
  const size = sizeProp ?? group?.size ?? 'md'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    if (event.defaultPrevented || !event.target.checked) return
    if (group) group.select(value)
    else setOwnChecked(true)
  }

  // Roving tab stop inside a group (computed by RadioGroup): exactly one radio is tabbable.
  const groupTabIndex = group && group.tabStop !== undefined ? (group.tabStop === value ? 0 : -1) : undefined

  return (
    <label
      className={cx('zzz-radio', `zzz-radio--${size}`, className)}
      style={style}
      data-size={size}
      data-checked={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <span className="zzz-radio__control">
        <input
          type="radio"
          className="zzz-radio__input"
          name={group ? group.name : nameProp}
          value={value}
          checked={checked}
          disabled={disabled}
          tabIndex={tabIndex ?? groupTabIndex}
          onChange={handleChange}
          {...rest}
        />
        <span className="zzz-radio__circle" aria-hidden="true">
          <span className="zzz-radio__dot" />
        </span>
      </span>
      {children != null ? (
        <Text role="body" className="zzz-radio__label">
          {children}
        </Text>
      ) : null}
    </label>
  )
}
