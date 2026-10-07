import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { StarRating } from './StarRating'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-micro)',
    lineHeight: 'var(--zzz-line-height-single)',
    color: 'var(--zzz-color-text-muted)',
}

const meta = {
    title: 'Primitives/StarRating',
    component: StarRating,
    tags: ['autodocs'],
    args: { value: 3, max: 5, size: 'card' },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 5, step: 1 } },
        size: {
            control: 'inline-radio',
            options: ['card', 'pill', 'bar', 'large', 'onLime'],
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Display-only refinement stars.',
            },
        },
    },
} satisfies Meta<typeof StarRating>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function Row({
    label,
    children,
    bg = '#000',
}: {
    label: string
    children: ReactNode
    bg?: string
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: gpx(24) }}>
            <span style={{ ...caption, width: gpx(180) }}>{label}</span>
            <div
                style={{
                    padding: `${gpx(10)} ${gpx(16)}`,
                    background: bg,
                    borderRadius: gpx(30),
                }}
            >
                {children}
            </div>
        </div>
    )
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
            <Row
                label="card 13×14 @16.2 (on rarity S)"
                bg="var(--zzz-color-rarity-s)"
            >
                <StarRating value={1} size="card" />
            </Row>
            <Row
                label="pill 23×24 @28.8"
                bg="var(--zzz-color-surface-stat-row)"
            >
                <StarRating value={1} size="pill" />
            </Row>
            <Row label="bar 23 @32">
                <StarRating value={1} size="bar" />
            </Row>
            <Row label="large 24 @34" bg="var(--zzz-color-surface-level-pill)">
                <StarRating value={1} size="large" />
            </Row>
            <Row label="onLime 23 @32, 2 px outline" bg="#A2E808">
                <StarRating value={3} size="onLime" />
            </Row>
        </div>
    ),
}

export const Values: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
            {[0, 1, 2, 3, 4, 5].map((v) => (
                <Row
                    key={v}
                    label={`${v} of 5`}
                    bg="var(--zzz-color-surface-stat-row)"
                >
                    <StarRating value={v} size="pill" />
                </Row>
            ))}
            <Row label="outline={false}" bg="var(--zzz-color-rarity-a)">
                <StarRating value={2} size="card" outline={false} />
            </Row>
        </div>
    ),
}
