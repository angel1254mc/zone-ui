/**
 * Events list / event page glyphs. ~30 × 28, white.
 */
import { createIcon } from './createIcon'
import {
    arcBand,
    circle,
    ellipsePts,
    join,
    polar,
    poly,
    rect,
} from './geometry'
import { CHECK_D } from './actions'

/** Gift box: lid and body split by a vertical ribbon gap, two bow loops on top. */
export const GiftIcon = createIcon(
    'GiftIcon',
    'gift',
    <>
        <path
            d={join(
                rect(0.4, 9.4, 14, 6.2, 1),
                rect(17.6, 9.4, 14, 6.2, 1),
                rect(2.4, 17.2, 12, 14.4, 1.2),
                rect(17.6, 17.2, 12, 14.4, 1.2)
            )}
        />
        <path
            fillRule="evenodd"
            d={join(
                poly(ellipsePts(10.2, 4.9, 5.6, 3.5, 0, Math.PI * 2, 40, 22)),
                poly(ellipsePts(10.5, 5, 2.6, 1.3, 0, Math.PI * 2, 30, 22)),
                poly(ellipsePts(21.8, 4.9, 5.6, 3.5, 0, Math.PI * 2, 40, -22)),
                poly(ellipsePts(21.5, 5, 2.6, 1.3, 0, Math.PI * 2, 30, -22))
            )}
        />
        <path d={rect(13.8, 5.4, 4.4, 3.4, 1)} />
    </>
)

/** Circular arrow (~290°, open at the upper right) with a centre dot. */
export const TargetLoopIcon = createIcon(
    'TargetLoopIcon',
    'targetLoop',
    (() => {
        const ro = 14.6
        const ri = 9.7
        const tip = polar(16, 16.6, (ro + ri) / 2, 22)
        const a = polar(16, 16.6, ro + 3, 64)
        const b = polar(16, 16.6, ri - 3, 64)
        return (
            <>
                <path d={arcBand(16, 16.6, ro, ri, 62, 352)} />
                <path d={poly([a, tip, b], [0.6, 0.8, 0.6])} />
                <path d={circle(16, 16.6, 3.8)} />
            </>
        )
    })()
)

/** Figure-8 hourglass: two stacked loops pinched in the middle, bars top and bottom. */
export const HourglassIcon = createIcon(
    'HourglassIcon',
    'hourglass',
    <>
        <path
            d={join(
                rect(4.6, 0, 22.8, 3.9, 1.2),
                rect(4.6, 28.1, 22.8, 3.9, 1.2)
            )}
        />
        <path
            fillRule="evenodd"
            d={join(
                poly(ellipsePts(16, 10.1, 8.3, 6.5, 0, Math.PI * 2, 48)),
                poly(ellipsePts(16, 10.1, 4, 2.6, 0, Math.PI * 2, 32))
            )}
        />
        <path
            fillRule="evenodd"
            d={join(
                poly(ellipsePts(16, 21.9, 8.3, 6.5, 0, Math.PI * 2, 48)),
                poly(ellipsePts(16, 21.9, 4, 2.6, 0, Math.PI * 2, 32))
            )}
        />
    </>
)

/** "Completed" tick: the CheckIcon glyph in `color.icon.check` green (#48B416). */
export const CompletedCheckIcon = createIcon(
    'CompletedCheckIcon',
    'completedCheck',
    <path
        d={CHECK_D}
        style={{ fill: 'var(--zzz-color-icon-check, #48B416)' }}
    />
)
