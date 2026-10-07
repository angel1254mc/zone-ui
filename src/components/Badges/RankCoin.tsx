import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { cx } from '../../utils'
import { RankLetterA, RankLetterB, RankLetterS } from '../../icons'
import { badgeA11y, type BadgeA11yProps } from './shared'
import './Badges.css'

export type Rank = 'S' | 'A' | 'B'

export interface RankCoinProps
    extends Omit<ComponentPropsWithRef<'span'>, 'children'>,
        BadgeA11yProps {
    rank: Rank
    /** Diameter in design units. Default 30 (level pills); 29 in the large level pill. */
    size?: number
}

const LETTERS = { S: RankLetterS, A: RankLetterA, B: RankLetterB } as const

/**
 * Rarity coin: a dark `color.rarityCoin.ring` ring with a lit top-left, a gradient
 * body per rank (`color.rarityCoin.s` / `.a`; B uses a gradient built from `color.rarity.b`)
 * and a knocked-out black italic letter. Everything inside is sized in
 * `em` of the diameter, so `size` scales the whole coin.
 */
export function RankCoin({
    rank,
    size,
    label,
    decorative,
    className,
    style,
    ...rest
}: RankCoinProps) {
    const Letter = LETTERS[rank]
    const s =
        size == null
            ? style
            : ({ '--zzz-badge-size': String(size), ...style } as CSSProperties)
    return (
        <span
            {...rest}
            {...badgeA11y(label ?? `Rank ${rank}`, decorative)}
            className={cx(
                'zzz-rank-coin',
                `zzz-rank-coin--${rank.toLowerCase()}`,
                className
            )}
            style={s}
        >
            <span className="zzz-rank-coin__body" />
            <Letter className="zzz-rank-coin__letter" />
        </span>
    )
}
