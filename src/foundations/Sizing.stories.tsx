import type { Meta, StoryObj } from '@storybook/react-vite'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ZzzTheme } from '../components/ZzzTheme'
import { CheckIcon, FilterIcon } from '../icons'
import { tokens } from '../styles/tokens'
import './foundations.css'

type Size = 'sm' | 'md' | 'lg'
const SIZES: Size[] = ['sm', 'md', 'lg']

const meta = {
    title: 'Foundations/Sizing',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: [
                    'Zone is sized like any other web design system (Chakra, Radix Themes, Mantine, MUI): in **rem**, so every size follows the browser font size and zoom, and the experience is the same on any screen. Nothing depends on the screen resolution.',
                    '',
                    '- Lengths are written in **design units**; one unit renders as `var(--zzz-px)`, with `--zzz-px = calc(1rem / 16 * var(--zzz-scale))`.',
                    '- The default `--zzz-scale` is **0.7**: at the browser default 16 px font size an md control is ~40 px tall, body text ~14 px and a button label ~18 px. The ZZZ look (ring, bevel, slants, shears) keeps its proportions at any scale.',
                    '- Controls come in **sm / md / lg** (≈ 32 / 40 / 48 px at the default; 46 / 57 / 69 design units). **md** is the default.',
                    '- `--zzz-scale: 1` (or `<ZzzTheme scale={1}>`) is **game density**: 1 design unit = 1 CSS px, a dense, full-screen-game feel. `0.5` is a compact density.',
                    '- Change density globally with `:root { --zzz-scale: … }`, or for a subtree with `<ZzzTheme scale={…}>`. `<Stage>` and `scale="viewport"` are optional tools for full-screen game-style scenes only.',
                    '',
                    'The readouts below are measured live in the browser, so they change with the Scale tool and your browser font size.',
                ].join('\n'),
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const fmt = (n: number) => String(Math.round(n * 10) / 10)

/** Live readout of an element's height (or computed font-size) in CSS px and rem. */
function useReadout<T extends HTMLElement>(
    label: string,
    measure: 'height' | 'fontSize' = 'height'
) {
    const ref = useRef<T>(null)
    const [text, setText] = useState('')
    useLayoutEffect(() => {
        const target = ref.current
        if (!target) return
        const update = () => {
            const v =
                measure === 'height'
                    ? target.getBoundingClientRect().height
                    : parseFloat(getComputedStyle(target).fontSize)
            const root =
                parseFloat(
                    getComputedStyle(document.documentElement).fontSize
                ) || 16
            setText(`${label} ${fmt(v)} px = ${fmt(v / root)} rem`)
        }
        update()
        const ro = new ResizeObserver(update)
        ro.observe(target)
        return () => ro.disconnect()
    }, [label, measure])
    return [ref, text] as const
}

function Readout({ children }: { children: ReactNode }) {
    return (
        <span className="zzz-doc-code zzz-doc-size__readout" data-readout>
            {children}
        </span>
    )
}

function ControlRow({ size }: { size: Size }) {
    const [ref, readout] = useReadout<HTMLDivElement>('height')
    return (
        <div className="zzz-doc-size" data-size={size}>
            <span className="zzz-doc-size__tag zzz-italic">{size}</span>
            <div ref={ref} className="zzz-mat-pill zzz-doc-size__pill">
                <span className="zzz-doc-size__label zzz-italic">Start</span>
            </div>
            <div
                className="zzz-mat-pill zzz-doc-size__pill zzz-doc-size__pill--capped"
                style={{ position: 'relative' }}
            >
                <span className="zzz-doc-size__cap" aria-hidden="true">
                    <span className="zzz-doc-size__disc" />
                </span>
                <span className="zzz-doc-size__label zzz-italic">Confirm</span>
            </div>
            <div
                className="zzz-mat-pill zzz-doc-size__circle"
                aria-label="Filter"
                role="img"
            >
                <FilterIcon />
            </div>
            <div className="zzz-doc-size__field">Search…</div>
            <Readout>{readout}</Readout>
        </div>
    )
}

/** The sm / md / lg control scale at the current density (default 0.7). */
export const ControlScale: Story = {
    name: 'Control scale',
    render: () => (
        <div className="zzz-doc">
            {SIZES.map((s) => (
                <ControlRow key={s} size={s} />
            ))}
        </div>
    ),
}

const ROWS: { key: string; label: string; values: (s: Size) => number }[] = [
    {
        key: 'height',
        label: 'Height (pill, circle, field)',
        values: (s) => tokens.size.control[s],
    },
    {
        key: 'label',
        label: 'Label font size',
        values: (s) => tokens.fontSize.control[s],
    },
    {
        key: 'cap',
        label: 'Icon-cap diameter',
        values: (s) => tokens.size.control.cap[s],
    },
    {
        key: 'disc',
        label: 'Icon-cap disc',
        values: (s) => tokens.size.control.disc[s],
    },
    { key: 'icon', label: 'Glyph', values: (s) => tokens.size.control.icon[s] },
    {
        key: 'padX',
        label: 'Inline padding (auto width)',
        values: (s) => tokens.size.control.paddingX[s],
    },
]
const VARS: Record<string, (s: Size) => string> = {
    height: (s) => `--zzz-size-control-${s}`,
    label: (s) => `--zzz-font-size-control-${s}`,
    cap: (s) => `--zzz-size-control-cap-${s}`,
    disc: (s) => `--zzz-size-control-disc-${s}`,
    icon: (s) => `--zzz-size-control-icon-${s}`,
    padX: (s) => `--zzz-size-control-padding-x-${s}`,
}

/** The size tokens: design units, and CSS px at the web default (0.7) and game density (1) with a 16 px root. */
export const SizeTokens: Story = {
    name: 'Size tokens',
    render: () => (
        <table className="zzz-doc-table">
            <thead>
                <tr>
                    <th className="zzz-doc-code">token</th>
                    {SIZES.map((s) => (
                        <th key={s} className="zzz-doc-code">
                            {s}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {ROWS.map((row) => (
                    <tr key={row.key}>
                        <td className="zzz-doc-caption">{row.label}</td>
                        {SIZES.map((s) => {
                            const n = row.values(s)
                            return (
                                <td key={s} className="zzz-doc-code">
                                    <div>{VARS[row.key](s)}</div>
                                    <div className="zzz-doc-dim">
                                        {n} units · {fmt(n * 0.7)} px @0.7 · {n}{' '}
                                        px @1
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    ),
}

const TYPE: { role: string; size: number; use: string }[] = [
    {
        role: 'label',
        size: tokens.fontSize.label,
        use: 'captions, chips, counts',
    },
    { role: 'body', size: tokens.fontSize.body, use: 'body copy' },
    { role: 'body-lg', size: tokens.fontSize.bodyLg, use: 'emphasised rows' },
    {
        role: 'button',
        size: tokens.fontSize.button,
        use: 'md button / tab labels',
    },
    {
        role: 'title',
        size: tokens.fontSize.title,
        use: 'dialog and page titles',
    },
]

function TypeRow({
    role,
    size,
    use,
}: {
    role: string
    size: number
    use: string
}) {
    const [ref, readout] = useReadout<HTMLParagraphElement>(
        'font-size',
        'fontSize'
    )
    return (
        <div className="zzz-doc-row" style={{ alignItems: 'baseline' }}>
            <span
                className="zzz-doc-code"
                style={{ width: 'calc(260 * var(--zzz-px))' }}
            >
                .zzz-text-{role} ({size} units)
            </span>
            <p ref={ref} className={`zzz-doc-type-sample zzz-text-${role}`}>
                The quick proxy jumps the Hollow
            </p>
            <span className="zzz-doc-caption">{use}</span>
            <Readout>{readout}</Readout>
        </div>
    )
}

/** Text roles at the current density, with live px readouts. */
export const TypeScale: Story = {
    name: 'Type scale',
    render: () => (
        <div className="zzz-doc">
            {TYPE.map((t) => (
                <TypeRow key={t.role} {...t} />
            ))}
        </div>
    ),
}

function DensityRow({ scale }: { scale: number }) {
    const [ref, readout] = useReadout<HTMLDivElement>('md height')
    return (
        <div className="zzz-doc-size" data-size="md">
            <span
                className="zzz-doc-code"
                style={{ width: 'calc(220 * var(--zzz-px))' }}
            >
                scale={scale}
                {scale === 0.7
                    ? ' (default)'
                    : scale === 1
                      ? ' (game density)'
                      : ''}
            </span>
            <div ref={ref} className="zzz-mat-pill zzz-doc-size__pill">
                <span className="zzz-doc-size__label zzz-italic">Start</span>
            </div>
            <div
                className="zzz-mat-pill zzz-doc-size__circle"
                role="img"
                aria-label="Done"
            >
                <CheckIcon />
            </div>
            <Readout>{readout}</Readout>
        </div>
    )
}

/** The same md controls at each density the Scale tool offers. */
export const Densities: Story = {
    parameters: {
        docs: {
            description: {
                story: 'One md row at each density. `0.7` is the default; `1` is game density (1 design unit = 1 CSS px); `0.5` is compact. All of them are rem-based, so they also follow the browser font size.',
            },
        },
    },
    render: () => (
        <div className="zzz-doc">
            {[0.5, 0.7, 1].map((scale) => (
                <ZzzTheme key={scale} scale={scale}>
                    <DensityRow scale={scale} />
                </ZzzTheme>
            ))}
        </div>
    ),
}
