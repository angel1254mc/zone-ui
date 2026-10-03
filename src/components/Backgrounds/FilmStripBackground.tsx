import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils'
import type { BackgroundLayerProps } from './types'
import './Backgrounds.css'

export interface FilmStripBackgroundProps extends BackgroundLayerProps {
  /** Poster content, cycled through the orange frames. Default: original black stencil glyphs. */
  frames?: ReactNode[]
  /** Number of strips (2 or 3, default 3). */
  strips?: 2 | 3
}

interface StripSpec {
  /** x of the strip's left edge at the layer's vertical centre (design units) */
  left: number
  width: number
  /** 'dark' = #1E2020 body; 'teal' = the grey-teal body of the poster strip (#3D4A4A) */
  body: 'dark' | 'teal'
  /** index of the first frame that is a poster (frames alternate window / poster) */
  phase: 0 | 1
}

/* Strip positions at the layer's vertical centre, along the 16° lean
 * (+0.287 px/px): the narrow dark strip's left edge ≈ 112, the teal poster strip ≈ 232 (300 wide,
 * its sprocket edge covering the dark strip's right one), the third strip ≈ 500. */
const STRIPS: StripSpec[] = [
  { left: 112, width: 150, body: 'dark', phase: 1 },
  { left: 232, width: 300, body: 'teal', phase: 0 },
  { left: 500, width: 210, body: 'dark', phase: 1 },
]
const FRAMES_PER_STRIP = 8

/* Original stencil glyphs: black on film orange. */
const STENCILS_RAW: ReactNode[] = [
  <svg key="q" viewBox="0 0 200 300" className="zzz-filmstrip__stencil">
    <text x="100" y="250" textAnchor="middle" fontSize="300" className="zzz-filmstrip__glyph">
      ?
    </text>
  </svg>,
  <svg key="zone" viewBox="0 0 200 300" className="zzz-filmstrip__stencil">
    <g transform="rotate(90 100 150)">
      <text x="100" y="190" textAnchor="middle" fontSize="120" className="zzz-filmstrip__glyph">
        ZONE
      </text>
    </g>
  </svg>,
  <svg key="0x" viewBox="0 0 200 300" className="zzz-filmstrip__stencil">
    <text x="16" y="150" fontSize="92" className="zzz-filmstrip__glyph">
      00.
    </text>
    <text x="16" y="240" fontSize="92" className="zzz-filmstrip__glyph">
      0X
    </text>
  </svg>,
  <svg key="mark" viewBox="0 0 200 300" className="zzz-filmstrip__stencil">
    <circle cx="100" cy="120" r="62" fill="none" stroke="#000" strokeWidth="26" />
    <rect x="38" y="200" width="124" height="26" rx="6" fill="#000" />
    <rect x="38" y="240" width="80" height="26" rx="6" fill="#000" />
  </svg>,
]

const STENCILS = [STENCILS_RAW[1], STENCILS_RAW[0], STENCILS_RAW[2], STENCILS_RAW[3]]

/**
 * 35 mm film strips (a backdrop beside a character or poster panel): vertical strips rotated −16°
 * (skew.watermarkRotate, leaning "\"), black sprocket edges with #1E2020 holes, frames alternating
 * dark windows and film-orange (`color.content.filmOrange`) poster panels with black stencils.
 */
export function FilmStripBackground({ frames, strips = 3, className, ref, ...rest }: FilmStripBackgroundProps) {
  const posters = frames && frames.length > 0 ? frames : STENCILS
  return (
    <div ref={ref} aria-hidden="true" className={cx('zzz-bg', 'zzz-filmstrip', className)} {...rest}>
      {STRIPS.slice(0, strips).map((s, si) => (
        <div
          key={si}
          className={cx('zzz-filmstrip__strip', `zzz-filmstrip__strip--${s.body}`)}
          style={{ '--zzz-strip-left': s.left, '--zzz-strip-width': s.width } as CSSProperties}
        >
          <div className="zzz-filmstrip__frames">
            {/* each strip starts one poster further into the list, so neighbours differ */}
            {Array.from({ length: FRAMES_PER_STRIP }, (_, fi) => {
              const isPoster = fi % 2 === s.phase
              if (!isPoster) return <div key={fi} className="zzz-filmstrip__frame zzz-filmstrip__frame--window" />
              const content = posters[(si + Math.floor(fi / 2)) % posters.length]
              return (
                <div key={fi} className="zzz-filmstrip__frame zzz-filmstrip__frame--poster">
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
