import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, type ReactNode } from 'react'
import { fn } from 'storybook/test'
import { GameArtProvider, useGameArt, type GameArtState } from './art'
import {
    STORAGE_KEY,
    TriviaPage,
    generateDailySet,
    nextRecord,
    EMPTY_RECORD,
    TIMED_OUT,
    type TriviaPageProps,
} from './pages/Trivia'

const FIXED_DATE = '2026-09-30'

/** The page fills the story viewport (layout fullscreen); `width` simulates a device. */
const Frame = ({
    children,
    width,
    height,
}: {
    children: ReactNode
    width?: number
    height?: number
}) => (
    <div
        style={{
            minHeight: '100vh',
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: width ?? '100%',
                height,
                minHeight: height ? undefined : '100vh',
                overflow: height ? 'auto' : undefined,
                outline: width ? '1px solid #333' : undefined,
            }}
        >
            {children}
        </div>
    </div>
)

/** Pins the art state for one story (the loading and no-art states). */
const withArtState =
    (state: GameArtState): Decorator =>
    (Story) => (
        <GameArtProvider state={state}>
            <Story />
        </GameArtProvider>
    )

/** Answers for the fixed day: correct except at `wrongAt`; `timeoutAt` ran out of time. */
function useScripted(
    count: number,
    wrongAt: number[] = [],
    timeoutAt: number[] = []
): number[] {
    const manifest = useGameArt()
    return useMemo(() => {
        const set = generateDailySet(manifest, FIXED_DATE)
        return set.questions
            .slice(0, count)
            .map((q, i) =>
                timeoutAt.includes(i)
                    ? TIMED_OUT
                    : wrongAt.includes(i)
                      ? (q.answer + 1) % 4
                      : q.answer
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manifest, count])
}

function Scripted({
    count,
    wrongAt,
    timeoutAt,
    ...props
}: TriviaPageProps & {
    count: number
    wrongAt?: number[]
    timeoutAt?: number[]
}) {
    const answers = useScripted(count, wrongAt, timeoutAt)
    return <TriviaPage {...props} initialAnswers={answers} />
}

/** A storage that already holds a finished run for the fixed day (as after a reload). */
function AlreadyPlayedPage(props: TriviaPageProps) {
    const answers = useScripted(5, [3])
    const manifest = useGameArt()
    const storage = useMemo(() => {
        const set = generateDailySet(manifest, FIXED_DATE)
        const score = set.questions.filter(
            (q, i) => answers[i] === q.answer
        ).length
        const prev = {
            ...EMPTY_RECORD,
            lastDate: '2026-09-29',
            streak: 6,
            best: 5,
            played: 21,
        }
        const rec = {
            ...nextRecord(prev, FIXED_DATE, score),
            day: {
                date: FIXED_DATE,
                answers,
                elapsedMs: 74_000,
                started: null,
            },
        }
        const map = new Map([[STORAGE_KEY, JSON.stringify(rec)]])
        return {
            getItem: (k: string) => map.get(k) ?? null,
            setItem: (k: string, v: string) => void map.set(k, v),
        }
    }, [manifest, answers])
    return <TriviaPage {...props} storage={storage} />
}

const meta = {
    title: 'Examples/ZZZ Trivia',
    component: TriviaPage,
    tags: ['autodocs'],
    args: { onBack: fn() },
    argTypes: {
        date: {
            control: 'text',
            description:
                'YYYY-MM-DD — the same date always gives the same 5 questions.',
        },
        scale: { control: { type: 'number', min: 0.3, max: 1, step: 0.05 } },
        manifest: { control: false },
        facts: { control: false },
        storage: { control: false },
        now: { control: false },
        distribution: { control: 'object' },
    },
    render: (args) => (
        <Frame>
            <TriviaPage {...args} />
        </Frame>
    ),
    parameters: {
        layout: 'fullscreen',
        docs: {
            story: { inline: false, height: '720px' },
            description: {
                component:
                    'An example daily-quiz web app composed only from general zone-ui ',
            },
        },
    },
} satisfies Meta<typeof TriviaPage>

export default meta
type Story = StoryObj<typeof meta>

/** Today's puzzle with your real localStorage: play once, and a reload shows your results until midnight. */
export const Default: Story = {}

/** A fixed date: deterministic questions and host (memory-only storage, so it can be replayed). */
export const FixedDate: Story = { args: { date: FIXED_DATE, storage: null } }

/** Question 3 after one right and one wrong answer (timer frozen at 21 s). */
export const MidQuiz: Story = {
    args: { date: FIXED_DATE, storage: null, timerSecondsLeft: 21 },
    render: (args) => (
        <Frame>
            <Scripted {...args} count={2} wrongAt={[1]} />
        </Frame>
    ),
}

/** The warning state of the question timer (≤ 10 s left: orange, pulsing; the host hurries you). */
export const WarningTimer: Story = {
    name: 'Warning timer',
    args: { date: FIXED_DATE, storage: null, timerSecondsLeft: 7 },
    render: (args) => (
        <Frame>
            <Scripted {...args} count={3} wrongAt={[0]} />
        </Frame>
    ),
}

/** A revealed wrong answer: the pick in red, the right one revealed, the fact and "Next question". */
export const Revealed: Story = {
    args: {
        date: FIXED_DATE,
        storage: null,
        initialRevealed: true,
        timerSecondsLeft: 12,
    },
    render: (args) => (
        <Frame>
            <Scripted {...args} count={2} wrongAt={[1]} />
        </Frame>
    ),
}

/** Results + stats after a run with one wrong answer and one timeout. */
export const Results: Story = {
    args: { date: FIXED_DATE, storage: null },
    render: (args) => (
        <Frame>
            <Scripted {...args} count={5} wrongAt={[1]} timeoutAt={[3]} />
        </Frame>
    ),
}

/** Reloading after today's run: straight to the results with an "already played" notice. */
export const AlreadyPlayed: Story = {
    args: { date: FIXED_DATE },
    render: (args) => (
        <Frame>
            <AlreadyPlayedPage {...args} />
        </Frame>
    ),
}

/** Phone (390 × 844): same density as desktop; the host becomes a row above the card. */
export const Phone: Story = {
    args: { date: FIXED_DATE, storage: null, timerSecondsLeft: 18 },
    render: (args) => (
        <Frame width={390} height={844}>
            <Scripted {...args} count={1} />
        </Frame>
    ),
}

/** Phone start screen. */
export const PhoneStart: Story = {
    name: 'Phone start',
    args: { date: FIXED_DATE, storage: null },
    render: (args) => (
        <Frame width={390} height={844}>
            <TriviaPage {...args} />
        </Frame>
    ),
}

/** Phone results. */
export const PhoneResults: Story = {
    name: 'Phone results',
    args: { date: FIXED_DATE, storage: null },
    render: (args) => (
        <Frame width={390} height={844}>
            <Scripted {...args} count={5} wrongAt={[2]} />
        </Frame>
    ),
}

/** No art reachable (art state `missing`): the deterministic text fallback set; image slots are empty frames. */
export const NoArt: Story = {
    name: 'No art',
    args: { date: FIXED_DATE, storage: null, timerSecondsLeft: 25 },
    decorators: [withArtState({ status: 'missing', manifest: null })],
    render: (args) => (
        <Frame>
            <Scripted {...args} count={0} />
        </Frame>
    ),
}

/** Start screen without art: same layout, the host is an empty frame (same real host as the fallback day). */
export const NoArtStart: Story = {
    name: 'No art — start',
    args: { date: FIXED_DATE, storage: null },
    decorators: [withArtState({ status: 'missing', manifest: null })],
}

/** Art state still loading (pinned): the start screen waits — Play disabled with a spinner, a neutral skeleton for the host. */
export const Loading: Story = {
    args: { date: FIXED_DATE, storage: null },
    decorators: [withArtState({ status: 'loading', manifest: null })],
}

/** Phone while loading. */
export const PhoneLoading: Story = {
    name: 'Phone loading',
    args: { date: FIXED_DATE, storage: null },
    decorators: [withArtState({ status: 'loading', manifest: null })],
    render: (args) => (
        <Frame width={390} height={844}>
            <TriviaPage {...args} />
        </Frame>
    ),
}
