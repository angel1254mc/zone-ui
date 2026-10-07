/**
 * Actions and navigation glyphs.
 *
 * Grid convention for the whole set: the glyph's larger dimension spans the
 * full 32-unit viewBox, so `size` equals the glyph's box in design units.
 * All shapes are original geometry.
 */
import { createIcon } from './createIcon'
import {
    arcBand,
    bar,
    circle,
    join,
    polar,
    poly,
    rect,
    starPoints,
    stroke,
    type Pt,
} from './geometry'

/* ---------- shared shapes ---------- */

/** Plus / cross outline centred on (cx, cy); `L` arm half-length, `h` half-thickness, rotated `rot`°. */
export function crossPoints(
    cx: number,
    cy: number,
    L: number,
    h: number,
    rot = 0
): Pt[] {
    const raw: Pt[] = [
        [h, -L],
        [h, -h],
        [L, -h],
        [L, h],
        [h, h],
        [h, L],
        [-h, L],
        [-h, h],
        [-L, h],
        [-L, -h],
        [-h, -h],
        [-h, -L],
    ]
    const a = (rot * Math.PI) / 180
    const c = Math.cos(a)
    const s = Math.sin(a)
    return raw.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as Pt)
}

/** Heavy tick used by CheckIcon and CompletedCheckIcon: short left arm, long right arm. */
export const CHECK_D = stroke(
    [
        [3.1, 15.2],
        [12, 24.1],
        [29, 6.6],
    ],
    7.4,
    [0.9, 0.9, 0.6, 0.9, 0.9, 0.6]
)

/** Five-point star with softened tips (StarIcon, star ratings). */
export const STAR_D = poly(
    starPoints(16, 17.35, 5, 17.6, 8.6),
    [2.6, 0.6, 2.6, 0.6, 2.6, 0.6, 2.6, 0.6, 2.6, 0.6]
)

/** U-turn arrow shared by Back (flat, wide). */
const BACK_D =
    'M0 10.2 L11.2 3.4 V7 H21.2 A10.8 10.8 0 0 1 21.2 28.6 H9.9 V23.1 H21.2 ' +
    'A4.65 4.65 0 0 0 21.2 13.8 H11.2 V17 Z'

/* ---------- glyphs ---------- */

/** Thick "return" U-turn arrow. Red on the Back tag; box 34 × 26. */
export const BackIcon = createIcon('BackIcon', 'back', <path d={BACK_D} />)

/** Two crossing 45° bars. Box 24 × 23. */
export const CloseIcon = createIcon(
    'CloseIcon',
    'close',
    <path d={poly(crossPoints(16, 16, 19.1, 3.5, 45), 0.9)} />
)

/** Solid house with a door knock-out. Box 28 × 26. */
export const HomeIcon = createIcon(
    'HomeIcon',
    'home',
    <path
        fillRule="evenodd"
        d={join(
            poly(
                [
                    [16, 0],
                    [32, 11.6],
                    [32, 15],
                    [28.7, 15],
                    [28.7, 30.75],
                    [3.3, 30.75],
                    [3.3, 15],
                    [0, 15],
                    [0, 11.6],
                ],
                [4.4, 0.7, 0.5, 0.5, 0.8, 0.8, 0.5, 0.5, 0.7]
            ),
            rect(12.2, 15.2, 7.6, 11.6, 0.6)
        )}
    />
)

/** Solid funnel (flat top, straight taper, narrow stem). Box 21 × 24. */
export const FilterIcon = createIcon(
    'FilterIcon',
    'filter',
    <path d="M2 1 H30 Q32 1 32 3 V5.9 Q32 7.4 31 8.5 L21.4 19.1 Q19.9 20.7 19.9 22.8 V29.8 Q19.9 31 18.7 31 H13.3 Q12.1 31 12.1 29.8 V22.8 Q12.1 20.7 10.6 19.1 L1 8.5 Q0 7.4 0 5.9 V3 Q0 1 2 1 Z" />
)

/** Keyhole outline (circle + slot) used by the padlocks. */
function keyhole(
    cx: number,
    cy: number,
    r: number,
    slotW: number,
    slotBottom: number
): string {
    const hw = slotW / 2
    const dy = Math.sqrt(r * r - hw * hw)
    return (
        `M${cx - hw} ${cy + dy} A${r} ${r} 0 1 1 ${cx + hw} ${cy + dy} ` +
        `V${slotBottom - 0.6} Q${cx + hw} ${slotBottom} ${cx + hw - 0.6} ${slotBottom} H${cx - hw + 0.6} ` +
        `Q${cx - hw} ${slotBottom} ${cx - hw} ${slotBottom - 0.6} Z`
    )
}

/** Solid padlock with a knocked-out keyhole. Glyph ~25 × 30. */
export const LockIcon = createIcon(
    'LockIcon',
    'lock',
    <>
        <path d="M6.7 14 V9.3 A9.3 9.3 0 0 1 25.3 9.3 V14 H20.5 V9.3 A4.5 4.5 0 0 0 11.5 9.3 V14 Z" />
        <path
            fillRule="evenodd"
            d={join(
                rect(2.65, 12.8, 26.7, 19.2, 2.4),
                keyhole(16, 20.4, 2.3, 2.3, 26.9)
            )}
        />
    </>
)

/** The padlock with its shackle raised and the right leg lifted clear. Glyph 22 × 28. */
export const UnlockIcon = createIcon(
    'UnlockIcon',
    'unlock',
    <>
        <path d="M5.4 16 V8.6 A8.6 8.6 0 0 1 22.6 8.6 V11.2 H17.9 V8.6 A3.9 3.9 0 0 0 10.1 8.6 V16 Z" />
        <path
            fillRule="evenodd"
            d={join(
                rect(2.8, 14.4, 26.4, 17.6, 2.4),
                keyhole(16, 21.6, 2.2, 2.2, 27.4)
            )}
        />
    </>
)

/** Solid bin: tapered body with two slots, lid bar with a handle bump. Box 23 × 32. */
export const TrashIcon = createIcon(
    'TrashIcon',
    'trash',
    <>
        <path d="M11.4 5.2 V2 Q11.4 0.4 13 0.4 H19 Q20.6 0.4 20.6 2 V5.2 H18.1 V3 H13.9 V5.2 Z" />
        <path d={rect(4.4, 4.6, 23.2, 4.8, 1.4)} />
        <path
            fillRule="evenodd"
            d={join(
                poly(
                    [
                        [5.9, 11],
                        [26.1, 11],
                        [24.6, 32],
                        [7.4, 32],
                    ],
                    [0.8, 0.8, 2.6, 2.6]
                ),
                rect(10.7, 15, 3.1, 12.8, 1.5),
                rect(18.2, 15, 3.1, 12.8, 1.5)
            )}
        />
    </>
)

/** Five-point star with slightly rounded tips (favourites, ratings). */
export const StarIcon = createIcon('StarIcon', 'star', <path d={STAR_D} />)

/** Two bars crossing at the centre, flat ends. Box 26 × 26. */
export const PlusIcon = createIcon(
    'PlusIcon',
    'plus',
    <path
        d={poly(
            crossPoints(16, 16, 16, 3.8),
            [0.8, 0.5, 0.8, 0.8, 0.5, 0.8, 0.8, 0.5, 0.8, 0.8, 0.5, 0.8]
        )}
    />
)

/** One flat bar. Box 25 × 7. */
export const MinusIcon = createIcon(
    'MinusIcon',
    'minus',
    <path d={rect(0, 11.75, 32, 8.5, 0.8)} />
)

/** Heavy check: short left arm, long right arm, ~90°. Box ~22 × 16. */
export const CheckIcon = createIcon('CheckIcon', 'check', <path d={CHECK_D} />)

/** Rounded-square outline broken at the top-right corner, the corner piece lifted off. ~18 on a 34 disc. */
export const RecycleIcon = createIcon(
    'RecycleIcon',
    'recycle',
    <>
        <path
            d={poly(
                [
                    [16.4, 1.2],
                    [0, 1.2],
                    [0, 32],
                    [30.8, 32],
                    [30.8, 17.4],
                    [23.8, 17.4],
                    [23.8, 25],
                    [7, 25],
                    [7, 8.2],
                    [16.4, 8.2],
                ],
                [0.5, 5.2, 5.2, 5.2, 0.5, 0.5, 1.4, 1.4, 1.4, 0.5]
            )}
        />
        <path d={rect(21.2, 0, 10.8, 12.2, 1.8)} />
    </>
)

/**
 * Return arrow built like BackIcon (Back is the base of ResetIcon): a solid
 * left-pointing arrowhead at the top-left, a short top bar turning down through a
 * semicircle on the right, and a flat bottom bar running back left. Stroke 5.4 units
 * (~3.4 px at the 20 px glyph on the 32 disc), flat ends. ~20 on a 32 disc.
 */
const RESET_D = (() => {
    const cx = 17.65 // semicircle centre x
    const top = 5.8 // outer top of the top bar
    const bot = 32 // outer bottom of the bottom bar
    const w = 5.4 // stroke
    const ro = (bot - top) / 2
    const ri = ro - w
    const cy = top + ro
    const f = (v: number) => Math.round(v * 100) / 100
    return (
        `M1.25 ${f(cy - ro + w / 2)} L14.4 0 V${top} H${cx} ` +
        `A${f(ro)} ${f(ro)} 0 0 1 ${cx} ${bot} H4.5 V${f(bot - w)} H${cx} ` +
        `A${f(ri)} ${f(ri)} 0 0 0 ${cx} ${f(top + w)} H14.4 V${f(2 * (top + w / 2))} Z`
    )
})()

export const ResetIcon = createIcon('ResetIcon', 'reset', <path d={RESET_D} />)

/** Rounded square: left half solid, right half an outline, nubs on the divider. ~18 on a 34 disc. */
export const CompareIcon = createIcon(
    'CompareIcon',
    'compare',
    <>
        <path
            fillRule="evenodd"
            d={join(
                rect(0.8, 4.4, 30.4, 23.2, 5),
                rect(17.6, 10, 8.8, 13.6, 1.4)
            )}
        />
        <path d={rect(12.8, 0, 6.4, 6, 1.2)} />
        <path d={rect(12.8, 26, 6.4, 6, 1.2)} />
    </>
)

/** Target: a heavy disc with a knocked-out centre dot and an arc slit at the upper right. ~22 on a 34 disc. */
export const RecommendIcon = createIcon(
    'RecommendIcon',
    'recommend',
    <path
        fillRule="evenodd"
        d={join(
            circle(16, 16, 16),
            circle(16, 16.4, 5.9),
            arcBand(16, 16.2, 12.6, 8.4, 8, 88)
        )}
    />
)

/** One notched chevron (>) of the Enhance glyph. */
function chevron(x0: number): string {
    return poly(
        [
            [x0, 5.2],
            [x0 + 6.6, 5.2],
            [x0 + 15, 16],
            [x0 + 6.6, 26.8],
            [x0, 26.8],
            [x0 + 6.2, 16],
        ],
        [1, 1, 1.2, 1, 1, 0.6]
    )
}

/** ">>": two heavy notched chevrons. Box 37 × 25. */
export const EnhanceIcon = createIcon(
    'EnhanceIcon',
    'enhance',
    <path d={join(chevron(0), chevron(17))} />
)

/** Info "(i)": a ring open at 12 o'clock, a bar from the gap and a dot below. Box 31 × 31. */
export const InfoAlertIcon = createIcon(
    'InfoAlertIcon',
    'infoAlert',
    <>
        <path d={arcBand(16, 16, 16, 11.3, 20, 340)} />
        <path d={rect(14, 3.6, 4, 13, 0.8)} />
        <path d={rect(13, 19, 6, 5, 1)} />
    </>
)

/** Outline clock / timer: a ring with a tapered hand toward half past one. Box 27. */
export const ClockIcon = createIcon(
    'ClockIcon',
    'clock',
    <>
        <path
            fillRule="evenodd"
            d={join(circle(16, 16, 16), circle(16, 16, 11.8))}
        />
        <path
            d={(() => {
                const tip = polar(16, 16, 9.6, 48)
                const a = polar(16, 16, 2.9, 48 - 90)
                const b = polar(16, 16, 2.9, 48 + 90)
                const back = polar(16, 16, 2.9, 48 + 180)
                return `M${a[0]} ${a[1]} L${tip[0]} ${tip[1]} L${b[0]} ${b[1]} A2.9 2.9 0 0 1 ${back[0]} ${back[1]} A2.9 2.9 0 0 1 ${a[0]} ${a[1]} Z`
            })()}
        />
    </>
)

/** Outline circle with a centred bold "!". Box 27. */
export const ExclaimCircleIcon = createIcon(
    'ExclaimCircleIcon',
    'exclaimCircle',
    <path
        fillRule="evenodd"
        d={join(
            circle(16, 16, 16),
            circle(16, 16, 12),
            rect(13.8, 7, 4.4, 11, 1),
            rect(13.8, 20.4, 4.4, 4.4, 1.1)
        )}
    />
)

/** Magnifier: a thick ring with a short 45° handle. Box 22. */
export const SearchIcon = createIcon(
    'SearchIcon',
    'search',
    <>
        <path
            fillRule="evenodd"
            d={join(circle(12.6, 12.6, 12.6), circle(12.6, 12.6, 6.8))}
        />
        <path d={bar([20.2, 20.2], [29.6, 29.6], 6.6, 1.2)} />
    </>
)

/** Solid downward triangle, slightly rounded. Box 15 × 14. */
export const CaretDownIcon = createIcon(
    'CaretDownIcon',
    'caretDown',
    <path
        d={poly(
            [
                [0, 1.1],
                [32, 1.1],
                [16, 30.9],
            ],
            [2.2, 2.2, 3]
        )}
    />
)

/** Tiny solid triangle, pointing up (scrollbar cap). Box 9 × 8. */
export const ScrollArrowUpIcon = createIcon(
    'ScrollArrowUpIcon',
    'scrollArrowUp',
    <path
        d={poly(
            [
                [16, 1.8],
                [32, 30.2],
                [0, 30.2],
            ],
            1.2
        )}
    />
)

/** Tiny solid triangle, pointing down (scrollbar cap). Box 9 × 8. */
export const ScrollArrowDownIcon = createIcon(
    'ScrollArrowDownIcon',
    'scrollArrowDown',
    <path
        d={poly(
            [
                [0, 1.8],
                [32, 1.8],
                [16, 30.2],
            ],
            1.2
        )}
    />
)

/** Thin-ish chevron pointing left. Box 10 × 18. */
export const ChevronLeftIcon = createIcon(
    'ChevronLeftIcon',
    'chevronLeft',
    <path
        d={stroke(
            [
                [23.4, 2.2],
                [8.6, 16],
                [23.4, 29.8],
            ],
            5.2,
            0.6
        )}
    />
)

/** Thin-ish chevron pointing right. Box 10 × 18. */
export const ChevronRightIcon = createIcon(
    'ChevronRightIcon',
    'chevronRight',
    <path
        d={stroke(
            [
                [8.6, 2.2],
                [23.4, 16],
                [8.6, 29.8],
            ],
            5.2,
            0.6
        )}
    />
)

/** Two bars: the left one with a head at the bottom, the right one with a head at the top. Box 29 × 26. */
export const SortIcon = createIcon(
    'SortIcon',
    'sort',
    <>
        <path
            d={poly(
                [
                    [4.7, 1.7],
                    [11.3, 1.7],
                    [11.3, 18.4],
                    [15.6, 18.4],
                    [8, 30.3],
                    [0.4, 18.4],
                    [4.7, 18.4],
                ],
                [0.6, 0.6, 0.3, 0.7, 1, 0.7, 0.3]
            )}
        />
        <path
            d={poly(
                [
                    [27.3, 30.3],
                    [20.7, 30.3],
                    [20.7, 13.6],
                    [16.4, 13.6],
                    [24, 1.7],
                    [31.6, 13.6],
                    [27.3, 13.6],
                ],
                [0.6, 0.6, 0.3, 0.7, 1, 0.7, 0.3]
            )}
        />
    </>
)

/** Four-point sparkle (concave star) centred on (cx, cy). */
export function sparkle(
    cx: number,
    cy: number,
    r: number,
    pinch = 0.18
): string {
    const k = r * pinch
    return (
        `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} ` +
        `Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r} Z`
    )
}

/** Coat hanger (outfit) with two sparkles at the top right. Box 36. */
export const HangerIcon = createIcon(
    'HangerIcon',
    'hanger',
    <>
        <path d="M13.2 9.6 A4.3 4.3 0 1 1 18.6 13.7 L17.9 16.3 H14.5 L15.4 11.6 A1.6 1.6 0 1 0 15.8 9.6 Z" />
        <path
            fillRule="evenodd"
            d={join(
                poly(
                    [
                        [16, 13.2],
                        [31.5, 26.4],
                        [31.5, 29.8],
                        [0.5, 29.8],
                        [0.5, 26.4],
                    ],
                    [1.2, 1.4, 1, 1, 1.4]
                ),
                poly(
                    [
                        [16, 18.4],
                        [25.4, 26.2],
                        [6.6, 26.2],
                    ],
                    0.6
                )
            )}
        />
        <path d={join(sparkle(26.2, 5.2, 4.6), sparkle(30.2, 12, 2.6))} />
    </>
)

/** Cloud of three blobs with a knocked-out swirl (photo / free-camera mode). ~34. */
export const CameraModeIcon = createIcon(
    'CameraModeIcon',
    'cameraMode',
    (uid) => (
        <>
            <defs>
                <mask
                    id={`${uid}-m`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="32"
                    height="32"
                >
                    <rect width="32" height="32" fill="#fff" />
                    <path
                        d={arcBand(16.4, 18.6, 5.4, 2.6, 40, 330)}
                        fill="#000"
                    />
                    <path d={circle(16.4, 18.6, 1.2)} fill="#000" />
                </mask>
            </defs>
            <g mask={`url(#${uid}-m)`}>
                <path d={circle(9.2, 18.6, 7.4)} />
                <path d={circle(17.4, 12.6, 9.4)} />
                <path d={circle(25.2, 19.4, 6.8)} />
                <path d={rect(4.6, 17.6, 24, 8.4, 3.8)} />
            </g>
        </>
    )
)

/** Metallic film-reel disc: five rounded knock-outs around a small hub. Rendered as an illustration (fixed greys). 60. */
export const ArchiveReelIcon = createIcon(
    'ArchiveReelIcon',
    'archiveReel',
    (uid) => {
        const holes = [0, 72, 144, 216, 288].map((a) => {
            const [x, y] = polar(16, 16, 9.4, a + 36)
            return circle(x, y, 4.3)
        })
        return (
            <>
                <defs>
                    {/* Neutral metallic greys (no token: illustration). */}
                    <linearGradient
                        id={`${uid}-g`}
                        x1="0.2"
                        y1="0"
                        x2="0.8"
                        y2="1"
                    >
                        <stop offset="0" stopColor="#F2F2F2" />
                        <stop offset="0.45" stopColor="#B9B9B9" />
                        <stop offset="0.7" stopColor="#8C8C8C" />
                        <stop offset="1" stopColor="#D2D2D2" />
                    </linearGradient>
                </defs>
                <path
                    fill={`url(#${uid}-g)`}
                    fillRule="evenodd"
                    d={join(circle(16, 16, 16), ...holes, circle(16, 16, 3.3))}
                />
                <path fill={`url(#${uid}-g)`} d={circle(16, 16, 1.9)} />
                <path
                    fill="#3A3A3A"
                    fillRule="evenodd"
                    d={join(circle(16, 16, 16), circle(16, 16, 14.9))}
                />
            </>
        )
    }
)
