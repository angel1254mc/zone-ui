import type { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react'
import { cx } from '../../utils'
import { CheckInTile } from './CheckInTile'
import type { CheckInTileProps } from './CheckInTile'
import './CheckInCalendar.css'

export interface CheckInCalendarOwnProps {
  /** One entry per day, in order. */
  days: CheckInTileProps[]
  /** Tiles per row. Default 7 (e.g. 7 × 2 at a 144 × 277.5 pitch). */
  columns?: number
  ref?: Ref<HTMLOListElement>
}

export type CheckInCalendarProps = CheckInCalendarOwnProps & Omit<ComponentPropsWithoutRef<'ol'>, keyof CheckInCalendarOwnProps>

/**
 * Daily check-in calendar:
 * `CheckInTile` tickets 141 × 265 in a grid at a 144 × 277.5 pitch. An ordered list; each tile is named
 * "Day 1, 30 × item, claimed".
 */
export function CheckInCalendar({ days, columns = 7, className, style, ref, ...rest }: CheckInCalendarProps) {
  return (
    <ol
      role="list"
      {...rest}
      ref={ref}
      className={cx('zzz-check-in-calendar', className)}
      style={{ '--zzz-check-in-columns': columns, ...style } as CSSProperties}
    >
      {days.map((d, i) => (
        <li key={`${d.day}-${i}`} className="zzz-check-in-calendar__cell">
          <CheckInTile {...d} />
        </li>
      ))}
    </ol>
  )
}
