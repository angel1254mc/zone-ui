import { useId } from 'react'
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils'
import { CategoryTag } from '../CategoryTag'
import type { WebSkin } from '../WebTabs'
import './NewsCard.css'

export type NewsCardTone = 'dark' | 'light'

export interface NewsCardProps extends Omit<ComponentPropsWithRef<'a'>, 'title'> {
  /** Banner art slot (an `<img>`, `<picture>` or SVG). Cropped to 396×220 with `object-fit: cover`. Decorative. */
  art?: ReactNode
  /** Date line, in the condensed face (e.g. `2024/07/04`). */
  date?: ReactNode
  /** A string renders a CategoryTag; any other node is rendered as given. */
  category?: ReactNode
  /** Headline: the link's accessible name. One line, ellipsised. */
  title: ReactNode
  /** Two-line clamped summary. */
  description?: ReactNode
  /** `dark` (default): theme text colours (title white, description tertiary). `light`: dark text for a light page. */
  tone?: NewsCardTone
  /** Skin of the CategoryTag. */
  skin?: WebSkin
  /** Card width in design units (default 396). */
  width?: number
}

/**
 * News article card: a 396×220
 * banner with only the top-right and bottom-left corners rounded (35), date + category tag,
 * one-line title, two-line description. The whole card is one link.
 */
export function NewsCard({
  art,
  date,
  category,
  title,
  description,
  tone = 'dark',
  skin = 'web',
  width,
  className,
  style,
  ...rest
}: NewsCardProps) {
  const id = useId()
  const titleId = `${id}-title`
  const dateId = `${id}-date`
  const categoryId = `${id}-category`
  const descId = `${id}-desc`
  const hasMeta = date != null || category != null
  const describedBy = [date != null && dateId, category != null && categoryId, description != null && descId]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={cx('zzz-news-card', 'zzz-focusable', className)}
      data-tone={tone}
      aria-labelledby={titleId}
      aria-describedby={describedBy || undefined}
      style={(width !== undefined ? { '--zzz-news-card-width': `calc(${width} * var(--zzz-px))`, ...style } : style) as CSSProperties}
      {...rest}
    >
      <span className="zzz-news-card__art" aria-hidden="true">
        <span className="zzz-news-card__art-inner">{art}</span>
      </span>
      {hasMeta && (
        <span className="zzz-news-card__meta">
          {date != null && (
            <span id={dateId} className="zzz-news-card__date">
              {date}
            </span>
          )}
          {category != null &&
            (typeof category === 'string' ? (
              <CategoryTag id={categoryId} skin={skin} className="zzz-news-card__tag">
                {category}
              </CategoryTag>
            ) : (
              <span id={categoryId} className="zzz-news-card__tag">
                {category}
              </span>
            ))}
        </span>
      )}
      <span id={titleId} className="zzz-news-card__title">
        {title}
      </span>
      {description != null && (
        <span id={descId} className="zzz-news-card__desc">
          {description}
        </span>
      )}
    </a>
  )
}
