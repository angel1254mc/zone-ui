import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils'
import { CompletedCheckIcon } from '../../icons'
import { badgeA11y, placementProps, type BadgeA11yProps, type BadgeOffset } from './shared'
import './Badges.css'

export interface StatusCheckProps extends Omit<ComponentPropsWithRef<'span'>, 'children'>, BadgeA11yProps {
  /** `top-left`: on the host icon's top-left corner (host `position: relative`). Default `inline`. */
  placement?: 'top-left' | 'inline'
  /** Overhang `[x, y]` in design units. Default `[12, 3]`. */
  offset?: BadgeOffset
}

/**
 * "Completed" tick: a `color.icon.check` green check with a thin black outline on a
 * list icon's top-left. Static.
 */
export function StatusCheck({ placement = 'inline', offset, label = 'Completed', decorative, className, style, ...rest }: StatusCheckProps) {
  const pos = placementProps(placement, offset, style)
  return (
    <span {...rest} {...badgeA11y(label, decorative)} className={cx('zzz-status-check', pos.className, className)} style={pos.style}>
      <CompletedCheckIcon className="zzz-status-check__icon" />
    </span>
  )
}
