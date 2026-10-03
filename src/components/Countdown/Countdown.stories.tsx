import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { HourglassIcon, InfoAlertIcon } from '../../icons'
import { Countdown } from './Countdown'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
}
const pastel: CSSProperties = { background: 'linear-gradient(100deg, #E9F4F2, #F4D9E3 55%, #F6E7EC)' }
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: gpx(18), alignItems: 'flex-start' }

const H = 3_600_000
const M = 60_000
const S = 1000

/** A fixed offset from the first render (stable per mount). */
function useTarget(offsetMs: number) {
  const [t] = useState(() => Date.now() + offsetMs)
  return t
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gpx(16) }}>
      <span style={{ ...caption, width: gpx(150), color: '#555' }}>{label}</span>
      {children}
    </div>
  )
}

const meta = {
  title: 'Data Display/Countdown',
  component: Countdown,
  tags: ['autodocs'],
  args: { target: Date.now() + 7 * H + 42 * M + 13 * S, prefix: 'Next puzzle in' },
  argTypes: {
    target: { control: 'date' },
    format: { control: 'select', options: ['auto', 'hms', 'ms', 'dhms', 'labels', 'compact'] },
    variant: { control: 'inline-radio', options: ['pill', 'plain'] },
    icon: { control: false },
  },
  decorators: [
    (Story, ctx) =>
      ctx.name === 'Phone Width' ? (
        <Story />
      ) : (
        <div style={{ ...pastel, padding: gpx(24) }}>
          <Story />
        </div>
      ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A live countdown, styled like the InfoPill event timer ("66d"). Counts down to `target` ' +
          'and re-renders on each second (deadline-based `useCountdown`, so background tabs stay exact); `onReach` fires once. ' +
          'Formats: `auto` (`07:42:13`, `2d 07:42:13`), `hms`, `ms`, `dhms`, `labels` (`7h 42m 13s`), `compact` (`66d`) or a ' +
          'function of `{ days, hours, minutes, seconds, totalMs }`. `prefix` / `suffix` slots ("Next puzzle in …", "Event ends in …"). ' +
          'Digits sit in fixed 1ch cells so the pill never jitters. `role="timer"` (not live). `variant="plain"` for inline text.',
      },
    },
  },
} satisfies Meta<typeof Countdown>

export default meta
type Story = StoryObj<typeof meta>

/** Live: ticks each second. */
export const Playground: Story = {}

function FormatsDemo() {
  const near = useTarget(7 * H + 42 * M + 13 * S)
  const far = useTarget(2 * 24 * H + 7 * H + 42 * M + 13 * S)
  const event = useTarget(66 * 24 * H + 5 * H)
  const short = useTarget(4 * M + 9 * S)
  return (
    <div style={col}>
      <Row label="auto · < 1 day">
        <Countdown target={near} prefix="Next puzzle in" />
      </Row>
      <Row label="auto · ≥ 1 day">
        <Countdown target={far} prefix="Event ends in" />
      </Row>
      <Row label="labels">
        <Countdown target={far} format="labels" suffix="left" />
      </Row>
      <Row label="compact (event timer)">
        <Countdown target={event} format="compact" />
      </Row>
      <Row label="ms + hourglass">
        <Countdown target={short} format="ms" icon={<HourglassIcon />} prefix="Auction closes in" />
      </Row>
      <Row label="no icon">
        <Countdown target={near} icon={null} />
      </Row>
      <Row label="custom function">
        <Countdown target={near} format={({ hours, minutes }) => `${hours} h ${minutes} min`} icon={<InfoAlertIcon />} />
      </Row>
    </div>
  )
}

export const Formats: Story = { render: () => <FormatsDemo /> }

function ReachedDemo() {
  const soon = useTarget(5 * S)
  const [count, setCount] = useState(0)
  return (
    <div style={col}>
      <Countdown target={soon} prefix="Unlocks in" reachedLabel="Unlocked!" onReach={() => setCount((c) => c + 1)} />
      <span style={{ ...caption, color: '#555' }}>onReach fired {count}×</span>
      <Countdown target={Date.now() - 1000} prefix="Next puzzle in" reachedLabel="Ready — refresh" />
    </div>
  )
}

/** Reaches the target after 5 s (`reachedLabel` turns accent), plus an already-reached one. */
export const Reached: Story = { render: () => <ReachedDemo /> }

function PlainDemo() {
  const t = useTarget(7 * H + 42 * M + 13 * S)
  return (
    <div style={{ padding: gpx(20), background: '#000' }}>
      <p className="zzz-text-body-lg" style={{ margin: 0, color: 'var(--zzz-color-text-primary)' }}>
        Today’s puzzle closes in <Countdown variant="plain" target={t} format="labels" />. Come back tomorrow!
      </p>
    </div>
  )
}

/** Inline text inside a sentence. */
export const Plain: Story = { render: () => <PlainDemo /> }

function PhoneDemo() {
  const t = useTarget(7 * H + 42 * M + 13 * S)
  return (
    <div style={{ width: 360, padding: 16, background: '#111', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <Countdown target={t} prefix="Next puzzle in" />
      <Countdown target={t} format="compact" />
    </div>
  )
}

/** Phone width (360 px) at the web default scale. */
export const PhoneWidth: Story = { render: () => <PhoneDemo /> }
