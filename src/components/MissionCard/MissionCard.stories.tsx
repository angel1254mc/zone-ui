import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { AgentImage } from '../../../examples/art'
import { MissionCard } from './MissionCard'
import type { MissionCardProps } from './MissionCard'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const pastel: CSSProperties = {
    background: 'linear-gradient(100deg, #E9F4F2, #F4D9E3 55%, #F6E7EC)',
}
const reward = (seed: number) => <AgentImage crop="circle" seed={seed} />

const meta = {
    title: 'Game/MissionCard',
    component: MissionCard,
    tags: ['autodocs'],
    args: {
        title: 'Check in for a total of 14 days in the "Surprise Screening Plan" to obtain',
        status: 'go',
        rewardLabel: 'Outfit reward',
        isNew: false,
    },
    argTypes: {
        status: {
            control: 'inline-radio',
            options: ['go', 'claimed', 'locked'],
        },
        reward: { control: false },
    },
    render: (args) => <MissionCard {...args} reward={reward(4)} />,
    decorators: [
        (Story) => (
            <div style={{ ...pastel, padding: gpx(24) }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component: 'Event mission card',
            },
        },
    },
} satisfies Meta<typeof MissionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Go: Story = { args: { isNew: true } }
export const Claimed: Story = {
    args: {
        title: 'Complete all stages in "Clink, Clank, Pinball Knight!"',
        status: 'claimed',
    },
}
export const Locked: Story = {
    name: 'Locked (Stay Tuned)',
    args: { title: 'This mission unlocks in Version 3.3', status: 'locked' },
}
export const SingleLine: Story = {
    args: { title: 'Clear "Shiyu Defense" Critical Node 3 times' },
}
export const WithOrnament: Story = { args: { theme: { ornament: '#F3A445' } } }
export const OtherTheme: Story = {
    name: 'Other event theme',
    args: {
        theme: { ring: '#6C63D9', body: '#F2B233' },
        title: 'Defeat 30 Ethereals in "Hollow Zero: Operation Matrix"',
    },
}

const CARDS: Pick<MissionCardProps, 'title' | 'status' | 'isNew'>[] = [
    {
        title: 'Complete all stages in "Clink, Clank, Pinball Knight!"',
        status: 'claimed',
    },
    {
        title: 'Check in for a total of 14 days in the "Surprise Screening Plan" to obtain',
        status: 'go',
        isNew: true,
    },
    { title: 'This mission unlocks in Version 3.3', status: 'locked' },
]

/** A column of three cards at a 162 pitch. */
export const Column: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
            {CARDS.map((c, i) => (
                <MissionCard
                    key={i}
                    {...c}
                    reward={reward(4)}
                    rewardLabel="Outfit reward"
                    theme={{ ornament: '#F3A445' }}
                />
            ))}
        </div>
    ),
}
