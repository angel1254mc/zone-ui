import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils'
import { useTabList } from '../SegmentedTabs/useTabList'
import type { TabListItem } from '../SegmentedTabs/useTabList'
import './IconTabs.css'

export interface IconTabsItem extends TabListItem {
  value: string
  /** Glyph (ReactNode): an `src/icons` component, an `<img>`, any SVG. Drawn 45 design units (at md), white; accent when active. */
  icon: ReactNode
  /** Accessible name of the tab (the tab shows no text). */
  label: string
  disabled?: boolean
}

/** Control size: sm / md / lg ≈ 32 / 40 / 48 CSS px controls at the default scale (md = the base look). */
export type IconTabsSize = 'sm' | 'md' | 'lg'

export interface IconTabsProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'defaultValue' | 'onChange'> {
  items: readonly IconTabsItem[]
  /** Selected value (controlled). */
  value?: string
  /** Initial value (uncontrolled). Default: the first enabled item. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * Control size (default `md`). Pill height 59, slot pitch 95, glyph 45, active circle 82 / disc 44
   * and the ring all scale by the control-size ratio (sm 46/57, lg 69/57).
   */
  size?: IconTabsSize
  /** Optional flourish: the active circle bumps 82 → 88 px every 667 ms (`motion.duration.selectionBeat`). */
  beat?: boolean
  /** Force the pressed look on this (inactive) tab. Docs / visual tests. */
  pressed?: string
}

/**
 * Category switcher: circle icon tabs in a 59 px pill, 95 px pitch. The active
 * tab is an 82 px accent circle overflowing the pill, with the glyph inverted on a 44 px black disc.
 */
export function IconTabs({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  beat = false,
  pressed,
  id,
  className,
  style,
  ref,
  ...rest
}: IconTabsProps) {
  const { value, getTabProps } = useTabList({ items, value: valueProp, defaultValue, onValueChange, id, pressed })

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      id={id}
      ref={ref}
      className={cx('zzz-icon-tabs', 'zzz-mat-pill', className)}
      data-size={size}
      data-beat={beat ? '' : undefined}
      style={{ '--zzz-icon-tabs-count': items.length, ...style } as CSSProperties}
      {...rest}
    >
      {items.map((item, index) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            {...getTabProps(item, index)}
            aria-label={item.label}
            className="zzz-icon-tabs__tab zzz-focusable"
            data-active={active ? '' : undefined}
          >
            {active && <span className="zzz-icon-tabs__disc" aria-hidden="true" />}
            <span className="zzz-icon-tabs__glyph" aria-hidden="true">
              {item.icon}
            </span>
          </button>
        )
      })}
    </div>
  )
}
