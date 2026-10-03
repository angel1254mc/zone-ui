import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { cx } from '../../utils'
import { poly, starPoints, type Pt } from '../../icons/geometry'
import './StarRating.css'

export type StarRatingSize = 'card' | 'pill' | 'bar' | 'large' | 'onLime'

export interface StarRatingProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Filled stars, 0–max (clamped; fractions round down). */
  value: number
  /** Number of stars. Default 5. */
  max?: number
  /**
   * `card` 13×14 at 16.2 pitch (item cards), `pill` 23×24 at 28.8 (side-panel stars pill),
   * `bar` 23 at 32 (equip-list bar), `large` 24 at 34 (big-panel stars pill), `onLime` 23 at 32
   * with a 2 px outline (Overclock bar). Default `card`.
   */
  size?: StarRatingSize
  /**
   * Black outline with a small drop to the lower right (1.5 px; 2 px on lime). Default on (it only
   * shows on art, lime or the grey pill fills).
   */
  outline?: boolean
  /** Accessible name. Default "`n` of `max` stars". */
  label?: string
}

interface StarSpec {
  w: number
  h: number
  pitch: number
  /** outline width (design units) when outlined */
  o: number
}

/**
 * Star box, pitch and outline per size. Boxes are ~1 px wider than the visible 13 / 23 because the
 * rounded tips shave the visible extent.
 */
const SPECS: Record<StarRatingSize, StarSpec> = {
  card: { w: 13.5, h: 14, pitch: 16.2, o: 1.5 },
  pill: { w: 24, h: 24, pitch: 28.8, o: 1.5 },
  bar: { w: 24, h: 24.5, pitch: 32, o: 1.5 },
  large: { w: 25, h: 24.5, pitch: 34, o: 1.5 },
  onLime: { w: 24, h: 24.5, pitch: 32, o: 2 },
}

/** Five-point star with softened tips, stretched to fill a w × h box. */
function starPath(w: number, h: number): string {
  const pts = starPoints(0, 0, 5, 1, 0.58)
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  const sx = w / (Math.max(...xs) - x0)
  const sy = h / (Math.max(...ys) - y0)
  const mapped: Pt[] = pts.map(([x, y]) => [(x - x0) * sx, (y - y0) * sy])
  return poly(
    mapped,
    mapped.map((_, i) => (i % 2 === 0 ? w * 0.085 : w * 0.05)),
  )
}

const PATHS = Object.fromEntries(
  (Object.keys(SPECS) as StarRatingSize[]).map((k) => [k, starPath(SPECS[k].w, SPECS[k].h)]),
) as Record<StarRatingSize, string>

/**
 * Star rating: five-point stars with slightly rounded tips, filled from the left.
 * Filled `color.star.filled`, empty `color.star.empty` (a flat grey, not an outline). Display only:
 * `role="img"` with an "n of max stars" label.
 */
export function StarRating({ value, max = 5, size = 'card', outline, label, className, style, ...rest }: StarRatingProps) {
  const spec = SPECS[size]
  const count = Math.max(0, Math.floor(max))
  const filled = Math.min(count, Math.max(0, Math.floor(Number.isFinite(value) ? value : 0)))
  const outlined = outline ?? true
  const d = PATHS[size]
  const vars = {
    '--zzz-star-w': String(spec.w),
    '--zzz-star-h': String(spec.h),
    '--zzz-star-gap': String(Math.round((spec.pitch - spec.w) * 100) / 100),
    ...style,
  } as CSSProperties

  return (
    <span
      {...rest}
      role="img"
      aria-label={label ?? `${filled} of ${count} stars`}
      data-outline={outlined ? '' : undefined}
      className={cx('zzz-star-rating', `zzz-star-rating--${size}`, className)}
      style={vars}
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          className="zzz-star-rating__star"
          data-filled={i < filled ? '' : undefined}
          viewBox={`0 0 ${spec.w} ${spec.h}`}
          aria-hidden="true"
          focusable="false"
        >
          {outlined ? (
            <path
              className="zzz-star-rating__outline"
              d={d}
              strokeWidth={spec.o * 2}
              strokeLinejoin="round"
              transform={`translate(${spec.o * 0.5} ${spec.o * 0.5})`}
            />
          ) : null}
          {outlined ? <path className="zzz-star-rating__outline" d={d} strokeWidth={spec.o * 1.2} strokeLinejoin="round" /> : null}
          <path className="zzz-star-rating__fill" d={d} />
        </svg>
      ))}
    </span>
  )
}
