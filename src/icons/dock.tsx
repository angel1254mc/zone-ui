/**
 * Home dock glyphs. White (56–64 tall), with an
 * external dark outline applied by the consumer via `filter: shadow.iconOutline`.
 * City Fund and Signal Search are coloured.
 */
import { createIcon } from './createIcon'
import { arcBand, circle, ellipse, ellipsePts, join, polar, poly, rect, starPoints, stroke, type Pt } from './geometry'
import { crossPoints } from './actions'

/** "Z" letter polygon (top bar, diagonal, bottom bar). */
export function zPoints(x0: number, y0: number, x1: number, y1: number, t: number, d: number): Pt[] {
  return [
    [x0, y0],
    [x1, y0],
    [x1, y0 + t],
    [x0 + d, y1 - t],
    [x1, y1 - t],
    [x1, y1],
    [x0, y1],
    [x0, y1 - t],
    [x1 - d, y0 + t],
    [x0, y0 + t],
  ]
}

/** 3 × 3 dots, the top-right one replaced by a small "+". */
export const MoreIcon = createIcon(
  'MoreIcon',
  'more',
  <path
    d={join(
      ...[4.4, 16, 27.6].flatMap((y) => [4.4, 16, 27.6].filter((x) => !(x === 27.6 && y === 4.4)).map((x) => circle(x, y, 4.2))),
      poly(crossPoints(27.6, 4.4, 4.4, 1.55), 0.3),
    )}
  />,
)

/**
 * A bust outline in front, two smaller solid busts behind it, spread wide.
 * Wide grid (`0 0 40.5 32`): the glyph is 76 × 55 at a 60 dock height.
 */
export const SquadIcon = createIcon(
  'SquadIcon',
  'squad',
  (uid) => {
    const W = 40.5
    const frontOuter = 'M9.45 31.5 V26.4 C9.45 20.4 14.05 17.3 20.25 17.3 C26.45 17.3 31.05 20.4 31.05 26.4 V31.5 Z'
    const frontInner = 'M12.85 28.4 V26.4 C12.85 22.6 15.65 20.5 20.25 20.5 C24.85 20.5 27.65 22.6 27.65 26.4 V28.4 Z'
    const back = (cx: number) =>
      join(circle(cx, 12.2, 4.1), `M${cx - 5.9} 28.8 V25 C${cx - 5.9} 21 ${cx - 3.4} 18.6 ${cx} 18.6 C${cx + 3.4} 18.6 ${cx + 5.9} 21 ${cx + 5.9} 25 V28.8 Z`)
    return (
      <>
        <defs>
          <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height="32">
            <rect width={W} height="32" fill="#fff" />
            <path d={join(circle(20.25, 9.2, 8.9), frontOuter)} fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          </mask>
        </defs>
        <path mask={`url(#${uid}-m)`} d={join(back(5.9), back(W - 5.9))} />
        <path fillRule="evenodd" d={join(circle(20.25, 9.2, 7.4), circle(20.25, 9.2, 4.2), frontOuter, frontInner)} />
      </>
    )
  },
  { viewBoxWidth: 40.5 },
)

/**
 * Solid envelope with the flap "V" knocked out and a bold "M" badge at the bottom right.
 * Wide grid (`0 0 41 32`): the glyph is 77 × 50 at a 60 dock height.
 */
export const MailIcon = createIcon(
  'MailIcon',
  'mail',
  (uid) => {
    const W = 41
    const [x0, x1, y0, y1] = [27.4, 41, 19.9, 30.3]
    const mid = (x0 + x1) / 2
    const m = poly(
      [
        [x0, y1],
        [x0, y0],
        [x0 + 3.4, y0],
        [mid, y0 + 3.9],
        [x1 - 3.4, y0],
        [x1, y0],
        [x1, y1],
        [x1 - 3, y1],
        [x1 - 3, y0 + 5.3],
        [mid, y0 + 9.2],
        [x0 + 3, y0 + 5.3],
        [x0 + 3, y1],
      ],
      0.3,
    )
    return (
      <>
        <defs>
          <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height="32">
            <rect width={W} height="32" fill="#fff" />
            <path d={m} fill="#000" stroke="#000" strokeWidth="4.4" strokeLinejoin="round" />
          </mask>
        </defs>
        <path
          mask={`url(#${uid}-m)`}
          fillRule="evenodd"
          d={join(
            rect(0, 3.7, 36.4, 22.6, 2.4),
            stroke(
              [
                [4, 7.6],
                [18.2, 17.4],
                [32.4, 7.6],
              ],
              3,
              0.4,
            ),
          )}
        />
        <path d={m} />
      </>
    )
  },
  { viewBoxWidth: 41 },
)

/** Scalloped gear (8 rounded teeth) with a crescent "C" cut out of the centre, open to the upper right. */
export const OptionsIcon = createIcon(
  'OptionsIcon',
  'options',
  <path fillRule="evenodd" d={join(poly(starPoints(16, 16, 8, 16.4, 12.2, 0), 2.6), arcBand(16, 16, 7.2, 2.8, 62, 372))} />,
)

/** Megaphone: a rounded back cup with a handle and a tall flared horn. */
export const NoticesIcon = createIcon(
  'NoticesIcon',
  'notices',
  <>
    <path d={poly([[0.6, 9.4], [10.8, 9.4], [10.8, 21.4], [0.6, 21.4]], [4.4, 0.8, 0.8, 4.4])} />
    <path d={poly([[5.2, 20], [9.6, 20], [10.2, 31], [6.8, 31]], 0.7)} />
    <path
      d={poly(
        [
          [12.4, 9.2],
          [26.6, 0.8],
          [28.2, 1.6],
          [28.2, 28.4],
          [26.6, 29.2],
          [12.4, 21.4],
        ],
        [0.6, 1.6, 1.2, 1.2, 1.6, 0.6],
      )}
    />
    <path d={ellipse(28.4, 15, 3.4, 8.2)} />
  </>,
)

/** Round badge with an original stacked double-Z monogram knocked out. */
export const AchievementsIcon = createIcon(
  'AchievementsIcon',
  'achievements',
  <>
    <path fillRule="evenodd" d={join(circle(16, 16, 16), circle(16, 16, 12.9))} />
    <path
      fillRule="evenodd"
      d={join(circle(16, 16, 10.9), poly(zPoints(10.2, 8.6, 22.2, 14.6, 2.5, 3.4), 0.3), poly(zPoints(9.8, 17.4, 21.8, 23.4, 2.5, 3.4), 0.3))}
    />
  </>,
)

/**
 * Two wire-frame globes over a tiny "INTER-KNOT" caption (live text, condensed face).
 * Wide grid (`0 0 46 32`): the glyph is ~86 wide at a 60 dock height.
 */
export const InterKnotIcon = createIcon(
  'InterKnotIcon',
  'interKnot',
  <>
    <g fill="none" stroke="currentColor" strokeWidth="2.3">
      {[12.2, 33.8].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="12" r="10.9" />
          <ellipse cx={cx} cy="12" rx="4.5" ry="10.9" />
          <path d={`M${cx - 10.8} 12 H${cx + 10.8} M${cx - 9} 6 H${cx + 9} M${cx - 9} 18 H${cx + 9}`} />
        </g>
      ))}
    </g>
    <text
      x="23"
      y="31.2"
      textAnchor="middle"
      fontSize="7"
      fontWeight="900"
      textLength="34"
      lengthAdjust="spacingAndGlyphs"
      style={{ fontFamily: 'var(--zzz-font-family-condensed, Impact, "Arial Narrow", sans-serif)' }}
    >
      INTER-KNOT
    </text>
  </>,
  { viewBoxWidth: 46 },
)

/** Arms of a "Y" around (cx, cy): one bar per angle, joined in the middle. */
function yPoints(cx: number, cy: number, angles: readonly number[], L: number, h: number): Pt[] {
  const out: Pt[] = []
  const sorted = [...angles].sort((a, b) => a - b)
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i]!
    const b = sorted[(i + 1) % sorted.length]! + (i === sorted.length - 1 ? 360 : 0)
    const tip = polar(cx, cy, L, a)
    const [ux, uy] = [(tip[0] - cx) / L, (tip[1] - cy) / L]
    // clockwise order: left corner then right corner of this arm's tip
    out.push([tip[0] - uy * h, tip[1] + ux * h])
    out.push([tip[0] + uy * h, tip[1] - ux * h])
    const half = (b - a) / 2
    out.push(polar(cx, cy, h / Math.sin((half * Math.PI) / 180), a + half))
  }
  return out
}

/** Isometric cube: a solid hexagon with its three inner edges knocked out. */
export const StorageIcon = createIcon(
  'StorageIcon',
  'storage',
  <path
    fillRule="evenodd"
    d={join(poly([0, 60, 120, 180, 240, 300].map((a) => polar(16, 16, 16, a)), 2.4), poly(yPoints(16, 16, [60, 180, 300], 10.6, 1.35), 0.2))}
  />,
)

/**
 * A small figure standing inside a wide, flat, tilted planet ring.
 * Wide grid (`0 0 56 32`): the glyph is 105 × 48 at a 60 dock height.
 */
export const AgentsIcon = createIcon(
  'AgentsIcon',
  'agents',
  (uid) => {
    const W = 56
    const cx = 28
    const cy = 20.4
    const tilt = -9
    const ringOuter = ellipsePts(cx, cy, 28.2, 7.4, 0, Math.PI * 2, 96, tilt)
    const ringInner = ellipsePts(cx, cy, 21, 3.7, 0, Math.PI * 2, 96, tilt)
    const front = [...ellipsePts(cx, cy, 30.2, 9.4, 0, Math.PI, 48, tilt), ...ellipsePts(cx, cy, 11.4, 1.8, Math.PI, 0, 36, tilt)]
    return (
      <>
        <defs>
          <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height="32">
            <rect width={W} height="32" fill="#fff" />
            <path d={poly(front)} fill="#000" />
          </mask>
        </defs>
        <path
          mask={`url(#${uid}-m)`}
          d={join(circle(29, 8.4, 5.3), 'M20.8 27 C20.8 18 24 14.2 29 14.2 C34 14.2 37.2 18 37.2 27 Z')}
        />
        <path fillRule="evenodd" d={join(poly(ringOuter), poly(ringInner))} />
      </>
    )
  },
  { viewBoxWidth: 56 },
)

/** "24" numerals over a tiny "HOUR" caption (numerals are paths, caption is live text). */
export const StoreIcon = createIcon(
  'StoreIcon',
  'store',
  <>
    <path d={arcBand(9.6, 7.2, 6.9, 2.5, 292, 482)} />
    <path
      d={poly(
          [
            [11.8, 8.4],
            [15.6, 10.6],
            [9.7, 16.8],
            [16.6, 16.8],
            [16.6, 21.4],
            [2.8, 21.4],
            [2.8, 17.6],
          ],
          [0.2, 0.4, 0.2, 0.5, 0.5, 0.5, 0.4],
        )}
    />
    <path
      fillRule="evenodd"
      d={join(
        poly(
          [
            [23.9, 4.6],
            [28.2, 4.6],
            [28.2, 16.4],
            [31.2, 16.4],
            [31.2, 20.2],
            [28.2, 20.2],
            [28.2, 23.8],
            [23.9, 23.8],
            [23.9, 20.2],
            [16.4, 20.2],
            [16.4, 16.6],
          ],
          0.5,
        ),
        poly(
          [
            [23.9, 11],
            [23.9, 16.4],
            [20, 16.4],
          ],
          0.2,
        ),
      )}
    />
    <text
      x="16"
      y="31.4"
      textAnchor="middle"
      fontSize="8.6"
      fontWeight="900"
      textLength="24"
      lengthAdjust="spacingAndGlyphs"
      style={{ fontFamily: 'var(--zzz-font-family-condensed, Impact, "Arial Narrow", sans-serif)' }}
    >
      HOUR
    </text>
  </>,
)

/**
 * New Eridu City Fund: a stylised figure (head, V wings, chest notch) over
 * white legs. Coloured: lime-yellow gradient
 * (#CFFB11 → #A9F905); the legs use currentColor (white in the dock).
 */
export const CityFundIcon = createIcon('CityFundIcon', 'cityFund', (uid) => (
  <>
    <defs>
      <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#CFFB11" />
        <stop offset="1" stopColor="#A9F905" />
      </linearGradient>
    </defs>
    <path fill={`url(#${uid}-g)`} d={circle(16, 4.3, 4.2)} />
    <path
      fill={`url(#${uid}-g)`}
      fillRule="evenodd"
      d={join(
        poly(
          [
            [0.4, 10],
            [11.6, 10],
            [16, 15.6],
            [20.4, 10],
            [31.6, 10],
            [23.4, 21.6],
            [8.6, 21.6],
          ],
          [0.8, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8],
        ),
        poly(
          [
            [12.9, 17.1],
            [19.1, 17.1],
            [16, 20.8],
          ],
          0.3,
        ),
      )}
    />
    <path
      d={poly(
        [
          [9.2, 23.4],
          [13.6, 23.4],
          [16, 26.4],
          [18.4, 23.4],
          [22.8, 23.4],
          [18.7, 27.7],
          [22.8, 31.8],
          [18.4, 31.8],
          [16, 29.1],
          [13.6, 31.8],
          [9.2, 31.8],
          [13.3, 27.7],
        ],
        0.4,
      )}
    />
  </>
))

/**
 * Signal Search: a retro TV (currentColor frame, V antenna) whose screen holds a
 * rainbow gradient (#C8D334 → #FA7850 → #D32FDC → #2084F0).
 * Wide grid (`0 0 37 32`): the glyph is 69 × 61 at a 60 dock height.
 */
export const SignalSearchIcon = createIcon(
  'SignalSearchIcon',
  'signalSearch',
  (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8D334" />
          <stop offset="0.3" stopColor="#FA7850" />
          <stop offset="0.62" stopColor="#D32FDC" />
          <stop offset="1" stopColor="#2084F0" />
        </linearGradient>
      </defs>
      <path
        d={stroke(
          [
            [11.6, 0.9],
            [18.5, 7.2],
            [25.4, 0.9],
          ],
          2.4,
          0.4,
        )}
      />
      <path
        fillRule="evenodd"
        d={join(rect(0.2, 6.6, 36.6, 25.2, 4.6), rect(3, 9.4, 31, 17.4, 4.4), rect(5.6, 28.1, 4, 1.3, 0.4), rect(26.4, 28.1, 5.6, 1.3, 0.4))}
      />
      <path fill={`url(#${uid}-g)`} d={rect(4.4, 10.7, 28.2, 14.8, 3.6)} />
    </>
  ),
  { viewBoxWidth: 37 },
)
