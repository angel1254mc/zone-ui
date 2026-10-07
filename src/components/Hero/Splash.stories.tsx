import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { AgentImage } from '../../../examples/art'
import { Button } from '../Button'
import { Text } from '../Text'
import { Splash } from './Splash'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

/** A positioned viewport for `contained` splashes. */
function Viewport({
    width = 1280,
    height = 720,
    children,
}: {
    width?: number | string
    height?: number | string
    children: ReactNode
}) {
    return (
        <div
            style={{
                position: 'relative',
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                maxWidth: '100%',
                overflow: 'hidden',
                background: '#000',
            }}
        >
            {children}
        </div>
    )
}

const Logo = () => (
    <div
        style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#111',
        }}
    >
        <AgentImage seed={5} crop="circle" alt="" />
    </div>
)

const meta = {
    title: 'Overlays/Splash',
    component: Splash,
    tags: ['autodocs'],
    args: {
        title: 'Proxy Trivia',
        subtitle: 'A daily quiz from New Eridu',
        hint: 'Press to enter',
        footer: 'v1.0 · Fan-made, not affiliated',
        contained: true,
        background: 'graffiti',
    },
    argTypes: {
        background: {
            control: 'inline-radio',
            options: ['graffiti', 'hatch', 'plain'],
        },
        logo: { control: false },
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A full-screen "press / tap to enter" gate for apps, games and kiosks.',
            },
        },
    },
    render: (args) => {
        function Demo() {
            const [open, setOpen] = useState(true)
            const [entered, setEntered] = useState(0)
            return (
                <Viewport>
                    <div
                        style={{
                            display: 'grid',
                            placeItems: 'center',
                            height: '100%',
                            gap: gpx(16),
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                justifyItems: 'center',
                                gap: gpx(24),
                            }}
                        >
                            <Text role="title" tone="primary">
                                Entered {entered}×
                            </Text>
                            <Button onClick={() => setOpen(true)}>
                                Show splash again
                            </Button>
                        </div>
                    </div>
                    <Splash
                        {...args}
                        logo={<Logo />}
                        open={open}
                        onOpenChange={setOpen}
                        onEnter={() => setEntered((n) => n + 1)}
                    />
                </Viewport>
            )
        }
        return <Demo />
    },
} satisfies Meta<typeof Splash>

export default meta
type Story = StoryObj<typeof meta>

/** Click, tap, Enter or Space to enter. */
export const Default: Story = {}

export const Hatch: Story = { args: { background: 'hatch' } }

export const Plain: Story = {
    args: {
        background: 'plain',
        subtitle: undefined,
        footer: undefined,
        hint: 'Tap to start',
    },
}

/** No logo, no subtitle: the minimum gate. */
export const Minimal: Story = {
    render: (args) => (
        <Viewport>
            <Splash {...args} subtitle={undefined} footer={undefined} />
        </Viewport>
    ),
}

/** Phone portrait (390 × 844 CSS px) at the web default scale. */
export const Phone: Story = {
    render: (args) => (
        <Viewport width={390} height={844}>
            <Splash {...args} logo={<Logo />} hint="Tap to enter" />
        </Viewport>
    ),
}

/** The hint pulse is frozen under reduced motion. */
export const ReducedMotion: Story = {
    render: (args) => (
        <div data-reduced-motion="">
            <Viewport>
                <Splash {...args} logo={<Logo />} />
            </Viewport>
        </div>
    ),
}
