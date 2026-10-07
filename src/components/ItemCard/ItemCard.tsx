import {
    useContext,
    type ComponentPropsWithRef,
    type CSSProperties,
    type ReactNode,
} from 'react'
import { cx } from '../../utils'
import { tokens } from '../../styles/tokens'
import { EmptySlotX, LockIcon } from '../../icons'
import { Capsule } from '../Capsule'
import { StarRating } from '../StarRating'
import { SlotHexBadge, type DriveDiscSlot } from '../Badges'
import { ItemGridItemContext } from './itemGridContext'
import './ItemCard.css'

/** Item rarity: S gold, A violet, B blue, C sage (materials only). */
export type Rarity = 's' | 'a' | 'b' | 'c'

/**
 * Card sizes (outer box, design units):
 * `storage` 118 (W-Engine / Drive Disc storage), `list` 115 (Overclock grid, equip list),
 * `material` 110 (Manage Item), `slot` 87 (upgrade-panel slots), `ingredient` 152 × 151
 * (crafting tiles), `reward` 116 × 118 (dialog reward tile: 5 px ring, radius 16),
 * `preview` 95 incl. a 5 px ring (event Reward Preview row, token `size.cardPreview`).
 */
export type ItemCardSize =
    | 'storage'
    | 'list'
    | 'material'
    | 'slot'
    | 'ingredient'
    | 'reward'
    | 'preview'

/** Owned / required count. When `owned < required` the owned number turns `color.danger.text`. */
export interface ItemCardCount {
    owned: number
    required?: number
}

export interface ItemCardProps
    extends Omit<
        ComponentPropsWithRef<'button'>,
        'children' | 'slot' | 'name'
    > {
    /** Item name. Leads the accessible name ("The Brimstone, Level 60, Rank S, Locked, …"). */
    name?: string
    /** Card size. Default `storage`, or the enclosing `ItemGrid`'s density. */
    size?: ItemCardSize
    /** Rarity: colours the band under the art. Default `b`. */
    rarity?: Rarity
    /** Art slot (an `<img>`, `<picture>` or SVG). It is fitted into the black art panel (`object-fit: contain`). */
    art?: ReactNode
    /** Filled stars (W-Engine refinement phase). Omit for no star row. */
    stars?: number
    /** Star count. Default 5. */
    starsMax?: number
    /** Specialty glyph, top-left (22 × 18, `color.icon.specialty`). Pass an icon, e.g. `<AttackIcon />`. */
    specialty?: ReactNode
    /** Equipped-by avatar (44 px circle overhanging the top-right corner). A ReactNode or an image URL. */
    avatar?: ReactNode | string
    /** Name of the agent the item is equipped by (accessible name only). */
    equippedBy?: string
    /** Shows the lock disc above the band. */
    locked?: boolean
    /** Drive-disc slot number: shows the `SlotHexBadge` at the top-left instead of the specialty glyph. */
    slot?: DriveDiscSlot
    /** Level: renders "Lv. {level}" in the capsule below. */
    level?: number | string
    /** Count: a number ("7") or owned / required ("20/60", owned in red when short). */
    count?: number | ItemCardCount
    /** Custom capsule content (overrides `level` / `count`); `false` hides the capsule. */
    caption?: ReactNode
    /** Selected: the 7 px pulsing accent ring directly outside the grey ring. */
    selected?: boolean
    /** Optional selection "heartbeat": the ring contracts every 667 ms (optional flourish). */
    beat?: boolean
    /** EMPTY slot: dark ring, black fill, broken X glyph and an "EMPTY" capsule. */
    empty?: boolean
    /** Render as a `<button>` (default) or as a static `<div>`. Inside `ItemGrid` it is always a `<div>`. */
    interactive?: boolean
}

interface SizeSpec {
    w: number
    h: number
    /** rarity band height */
    band: number
    /** card -> capsule gap */
    gap: number
    /** capsule height */
    cap: number
    /** EMPTY capsule height (default `cap - 1`) */
    capEmpty?: number
    /** decoration scale (stars, glyphs, lock, avatar) */
    k: number
}

/** Per-size geometry. Ring/radius per size live in CSS. */
export const ITEM_CARD_SIZES: Record<ItemCardSize, SizeSpec> = {
    storage: {
        w: tokens.size.card.storage,
        h: tokens.size.card.storage,
        band: 15,
        gap: 10,
        cap: 24,
        k: 1,
    },
    list: {
        w: tokens.size.card.list,
        h: tokens.size.card.list,
        band: 14,
        gap: 9,
        cap: 24,
        k: 1,
    },
    material: {
        w: tokens.size.card.material,
        h: tokens.size.card.material,
        band: 14,
        gap: 8,
        cap: 24,
        k: 1,
    },
    // slot: gap 9, EMPTY capsule 25
    slot: {
        w: tokens.size.card.slot,
        h: tokens.size.card.slot,
        band: 12,
        gap: 9,
        cap: 25,
        capEmpty: 25,
        k: 0.76,
    },
    ingredient: {
        w: tokens.size.card.ingredient,
        h: 151,
        band: 14,
        gap: 8,
        cap: 27,
        k: 1,
    },
    reward: {
        w: tokens.size.card.reward,
        h: 118,
        band: 14,
        gap: 8,
        cap: 24,
        k: 1,
    },
    // preview: outer 95, ring 5, band 16, pitch 107
    preview: {
        w: tokens.size.cardPreview,
        h: tokens.size.cardPreview,
        band: 16,
        gap: 8,
        cap: 24,
        k: 0.8,
    },
}

const RANK: Record<Rarity, string> = { s: 'S', a: 'A', b: 'B', c: 'C' }

function countParts(count: number | ItemCardCount) {
    const c = typeof count === 'number' ? { owned: count } : count
    const short = c.required !== undefined && c.owned < c.required
    return { ...c, short }
}

/**
 * The inventory tile: W-Engine, Drive Disc, material, crafting ingredient, reward and
 * upgrade slot all share one construction — a 4 px `#404040` ring (radius 14), a rarity-coloured
 * body and a black art panel whose rounded bottom leaves the rarity "cup" band. Stars, specialty
 * glyph, lock disc, slot hexagon and an overhanging equipped-by avatar are optional; the level /
 * count capsule sits below.
 *
 * Standalone it is a `<button>` whose accessible name is built from `name`, `level`, `rarity`,
 * `stars`, `locked` and `equippedBy`. Inside `ItemGrid` it renders as a `<div>` and the grid
 * cell (`role="option"`) is the focusable element. No hover, pressed or disabled look (by
 * design); `disabled` still disables the button.
 */
export function ItemCard({
    name,
    size: sizeProp,
    rarity = 'b',
    art,
    stars,
    starsMax = 5,
    specialty,
    avatar,
    equippedBy,
    locked = false,
    slot,
    level,
    count,
    caption,
    selected: selectedProp,
    beat = false,
    empty = false,
    interactive = true,
    className,
    style,
    type,
    ...rest
}: ItemCardProps) {
    const grid = useContext(ItemGridItemContext)
    const size = sizeProp ?? grid?.size ?? 'storage'
    const selected = selectedProp ?? grid?.selected ?? false
    const spec = ITEM_CARD_SIZES[size]
    const asButton = interactive && !grid

    const cnt = count !== undefined && !empty ? countParts(count) : null

    // Accessible description (the visual parts are aria-hidden when it covers them).
    const parts: string[] = []
    if (name) parts.push(name)
    if (empty) parts.push(name ? 'empty' : 'Empty slot')
    else {
        if (level !== undefined) parts.push(`Level ${level}`)
        if (cnt) {
            parts.push(
                cnt.required !== undefined
                    ? `${cnt.owned} of ${cnt.required} required${cnt.short ? ', insufficient' : ''}`
                    : `Quantity ${cnt.owned}`
            )
        }
        parts.push(`Rank ${RANK[rarity]}`)
        if (slot !== undefined) parts.push(`Slot ${slot}`)
        if (stars !== undefined)
            parts.push(
                `${Math.max(0, Math.min(starsMax, Math.floor(stars)))} of ${starsMax} stars`
            )
        if (locked) parts.push('Locked')
        if (equippedBy) parts.push(`Equipped by ${equippedBy}`)
    }
    const description = parts.join(', ')

    // Capsule content: custom caption > level > count > EMPTY.
    let capsule: ReactNode = null
    let capsuleDescribed = true
    if (caption === false || caption === null) capsule = null
    else if (caption !== undefined) {
        capsule = (
            <Capsule className="zzz-item-card__caption">{caption}</Capsule>
        )
        capsuleDescribed = false
    } else if (empty) {
        capsule = (
            <Capsule
                className="zzz-item-card__caption"
                tone="empty"
                size="sm"
            />
        )
    } else if (level !== undefined) {
        capsule = (
            <Capsule className="zzz-item-card__caption">Lv. {level}</Capsule>
        )
    } else if (cnt) {
        capsule = (
            <Capsule className="zzz-item-card__caption">
                <span
                    className="zzz-item-card__owned"
                    data-short={cnt.short ? '' : undefined}
                >
                    {cnt.owned}
                </span>
                {cnt.required !== undefined ? `/${cnt.required}` : null}
            </Capsule>
        )
    }

    const vars = {
        '--zzz-card-w': spec.w,
        '--zzz-card-h': spec.h,
        '--zzz-card-band': empty ? 0 : spec.band,
        '--zzz-card-gap': spec.gap,
        '--zzz-card-cap': empty ? (spec.capEmpty ?? spec.cap - 1) : spec.cap,
        '--zzz-card-k': spec.k,
        ...style,
    } as CSSProperties

    const avatarNode =
        typeof avatar === 'string' ? (
            <img src={avatar} alt="" draggable={false} />
        ) : (
            avatar
        )

    const body = (
        <>
            <span className="zzz-item-card__tile" aria-hidden="true">
                {empty ? (
                    <EmptySlotX className="zzz-item-card__empty-x" />
                ) : (
                    <span className="zzz-item-card__art">{art}</span>
                )}
                {!empty && slot !== undefined ? (
                    <SlotHexBadge
                        className="zzz-item-card__slot"
                        slot={slot}
                        placement="top-left"
                        decorative
                    />
                ) : null}
                {!empty && slot === undefined && specialty ? (
                    <span className="zzz-item-card__specialty">
                        {specialty}
                    </span>
                ) : null}
                {!empty && stars !== undefined ? (
                    <StarRating
                        className="zzz-item-card__stars"
                        value={stars}
                        max={starsMax}
                        size="card"
                    />
                ) : null}
                {!empty && locked ? (
                    <span className="zzz-item-card__lock">
                        <LockIcon className="zzz-item-card__lock-glyph" />
                    </span>
                ) : null}
                {!empty && avatarNode ? (
                    <span className="zzz-item-card__avatar">{avatarNode}</span>
                ) : null}
            </span>
            {capsule ? (
                <span
                    className="zzz-item-card__below"
                    aria-hidden={capsuleDescribed ? true : undefined}
                >
                    {capsule}
                </span>
            ) : null}
            {description ? (
                <span className="zzz-sr-only">{description}</span>
            ) : null}
        </>
    )

    const common = {
        className: cx(
            'zzz-item-card',
            `zzz-item-card--${size}`,
            !empty && `zzz-item-card--rarity-${rarity}`,
            className
        ),
        style: vars,
        'data-selected': selected ? '' : undefined,
        'data-empty': empty ? '' : undefined,
        'data-beat': selected && beat ? '' : undefined,
    }

    if (asButton) {
        return (
            <button
                {...rest}
                {...common}
                type={type ?? 'button'}
                aria-pressed={selectedProp === undefined ? undefined : selected}
            >
                {body}
            </button>
        )
    }
    // Button-only attributes have no meaning on the static `<div>`.
    const {
        disabled: _d,
        form: _f,
        formAction: _fa,
        value: _v,
        ...divRest
    } = rest
    void [_d, _f, _fa, _v]
    return (
        <div {...(divRest as ComponentPropsWithRef<'div'>)} {...common}>
            {body}
        </div>
    )
}
