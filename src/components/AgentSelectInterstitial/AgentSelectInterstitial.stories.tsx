import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { AgentImage } from '../../../examples/art'
import { Button } from '../Button'
import { GraffitiLayer } from '../Backgrounds'
import { Stage } from '../Stage'
import { AgentSelectInterstitial, INTERSTITIAL_TIMING } from './AgentSelectInterstitial'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const W = 1920
const H = 1080

/** Stand-in screens: the Agent Select roster before the wipe, the Agent Stats screen after it. */
function ScreenMock({ after }: { after: boolean }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}>
      <GraffitiLayer />
      <div style={{ position: 'absolute', left: after ? gpx(300) : gpx(200), top: gpx(40), width: gpx(900), height: gpx(1040) }}>
        <AgentImage seed={4} crop="full" />
      </div>
      {after ? (
        <div style={{ position: 'absolute', right: gpx(90), top: gpx(160), width: gpx(640), height: gpx(760), borderRadius: gpx(29), background: '#161616', boxShadow: `0 0 0 ${gpx(5)} #333` }} />
      ) : (
        <div style={{ position: 'absolute', right: gpx(90), top: gpx(40), display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: gpx(12) }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ width: gpx(150), height: gpx(190), borderRadius: gpx(10), overflow: 'hidden', background: '#222' }}>
              <AgentImage seed={i + 1} crop="select" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Canvas({ children }: { children: (c: HTMLElement) => ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const inner = (
    <div ref={setEl} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {el ? children(el) : null}
    </div>
  )
  return (
    <Stage width={W} height={H} style={{ width: '100%' }}>
      {inner}
    </Stage>
  )
}

const meta = {
  title: 'Overlays/AgentSelectInterstitial',
  component: AgentSelectInterstitial,
  tags: ['autodocs'],
  args: { play: false, label: 'Agent Select' },
  argTypes: {
    agentColor: { control: 'color' },
    at: { control: { type: 'range', min: 0, max: 933, step: 33 } },
    container: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Deprecated — use `SweepTransition`** (Overlays/SweepTransition). This is now a thin preset of it ' +
          '(`play` → `active`, `agentColor` → `tone`, label "Agent Select"), kept so existing code keeps working.\n\n' +
          'The "A G E N T  S E L E C T" wipe between two screens. **~930 ms**: a black centre band grows 24 → 56 px with the tracked condensed italic label ' +
          '(1.75em, entry flicker); three hatched chevron panels — sage `#779988`, teal `#384C4A`, deep `#202A27`, ' +
          '"<" edges at 16.2° with the tip 157 px ahead — sweep in from the right with an accelerating ease-in ' +
          '(light at 33 ms, teal at 100 ms resting as a 680 px strip, hold ~300 ms, teal covers at 467, deep at 433–533); ' +
          'the stack exits left at 567–633 ms revealing the new screen behind a chevron edge; the label blinks; the band ' +
          'collapses 833–933 ms.\n\n' +
          '`play` (rising edge) runs it; swap your screens in `onMidpoint` (567 ms); `onDone` at 933 ms. `agentColor` tints ' +
          'the panels. `at` freezes the timeline (stories, visual tests). Decorative (`aria-hidden`). Reduced motion: a ' +
          '400 ms quick fade.',
      },
    },
  },
  render: (args) => {
    function Demo() {
      const [play, setPlay] = useState(false)
      const [after, setAfter] = useState(false)
      return (
        <Canvas>
          {(c) => (
            <>
              <ScreenMock after={after} />
              <div style={{ position: 'absolute', left: gpx(66), bottom: gpx(30) }}>
                <Button size="md" onClick={() => setPlay(true)}>
                  {after ? 'Back to select' : 'Base'}
                </Button>
              </div>
              <AgentSelectInterstitial
                {...args}
                play={play || args.play}
                container={c}
                onMidpoint={() => setAfter((a) => !a)}
                onDone={() => setPlay(false)}
              />
            </>
          )}
        </Canvas>
      )
    }
    return <Demo />
  },
} satisfies Meta<typeof AgentSelectInterstitial>

export default meta
type Story = StoryObj<typeof meta>

/** Click "Base" to play; the screen swaps at the midpoint. */
export const Play: Story = {}

export const CustomColor: Story = { name: 'agentColor (tinted)', args: { agentColor: '#B0506A' } }

export const ReducedMotion: Story = { args: { reducedMotion: true } }

const frozen = (at: number, extra: Partial<Parameters<typeof AgentSelectInterstitial>[0]> = {}): Story => ({
  render: () => (
    <Canvas>
      {(c) => (
        <>
          <ScreenMock after={at >= INTERSTITIAL_TIMING.midpoint} />
          <AgentSelectInterstitial play={false} at={at} container={c} {...extra} />
        </>
      )}
    </Canvas>
  ),
})

/** t = 67 ms: band at 56, light panel mid-sweep. */
export const FrameEntry: Story = { name: 'Frame 67 ms (entry)', ...frozen(67) }
/** t = 233 ms: the hold (light panel + teal strip). */
export const FrameHold: Story = { name: 'Frame 233 ms (hold)', ...frozen(233) }
/** t = 500 ms: deep panel sweeping in. */
export const FrameDeep: Story = { name: 'Frame 500 ms (deep panel)', ...frozen(500) }
/** t = 600 ms: exit — the new screen revealed from the right. */
export const FrameExit: Story = { name: 'Frame 600 ms (exit)', ...frozen(600) }
/** t = 867 ms: band collapsing. */
export const FrameCollapse: Story = { name: 'Frame 867 ms (collapse)', ...frozen(867) }
