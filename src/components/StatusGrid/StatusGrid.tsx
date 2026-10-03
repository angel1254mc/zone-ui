import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { CheckIcon, CloseIcon, createIcon } from '../../icons'
import { Tooltip } from '../Tooltip'
import './StatusGrid.css'

/**
 * - `success`: live accent fill (correct answer, played day, check passed, unlocked)
 * - `error`: red (wrong answer, outage, failed)
 * - `warning`: orange (partial, degraded, late)
 * - `neutral`: grey (skipped, unknown, no data)
 * - `empty`: dark empty slot (not played yet, future day, locked)
 */
export type StatusGridStatus = 'success' | 'error' | 'warning' | 'neutral' | 'empty'

/** `sm` 40, `md` 64, `lg` 88 design-unit squares. */
export type StatusGridSize = 'sm' | 'md' | 'lg'

export interface StatusGridItem {
  status: StatusGridStatus
  /** Short label: shown under the cell (unless `hideLabels`) and used in the accessible name ("Q1: Correct"). */
  label?: ReactNode
  /** Plain-text label for the accessible name when `label` is not a string. */
  labelText?: string
  /** Tooltip content; the cell becomes focusable so keyboard users can open it. */
  tooltip?: ReactNode
  /** Custom content inside the cell (a number, a day, an icon). Replaces the status glyph. */
  content?: ReactNode
  /** Marks the cell as the current one (today, the active step): accent ring + `aria-current`. */
  current?: boolean
  /** React key (defaults to the index). */
  id?: string | number
}

export interface StatusGridOwnProps {
  items: StatusGridItem[]
  /** Default `md`. */
  size?: StatusGridSize
  /** Fixed column count (CSS grid). Default: cells flow and wrap. */
  columns?: number
  /** Status glyphs inside the cells (check / cross / ! / –) so colour is never the only cue. Default true. */
  glyphs?: boolean
  /** Keep the item labels for screen readers only (no captions under the cells). */
  hideLabels?: boolean
  /** Accessible words per status. Defaults: Success, Error, Warning, Neutral, Empty. */
  statusLabels?: Partial<Record<StatusGridStatus, string>>
  ref?: Ref<HTMLUListElement>
}

export type StatusGridProps = StatusGridOwnProps & Omit<ComponentPropsWithoutRef<'ul'>, keyof StatusGridOwnProps | 'children'>

const DEFAULT_WORDS: Record<StatusGridStatus, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  neutral: 'Neutral',
  empty: 'Empty',
}

/** Original heavy "!" on the 32 grid. */
const WarningGlyph = createIcon(
  'StatusWarningGlyph',
  'status-warning',
  <path d="M12.6 4h6.8l-1.2 15.5h-4.4L12.6 4Zm.4 18.5h6V28h-6v-5.5Z" />,
)
/** Heavy dash on the 32 grid. */
const NeutralGlyph = createIcon('StatusNeutralGlyph', 'status-neutral', <path d="M6 13h20v6H6z" />)

const GLYPH: Record<StatusGridStatus, ReactNode> = {
  success: <CheckIcon />,
  error: <CloseIcon />,
  warning: <WarningGlyph />,
  neutral: <NeutralGlyph />,
  empty: null,
}

function textOf(node: ReactNode): string | undefined {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : undefined
}

/**
 * A row / grid of small status tiles (rounded squares with the item-card ring and the black
 * keyline): quiz results, streak histories, uptime bars, achievement boards.
 *
 * Renders a `<ul>` (give it an `aria-label`); each cell is `role="img"` named
 * `label: status word` (e.g. "Q1: Correct") with an aria-hidden glyph, so the colour is never the only carrier.
 */
export function StatusGrid({
  items,
  size = 'md',
  columns,
  glyphs = true,
  hideLabels = false,
  statusLabels,
  className,
  style,
  ref,
  ...rest
}: StatusGridProps) {
  const words = { ...DEFAULT_WORDS, ...statusLabels }
  const vars = (columns ? { '--zzz-status-grid-columns': String(columns), ...style } : style) as CSSProperties

  return (
    <ul
      role="list"
      {...rest}
      ref={ref}
      style={vars}
      className={cx('zzz-status-grid', `zzz-status-grid--${size}`, columns && 'zzz-status-grid--columns', className)}
    >
      {items.map((item, i) => {
        const label = item.labelText ?? textOf(item.label) ?? String(i + 1)
        const name = `${label}: ${words[item.status]}`
        const inner =
          item.content != null ? (
            <span className="zzz-status-grid__content">{item.content}</span>
          ) : glyphs && GLYPH[item.status] ? (
            <span className="zzz-status-grid__glyph" aria-hidden="true">
              {GLYPH[item.status]}
            </span>
          ) : null
        const cell = (
          <span
            className={cx('zzz-status-grid__cell', item.tooltip != null && 'zzz-focusable')}
            data-status={item.status}
            role="img"
            aria-label={name}
            tabIndex={item.tooltip != null ? 0 : undefined}
          >
            {inner}
          </span>
        )
        return (
          <li
            key={item.id ?? i}
            className="zzz-status-grid__item"
            aria-current={item.current ? 'true' : undefined}
            data-current={item.current ? '' : undefined}
          >
            {item.tooltip != null ? <Tooltip content={item.tooltip}>{cell}</Tooltip> : cell}
            {!hideLabels && item.label != null ? (
              <span className="zzz-status-grid__caption" aria-hidden="true">
                {item.label}
              </span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
