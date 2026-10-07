import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { SortToggle } from './SortToggle'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    color: 'var(--zzz-color-text-muted)',
    fontSize: gpx(14),
    lineHeight: 1.2,
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: gpx(12),
                alignItems: 'center',
            }}
        >
            {children}
            <span style={caption}>{label}</span>
        </div>
    )
}

const meta = {
    title: 'Forms/SortToggle',
    component: SortToggle,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Sort-direction toggle, e.g. beside a drawer Select.',
            },
        },
    },
} satisfies Meta<typeof SortToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: gpx(40) }}>
            <Cell label="descending">
                <SortToggle defaultDirection="desc" />
            </Cell>
            <Cell label="ascending">
                <SortToggle defaultDirection="asc" />
            </Cell>
            <Cell label="pressed">
                <SortToggle pressed />
            </Cell>
            <Cell label="disabled">
                <SortToggle disabled />
            </Cell>
        </div>
    ),
}

export const Controlled: Story = {
    render: function Render() {
        const [direction, setDirection] = useState<'asc' | 'desc'>('desc')
        return (
            <Cell label={`direction: ${direction}`}>
                <SortToggle
                    direction={direction}
                    onDirectionChange={setDirection}
                />
            </Cell>
        )
    },
}

const SIZES = ['sm', 'md', 'lg'] as const

/** sm / md / lg = 46 / 57 / 69 design-unit circles (≈ 32 / 40 / 48 CSS px at the default scale). */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: gpx(48), alignItems: 'flex-end' }}>
            {SIZES.map((size) => (
                <Cell key={size} label={`size="${size}"`}>
                    <div
                        style={{
                            display: 'flex',
                            gap: gpx(24),
                            alignItems: 'center',
                        }}
                    >
                        <SortToggle size={size} />
                        <SortToggle size={size} defaultDirection="asc" />
                        <SortToggle size={size} pressed />
                        <SortToggle size={size} disabled />
                    </div>
                </Cell>
            ))}
        </div>
    ),
}
