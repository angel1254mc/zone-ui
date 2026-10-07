/**
 * Active-fill geometry, in design units of a 62 px tall fill.
 * The fill is [slanted cap?][flat body][slanted cap?]; round ends are the body's border-radius.
 * The slanted cap drawn here is the RIGHT edge of a fill, leaning "/" (top further right),
 * skew.tabEdge 26.5°. The left edge is the same cap rotated 180°.
 */
export const FILL_HEIGHT = 62
/** tan(26.5°) = 0.4986: horizontal run of the slanted edge per px of height. */
export const SLANT = Math.tan((26.5 * Math.PI) / 180)
/**
 * Corner radii: acute 14 (top of a right edge), obtuse 28 (bottom of a right edge); the sharp
 * slant vertex sits W/3 + 32..33 from the outer end.
 * (radius.tabCorner 10 and the 258 px painted width are the visible extent of this same shape.)
 */
export const RADIUS_ACUTE = 14
export const RADIUS_OBTUSE = 28
/** Cap box width: the slant run plus room for the obtuse fillet (tangent length 0.62 × rO). */
export const CAP_WIDTH = Math.round((FILL_HEIGHT * SLANT + 18) * 100) / 100
/** How far the cap path reaches back under the body (hides the seam). */
const OVERLAP = 2

type Pt = readonly [number, number]

const r2 = (n: number) => Math.round(n * 100) / 100

/** Closed path through `points` with the given corner radii (0 = sharp). */
export function roundedPolygon(
    points: readonly Pt[],
    radii: readonly number[]
): string {
    const n = points.length
    const parts: string[] = []
    for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n]
        const p1 = points[i]
        const p2 = points[(i + 1) % n]
        const r = radii[i] ?? 0
        const cmd = i === 0 ? 'M' : 'L'
        if (!r) {
            parts.push(`${cmd}${r2(p1[0])} ${r2(p1[1])}`)
            continue
        }
        const v1x = p0[0] - p1[0]
        const v1y = p0[1] - p1[1]
        const v2x = p2[0] - p1[0]
        const v2y = p2[1] - p1[1]
        const l1 = Math.hypot(v1x, v1y)
        const l2 = Math.hypot(v2x, v2y)
        const cos = (v1x * v2x + v1y * v2y) / (l1 * l2)
        const theta = Math.acos(Math.max(-1, Math.min(1, cos)))
        const d = r / Math.tan(theta / 2)
        const a: Pt = [p1[0] + (v1x / l1) * d, p1[1] + (v1y / l1) * d]
        const b: Pt = [p1[0] + (v2x / l2) * d, p1[1] + (v2y / l2) * d]
        // turn direction of p0 -> p1 -> p2 (y down): positive cross = clockwise on screen
        const cross =
            (p1[0] - p0[0]) * (p2[1] - p1[1]) -
            (p1[1] - p0[1]) * (p2[0] - p1[0])
        const sweep = cross > 0 ? 1 : 0
        parts.push(
            `${cmd}${r2(a[0])} ${r2(a[1])}`,
            `A${r} ${r} 0 0 ${sweep} ${r2(b[0])} ${r2(b[1])}`
        )
    }
    return `${parts.join(' ')} Z`
}

/** Path of the right slanted cap, viewBox `0 0 CAP_WIDTH FILL_HEIGHT` (extends OVERLAP px left of 0). */
export function segmentPath(
    radiusAcute = RADIUS_ACUTE,
    radiusObtuse = RADIUS_OBTUSE
): string {
    const h = FILL_HEIGHT
    const top = CAP_WIDTH
    const bottom = CAP_WIDTH - h * SLANT
    return roundedPolygon(
        [
            [-OVERLAP, 0],
            [top, 0],
            [bottom, h],
            [-OVERLAP, h],
        ],
        [0, radiusAcute, radiusObtuse, 0]
    )
}

export const CAP_PATH = segmentPath()
