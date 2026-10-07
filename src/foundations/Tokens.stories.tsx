import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { tokens } from '../styles/tokens'
import './foundations.css'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const kebab = (s: string) =>
    s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const cssVar = (...path: string[]) => `--zzz-${path.map(kebab).join('-')}`

type Tree = { readonly [k: string]: unknown }
const isColor = (v: unknown): v is string =>
    typeof v === 'string' && /^(#|rgba?\(|hsla?\()/i.test(v.trim())

/** Flattens a token subtree into [path segments, value] leaves. */
function leaves(node: Tree, path: string[] = []): [string[], unknown][] {
    return Object.entries(node).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v)
            ? leaves(v as Tree, [...path, k])
            : [[[...path, k], v] as [string[], unknown]]
    )
}

const meta = {
    title: 'Foundations/Tokens',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: [
                    'Every design token, generated from `src/styles/tokens.json` by `npm run tokens` into `src/styles/tokens.css` (CSS custom properties) and `src/styles/tokens.ts` (typed `tokens` object).',
                    '',
                    '- Name: `--zzz-` + the JSON path in kebab-case (`size.control.pillTop` → `--zzz-size-control-pill-top`).',
                    '- Lengths are written in **design units** and exist twice: `--zzz-x: calc(N * var(--zzz-px))` (scaled) and `--zzz-x-n: N` (raw). `--zzz-px` is rem-based, `calc(1rem / 16 * var(--zzz-scale))`, with `--zzz-scale: 0.7` by default, so 1 unit = 0.7 CSS px at a 16 px root font size and every size follows the browser font size and zoom. See **Foundations / Sizing**.',
                    '- Controls have a size scale: `--zzz-size-control-sm | md | lg` (46 / 57 / 69 units ≈ 32 / 40 / 48 px at the default) with matching `--zzz-font-size-control-*`, `--zzz-size-control-cap-*`, `-disc-*`, `-icon-*` and `-padding-x-*`.',
                    '- Components read the live accent only through `var(--zzz-accent)`.',
                    "- **Decorative text tones.** `text.faint` (#2E2E2E, 1.54:1 on black), `text.ghost` (#1C1C1C, 1.14:1 on #0C0C0C), `text.engraved` (debossed, ~1.1:1) and `text.uid` (#5E5E5E, 3.23:1) match the game's look but fall below WCAG 1.4.3. They are decorative: never let them be the only carrier of information. Give the element an accessible name or sr-only text, and mark purely ornamental engraved glyphs `aria-hidden`. Likewise, a state shown only by colour (for example the red insufficient-funds count) needs a non-colour cue or sr-only text (WCAG 1.4.1).",
                    "- **Figures.** The theme baseline uses `--zzz-font-numeric-default` (proportional-nums). With the Mona Sans fallback, `tabular-nums` swaps in a slashed 0 and a footed 1 that do not fit the kit's lettering; use the Zeros component or a fixed per-digit width when columns must align.",
                ].join('\n'),
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* ── Colours ──────────────────────────────────────────────────────────────────────────────── */

const COLOR_GROUPS: { title: string; groups: string[] }[] = [
    {
        title: 'Accent (pulse ends, midpoint, on-accent)',
        groups: ['accent', 'progress'],
    },
    { title: 'Rarity', groups: ['rarity', 'rarityCoin', 'rank', 'star'] },
    {
        title: 'Semantic',
        groups: [
            'danger',
            'highlight',
            'sage',
            'badge',
            'icon',
            'checkIn',
            'event',
            'element',
            'agentTheme',
            'content',
        ],
    },
    {
        title: 'Neutrals: backgrounds, surfaces, borders',
        groups: ['bg', 'surface', 'border', 'interstitial', 'watermark'],
    },
    { title: 'Text', groups: ['text'] },
]

function Swatch({ path, value }: { path: string[]; value: string }) {
    const name = cssVar('color', ...path)
    return (
        <div className="zzz-doc-swatch">
            <div
                className="zzz-doc-swatch__chip"
                style={{ background: `var(${name})` }}
            />
            <span className="zzz-doc-code">
                {name.replace('--zzz-color-', '')}
            </span>
            <span className="zzz-doc-code zzz-doc-dim">{value}</span>
        </div>
    )
}

export const Colors: Story = {
    render: () => (
        <div className="zzz-doc">
            <div className="zzz-doc-cell">
                <h3 className="zzz-doc-subheading">Live accent</h3>
                <div className="zzz-doc-row">
                    <div className="zzz-doc-swatch">
                        <div
                            className="zzz-doc-swatch__chip"
                            style={{ background: 'var(--zzz-accent)' }}
                        />
                        <span className="zzz-doc-code">--zzz-accent</span>
                        <span className="zzz-doc-code zzz-doc-dim">
                            #93BA00 ↔ #FCDC00, 1.5 s
                        </span>
                    </div>
                </div>
            </div>
            {COLOR_GROUPS.map(({ title, groups }) => (
                <div key={title} className="zzz-doc-cell">
                    <h3 className="zzz-doc-subheading">{title}</h3>
                    <div className="zzz-doc-row zzz-doc-row--tight">
                        {groups.flatMap((g) =>
                            leaves((tokens.color as Tree)[g] as Tree, [g])
                                .filter(([, v]) => isColor(v))
                                .map(([p, v]) => (
                                    <Swatch
                                        key={p.join('.')}
                                        path={p}
                                        value={v as string}
                                    />
                                ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    ),
}

/* ── Spacing & sizes ─────────────────────────────────────────────────────────────────────── */

function Ruler({ group, label }: { group: string[]; label: string }) {
    let node: unknown = tokens
    for (const k of group) node = (node as Tree)[k]
    const rows = leaves(node as Tree, group).filter(
        ([, v]) => typeof v === 'number'
    ) as [string[], number][]
    return (
        <div className="zzz-doc-cell">
            <h3 className="zzz-doc-subheading">{label}</h3>
            <table className="zzz-doc-table">
                <tbody>
                    {rows.map(([p, v]) => (
                        <tr key={p.join('.')}>
                            <td className="zzz-doc-code">{cssVar(...p)}</td>
                            <td className="zzz-doc-code zzz-doc-dim">{v}</td>
                            <td>
                                <div
                                    className="zzz-doc-bar"
                                    style={{ width: `var(${cssVar(...p)})` }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export const Spacing: Story = {
    render: () => (
        <div className="zzz-doc">
            <Ruler
                group={['space']}
                label="space.* (design units; × 0.7 = CSS px at the default)"
            />
            <Ruler
                group={['size', 'control']}
                label="size.control.* (incl. the sm / md / lg scale)"
            />
        </div>
    ),
}

/* ── Radius & borders ────────────────────────────────────────────────────────────────────── */

export const RadiusAndBorders: Story = {
    name: 'Radius & Borders',
    render: () => {
        const radii = leaves(tokens.radius as Tree, ['radius'])
        const borders = leaves(tokens.borderWidth as Tree, ['borderWidth'])
        return (
            <div className="zzz-doc">
                <div className="zzz-doc-cell">
                    <h3 className="zzz-doc-subheading">radius.*</h3>
                    <div className="zzz-doc-row zzz-doc-row--tight">
                        {radii.map(([p, v]) => (
                            <div key={p.join('.')} className="zzz-doc-swatch">
                                <div
                                    className="zzz-doc-radius"
                                    style={
                                        {
                                            borderRadius: `var(${cssVar(...p)})`,
                                        } as CSSProperties
                                    }
                                />
                                <span className="zzz-doc-code">
                                    {cssVar(...p).replace('--zzz-', '')}
                                </span>
                                <span className="zzz-doc-code zzz-doc-dim">
                                    {String(v)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="zzz-doc-cell">
                    <h3 className="zzz-doc-subheading">borderWidth.*</h3>
                    <table className="zzz-doc-table">
                        <tbody>
                            {borders.map(([p, v]) => (
                                <tr key={p.join('.')}>
                                    <td className="zzz-doc-code">
                                        {cssVar(...p)}
                                    </td>
                                    <td className="zzz-doc-code zzz-doc-dim">
                                        {String(v)}
                                    </td>
                                    <td>
                                        <div
                                            className="zzz-doc-border"
                                            style={{
                                                borderTopWidth: `var(${cssVar(...p)})`,
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
}

/* ── Skew protractor ─────────────────────────────────────────────────────────────────────── */

export const Skew: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Every `skew.*` angle drawn as a line from a common origin (0° = vertical; drawn as `skewX()` would lean a vertical edge). `skew.italic` (−10°) is the manual italic of `.zzz-italic`; `skew.hatch` (39.8°) is the global hatch direction.',
            },
        },
    },
    render: () => {
        const R = 150
        const entries = Object.entries(tokens.skew) as [string, string][]
        return (
            <div className="zzz-doc-row">
                <svg
                    width={gpx(2 * R + 40)}
                    height={gpx(R + 30)}
                    viewBox={`${-R - 20} ${-R - 10} ${2 * R + 40} ${R + 30}`}
                    aria-label="Skew protractor"
                >
                    <path
                        d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`}
                        fill="none"
                        stroke="#333333"
                        strokeWidth={2}
                    />
                    <line
                        x1={-R}
                        y1={0}
                        x2={R}
                        y2={0}
                        stroke="#333333"
                        strokeWidth={2}
                    />
                    <line
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={-R}
                        stroke="#555555"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                    />
                    {entries.map(([k, v], i) => {
                        const deg = parseFloat(v)
                        const a = (deg * Math.PI) / 180
                        const x = -Math.sin(a) * R // skewX: negative angles lean the top to the right
                        const y = -Math.cos(a) * R
                        const color =
                            k === 'italic'
                                ? 'var(--zzz-accent)'
                                : `hsl(${(i * 37) % 360} 0% ${55 + (i % 4) * 10}%)`
                        return (
                            <line
                                key={k}
                                x1={0}
                                y1={0}
                                x2={x}
                                y2={y}
                                stroke={color}
                                strokeWidth={k === 'italic' ? 4 : 2}
                            />
                        )
                    })}
                </svg>
                <table className="zzz-doc-table">
                    <tbody>
                        {entries.map(([k, v]) => (
                            <tr key={k}>
                                <td className="zzz-doc-code">
                                    {cssVar('skew', k)}
                                </td>
                                <td className="zzz-doc-code zzz-doc-dim">
                                    {v}
                                </td>
                                <td>
                                    <div
                                        className="zzz-doc-skew"
                                        style={{
                                            transform: `skewX(var(${cssVar('skew', k)}))`,
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    },
}
