import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import type { WebSkin } from '../WebTabs'
import './Pagination.css'

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end'

/**
 * Page list with one sibling each side of the current page and one boundary page at each end
 * (e.g. `1 2 3 4 5 … 175` on page 1). Always the same number of slots once the
 * count exceeds them, so the bar does not jump in width.
 */
export function getPaginationItems(page: number, count: number, siblingCount = 1, boundaryCount = 1): PaginationItem[] {
  const range = (from: number, to: number) => (to < from ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i))
  const b = boundaryCount
  const s = siblingCount
  const startPages = range(1, Math.min(b, count))
  const endPages = range(Math.max(count - b + 1, b + 1), count)
  const siblingsStart = Math.max(Math.min(page - s, count - b - s * 2 - 1), b + 2)
  const siblingsEnd = Math.min(Math.max(page + s, b + s * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : count - 1)
  const items: PaginationItem[] = [...startPages]
  if (siblingsStart > b + 2) items.push('ellipsis-start')
  else if (b + 1 < count - b) items.push(b + 1)
  items.push(...range(siblingsStart, siblingsEnd))
  if (siblingsEnd < count - b - 1) items.push('ellipsis-end')
  else if (count - b > b) items.push(count - b)
  items.push(...endPages)
  return items
}

/** Control size: sm / md / lg (md = a 52 design-unit track; sm / lg scale it by 46/57 and 69/57). */
export type PaginationSize = 'sm' | 'md' | 'lg'

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange' | 'children'> {
  /** Number of pages (≥ 1). */
  count: number
  /** Current page, 1-based (controlled). */
  page?: number
  /** Initial page (uncontrolled). Default 1. */
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** Pages shown each side of the current one. Default 1. */
  siblingCount?: number
  /** Pages always shown at each end. Default 1. */
  boundaryCount?: number
  /** Default `web` (white chips, ~40° slant, hover scale). `game` = mesh pill + accent chips at 26.5°. */
  skin?: WebSkin
  /**
   * Control size (default `md`). Track, page slots, chips, arrows, gaps and numbers scale by the
   * control-size ratio (sm 46/57, lg 69/57); skew angles stay; numbers never drop below the `label`
   * text role.
   */
  size?: PaginationSize
  /** Render links instead of buttons (server-rendered lists). Clicks still call onPageChange. */
  getPageHref?: (page: number) => string
  /** Accessible name of each page control. Default `Page N`. */
  getPageLabel?: (page: number) => string
  prevLabel?: string
  nextLabel?: string
  disabled?: boolean
}

/** Original arrow glyph (not a game asset). */
function Arrow() {
  return (
    <svg className="zzz-pagination__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.5 12H6M12.5 4.5 5 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Prev chip: round left end, slanted right edge (leans '/'); next is the same rotated 180°. */
function StepChip() {
  return (
    <svg className="zzz-pagination__step-chip" viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M20 3H58L33 37H20A17 17 0 0 1 20 3Z" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Pagination: a 52 px `#222122` pill, 64 px page slots, the current page on a skewed
 * white chip, prev/next as white end chips with black arrows.
 */
export function Pagination({
  count,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  skin = 'web',
  size = 'md',
  getPageHref,
  getPageLabel = (p) => `Page ${p}`,
  prevLabel = 'Previous page',
  nextLabel = 'Next page',
  disabled = false,
  className,
  ref,
  'aria-label': ariaLabel = 'Pagination',
  ...rest
}: PaginationProps) {
  const total = Math.max(1, Math.floor(count))
  const [rawPage, setPage] = useControllableState(pageProp, defaultPage, onPageChange)
  const page = Math.min(Math.max(1, rawPage), total)
  const items = getPaginationItems(page, total, siblingCount, boundaryCount)

  const control = (
    target: number,
    { label, className: cls, current = false, children }: { label: string; className: string; current?: boolean; children: ReactNode },
  ) => {
    const inactive = disabled || target < 1 || target > total
    const onClick = (event: MouseEvent) => {
      if (inactive) {
        event.preventDefault()
        return
      }
      if (target !== page) setPage(target)
    }
    const common = {
      className: cx(cls, 'zzz-focusable'),
      'aria-label': label,
      'aria-current': current ? ('page' as const) : undefined,
      'aria-disabled': inactive ? (true as const) : undefined,
      onClick,
    }
    return getPageHref ? (
      // An inactive control has no href, so it keeps role="link" (its aria-label stays valid) and
      // tabIndex 0: an <a> without href is not focusable, and stepping onto the last page with
      // Enter on "Next" would otherwise drop focus to <body> (button mode keeps focus the same way).
      <a
        {...common}
        href={inactive ? undefined : getPageHref(target)}
        role={inactive ? 'link' : undefined}
        tabIndex={inactive ? 0 : undefined}
      >
        {children}
      </a>
    ) : (
      <button {...common} type="button">
        {children}
      </button>
    )
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cx('zzz-pagination', className)} data-skin={skin} data-size={size} {...rest}>
      <ul role="list" className={cx('zzz-pagination__track', skin === 'game' && 'zzz-mat-pill')}>
        <li className="zzz-pagination__item zzz-pagination__item--prev">
          {control(page - 1, {
            label: prevLabel,
            className: 'zzz-pagination__step zzz-pagination__step--prev',
            children: (
              <>
                <StepChip />
                <Arrow />
              </>
            ),
          })}
        </li>
        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item} className="zzz-pagination__item">
              {control(item, {
                label: getPageLabel(item),
                className: 'zzz-pagination__page',
                current: item === page,
                children: (
                  <>
                    <span className="zzz-pagination__chip" aria-hidden="true" />
                    <span className="zzz-pagination__num">{item}</span>
                  </>
                ),
              })}
            </li>
          ) : (
            <li key={item} className="zzz-pagination__item zzz-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ),
        )}
        <li className="zzz-pagination__item zzz-pagination__item--next">
          {control(page + 1, {
            label: nextLabel,
            className: 'zzz-pagination__step zzz-pagination__step--next',
            children: (
              <>
                <StepChip />
                <Arrow />
              </>
            ),
          })}
        </li>
      </ul>
    </nav>
  )
}
