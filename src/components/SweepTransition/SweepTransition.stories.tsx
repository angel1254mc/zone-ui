import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AgentImage } from '../../../examples/art'
import { Button } from '../Button'
import { GraffitiLayer, HatchBackground } from '../Backgrounds'
import { Stage } from '../Stage'
import { Text } from '../Text'
import { SweepTransition, SWEEP_TIMING } from './SweepTransition'
import type { SweepTransitionProps } from './SweepTransition'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
}
const W = 1920
const H = 1080

/** A stand-in page: step N of a flow (art + a heading), so the swap at the midpoint is visible. */
function PageMock({ step, compact = false }: { step: number; compact?: boolean }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}>
      {step % 2 ? <GraffitiLayer /> : <HatchBackground />}
      <div
        style={{
          position: 'absolute',
          right: compact ? '-10%' : gpx(120),
          bottom: 0,
          width: compact ? '90%' : gpx(760),
          height: compact ? '60%' : gpx(1000),
        }}
      >
        <AgentImage seed={step + 3} crop="full" />
      </div>
      <div style={{ position: 'absolute', left: compact ? gpx(40) : gpx(140), top: compact ? gpx(80) : gpx(200) }}>
        <Text as="div" role={compact ? 'title' : 'eventTitle'} outline="event" italic>
          Step {step}
        </Text>
      </div>
    </div>
  )
}

/** A positioned box the sweep renders into (`container`). Desktop: a 1920×1080 Stage. */
function Canvas({
  native = false,
  phone = false,
  children,
}: {
  native?: boolean
  phone?: boolean
  children: (c: HTMLElement) => ReactNode
}) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const inner = (
    <div ref={setEl} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {el ? children(el) : null}
    </div>
  )
  if (phone)
    return (
      <div style={{ position: 'relative', width: '390px', height: '844px' }}>
        {inner}
      </div>
    )
  if (native) return <div style={{ position: 'relative', width: gpx(W), height: gpx(H) }}>{inner}</div>
  return (
    <Stage width={W} height={H} style={{ width: '100%' }}>
      {inner}
    </Stage>
  )
}

function Demo(args: Partial<SweepTransitionProps> & { phone?: boolean }) {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(1)
  const { phone, ...sweep } = args
  return (
    <Canvas phone={phone}>
      {(c) => (
        <>
          <PageMock step={step} compact={phone} />
          <div style={{ position: 'absolute', left: phone ? gpx(40) : gpx(66), bottom: phone ? gpx(60) : gpx(40) }}>
            <Button size="md" onClick={() => setActive(true)}>
              Next
            </Button>
          </div>
          <SweepTransition
            {...sweep}
            label={sweep.label ?? `Step ${step + 1}`}
            active={active}
            container={c}
            onMidpoint={() => setStep((s) => s + 1)}
            onDone={() => setActive(false)}
          />
        </>
      )}
    </Canvas>
  )
}

const meta = {
  title: 'Overlays/SweepTransition',
  component: SweepTransition,
  tags: ['autodocs'],
  args: { label: undefined, tone: 'default', duration: SWEEP_TIMING.total },
  argTypes: {
    tone: { control: 'select', options: ['default', 'accent', '#B0506A', '#3A7BD5'] },
    duration: { control: { type: 'range', min: 400, max: 2400, step: 50 } },
    at: { control: { type: 'range', min: 0, max: 933, step: 33 } },
    container: { control: false },
    active: { control: false },
    runKey: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-screen sweep between steps, levels, questions or routes, inspired by the game\'s ' +
          '"AGENT SELECT" wipe. A black centre band grows with a tracked ' +
          'condensed italic **label** ("QUESTION 3", "LOADING", "STAGE CLEAR"); three hatched chevron panels ' +
          '("<" edges at 16.2°) sweep in from the right; the stack exits left revealing the new content behind a ' +
          'chevron edge; the label blinks; the band collapses.\n\n' +
          '- **Trigger**: `active` (rising edge; reset it in `onDone`) or `runKey` (every new non-null value plays, ' +
          'including on mount — e.g. `runKey={questionIndex}`).\n' +
          '- **Callbacks**: swap your content in `onMidpoint` (567 / 933 of `duration`); `onDone` at the end.\n' +
          '- **tone**: `default` (sage `#779988` / teal `#384C4A` / deep `#202A27`), `accent` (the live ' +
          'lime ↔ yellow accent + two darker mixes), any colour (a tint; darker two derived), or a 3-tuple of ' +
          'colours / `{ light, dark }` stripe pairs.\n' +
          '- **duration**: default 933 ms; the whole timeline scales.\n' +
          '- `container` keeps it inside an element (else a fixed layer on `<body>`); `at` freezes a frame.\n' +
          '- Decorative (`aria-hidden`): announce the new content yourself. **Reduced motion** (OS setting, a ' +
          '`data-reduced-motion` ancestor, or `reducedMotion`): a 400 ms quick fade.\n' +
          '- Works at any aspect: on a tall phone layer the chevron tip is capped at 12 % of the width and the ' +
          'band tracking shrinks so the label fits.\n\n' +
          '`AgentSelectInterstitial` is now a deprecated preset of this component.',
      },
    },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof SweepTransition>

export default meta
type Story = StoryObj<typeof meta>

/** Click "Next": the page swaps at the midpoint. */
export const Play: Story = {}

export const AccentTone: Story = { name: 'tone: accent', args: { tone: 'accent', label: 'Stage Clear' } }

export const Tinted: Story = { name: 'tone: tint colour', args: { tone: '#3A7BD5', label: 'Loading' } }

export const CustomTones: Story = {
  name: 'tone: custom 3 panels',
  args: { tone: ['#F168A3', '#5A2E4A', { light: '#24161F', dark: '#1A1016' }], label: 'Round 2' },
}

export const Slow: Story = { name: 'duration 1800 ms', args: { duration: 1800, label: 'Loading' } }

export const ReducedMotion: Story = { args: { reducedMotion: true } }

/** Keyed: every new `runKey` plays (here the question number). */
export const Keyed: Story = {
  render: () => {
    function KeyedDemo() {
      const [q, setQ] = useState(1)
      const [shown, setShown] = useState(1)
      return (
        <Canvas>
          {(c) => (
            <>
              <PageMock step={shown} />
              <div style={{ position: 'absolute', left: gpx(66), bottom: gpx(40) }}>
                <Button size="md" onClick={() => setQ((n) => n + 1)}>
                  Next question
                </Button>
              </div>
              <SweepTransition runKey={q} label={`Question ${q}`} container={c} onMidpoint={() => setShown(q)} />
            </>
          )}
        </Canvas>
      )
    }
    return <KeyedDemo />
  },
}

/** Phone portrait (390 × 844 CSS px) at the web default scale. */
export const Phone: Story = { args: { phone: true, label: 'Question 3' } as never }

const frozen = (at: number, extra: Partial<SweepTransitionProps> = {}, phone = false): Story => ({
  render: () => (
    <Canvas phone={phone}>
      {(c) => (
        <>
          <PageMock step={at >= SWEEP_TIMING.midpoint ? 2 : 1} compact={phone} />
          <SweepTransition at={at} container={c} label="Question 3" {...extra} />
        </>
      )}
    </Canvas>
  ),
})

/** t = 233 ms: the hold (sage panel + teal strip). */
export const FrameHold: Story = { name: 'Frame 233 ms (hold)', ...frozen(233) }
/** t = 500 ms: deep panel sweeping in. */
export const FrameDeep: Story = { name: 'Frame 500 ms (deep panel)', ...frozen(500) }
/** t = 600 ms: exit — the new content revealed from the right. */
export const FrameExit: Story = { name: 'Frame 600 ms (exit)', ...frozen(600) }
/** Accent tone at the hold. */
export const FrameAccent: Story = { name: 'Frame 233 ms (accent)', ...frozen(233, { tone: 'accent', label: 'Stage Clear' }) }
/** Phone portrait at the hold. */
export const FramePhone: Story = { name: 'Frame 233 ms (phone)', ...frozen(233, {}, true) }
/** Phone portrait at the exit. */
export const FramePhoneExit: Story = { name: 'Frame 600 ms (phone exit)', ...frozen(600, {}, true) }

/** t = 0 … 900 ms in 33.3 ms steps. */
const TIMES = Array.from({ length: 28 }, (_, k) => Math.round(k * 33.33))

/** The whole timeline frozen with `at` every 33 ms (default tone). */
export const Timeline: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12), padding: gpx(16), background: '#26262E' }}>
      <span style={caption}>Frozen with `at`, t = 0 … 900 ms</span>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${gpx(224)})`, gap: gpx(4), width: gpx(1596) }}>
        {TIMES.map((t) => (
          <div key={t} style={{ width: gpx(224), height: gpx((224 * H) / W), overflow: 'hidden' }}>
            <div style={{ transform: `scale(${224 / W})`, transformOrigin: '0 0' }}>
              <Canvas native>
                {(c) => (
                  <>
                    <PageMock step={t >= SWEEP_TIMING.midpoint ? 2 : 1} />
                    <SweepTransition at={t} container={c} label="Question 3" />
                  </>
                )}
              </Canvas>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
