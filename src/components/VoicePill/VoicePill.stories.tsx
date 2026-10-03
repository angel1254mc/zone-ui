import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { VoicePill } from './VoicePill'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-dialog-item)',
  color: 'var(--zzz-color-text-muted)',
}
const lightPage: CSSProperties = { background: '#EFEFEF', width: 'fit-content', padding: gpx(20) }

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  )
}

/**
 * Story-only language toggle
 * (76×30 black pill, 16 px #E8E8E8 label, 20 px knob). Not part of the library.
 */
function LangToggle() {
  const [en, setEn] = useState(true)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={en}
      aria-label="Voice language: English"
      onClick={() => setEn(!en)}
      className="zzz-focusable"
      style={{
        position: 'relative',
        width: gpx(76),
        height: gpx(30),
        border: 0,
        padding: 0,
        borderRadius: 'var(--zzz-radius-pill)',
        background: '#000',
        color: '#E8E8E8',
        fontSize: gpx(16),
        lineHeight: gpx(24),
        cursor: 'pointer',
      }}
    >
      <span style={{ position: 'absolute', top: gpx(3), [en ? 'left' : 'right']: gpx(10) }}>{en ? 'EN' : 'JP'}</span>
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: gpx(5), left: en ? gpx(45) : gpx(9), width: gpx(20), height: gpx(20), borderRadius: '50%', background: '#E8E8E8' }}
      />
    </button>
  )
}

const meta = {
  title: 'Primitives/VoicePill',
  component: VoicePill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Voice-sample play pill.',
          '',
          '- 392×57 pill (min-width), 6 px ring, padding-left 60. A 57 px black round play button covers the left end.',
          '- The original mic glyph (24×33) fills bottom-up with `#BFDB5A` (web) or the live `--zzz-accent` (`skin="game"`) as `progress` goes 0 → 1; without `progress` it is full while playing.',
          '- "CV:" + name in `body`, line-height 30; `trailing` slot for e.g. a language toggle (the one in these stories is story-only).',
          '- `tone="dark"` (default): the dark pill ring #333 on #090909, white text. `tone="light"`: an #E8E8E8 pill with a black ring.',
          '- A11y: `<button aria-pressed>` toggles playing (Enter/Space); progress is a separate `role="progressbar"` (0–100). Disabled: glyph/label `color.text.disabled`.',
        ].join('\n'),
      },
    },
  },
  args: { name: 'Blythe Melin' },
} satisfies Meta<typeof VoicePill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The light pill with the language toggle. */
export const Light: Story = {
  args: { tone: 'light', trailing: <LangToggle /> },
  render: (args) => (
    <div style={lightPage}>
      <VoicePill {...args} />
    </div>
  ),
}

/** Progress 0 → 100 %, both skins and tones. */
export const Progress: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <Row key={p} label={`progress ${p * 100}%`}>
          <div style={{ display: 'flex', gap: gpx(24), alignItems: 'center' }}>
            <VoicePill name="Blythe Melin" progress={p} playing={p > 0} />
            <VoicePill name="Blythe Melin" progress={p} playing={p > 0} skin="game" />
            <div style={{ ...lightPage, padding: gpx(8) }}>
              <VoicePill name="Blythe Melin" progress={p} playing={p > 0} tone="light" />
            </div>
          </div>
        </Row>
      ))}
    </div>
  ),
}

/** A running sample: click to play; progress advances over 4 s and stops at the end. */
export const Playing: Story = {
  render: () => {
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    useEffect(() => {
      if (!playing) return
      const t = window.setInterval(() => {
        setProgress((p) => {
          const next = Math.min(1, p + 0.025)
          if (next >= 1) setPlaying(false)
          return next
        })
      }, 100)
      return () => window.clearInterval(t)
    }, [playing])
    return (
      <VoicePill
        name="Blythe Melin"
        playing={playing}
        progress={progress}
        onPlayingChange={(next) => {
          if (next && progress >= 1) setProgress(0)
          setPlaying(next)
        }}
        trailing={<LangToggle />}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: gpx(24), alignItems: 'center' }}>
      <VoicePill name="Blythe Melin" disabled />
      <VoicePill name="Blythe Melin" disabled progress={0.5} skin="game" />
      <div style={{ ...lightPage, padding: gpx(8) }}>
        <VoicePill name="Blythe Melin" disabled progress={0.5} tone="light" />
      </div>
    </div>
  ),
}
