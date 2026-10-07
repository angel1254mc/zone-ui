import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Button } from '../Button'
import { CountdownBar } from './CountdownBar'
import { useCountdown } from './useCountdown'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-micro)',
    lineHeight: 'var(--zzz-line-height-single)',
    color: 'var(--zzz-color-text-muted)',
}
const col: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: gpx(28),
    width: gpx(720),
    maxWidth: '100%',
}
const surface: CSSProperties = {
    padding: gpx(28),
    background: 'var(--zzz-color-surface-raised)',
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(10) }}>
            <span style={caption}>{label}</span>
            {children}
        </div>
    )
}

/** A 360 px-wide phone column at --zzz-scale 0.6 (the nested theme recomputes --zzz-px). */
function Phone({
    children,
    width = 360,
}: {
    children: ReactNode
    width?: number
}) {
    return (
        <div
            className="zzz-theme"
            style={
                {
                    '--zzz-scale': 0.6,
                    width,
                    padding: 16,
                    background: '#000',
                } as CSSProperties
            }
        >
            {children}
        </div>
    )
}

/** Stories that draw their own frame (story decorators cannot remove the meta one). */
const BARE = ['Phone Width']

const meta = {
    title: 'Data Display/CountdownBar',
    component: CountdownBar,
    tags: ['autodocs'],
    args: { durationMs: 30_000 },
    argTypes: {
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
        expiredLabel: { control: 'text' },
    },
    decorators: [
        (Story, ctx) =>
            BARE.includes(ctx.name) ? (
                <Story />
            ) : (
                <div style={surface}>
                    <div style={{ width: gpx(720), maxWidth: '100%' }}>
                        <Story />
                    </div>
                </div>
            ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'A simple countdown bar component that counts down from durationMs. Controllable via `secondsLeft`',
            },
        },
    },
} satisfies Meta<typeof CountdownBar>

export default meta
type Story = StoryObj<typeof meta>

/** Self-driven 30 s countdown (runs live; remount the story to restart). */
export const Playground: Story = {}

/** Static snapshots of every state (controlled props). */
export const States: Story = {
    args: { durationMs: 30_000 },
    render: () => (
        <div style={col}>
            <Labeled label="normal · 22 s of 30">
                <CountdownBar durationMs={30_000} secondsLeft={22} />
            </Labeled>
            <Labeled label="warning · ≤ warnAt (10 s): orange + pulse">
                <CountdownBar durationMs={30_000} secondsLeft={8} />
            </Labeled>
            <Labeled label="critical · ≤ criticalAt (3 s): red">
                <CountdownBar durationMs={30_000} secondsLeft={2} />
            </Labeled>
            <Labeled label="expired · custom label">
                <CountdownBar
                    durationMs={30_000}
                    secondsLeft={0}
                    expiredLabel="Time's up"
                />
            </Labeled>
            <Labeled label="paused (running=false) · self-driven">
                <CountdownBar durationMs={45_000} running={false} />
            </Labeled>
        </div>
    ),
}

export const Warning: Story = { args: { durationMs: 30_000, secondsLeft: 7 } }
export const Expired: Story = {
    args: { durationMs: 30_000, secondsLeft: 0, expiredLabel: 'Too slow!' },
}

/** Overclock-bar ">" cuts across the fill. */
export const Chevrons: Story = {
    render: () => (
        <div style={col}>
            <CountdownBar durationMs={30_000} secondsLeft={21} chevrons />
            <CountdownBar durationMs={30_000} secondsLeft={6} chevrons />
            <CountdownBar
                durationMs={30_000}
                secondsLeft={18}
                chevrons
                size="lg"
            />
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div style={col}>
            <Labeled label="sm (channel 16, readout 21)">
                <CountdownBar size="sm" durationMs={30_000} secondsLeft={18} />
            </Labeled>
            <Labeled label="md (channel 28, readout 26, default)">
                <CountdownBar durationMs={30_000} secondsLeft={18} />
            </Labeled>
            <Labeled label="lg (channel 40, readout 30)">
                <CountdownBar size="lg" durationMs={30_000} secondsLeft={18} />
            </Labeled>
            <Labeled label="no readout · fraction only">
                <CountdownBar
                    fraction={0.42}
                    showValue={false}
                    label="Session time"
                />
            </Labeled>
            <Labeled label="minutes (cooldown 2:05)">
                <CountdownBar
                    durationMs={300_000}
                    secondsLeft={125}
                    label="Cooldown"
                />
            </Labeled>
        </div>
    ),
}

function QuizTimer() {
    const [round, setRound] = useState(1)
    const [log, setLog] = useState('')
    const cd = useCountdown({
        durationMs: 15_000,
        onExpire: () => setLog(`Round ${round}: time ran out`),
    })
    return (
        <div style={col}>
            <CountdownBar
                durationMs={cd.totalMs}
                secondsLeft={cd.secondsLeft}
                fraction={cd.fraction}
                warnAt={5}
                chevrons
            />
            <div style={{ display: 'flex', gap: gpx(16), flexWrap: 'wrap' }}>
                <Button onClick={() => (cd.ticking ? cd.pause() : cd.resume())}>
                    {cd.ticking ? 'Pause' : 'Resume'}
                </Button>
                <Button
                    onClick={() => {
                        setRound((r) => r + 1)
                        setLog('')
                        cd.reset()
                    }}
                >
                    Next round
                </Button>
            </div>
            <span style={caption}>
                {log || `Round ${round} · ${cd.secondsLeft}s left`}
            </span>
        </div>
    )
}

/** Controlled by `useCountdown()` (15 s rounds, warning at 5 s): pause / resume / reset. */
export const WithUseCountdown: Story = { render: () => <QuizTimer /> }

/** Phone width (360 px at --zzz-scale 0.6): the bar is fluid, the readout keeps its width. */
export const PhoneWidth: Story = {
    parameters: { layout: 'centered' },
    render: () => (
        <Phone>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <CountdownBar durationMs={30_000} secondsLeft={24} />
                <CountdownBar durationMs={30_000} secondsLeft={9} chevrons />
                <CountdownBar durationMs={30_000} secondsLeft={0} />
                <CountdownBar size="sm" durationMs={30_000} secondsLeft={14} />
            </div>
        </Phone>
    ),
}
