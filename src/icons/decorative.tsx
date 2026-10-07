/**
 * Glyph-like decorative vectors. Monochrome (currentColor);
 * the intended colour token is named on each.
 */
import { createIcon } from './createIcon'
import { circle, join, poly, rect } from './geometry'

/**
 * EMPTY-slot X: two 45° strokes, stroke = 12.5 % of the box, round caps. The
 * "\" stroke breaks just below-right of the crossing, as if it passes under
 * the "/". Colour `color.icon.emptyX` (#252525); 72 px on a 115 slot.
 */
export const EmptySlotX = createIcon(
    'EmptySlotX',
    'emptySlotX',
    <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M2 30 L30 2" />
        <path d="M2 2 L16 16" />
        <path d="M21.7 21.7 L30 30" />
    </g>
)

/**
 * Overclock-bar chevron: a full-height ">" cut ~6 units thick, arms ~19°
 * from vertical, slightly concave. Meant as a mask (black on lime).
 * Use `preserveAspectRatio="none"` to stretch it to the bar height.
 */
export const OverclockChevron = createIcon(
    'OverclockChevron',
    'overclockChevron',
    <path d="M10.1 0 H16.5 Q18.9 8.4 22 16 Q18.9 23.6 16.5 32 H10.1 Q12.5 23.6 15.6 16 Q12.5 8.4 10.1 0 Z" />
)

/** UID-footer signal strength: 3 bars at a 6 pitch, heights 4 / 10 / 15, rounded tops. `color.icon.signal`. */
export const SignalBars = createIcon(
    'SignalBars',
    'signalBars',
    <path
        d={join(
            ...[
                [0, 7.5],
                [11.75, 18.8],
                [23.5, 28.2],
            ].map(([x, h]) =>
                poly(
                    [
                        [x!, 30.1 - h!],
                        [x! + 8.5, 30.1 - h!],
                        [x! + 8.5, 30.1],
                        [x!, 30.1],
                    ],
                    [1.6, 1.6, 0, 0]
                )
            )
        )}
    />
)

/** Film sprocket hole: a 15 × 30 rounded rectangle (r 3). Repeated every 57 px on the Home events strip. */
export const FilmSprocket = createIcon(
    'FilmSprocket',
    'filmSprocket',
    <path d={rect(8, 0, 16, 32, 3.2)} />
)

/** EVENTS-cap ornament: a 4 × 3 grid of 4 px dots at an 8 px pitch. */
export const DotGridOrnament = createIcon(
    'DotGridOrnament',
    'dotGridOrnament',
    <path
        d={join(
            ...[6.86, 16, 25.14].flatMap((y) =>
                [2.29, 11.43, 20.57, 29.71].map((x) => circle(x, y, 2.29))
            )
        )}
    />
)
