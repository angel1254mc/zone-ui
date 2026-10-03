/**
 * Tiny path-building helpers for the 32 × 32 icon grid.
 *
 * Every helper returns an SVG path string. The strings are built once at module
 * load, so the icon components themselves stay static. The glyphs are
 * composed from primitive geometry.
 */

export type Pt = readonly [number, number]

/** Trim a coordinate to two decimals (keeps the emitted `d` strings short). */
export const n = (v: number): string => {
  const r = Math.round(v * 100) / 100
  return Object.is(r, -0) ? '0' : String(r)
}

const p = (pt: Pt): string => `${n(pt[0])} ${n(pt[1])}`

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]]
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]]
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k]
const len = (a: Pt): number => Math.hypot(a[0], a[1])
const unit = (a: Pt): Pt => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l]
}

/**
 * Closed polygon with softened corners. `r` is the distance cut back along each
 * edge at a vertex (a quadratic curve then bridges the cut), either one value
 * for every vertex or one per vertex. 0 keeps the corner sharp.
 */
export function poly(points: readonly Pt[], r: number | readonly number[] = 0): string {
  const count = points.length
  const radius = (i: number) => (typeof r === 'number' ? r : (r[i] ?? 0))
  let d = ''
  for (let i = 0; i < count; i++) {
    const v = points[i]!
    const prev = points[(i - 1 + count) % count]!
    const next = points[(i + 1) % count]!
    const rr = Math.min(radius(i), len(sub(prev, v)) / 2, len(sub(next, v)) / 2)
    if (rr <= 0) {
      d += `${i === 0 ? 'M' : 'L'}${p(v)} `
      continue
    }
    const a = add(v, mul(unit(sub(prev, v)), rr))
    const b = add(v, mul(unit(sub(next, v)), rr))
    d += `${i === 0 ? 'M' : 'L'}${p(a)} Q${p(v)} ${p(b)} `
  }
  return `${d}Z`
}

/** Rounded rectangle. */
export function rect(x: number, y: number, w: number, h: number, r = 0): string {
  return poly(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    r,
  )
}

/** Full circle as a closed subpath (use with `fill-rule="evenodd"` for rings). */
export function circle(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)} ${n(cy)} A${n(r)} ${n(r)} 0 1 0 ${n(cx + r)} ${n(cy)} A${n(r)} ${n(r)} 0 1 0 ${n(cx - r)} ${n(cy)} Z`
}

/** Ellipse as a closed subpath. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${n(cx - rx)} ${n(cy)} A${n(rx)} ${n(ry)} 0 1 0 ${n(cx + rx)} ${n(cy)} A${n(rx)} ${n(ry)} 0 1 0 ${n(cx - rx)} ${n(cy)} Z`
}

/** Point on a circle; `deg` runs clockwise from 12 o'clock. */
export function polar(cx: number, cy: number, r: number, deg: number): Pt {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)]
}

/**
 * Annular sector (a thick arc with flat, radial ends). Angles run clockwise
 * from 12 o'clock; `from` < `to`, span up to 359.9°.
 */
export function arcBand(cx: number, cy: number, rOuter: number, rInner: number, from: number, to: number): string {
  const large = to - from > 180 ? 1 : 0
  const o0 = polar(cx, cy, rOuter, from)
  const o1 = polar(cx, cy, rOuter, to)
  const i1 = polar(cx, cy, rInner, to)
  const i0 = polar(cx, cy, rInner, from)
  return (
    `M${p(o0)} A${n(rOuter)} ${n(rOuter)} 0 ${large} 1 ${p(o1)} ` +
    `L${p(i1)} A${n(rInner)} ${n(rInner)} 0 ${large} 0 ${p(i0)} Z`
  )
}

/** Straight bar of width `w` from a to b, flat ends, optional corner softening. */
export function bar(a: Pt, b: Pt, w: number, r = 0): string {
  const dir = unit(sub(b, a))
  const nrm: Pt = [-dir[1] * (w / 2), dir[0] * (w / 2)]
  return poly([add(a, nrm), add(b, nrm), sub(b, nrm), sub(a, nrm)], r)
}

/**
 * Outline of an open polyline of width `w` with flat (butt) ends and mitred
 * joins, as one closed polygon. Good for checks, chevrons and zig-zags.
 */
export function stroke(points: readonly Pt[], w: number, r: number | readonly number[] = 0): string {
  const h = w / 2
  const count = points.length
  const left: Pt[] = []
  const right: Pt[] = []
  for (let i = 0; i < count; i++) {
    const v = points[i]!
    const dPrev = i > 0 ? unit(sub(v, points[i - 1]!)) : null
    const dNext = i < count - 1 ? unit(sub(points[i + 1]!, v)) : null
    if (!dPrev || !dNext) {
      const d = (dPrev ?? dNext)!
      const nrm: Pt = [-d[1], d[0]]
      left.push(add(v, mul(nrm, h)))
      right.push(sub(v, mul(nrm, h)))
      continue
    }
    const n1: Pt = [-dPrev[1], dPrev[0]]
    const n2: Pt = [-dNext[1], dNext[0]]
    const m = unit(add(n1, n2))
    const cos = m[0] * n1[0] + m[1] * n1[1]
    const k = h / Math.max(cos, 0.2)
    left.push(add(v, mul(m, k)))
    right.push(sub(v, mul(m, k)))
  }
  return poly([...left, ...right.reverse()], r)
}

/**
 * Regular star / gear outline: `points` tips alternating between `rOuter` and
 * `rInner`, starting at `rot` degrees (clockwise from 12 o'clock).
 */
export function starPoints(cx: number, cy: number, points: number, rOuter: number, rInner: number, rot = 0): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < points * 2; i++) {
    out.push(polar(cx, cy, i % 2 === 0 ? rOuter : rInner, rot + (i * 180) / points))
  }
  return out
}

/** Mirror a list of points around the vertical line x = 16 (and reverse to keep winding). */
export function mirrorX(points: readonly Pt[], axis = 16): Pt[] {
  return points.map(([x, y]) => [2 * axis - x, y] as Pt).reverse()
}

/** Translate + scale points: (x, y) → (x * s + dx, y * s + dy). */
export function place(points: readonly Pt[], s: number, dx: number, dy: number): Pt[] {
  return points.map(([x, y]) => [x * s + dx, y * s + dy] as Pt)
}

/** Sample an ellipse (optionally rotated) between two parametric angles (radians). */
export function ellipsePts(cx: number, cy: number, rx: number, ry: number, t0: number, t1: number, steps: number, rotDeg = 0): Pt[] {
  const a = (rotDeg * Math.PI) / 180
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps
    const x = rx * Math.cos(t)
    const y = ry * Math.sin(t)
    out.push([cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)])
  }
  return out
}

/** Join several subpaths into one `d` (use with evenodd for knock-outs). */
export const join = (...parts: string[]): string => parts.join(' ')
