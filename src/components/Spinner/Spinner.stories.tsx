import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { Spinner } from './Spinner'
import { Button } from '../Button'

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
    title: 'Primitives/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Loading indicator.',
            },
        },
    },
    args: { variant: 'ring', label: 'Loading' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: gpx(60), alignItems: 'flex-end' }}>
            <Cell label="ring · accent">
                <Spinner />
            </Cell>
            <Cell label="ring · white">
                <Spinner tone="white" />
            </Cell>
            <Cell label="ring · current (sage)">
                <span style={{ color: 'var(--zzz-color-sage-base)' }}>
                    <Spinner tone="current" />
                </span>
            </Cell>
            <Cell label="chevrons">
                <Spinner variant="chevrons" />
            </Cell>
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: gpx(48), alignItems: 'center' }}>
            <Spinner size={22} />
            <Spinner size={40} />
            <Spinner size={80} />
            <Spinner variant="chevrons" size={22} />
            <Spinner variant="chevrons" size={44} />
            <Spinner variant="chevrons" size={88} />
        </div>
    ),
}

/** Reduced motion: `data-reduced-motion` on an ancestor freezes both variants. */
export const ReducedMotion: Story = {
    render: () => (
        <div
            data-reduced-motion=""
            style={{ display: 'flex', gap: gpx(60), alignItems: 'center' }}
        >
            <Spinner />
            <Spinner variant="chevrons" />
        </div>
    ),
}

/** In context: a loading button label and a panel placeholder. */
export const InContext: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: gpx(40),
                alignItems: 'center',
            }}
        >
            <Button
                disabled
                icon={<Spinner size={26} tone="white" label="Saving" />}
            >
                Saving
            </Button>
            <div
                className="zzz-mat-panel"
                style={{
                    width: gpx(460),
                    height: gpx(220),
                    display: 'grid',
                    placeItems: 'center',
                    margin: gpx(8),
                }}
            >
                <Spinner
                    variant="chevrons"
                    size={56}
                    label="Loading agent roster"
                />
            </div>
        </div>
    ),
}
