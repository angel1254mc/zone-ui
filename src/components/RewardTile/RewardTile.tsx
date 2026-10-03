import { Children, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cx } from '../../utils'
import { ItemCard, type Rarity } from '../ItemCard'
import { Capsule } from '../Capsule'
import './RewardTile.css'

export interface RewardTileProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Item name, shown on up to two lines under the count (truncated with "…"). */
  name: ReactNode
  /** Count shown in the strip under the tile ("300"). Omit for no strip. */
  count?: ReactNode
  /** Rarity band colour. Default `b`. */
  rarity?: Rarity
  /** Art slot (`<img>`, `<picture>` or SVG). */
  art?: ReactNode
}

/**
 * Dialog reward tile: an `ItemCard size="reward"` (116 × 118, 5 px ring, outer
 * radius 16, 14 px band), a black count strip 8 px below it and a two-line `label` name. Not
 * interactive; the count and name are its text.
 */
export function RewardTile({ name, count, rarity = 'b', art, className, ...rest }: RewardTileProps) {
  return (
    <div {...rest} className={cx('zzz-reward-tile', className)}>
      <ItemCard className="zzz-reward-tile__card" size="reward" rarity={rarity} art={art} caption={false} interactive={false} aria-hidden="true" />
      {count !== undefined && count !== null ? <Capsule className="zzz-reward-tile__count">{count}</Capsule> : null}
      <span className="zzz-reward-tile__name">{name}</span>
    </div>
  )
}

export interface RewardTileGroupProps extends ComponentPropsWithRef<'ul'> {
  children?: ReactNode
}

/** A centred row of reward tiles, 141 px apart (gap 25), rendered as a list. */
export function RewardTileGroup({ className, children, ...rest }: RewardTileGroupProps) {
  return (
    <ul {...rest} className={cx('zzz-reward-tile-group', className)}>
      {Children.map(children, (child) => (child === null || child === undefined || child === false ? null : <li className="zzz-reward-tile-group__item">{child}</li>))}
    </ul>
  )
}
