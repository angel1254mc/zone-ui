import type { Meta, StoryObj } from '@storybook/react-vite'
import { CompareIcon, FilterIcon, RecommendIcon } from '../../icons'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { BottomBar } from './BottomBar'
import { SignalBars, UidFooter } from './UidFooter'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const compareRecommend = (
    <>
        <Button width="compact" icon={<CompareIcon />} iconTone="compare">
            Compare
        </Button>
        <Button width="compact" icon={<RecommendIcon />} iconTone="recommend">
            Recommend
        </Button>
    </>
)
const removeEnhance = (
    <>
        <Button width="compact">Remove</Button>
        <Button width="compact">Enhance</Button>
    </>
)

const meta = {
    title: 'Shell/BottomBar',
    component: BottomBar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Bottom bar: a solid black band that can be used as a footer or the bottom-most item of a screen.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: '100%',
                    background: '#1a1a1a',
                    paddingTop: gpx(20),
                }}
            >
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BottomBar>

export default meta
type Story = StoryObj<typeof meta>

/** Compare / Recommend at the left, Remove / Enhance at the right. */
export const Default: Story = {
    args: { left: compareRecommend, right: removeEnhance },
}

/** The filter circle at the left. */
export const FilterCircle: Story = {
    args: {
        left: <IconButton icon={<FilterIcon />} label="Filter" />,
        right: <Button width="wide">Craft</Button>,
    },
}

/** Key hints inside the band ("R Discard", "T Lock") and the Storage separator. */
export const KeyHintsAndSeparator: Story = {
    args: {
        separator: true,
        hints: [
            { keyCap: 'R', label: 'Discard' },
            { keyCap: 'T', label: 'Lock' },
        ],
    },
}

export const PressedAndDisabled: Story = {
    args: {
        left: (
            <>
                <Button
                    width="compact"
                    icon={<CompareIcon />}
                    iconTone="compare"
                    pressed
                >
                    Compare
                </Button>
                <Button
                    width="compact"
                    icon={<RecommendIcon />}
                    iconTone="recommend"
                    disabled
                >
                    Recommend
                </Button>
            </>
        ),
        right: removeEnhance,
    },
}

export const Uid: StoryObj<typeof UidFooter> = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: gpx(60),
                padding: gpx(24),
                background: '#000',
            }}
        >
            <UidFooter uid="1000000001" />
            <UidFooter uid="1000000001" signal={2} />
            <UidFooter uid="1000000001" signal={1} />
            <UidFooter uid="1000000001" hideSignal />
            <SignalBars signal={0} />
        </div>
    ),
    parameters: {
        docs: {
            description: { story: 'Signal levels 3 / 2 / 1 / hidden / 0.' },
        },
    },
}
