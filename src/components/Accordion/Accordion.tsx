import { createContext, useCallback, useContext, useId, useMemo } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import { CaretDownIcon } from '../../icons'
import './Accordion.css'

export type AccordionType = 'single' | 'multiple'
/** `default` = black pill header, `tertiary` content; `plain` = #222 header, muted content. */
export type AccordionVariant = 'default' | 'plain'

interface AccordionCtx {
  open: readonly string[]
  toggle(value: string): void
  headingLevel: 2 | 3 | 4 | 5 | 6
  baseId: string
}

const Ctx = createContext<AccordionCtx | null>(null)

export interface AccordionProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** `single` (default): opening an item closes the others. `multiple`: independent items. */
  type?: AccordionType
  /** Open item values (controlled). */
  value?: string[]
  /** Initially open item values (uncontrolled). */
  defaultValue?: string[]
  onValueChange?(value: string[]): void
  /** `single` only: allow closing the open item (default true). */
  collapsible?: boolean
  /** Heading level wrapping each header button. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Default `default`. */
  variant?: AccordionVariant
}

const EMPTY: string[] = []

/**
 * Header = the dark full pill (58 tall) with a white title and a caret that turns
 * 180° when open; content `body` in `color.text.tertiary`, padding 12/28/8; items 8 apart.
 * WAI-ARIA accordion: heading > button[aria-expanded][aria-controls] + role=region.
 */
export function Accordion({
  type = 'single',
  value,
  defaultValue = EMPTY,
  onValueChange,
  collapsible = true,
  headingLevel = 3,
  variant = 'default',
  className,
  children,
  ...rest
}: AccordionProps) {
  const [open, setOpen] = useControllableState<string[]>(value, defaultValue, onValueChange)
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  const toggle = useCallback(
    (v: string) => {
      setOpen((prev) => {
        const isOpen = prev.includes(v)
        if (type === 'multiple') return isOpen ? prev.filter((x) => x !== v) : [...prev, v]
        if (isOpen) return collapsible ? [] : prev
        return [v]
      })
    },
    [setOpen, type, collapsible],
  )

  const ctx = useMemo(() => ({ open, toggle, headingLevel, baseId }), [open, toggle, headingLevel, baseId])

  return (
    <div {...rest} className={cx('zzz-accordion', `zzz-accordion--${variant}`, className)} data-type={type}>
      <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
    </div>
  )
}

export interface AccordionItemProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Unique value within the Accordion. */
  value: string
  /** Header title. */
  title: ReactNode
  /** Optional trailing node in the header, before the caret (a count, a badge…). */
  meta?: ReactNode
  disabled?: boolean
  /** Force the header's pressed look (stories / visual tests). */
  pressed?: boolean
  children?: ReactNode
}

export function AccordionItem({
  value,
  title,
  meta,
  disabled = false,
  pressed,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>')
  const isOpen = ctx.open.includes(value)
  const safe = value.replace(/[^a-zA-Z0-9_-]/g, '_')
  const headerId = `zzz-acc${ctx.baseId}-${safe}-h`
  const panelId = `zzz-acc${ctx.baseId}-${safe}-p`
  const Heading = `h${ctx.headingLevel}` as 'h3'

  return (
    <div
      {...rest}
      className={cx('zzz-accordion__item', className)}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
    >
      <Heading className="zzz-accordion__heading">
        <button
          type="button"
          id={headerId}
          className="zzz-accordion__trigger zzz-mat-pill zzz-pressable zzz-focusable"
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          data-pressed={pressed ? '' : undefined}
          onClick={() => ctx.toggle(value)}
        >
          <span className="zzz-accordion__title">{title}</span>
          {meta != null ? <span className="zzz-accordion__meta">{meta}</span> : null}
          <CaretDownIcon className="zzz-accordion__caret" />
        </button>
      </Heading>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="zzz-accordion__panel"
        hidden={!isOpen}
      >
        <div className="zzz-accordion__content">{children}</div>
      </div>
    </div>
  )
}
