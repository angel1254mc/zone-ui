import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { WEngineImage } from '../../../examples/art'
import { Button } from '../Button'
import { HatchBackground } from '../Backgrounds'
import { ItemCard } from '../ItemCard'
import { ScreenFade, ScreenTransition, SCREEN_TIMING, tileStagger, type ScreenTransitionMode } from './ScreenTransition'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
}
const RAR = ['s', 'a', 'b', 'a', 'b', 's', 'a', 'b'] as const
/** Real W-Engine ids per rank, so a card's rarity frame matches its engine. */
const ENGINE_IDS = {
  s: ['14102', '14104', '14105', '14107', '14109', '14110', '14114', '14116'],
  a: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008'],
  b: ['12001', '12002', '12003', '12004', '12005', '12006', '12007', '12008'],
} as const
const engineId = (r: 's' | 'a' | 'b', n: number) => ENGINE_IDS[r][n % ENGINE_IDS[r].length]

/** A mock inventory screen whose tiles stagger in on mount. */
function GridScreen({ title, seed, slow = false, cols = 8, rows = 3 }: { title: string; seed: number; slow?: boolean; cols?: number; rows?: number }) {
  return (
    <div style={{ position: 'relative', height: gpx(560), overflow: 'hidden', background: '#000' }}>
      <HatchBackground />
      <h2 style={{ position: 'relative', margin: 0, padding: `${gpx(24)} ${gpx(40)}`, fontSize: 'var(--zzz-font-size-title)', lineHeight: 1, color: 'var(--zzz-color-text-title)' }}>
        {title}
      </h2>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${cols}, auto)`, justifyContent: 'start', gap: gpx(17), padding: `0 ${gpx(40)}` }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const s = tileStagger(i, { slow })
          const r = RAR[(i + seed) % RAR.length]
          return (
            <div key={i} className={s.className} style={s.style}>
              <ItemCard rarity={r} level={60} stars={1} interactive={false} art={<WEngineImage id={engineId(r, seed * 40 + i)} alt="" />} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FlatScreen({ title, tone }: { title: string; tone: string }) {
  return (
    <div style={{ height: gpx(560), background: tone, display: 'grid', placeItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: 'var(--zzz-font-size-event-title)', lineHeight: 1, color: '#fff' }}>{title}</h2>
    </div>
  )
}

const SCREENS = [
  (slow: boolean) => <GridScreen title="W-Engine Storage" seed={1} slow={slow} />,
  () => <FlatScreen title="Events" tone="#2A3C5A" />,
  (slow: boolean) => <GridScreen title="Drive Disc Storage" seed={2} slow={slow} />,
]

function Demo({ mode, hold }: { mode: ScreenTransitionMode; hold?: number }) {
  const [i, setI] = useState(0)
  const [log, setLog] = useState('')
  return (
    <div style={{ width: gpx(1400), display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
      <div style={{ display: 'flex', gap: gpx(16), alignItems: 'center' }}>
        <Button onClick={() => setI((n) => (n + 1) % SCREENS.length)}>Next screen</Button>
        <span style={caption}>{log || `mode="${mode}"`}</span>
      </div>
      <ScreenTransition screenKey={i} mode={mode} hold={hold} onDone={(k) => setLog(`mode="${mode}" · entered screen ${k}`)}>
        {SCREENS[i](mode === 'blurThrough')}
      </ScreenTransition>
    </div>
  )
}

const meta = {
  title: 'Overlays/ScreenTransition',
  component: ScreenTransition,
  tags: ['autodocs'],
  args: { screenKey: 0, mode: 'cut' },
  argTypes: {
    mode: { control: 'inline-radio', options: ['cut', 'fadeThroughBlack', 'fadeFromBlack', 'blurThrough'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Screen changes. Wrap the routed screen and change ' +
          '`screenKey`; the outgoing screen stays rendered (inert) until the cut.\n\n' +
          '- `cut` (default): fade to black **220 ms** `cubic-bezier(.55,0,1,.45)`, hold (`hold`, default 130), hard cut; the new grid then staggers in.\n' +
          '- `fadeThroughBlack`: the same, then fade from black **300 ms** ease-out-quad.\n' +
          '- `fadeFromBlack`: new screen at once, fading in from black (also `appear`).\n' +
          '- `blurThrough`: the old screen blurs σ 8 under a `#1A1A1A` scrim .28 → .70 for ~100 ms, then the new screen cuts in on top, no black hold; its tiles use the slow stagger.\n\n' +
          '`tileStagger(i, { slow })` gives a tile the entrance fade (100 ms, delay 33 ms + i × **8.5** ms, or × **18** ms slow); ' +
          '`useScreenEntered()` tells children whether their screen is visible. `ScreenFade` is an imperative black veil ' +
          '(`active` / `exit` / `onDone`). Reduced motion: 100 ms cross-fade, no stagger. After a transition focus moves to ' +
          'the new screen heading (`[data-screen-heading]` or the first h1/h2).',
      },
    },
  },
  render: (args) => <Demo mode={args.mode ?? 'cut'} hold={args.hold} />,
} satisfies Meta<typeof ScreenTransition>

export default meta
type Story = StoryObj<typeof meta>

export const Cut: Story = {}
export const FadeThroughBlack: Story = { args: { mode: 'fadeThroughBlack' } }
export const FadeFromBlack: Story = { args: { mode: 'fadeFromBlack' } }
export const BlurThrough: Story = { args: { mode: 'blurThrough' } }
export const LongHold: Story = { name: 'Loading hold (1 s)', args: { mode: 'fadeThroughBlack', hold: 1000 } }

/** Tile stagger alone: remount to replay (8.5 ms vs 18 ms per tile). */
export const TileStagger: Story = {
  render: () => {
    function Replay() {
      const [n, setN] = useState(0)
      return (
        <div style={{ width: gpx(1400), display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
          <Button onClick={() => setN((x) => x + 1)}>Replay</Button>
          <span style={caption}>8.5 ms / tile (default)</span>
          <GridScreen key={`f${n}`} title="Fast" seed={3} />
          <span style={caption}>18 ms / tile (slow)</span>
          <GridScreen key={`s${n}`} title="Slow" seed={4} slow />
        </div>
      )
    }
    return <Replay />
  },
}

/** ScreenFade: drive the veil yourself. */
export const Fade: Story = {
  name: 'ScreenFade (imperative)',
  render: () => {
    function D() {
      const [active, setActive] = useState(false)
      const [screen, setScreen] = useState(0)
      return (
        <div style={{ width: gpx(1400), display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
          <Button onClick={() => setActive(true)}>Go</Button>
          <div style={{ position: 'relative' }}>
            {SCREENS[screen](false)}
            <ScreenFade
              active={active}
              exit="fade"
              onDone={(s) => {
                if (s === 'black') {
                  setScreen((x) => (x + 1) % SCREENS.length)
                  window.setTimeout(() => setActive(false), SCREEN_TIMING.hold)
                }
              }}
            />
          </div>
        </div>
      )
    }
    return <D />
  },
}

/**
 * One frame of the real CSS at time t (ms) after the key change, by pausing the phase animation at a
 * negative delay. Cut mode: out 220, hold 130, cut at 350.
 */
function Frame({ t, mode }: { t: number; mode: 'cut' | 'fadeThroughBlack' }) {
  const cutAt = SCREEN_TIMING.out + SCREEN_TIMING.hold
  const phase = t < SCREEN_TIMING.out ? 'out' : t < cutAt ? 'hold' : mode === 'fadeThroughBlack' && t < cutAt + SCREEN_TIMING.in ? 'in' : 'idle'
  const delay = phase === 'out' ? t : phase === 'in' ? t - cutAt : 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(4) }}>
      <span style={caption}>+{t} ms</span>
      <div className="zzz-screen-transition" data-phase={phase} style={{ width: gpx(213), height: gpx(90), overflow: 'hidden' }}>
        <div className="zzz-screen-transition__layer" style={{ transform: 'scale(0.152)', transformOrigin: '0 0', width: gpx(1400) }}>
          {t < cutAt ? <GridScreen title="Materials" seed={5} /> : <FlatScreen title="Home" tone="#5A6B7A" />}
        </div>
        <div className="zzz-screen-transition__veil" style={{ animationPlayState: 'paused', animationDelay: `-${delay}ms` }} />
      </div>
    </div>
  )
}

export const Timeline: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'The real CSS frozen every 33 ms after a key change, for `cut` (out 220 ms, hold 130 ms, cut) and `fadeThroughBlack` (fade-in 300 ms after the hold).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(14), padding: gpx(16), background: '#26262E' }}>
      <span style={caption}>mode="cut" (out 220 ms, hold 130 ms, cut)</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: gpx(8), width: gpx(1920) }}>
        {Array.from({ length: 18 }, (_, k) => (
          <Frame key={k} t={Math.round(k * 33.3)} mode="cut" />
        ))}
      </div>
      <span style={caption}>mode="fadeThroughBlack" (fade-in 300 ms after the hold)</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: gpx(8), width: gpx(1920) }}>
        {Array.from({ length: 24 }, (_, k) => (
          <Frame key={k} t={Math.round(k * 33.3)} mode="fadeThroughBlack" />
        ))}
      </div>
    </div>
  ),
}
