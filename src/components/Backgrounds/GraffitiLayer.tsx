import { useId } from 'react'
import { cx } from '../../utils'
import { tokens } from '../../styles/tokens'
import type { BackgroundLayerProps } from './types'
import './Backgrounds.css'

export interface GraffitiLayerProps extends BackgroundLayerProps {
  /**
   * `agent` (default): `color.watermark.glyph` #232323 on black, fading to
   * `glyphDim` #161616 toward the lower left, faint hatch (±3 levels) inside the letters only. The
   * black between the letters is pure #000, so put this layer over black, not over the
   * global HatchBackground.
   * `dialog`: dialog band: large shapes ≈ #181818, small print ≈ #1E1E1E (a step lighter than the
   * color.watermark.dialog* tokens, see Backgrounds.css).
   */
  variant?: 'agent' | 'dialog'
  /**
   * Drift along the layer's own baseline at pattern.watermark.drift (−23.3, +6.4) px/s (dialog band).
   * Frozen under prefers-reduced-motion or `data-reduced-motion` on an ancestor.
   */
  drift?: boolean
}

/** Copy lines from pattern.watermark.content ("A / B /// C" → ["A", "B", "C"]). */
const COPY = tokens.pattern.watermark.content
  .split('/')
  .map((s) => s.trim())
  .filter(Boolean)
const [
  BRAND = 'ZONE UI KIT',
  MONO = 'ZONE',
  SITE = 'ZONE-UI',
  GUIDE = 'INTERFACE FIELD MANUAL',
  WARNING = 'STAY SHARP: EVERY PRESS LIGHTS THE ACCENT',
] = COPY

/** Brand words ("A B C" → ["A", "B", "C"]); the plate prints them one per line. */
const BRAND_WORDS = BRAND.split(' ').filter(Boolean)
/** Short knock-out run: the first two letters of the first brand word. */
const KNOCK_SHORT = (BRAND_WORDS[0] ?? MONO).slice(0, 2)
/** Site name without its extension and punctuation, split into two knock-out halves (3 + rest). */
const SITE_LETTERS = SITE.split('.')[0].replace(/[^A-Za-z0-9]/g, '')
const KNOCK_A = SITE_LETTERS.slice(0, 3)
const KNOCK_B = SITE_LETTERS.slice(3, 7)
/** Outline-only word: the last brand word. */
const OUTLINE = BRAND_WORDS[BRAND_WORDS.length - 1] ?? MONO
/** Ring motif letter: the monogram's initial. */
const RING = MONO.charAt(0)

/**
 * The SVG canvas in design units: a fixed 21:9 board (2520 × 1080), centred in the layer and cropped
 * by it. Keep in sync with `.zzz-graffiti__svg` in Backgrounds.css.
 */
const CANVAS_W = 2520
const CANVAS_H = 1080

/** Width of one repeating graffiti tile along the rotated baseline (design units). */
const TILE = 1800
/** Drift speed along the baseline: |(−23.3, 6.4)| = 24.16 px/s → one tile every 74.5 s. */
const DRIFT = Math.hypot(tokens.pattern.watermark.drift.x, tokens.pattern.watermark.drift.y)
export const GRAFFITI_LOOP_SECONDS = Math.round((TILE / DRIFT) * 100) / 100

interface Paint {
  large: string
  detail: string
  knock: string
}

/**
 * One 1800 × 1800 tile of original lettering: rounded block tiles,
 * a huge monogram, an outline-only word, a ring motif, a knock-out plate and micro-copy lines.
 */
function Tile({ x, paint }: { x: number; paint: Paint }) {
  const [w1, w2, w3] = BRAND_WORDS
  return (
    <g transform={`translate(${x} -900)`}>
      {/* big rounded blocks */}
      <g style={{ fill: paint.large }}>
        <rect x="0" y="0" width="560" height="300" rx="64" />
        <rect x="620" y="-40" width="760" height="260" rx="64" />
        <rect x="1440" y="30" width="330" height="430" rx="72" />
        <rect x="-10" y="380" width="300" height="360" rx="80" />
        <rect x="40" y="1320" width="700" height="440" rx="72" />
        <rect x="780" y="1330" width="940" height="430" rx="72" />
        <rect x="300" y="-420" width="620" height="330" rx="72" />
        <rect x="980" y="-460" width="760" height="360" rx="72" />
        <rect x="-60" y="820" width="330" height="330" rx="72" />
        {/* dense fill around the plate and above the big monogram (blocks ~40–60 units apart) */}
        <rect x="330" y="260" width="290" height="330" rx="64" />
        <rect x="1030" y="240" width="370" height="250" rx="60" />
        <rect x="330" y="600" width="440" height="250" rx="60" />
        <rect x="810" y="600" width="540" height="250" rx="60" />
        <text className="zzz-graffiti__display" x="310" y="1290" fontSize="580" style={{ letterSpacing: '-0.03em' }}>
          {MONO}
        </text>
        {/* ring motif */}
        <circle cx="1560" cy="760" r="150" fill="none" style={{ stroke: paint.large }} strokeWidth="38" />
        <circle cx="1720" cy="600" r="22" />
        <text className="zzz-graffiti__display" x="1560" y="840" fontSize="230" textAnchor="middle">
          {RING}
        </text>
      </g>
      {/* lettering knocked out of the blocks */}
      <g className="zzz-graffiti__display" style={{ fill: paint.knock }}>
        <text x="1050" y="460" fontSize="240">
          {KNOCK_SHORT}
        </text>
        <text x="360" y="810" fontSize="200">
          {KNOCK_A}
        </text>
        <text x="835" y="810" fontSize="200" style={{ letterSpacing: KNOCK_B.length > 3 ? '-0.05em' : undefined }}>
          {KNOCK_B}
        </text>
      </g>
      {/* outline-only lettering */}
      <text
        className="zzz-graffiti__display"
        x="1470"
        y="1310"
        fontSize="150"
        style={{ fill: 'none', stroke: paint.large, letterSpacing: '0.04em' }}
        strokeWidth="11"
      >
        {OUTLINE}
      </text>
      {/* knock-out plate */}
      <g transform="translate(660 280)">
        <rect width="330" height="190" rx="18" style={{ fill: paint.detail }} />
        <g className="zzz-graffiti__plate" style={{ fill: paint.knock }} fontSize="52">
          <text x="26" y="62">
            {w1}
          </text>
          <text x="26" y="116">
            {w2}
          </text>
          <text x="26" y="170">
            {w3}
          </text>
        </g>
      </g>
      {/* micro-copy */}
      <g className="zzz-graffiti__micro" style={{ fill: paint.detail }}>
        <text x="1180" y="545" fontSize="40">
          {SITE} ///
        </text>
        <text x="660" y="530" fontSize="40">
          {GUIDE}
        </text>
        <text x="660" y="572" fontSize="30">
          {WARNING}
        </text>
        <text x="60" y="1860" fontSize="34">
          {WARNING}
        </text>
      </g>
    </g>
  )
}

/**
 * Graffiti watermark layer: huge original wordmark / monogram lettering and micro-copy (from
 * `pattern.watermark.content`), rotated −16° (skew.watermarkRotate, text rising to the right) and
 * cropped by the frame. Draw it over black or inside the dialog band. The SVG is a fixed wide canvas
 * sized in design units (with --zzz-px, centred, cropped by the layer), so the lettering keeps its size in
 * any container.
 */
export function GraffitiLayer({
  variant = 'agent',
  drift = false,
  className,
  style,
  ref,
  ...rest
}: GraffitiLayerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const fadeId = `zzz-graffiti-fade-${uid}`
  const hatchId = `zzz-graffiti-hatch-${uid}`
  const maskId = `zzz-graffiti-mask-${uid}`
  const ditherId = `zzz-graffiti-dither-${uid}`
  const agent = variant === 'agent'
  const paint: Paint = agent
    ? {
        large: 'var(--zzz-color-watermark-glyph)',
        detail: 'var(--zzz-color-watermark-glyph)',
        knock: 'var(--zzz-color-bg-base)',
      }
    : {
        large: 'var(--zzz-graffiti-dialog-large)',
        detail: 'var(--zzz-graffiti-dialog-detail)',
        knock: 'var(--zzz-color-bg-base)',
      }
  const hatchPaint: Paint = {
    large: `url(#${hatchId})`,
    detail: `url(#${hatchId})`,
    knock: 'none',
  }
  const ditherPaint: Paint = { large: `url(#${ditherId})`, detail: `url(#${ditherId})`, knock: 'none' }
  // Columns cover the rotated frame (±1400 × ±900 around the centre) plus one tile of drift.
  const cols = [-2700, -900, 900, 2700]

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-variant={variant}
      data-drift={drift ? '' : undefined}
      className={cx('zzz-bg', 'zzz-graffiti', `zzz-graffiti--${variant}`, className)}
      style={{
        ['--zzz-graffiti-loop' as string]: `${GRAFFITI_LOOP_SECONDS}s`,
        ...style,
      }}
      {...rest}
    >
      <svg className="zzz-graffiti__svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="none">
        <defs>
          {/* Fade toward the lower left, in SCREEN space: a luminance mask on the unrotated group.
              Glyph cores stay ≈ #232323–#252525 up to ~37 % of the diagonal, ≈ #171717 by 54 %.
              Mask grey #A1A1A1 = glyphDim / glyph = 22 / 35 ≈ 0.63 (over black: #232323 → #161616). */}
          <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1={CANVAS_W} y1="0" x2="0" y2={CANVAS_H}>
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.36" stopColor="#FFFFFF" />
            <stop offset="0.56" stopColor="#A1A1A1" />
            <stop offset="1" stopColor="#A1A1A1" />
          </linearGradient>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-2000"
            y="-2000"
            width={CANVAS_W + 4000}
            height={CANVAS_H + 4000}
            style={{ maskType: 'luminance' }}
          >
            {/* Over-sized so containers wider/taller than the canvas stay covered (the SVG
                overflows its canvas; the layer crops it). The gradient pads beyond its ends. */}
            <rect x="-2000" y="-2000" width={CANVAS_W + 4000} height={CANVAS_H + 4000} fill={`url(#${fadeId})`} />
          </mask>
          {/* The global hatch, ±3 levels, seen inside the letters: 7.68 period, stripes '\' at 39.8°
              in screen space (−50.2° from vertical, +16° to undo the layer rotation). */}
          <pattern id={hatchId} patternUnits="userSpaceOnUse" width="7.68" height="40" patternTransform="rotate(-34.2)">
            <rect width="7.68" height="40" fill="#000" fillOpacity="0.07" />
            <rect x="1.9" width="3.84" height="40" fill="#FFF" fillOpacity="0.025" />
          </pattern>
          {/* Dialog band: the shapes carry a fine ~3 px halftone checker. */}
          <pattern id={ditherId} patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(16)">
            <rect width="1.5" height="1.5" fill="#FFF" fillOpacity="0.02" />
            <rect x="1.5" y="1.5" width="1.5" height="1.5" fill="#000" fillOpacity="0.2" />
          </pattern>
        </defs>
        <g mask={agent ? `url(#${maskId})` : undefined}>
          <g transform={`translate(${CANVAS_W / 2} ${CANVAS_H / 2}) rotate(-16)`}>
            <g className="zzz-graffiti__track">
              {cols.map((x) => (
                <Tile key={x} x={x} paint={paint} />
              ))}
              {cols.map((x) => (
                <Tile key={`t${x}`} x={x} paint={agent ? hatchPaint : ditherPaint} />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
