/**
 * Rank, rarity and badge glyphs (`RankLetterS`, `SlotDigit1`, `HexBadge`, …).
 *
 * The rank letters are heavy italic display letters drawn with the 10° house
 * slant built into the geometry, meant to be knocked out of a coin
 * (the `RankCoin` component composes them).
 */
import { createIcon } from './createIcon'
import { circle, join, poly, starPoints, stroke, type Pt } from './geometry'

/** skewX(-10°) around the vertical centre (y = 16), so the glyph stays centred. */
const ITALIC = 'matrix(1 0 -0.1763 1 2.82 0)'

/** Centre line of an "S" made of two stacked elliptical bowls. */
function sPoints(cx: number, top: number, bottom: number, rx: number, ry: number): Pt[] {
  const c1 = top + ry
  const c2 = bottom - ry
  const pts: Pt[] = []
  const at = (cy: number, deg: number): Pt => {
    const a = (deg * Math.PI) / 180
    return [cx + rx * Math.sin(a), cy - ry * Math.cos(a)]
  }
  for (let d = 80; d >= -180; d -= 10) pts.push(at(c1, d))
  for (let d = 0; d <= 260; d += 10) pts.push(at(c2, d))
  return pts
}

/** Heavy italic "S" with flat-cut terminals. */
export const RankLetterS = createIcon(
  'RankLetterS',
  'rankLetterS',
  <path transform={ITALIC} d={stroke(sPoints(16, 3.3, 28.7, 8.1, 6.15), 6.6)} />,
)

/** Heavy italic "A" with a flat apex and a triangular counter. */
export const RankLetterA = createIcon(
  'RankLetterA',
  'rankLetterA',
  <path
    transform={ITALIC}
    fillRule="evenodd"
    d={join(
      poly(
        [
          [12.3, 0],
          [19.7, 0],
          [28.8, 32],
          [21.6, 32],
          [20.2, 26.3],
          [11.8, 26.3],
          [10.4, 32],
          [3.2, 32],
        ],
        [1, 1, 0.6, 0.6, 0.4, 0.4, 0.6, 0.6],
      ),
      poly(
        [
          [16, 8.6],
          [18.6, 20],
          [13.4, 20],
        ],
        0.4,
      ),
    )}
  />,
)

/** Heavy italic "B". */
export const RankLetterB = createIcon(
  'RankLetterB',
  'rankLetterB',
  <path
    transform={ITALIC}
    fillRule="evenodd"
    d={join(
      'M4.6 0 H18.2 C24.2 0 27.2 3 27.2 7.6 C27.2 11 25.4 13.4 22.8 14.8 C26.2 16 28.4 19 28.4 23 ' +
        'C28.4 28.6 24.8 32 18.6 32 H4.6 Z',
      'M11.4 6 H17.2 C19.4 6 20.4 7.2 20.4 8.9 C20.4 10.6 19.4 11.9 17.2 11.9 H11.4 Z',
      'M11.4 18 H18 C20.4 18 21.6 19.6 21.6 21.8 C21.6 24.1 20.4 25.8 18 25.8 H11.4 Z',
    )}
  />,
)

/**
 * Agent-card rank sun: a 12-point gear with short rounded rays, a black
 * outline and the `color.rank.starburst*` gold gradient. The letter is laid on
 * top by the RankBadge component.
 */
export const RankStarburstIcon = createIcon('RankStarburstIcon', 'rankStarburst', (uid) => (
  <>
    <defs>
      {/* color.rank.starburstTop / Mid / Bottom */}
      <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#F9D127" />
        <stop offset="0.5" stopColor="#F7BC00" />
        <stop offset="1" stopColor="#D7A51D" />
      </linearGradient>
    </defs>
    <path fill="#000" d={poly(starPoints(16, 16, 12, 16, 13.4), [1.3, 0.8])} />
    <path fill={`url(#${uid}-g)`} d={poly(starPoints(16, 16, 12, 14.2, 11.7), [1.1, 0.7])} />
  </>
))

/** A heavy "∞" (replaces the rank letter on one agent card). */
export const InfinityRankIcon = createIcon(
  'InfinityRankIcon',
  'infinityRank',
  <path
    fill="none"
    stroke="currentColor"
    strokeWidth="5.4"
    strokeLinejoin="round"
    d="M16 16 C18.9 11.6 20.9 9.9 22.9 9.9 A6.1 6.1 0 0 1 22.9 22.1 C20.9 22.1 18.9 20.4 16 16 C13.1 11.6 11.1 9.9 9.1 9.9 A6.1 6.1 0 0 0 9.1 22.1 C11.1 22.1 13.1 20.4 16 16 Z"
  />,
)

/**
 * Combat Readiness coin: an orange ring around a dark centre holding an
 * italic orange "S". Orange = `color.icon.combatReadiness`; the dark centre
 * #3C230F, as in CombatBadge.
 */
export const CombatSIcon = createIcon(
  'CombatSIcon',
  'combatS',
  <>
    <path fillRule="evenodd" style={{ fill: 'var(--zzz-color-icon-combat-readiness, #F0680B)' }} d={join(circle(16, 16, 16), circle(16, 16, 12.6))} />
    <path fill="#3C230F" d={circle(16, 16, 12.7)} />
    <path
      transform={ITALIC}
      style={{ fill: 'var(--zzz-color-icon-combat-readiness, #F0680B)' }}
      d={stroke(sPoints(16, 7.6, 24.4, 5, 3.9), 3.9)}
    />
  </>,
)

/* ---------- drive-disc slot numerals: squared "segment" digits ---------- */

const W = 4.2
const seg = (...lines: Pt[][]) => lines.map((l) => stroke(l, W, 0.3))

const DIGITS: Record<number, string[]> = {
  1: seg(
    [
      [11.2, 4.1],
      [17.9, 4.1],
      [17.9, 30],
    ],
    [
      [11.2, 27.9],
      [24.6, 27.9],
    ],
  ),
  2: seg([
    [7.9, 4.1],
    [24.1, 4.1],
    [24.1, 16],
    [7.9, 16],
    [7.9, 27.9],
    [24.1, 27.9],
  ]),
  3: seg(
    [
      [7.9, 4.1],
      [24.1, 4.1],
      [24.1, 27.9],
      [7.9, 27.9],
    ],
    [
      [11.6, 16],
      [22, 16],
    ],
  ),
  4: seg(
    [
      [7.9, 2],
      [7.9, 18.6],
      [26.1, 18.6],
    ],
    [
      [19.6, 9.6],
      [19.6, 30],
    ],
  ),
  5: seg([
    [24.1, 4.1],
    [7.9, 4.1],
    [7.9, 16],
    [24.1, 16],
    [24.1, 27.9],
    [7.9, 27.9],
  ]),
  6: seg([
    [24.1, 4.1],
    [7.9, 4.1],
    [7.9, 27.9],
    [24.1, 27.9],
    [24.1, 16],
    [10, 16],
  ]),
}

function digit(k: number) {
  return (
    <>
      {DIGITS[k]!.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  )
}

/** Squared techno numeral 1 (drive-disc slot hexagon, `#B4B3B6`). */
export const SlotDigit1 = createIcon('SlotDigit1', 'slotDigit1', digit(1))
/** Squared techno numeral 2. */
export const SlotDigit2 = createIcon('SlotDigit2', 'slotDigit2', digit(2))
/** Squared techno numeral 3. */
export const SlotDigit3 = createIcon('SlotDigit3', 'slotDigit3', digit(3))
/** Squared techno numeral 4. */
export const SlotDigit4 = createIcon('SlotDigit4', 'slotDigit4', digit(4))
/** Squared techno numeral 5. */
export const SlotDigit5 = createIcon('SlotDigit5', 'slotDigit5', digit(5))
/** Squared techno numeral 6. */
export const SlotDigit6 = createIcon('SlotDigit6', 'slotDigit6', digit(6))

/**
 * Drive-disc slot hexagon: flat top and bottom, pointed left and right
 * (38 × 36). Fill `color.surface.slotHex`, 2.5-unit `#666568` outline.
 */
export const HexBadge = createIcon(
  'HexBadge',
  'hexBadge',
  <path
    style={{ fill: 'var(--zzz-color-surface-slot-hex, #1A191C)', stroke: '#666568' }}
    strokeWidth="2.5"
    strokeLinejoin="round"
    d={poly(
      [
        [1.25, 16],
        [8.6, 2.1],
        [23.4, 2.1],
        [30.75, 16],
        [23.4, 29.9],
        [8.6, 29.9],
      ],
      0.8,
    )}
  />,
)
