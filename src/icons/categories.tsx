/**
 * Storage category glyphs for IconTabs. Designed for 45 px.
 */
import { createIcon } from './createIcon'
import { circle, join, poly, polar, rect, stroke, type Pt } from './geometry'
import { crossPoints } from './actions'

/** Ring holding a downward triangle outline with a solid triangle nested inside. */
export const WEngineCategoryIcon = createIcon(
  'WEngineCategoryIcon',
  'wEngineCategory',
  (() => {
    const tri = (r: number): Pt[] => [polar(16, 16.8, r, 300), polar(16, 16.8, r, 60), polar(16, 16.8, r, 180)]
    return (
      <>
        <path fillRule="evenodd" d={join(circle(16, 16, 16), circle(16, 16, 12.2))} />
        <path fillRule="evenodd" d={join(poly(tri(13.2), 1.6), poly(tri(7.4), 0.6))} />
        <path d={poly(tri(3.9), 0.5)} />
      </>
    )
  })(),
)

/** Disc: outer ring with rectangular tabs on both sides, an inner ring and a centre dot. */
export const DriveDiscCategoryIcon = createIcon(
  'DriveDiscCategoryIcon',
  'driveDiscCategory',
  <>
    <path fillRule="evenodd" d={join(circle(16, 16, 13.4), circle(16, 16, 9.6))} />
    <path d={join(rect(0, 9.2, 4.6, 4.8, 0.8), rect(0, 18, 4.6, 4.8, 0.8), rect(27.4, 9.2, 4.6, 4.8, 0.8), rect(27.4, 18, 4.6, 4.8, 0.8))} />
    <path fillRule="evenodd" d={join(circle(16, 16, 7.4), circle(16, 16, 5.2))} />
    <path d={circle(16, 16, 3)} />
  </>,
)

/** Crate: a lid bar over a body with a bold X knocked out. */
export const MaterialsCategoryIcon = createIcon(
  'MaterialsCategoryIcon',
  'materialsCategory',
  <>
    <path d={rect(0.5, 2.5, 31, 6.4, 1)} />
    <path fillRule="evenodd" d={join(rect(2.4, 10.6, 27.2, 19, 1.6), poly(crossPoints(16, 20.1, 7.4, 2.2, 45), 0.4))} />
  </>,
)

/** Safe: a rounded body with an inner outline square holding a dial with one hand. */
export const ConsumablesCategoryIcon = createIcon(
  'ConsumablesCategoryIcon',
  'consumablesCategory',
  <>
    <path
      fillRule="evenodd"
      d={join(
        rect(1, 0.5, 30, 28.5, 4.2),
        rect(4.4, 3.9, 23.2, 21.7, 2.4),
        rect(6.4, 5.9, 19.2, 17.7, 1.4),
        circle(16, 14.75, 6.8),
        circle(16, 14.75, 4.6),
        stroke([polar(16, 14.75, 0.8, 120), polar(16, 14.75, 3.9, 300)], 2.2, 0.3),
      )}
    />
    <path d={join(rect(5, 28, 5, 3.5, 0.8), rect(22, 28, 5, 3.5, 0.8))} />
  </>,
)
