import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { cx } from '../../utils'
import { CombatSIcon } from '../../icons'
import { badgeA11y, type BadgeA11yProps } from './shared'
import './Badges.css'

export interface CombatBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'>, BadgeA11yProps {
  /** Diameter in design units. Default 40. */
  size?: number
}

/**
 * Combat Readiness coin: an orange `color.icon.combatReadiness` ring around a dark
 * `#3C230F` centre holding an italic orange "S". Label default "Combat Readiness";
 * pass `decorative` when that text sits next to it.
 */
export function CombatBadge({ size, label = 'Combat Readiness', decorative, className, style, ...rest }: CombatBadgeProps) {
  const s = size == null ? style : ({ '--zzz-badge-size': String(size), ...style } as CSSProperties)
  return (
    <span {...rest} {...badgeA11y(label, decorative)} className={cx('zzz-combat-badge', className)} style={s}>
      <CombatSIcon className="zzz-combat-badge__icon" />
    </span>
  )
}
