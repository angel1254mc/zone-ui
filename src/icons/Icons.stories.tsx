import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'
import { iconNames, type IconName } from './registry'

/** calc(N * var(--zzz-px)): N design units. */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const font: CSSProperties = {
    fontFamily: 'var(--zzz-font-family-ui, sans-serif)',
    fontWeight: 900,
    lineHeight: 1.2,
}

const meta = {
    title: 'Foundations/Icons',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: [
                    'Original SVG glyphs. Every glyph is a React component on a `0 0 32 32` grid (the wide Home-dock glyphs Squad, Mail, Inter-Knot, Agents and Signal Search widen it to `0 0 W 32`; `size` is the height), filled with `currentColor` (element, currency and a few coloured dock glyphs carry their own palette).',
                    '',
                    '```tsx',
                    "import { BackIcon, Icon } from '@angel1254mc/zone-ui'",
                    '<BackIcon size={34} style={{ color: "var(--zzz-color-danger-base)" }} />',
                    '<Icon name="filter" size="1.5em" title="Filter" />',
                    '```',
                    '',
                    '- `size`: a number is in design units (`calc(n * var(--zzz-px))`, follows `--zzz-scale`); a string is any CSS length. Default `1em`.',
                    '- `title`: gives `role="img"` + `<title>`; without it the icon is `aria-hidden` and `focusable="false"`.',
                    '- `icons` is the `{ name: Component }` record, `IconName` its key union, `iconNames` the ordered list.',
                    '',
                    'Icons are never skewed, even inside italic buttons. Dock icons get their dark outline from `filter: var(--zzz-shadow-icon-outline)`, not from the path.',
                ].join('\n'),
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Grid({
    background,
    color,
    children,
}: {
    background: string
    color: string
    children: ReactNode
}) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${gpx(150)}, 1fr))`,
                gap: gpx(8),
                padding: gpx(16),
                background,
                color,
                borderRadius: gpx(12),
                ...font,
            }}
        >
            {children}
        </div>
    )
}

function Tile({ name, size = 48 }: { name: IconName; size?: number }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: gpx(8),
                padding: gpx(10),
            }}
        >
            <Icon name={name} size={size} />
            <span
                style={{
                    fontSize: gpx(12),
                    opacity: 0.8,
                    overflowWrap: 'anywhere',
                    textAlign: 'center',
                }}
            >
                {name}
            </span>
        </div>
    )
}

/** Every glyph, white on the app background. */
export const Gallery: Story = {
    render: () => (
        <Grid background="var(--zzz-color-bg-app, #0b0b0b)" color="#FFFFFF">
            {iconNames.map((n) => (
                <Tile key={n} name={n} />
            ))}
        </Grid>
    ),
}

/** Every glyph, black (`color.accent.on`) on the pulsing accent: the pressed / selected look. */
export const OnAccent: Story = {
    render: () => (
        <Grid
            background="var(--zzz-accent)"
            color="var(--zzz-color-accent-on, #000)"
        >
            {iconNames.map((n) => (
                <Tile key={n} name={n} />
            ))}
        </Grid>
    ),
}

const sizeSteps = [14, 22, 28, 34, 45, 60]

/** `size.icon.*` steps (design units), plus the `1em` default inheriting the font size. */
export const Sizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: gpx(24),
                color: '#FFFFFF',
                ...font,
            }}
        >
            {sizeSteps.map((s) => (
                <div
                    key={s}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: gpx(8),
                    }}
                >
                    <Icon name="home" size={s} />
                    <span style={{ fontSize: gpx(14) }}>{s}</span>
                </div>
            ))}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: gpx(8),
                }}
            >
                <span style={{ fontSize: gpx(40) }}>
                    <Icon name="home" />
                </span>
                <span style={{ fontSize: gpx(14) }}>1em @ 40</span>
            </div>
        </div>
    ),
}

/** Accessible name via `title`. */
export const WithTitle: Story = {
    render: () => (
        <span style={{ color: '#FFFFFF' }}>
            <Icon name="lock" size={45} title="Locked" />
        </span>
    ),
}
