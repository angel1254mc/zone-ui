import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { Text } from '../Text'
import './EventRibbon.css'

export interface EventRibbonOwnProps {
  children?: ReactNode
  ref?: Ref<HTMLParagraphElement>
}

export type EventRibbonProps = EventRibbonOwnProps & Omit<ComponentPropsWithoutRef<'p'>, keyof EventRibbonOwnProps>

/** Halftone end zone, in design units (size.ribbon.halftoneZone 50; inner body 33 tall). */
const ZONE = 50
const H = 33
/** Diamond lattice pitch (dots ~5.6 apart along the rows, rows offset by half). */
const PITCH = 5.6

/** Dots of one end (the left one; the right end is the same SVG mirrored in CSS). Radius shrinks toward the centre. */
const DOTS = (() => {
  const out: { x: number; y: number; r: number }[] = []
  const rows = Math.floor(H / (PITCH / 2))
  for (let j = 0; j <= rows; j++) {
    const y = 1.2 + j * (PITCH / 2)
    const offset = j % 2 ? PITCH / 2 : 0
    for (let x = 3 + offset; x < ZONE; x += PITCH) {
      const t = x / ZONE // 0 at the end, 1 toward the centre
      const r = 2.5 * (1 - t) ** 1.2
      if (r >= 0.35) out.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, r: Math.round(r * 100) / 100 })
    }
  }
  return out
})()

function Halftone({ side }: { side: 'start' | 'end' }) {
  return (
    <svg
      className={cx('zzz-event-ribbon__halftone', `zzz-event-ribbon__halftone--${side}`)}
      viewBox={`0 0 ${ZONE} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </svg>
  )
}

/**
 * Subtitle ribbon under an `EventTitle` (e.g. "New Chapter Unlocked"): a full pill 44 tall (4 px black outline + 36 white body, plus a 4 px hard drop) around a `color.event.ribbonFill` body,
 * black centred `bodyXl` text with ~60 px side padding and a black halftone dot fade (~50 px) at both ends,
 * the dots shrinking toward the centre. Static text.
 */
export function EventRibbon({ className, children, ref, ...rest }: EventRibbonProps) {
  return (
    <p {...rest} ref={ref} className={cx('zzz-event-ribbon', className)}>
      <Halftone side="start" />
      <Text role="bodyXl" className="zzz-event-ribbon__text">
        {children}
      </Text>
      <Halftone side="end" />
    </p>
  )
}
