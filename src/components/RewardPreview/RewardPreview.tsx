import { useId, useRef } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react'
import { cx, usePressFlash } from '../../utils'
import { ItemCard } from '../ItemCard'
import type { ItemCardProps } from '../ItemCard'
import { Text } from '../Text'
import './RewardPreview.css'

export interface RewardPreviewOwnProps {
  /** Reward tiles, rendered as `ItemCard size="preview"` (95 outer) without a caption. Give each a `name` for its accessible name. */
  items: ItemCardProps[]
  /** The ">" affordance. With `onMore` it is a button ("More rewards"); without, it scrolls the row by one page. */
  onMore?: () => void
  /** Heading text. Default "Reward Preview". */
  label?: ReactNode
  /** Tiles visible before the row clips (width = n × 107 − 20). Default 6. */
  visible?: number
  /** Slot under the row, e.g. `<Notice>"Unlock Early" has been unlocked</Notice>`. */
  notice?: ReactNode
  /** Accessible name of the ">" button. Default "More rewards". */
  moreLabel?: string
  ref?: Ref<HTMLElement>
}

export type RewardPreviewProps = RewardPreviewOwnProps & Omit<ComponentPropsWithoutRef<'section'>, keyof RewardPreviewOwnProps>

/**
 * "Reward Preview" row: a right-aligned `bodyXl` white label
 * with the event-title sticker outline above a row of `ItemCard size="preview"` tiles at a ~107 pitch, clipped
 * at the right, with a white ">" chevron (≈17 × 31) as the scroll affordance, and an optional notice slot below.
 */
export function RewardPreview(props: RewardPreviewProps) {
  const { items, onMore, label = 'Reward Preview', visible = 6, notice, moreLabel = 'More rewards', className, style, ref, ...rest } = props
  const headingId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const press = usePressFlash<HTMLButtonElement>()
  // The row clips and scrolls horizontally. With static tiles it has no focusable descendants, so the
  // list itself takes focus (arrow keys scroll it; WebKit does not do this on its own), named by the heading.
  const staticTiles = items.every((item) => item.onClick === undefined)

  const handleMore = () => {
    if (onMore) return onMore()
    const el = listRef.current
    if (!el) return
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    if (typeof el.scrollTo === 'function') el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section
      {...rest}
      ref={ref}
      aria-labelledby={headingId}
      className={cx('zzz-reward-preview', className)}
      style={{ '--zzz-reward-preview-visible': visible, ...style } as CSSProperties}
    >
      <Text as="h3" id={headingId} role="bodyXl" outline="event" tone="primary" className="zzz-reward-preview__label">
        {label}
      </Text>
      <div className="zzz-reward-preview__row">
        <ul
          ref={listRef}
          className={cx('zzz-reward-preview__list', staticTiles && 'zzz-focusable')}
          role="list"
          aria-labelledby={headingId}
          tabIndex={staticTiles ? 0 : undefined}
        >
          {items.map(({ className: itemClass, ...item }, i) => (
            <li key={item.id ?? `${item.name ?? 'reward'}-${i}`} className="zzz-reward-preview__item">
              <ItemCard
                size="preview"
                caption={false}
                interactive={item.onClick !== undefined}
                {...item}
                className={cx('zzz-reward-preview__card', itemClass)}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          {...press}
          className="zzz-reward-preview__more zzz-pressable zzz-focusable"
          aria-label={moreLabel}
          onClick={handleMore}
        >
          {/* Chunky scroll chevron: 18 × 30 ink with an 11 px horizontal run (~7.5 px arms). */}
          <svg viewBox="0 0 18 30" aria-hidden="true" focusable="false">
            <path d="M0 0h10.6a1 1 0 0 1 .85.47l6.3 14a1.2 1.2 0 0 1 0 1.06l-6.3 14a1 1 0 0 1-.85.47H0l7-15z" />
          </svg>
        </button>
      </div>
      {notice != null ? <div className="zzz-reward-preview__notice">{notice}</div> : null}
    </section>
  )
}
