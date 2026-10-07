import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttackIcon } from '../../icons'
import { SectionLabel } from '../SectionLabel'
import { EmptyStatRow, StatGrid, StatRow } from './StatRow'
import { Specimen, Specimens } from './Specimens.story-helpers'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
    title: 'Data Display/StatRow',
    component: StatRow,
    tags: ['autodocs'],
    args: { label: 'Base ATK', value: '684', variant: 'panel' },
    argTypes: {
        variant: {
            control: 'inline-radio',
            options: ['panel', 'grid', 'agent', 'equip'],
        },
        highlight: { control: 'boolean' },
        rollCount: { control: { type: 'number', min: 0, max: 5 } },
        fit: { control: 'inline-radio', options: [false, true, 'wrap'] },
    },
    parameters: {
        docs: {
            description: {
                component: 'Label/value stat capsule.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ padding: gpx(20), background: '#000' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StatRow>

export default meta
type Story = StoryObj<typeof meta>

export const Panel: Story = {}
export const Grid: Story = {
    args: { variant: 'grid' },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: gpx(20),
                    background: 'var(--zzz-color-surface-raised)',
                }}
            >
                <Story />
            </div>
        ),
    ],
}
export const Agent: Story = {
    args: { variant: 'agent', label: 'ATK', value: '2,155' },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: gpx(20),
                    background: 'var(--zzz-color-surface-agent-info)',
                }}
            >
                <Story />
            </div>
        ),
    ],
}
export const Equip: Story = {
    args: { variant: 'equip', label: 'Base ATK', value: '594' },
}
export const Highlight: Story = {
    args: {
        variant: 'agent',
        label: 'CRIT Rate',
        value: '45.8%',
        highlight: true,
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: gpx(20),
                    background: 'var(--zzz-color-surface-agent-info)',
                }}
            >
                <Story />
            </div>
        ),
    ],
}
export const RollCount: Story = {
    args: { label: 'CRIT Rate', value: '4.8%', rollCount: 2 },
}
export const WithIcon: Story = {
    args: { label: 'ATK', value: '30%', icon: <AttackIcon /> },
}
export const FitShrink: Story = {
    args: {
        variant: 'agent',
        label: 'Anomaly Proficiency',
        value: '152',
        fit: true,
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: gpx(20),
                    background: 'var(--zzz-color-surface-agent-info)',
                }}
            >
                <Story />
            </div>
        ),
    ],
}
export const FitWrap: Story = {
    args: {
        variant: 'agent',
        label: 'Automatic Adrenaline Accumulation',
        value: '2',
        fit: 'wrap',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: gpx(20),
                    background: 'var(--zzz-color-surface-agent-info)',
                }}
            >
                <Story />
            </div>
        ),
    ],
}

export const Empty: StoryObj<typeof EmptyStatRow> = {
    render: () => (
        <Specimens column>
            <Specimen
                label="grid (default) on the big-panel column"
                bg="var(--zzz-color-surface-raised)"
            >
                <EmptyStatRow />
            </Specimen>
            <Specimen label="panel" bg="#000">
                <EmptyStatRow variant="panel" />
            </Specimen>
        </Specimens>
    ),
}

/** Large-panel stat grid: 2 columns, 21 / 14 gaps, EMPTY sub-stat slots. */
export const TwoColumnGrid: Story = {
    render: () => (
        <div
            style={{
                padding: gpx(20),
                background: 'var(--zzz-color-surface-raised)',
                display: 'grid',
                gap: gpx(10),
            }}
        >
            <SectionLabel>Base Stat</SectionLabel>
            <StatGrid columns={2} variant="grid">
                <StatRow label="Base ATK" value="684" />
                <EmptyStatRow />
            </StatGrid>
            <SectionLabel>Advanced Stat</SectionLabel>
            <StatGrid columns={2} variant="grid">
                <StatRow label="ATK" value="30%" />
                <EmptyStatRow />
                <EmptyStatRow />
                <EmptyStatRow />
            </StatGrid>
        </div>
    ),
}

const agentStats = (
    <StatGrid columns={2} variant="agent">
        <StatRow label="HP" value="17,066" highlight />
        <StatRow label="ATK" value="2,155" />
        <StatRow label="DEF" value="872" />
        <StatRow label="Impact" value="95" />
        <StatRow label="CRIT Rate" value="45.8%" highlight />
        <StatRow label="CRIT DMG" value="90%" highlight />
        <StatRow label="Anomaly Mastery" value="90" />
        <StatRow label="Anomaly Proficiency" value="152" fit />
        <StatRow label="Sheer Force" value="2,352" highlight />
        <StatRow
            label="Automatic Adrenaline Accumulation"
            value="2"
            fit="wrap"
        />
    </StatGrid>
)

/** Profile-sheet stat grid: black rows on #232323, pitch 52, orange highlighted stats. */
export const AgentGrid: Story = {
    render: () => (
        <div
            style={{
                padding: gpx(20),
                background: 'var(--zzz-color-surface-agent-info)',
            }}
        >
            {agentStats}
        </div>
    ),
}
