import type { ComponentPropsWithRef } from 'react'
import { getTabId, getTabPanelId } from './useTabList'

export interface TabPanelProps extends ComponentPropsWithRef<'div'> {
  /** The `id` given to the SegmentedTabs / IconTabs that controls this panel. */
  tabsId: string
  /** The tab value this panel belongs to. */
  value: string
}

/**
 * `role="tabpanel"` wired to a tab of a SegmentedTabs / IconTabs that has the same `id`
 * (`aria-labelledby` the tab, and the tab's `aria-controls` points here). Render only the active
 * panel, or render all and set `hidden` on the inactive ones.
 */
export function TabPanel({ tabsId, value, ref, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={getTabPanelId(tabsId, value)}
      aria-labelledby={getTabId(tabsId, value)}
      tabIndex={0}
      ref={ref}
      {...rest}
    />
  )
}
