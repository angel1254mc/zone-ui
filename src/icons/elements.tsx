/**
 * Element glyphs. Coloured with the `color.element.*` tokens.
 * Solid colours read the CSS custom property with the token value as
 * fallback; gradients hardcode the token's stops (a CSS `linear-gradient()`
 * token cannot be used as an SVG paint).
 */
import { createIcon } from './createIcon'
import { bar, join, polar, poly, starPoints, type Pt } from './geometry'
import { crossPoints } from './actions'

const solid = (token: string, hex: string) => ({ fill: `var(--zzz-color-element-${token}, ${hex})` })

/** Flame with three tongues (tallest centre) and a knocked-out inner flame. `color.element.fire` gradient. */
export const FireIcon = createIcon('FireIcon', 'fire', (uid) => (
  <>
    <defs>
      {/* color.element.fire: linear-gradient(180deg, #EA140D 0%, #FC6F1C 100%) */}
      <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#EA140D" />
        <stop offset="1" stopColor="#FC6F1C" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#${uid}-g)`}
      fillRule="evenodd"
      d={join(
        'M16 32 C8.6 32 3.4 27.2 3.4 20.4 C3.4 15.6 5.4 12.2 7.2 8.6 C8.9 10.8 10 12.7 10.6 15 ' +
          'C11.2 9.6 13.2 4.8 16.2 0.4 C18.4 4.6 21.2 7.8 21.4 12.4 C22.9 10.6 24.4 8.4 25.4 5.4 ' +
          'C27.6 9.6 28.6 14.6 28.6 20.4 C28.6 27.2 23.4 32 16 32 Z',
        'M16 17.2 C17.8 20 20.3 22 20.3 25 A4.3 4.3 0 0 1 11.7 25 C11.7 22 14.2 20 16 17.2 Z',
      )}
    />
  </>
))

/** Four-point concave star with a small sparkle at its lower right. `color.element.starGradient` (likely Ether). */
export const StarSparkIcon = createIcon('StarSparkIcon', 'starSpark', (uid) => (
  <>
    <defs>
      {/* color.element.starGradient: #C8307A 0% → #7052C6 55% → #3A52BA 100% (top to bottom) */}
      <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#C8307A" />
        <stop offset="0.55" stopColor="#7052C6" />
        <stop offset="1" stopColor="#3A52BA" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#${uid}-g)`}
      d={join(
        'M13.4 0 Q15 11.8 26.8 13.4 Q15 15 13.4 26.8 Q11.8 15 0 13.4 Q11.8 11.8 13.4 0 Z',
        'M26.2 20.4 Q26.8 25.4 32 26.2 Q26.8 27 26.2 32 Q25.6 27 20.4 26.2 Q25.6 25.4 26.2 20.4 Z',
      )}
    />
  </>
))

/** Six-arm snowflake with forked tips and a hexagonal knock-out centre. `color.element.snowflake` (likely Ice). */
export const SnowflakeIcon = createIcon('SnowflakeIcon', 'snowflake', (uid) => {
  const arms: string[] = []
  for (let a = 0; a < 360; a += 60) {
    arms.push(bar([16, 16], polar(16, 16, 15.6, a), 3.4, 0.4))
    const fork = polar(16, 16, 9.8, a)
    arms.push(bar(fork, polar(fork[0], fork[1], 5.4, a + 48), 2.8, 0.4))
    arms.push(bar(fork, polar(fork[0], fork[1], 5.4, a - 48), 2.8, 0.4))
  }
  const hex = (r: number): Pt[] => [0, 60, 120, 180, 240, 300].map((a) => polar(16, 16, r, a))
  return (
    <>
      <defs>
        <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <path d={poly(hex(2.9), 0.3)} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${uid}-m)`} style={solid('snowflake', '#8296D3')}>
        {arms.map((d) => (
          <path key={d} d={d} />
        ))}
        <path d={poly(hex(6.4), 0.6)} />
      </g>
    </>
  )
})

/** Six-point star (hexagram silhouette) with a hexagonal centre knock-out. `color.element.cyanStar`. */
export const HexStarIcon = createIcon(
  'HexStarIcon',
  'hexStar',
  <path
    fillRule="evenodd"
    style={solid('cyan-star', '#41D3D6')}
    d={join(
      poly(starPoints(16, 16, 6, 16, 9.24), 0.5),
      poly(
        [30, 90, 150, 210, 270, 330].map((a) => polar(16, 16, 4.4, a)),
        0.3,
      ),
    )}
  />,
)

/** Concave diamond with flared points and a small cross knock-out. `color.element.goldDiamond` (likely Physical). */
export const GoldDiamondIcon = createIcon(
  'GoldDiamondIcon',
  'goldDiamond',
  <path
    fillRule="evenodd"
    style={solid('gold-diamond', '#C0934B')}
    d={join(
      'M16 0 L18.3 4.4 Q19.6 12.4 27.6 13.7 L32 16 L27.6 18.3 Q19.6 19.6 18.3 27.6 L16 32 L13.7 27.6 ' +
        'Q12.4 19.6 4.4 18.3 L0 16 L4.4 13.7 Q12.4 12.4 13.7 4.4 Z',
      poly(crossPoints(16, 16, 3.8, 1.15), 0.2),
    )}
  />,
)

/** A thick band spiralling inward ~1.25 turns. `color.element.swirl`. */
export const SwirlIcon = createIcon(
  'SwirlIcon',
  'swirl',
  (() => {
    const start = 210
    const turns = 450
    const steps = 90
    const rc = (t: number) => 12.8 - 7.3 * t
    const w = (t: number) => 5.9 - 2.3 * t
    const outer: Pt[] = []
    const inner: Pt[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      outer.push(polar(16, 16, rc(t) + w(t) / 2, start + turns * t))
      inner.push(polar(16, 16, rc(t) - w(t) / 2, start + turns * t))
    }
    const capA = polar(16, 16, rc(0), start)
    const capB = polar(16, 16, rc(1), start + turns)
    return (
      <g style={solid('swirl', '#8BA8E4')}>
        <path d={poly([...outer, ...inner.reverse()])} />
        <circle cx={capA[0]} cy={capA[1]} r={w(0) / 2} />
        <circle cx={capB[0]} cy={capB[1]} r={w(1) / 2} />
      </g>
    )
  })(),
)

/** Lightning bolt: a slanted Z with sharp tips. `color.element.electric`. */
export const ElectricIcon = createIcon(
  'ElectricIcon',
  'electric',
  <path
    style={solid('electric', '#2EB6FF')}
    d={poly(
      [
        [19.2, 0],
        [4.4, 18.6],
        [14, 18.6],
        [10.6, 32],
        [27.6, 12.4],
        [17.8, 12.4],
        [22.6, 0],
      ],
      [0.3, 0.6, 0.4, 0.2, 0.6, 0.4, 0.3],
    )}
  />,
)
