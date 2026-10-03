import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '../Button'
import { Text } from '../Text'
import { SoundToggle } from './SoundToggle'
import { SpeakerIcon, SpeakerLowIcon, SpeakerMutedIcon } from './icons'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
}
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: gpx(32) }

const meta = {
  title: 'Shell/SoundToggle',
  component: SoundToggle,
  tags: ['autodocs'],
  argTypes: {
    volumeControl: { control: 'inline-radio', options: ['none', 'inline', 'popover'] },
    popoverPlacement: { control: 'inline-radio', options: ['bottom', 'top'] },
    size: { control: 'inline-radio', options: ['md', 'sort', 'stepper', 'key'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A sound on/off toggle for app headers and settings: the round pill ' +
          '`IconButton` with original speaker glyphs (on · low · muted), a toggle button whose `aria-pressed` ' +
          'means **muted** (default name "Mute"). Optional volume `Slider` (0–1, labelled "Volume", value text ' +
          '"50%") `inline` or in a `popover` that opens on hover, on keyboard focus, on a **touch long-press** of the ' +
          'button (which does not toggle mute) or through `popoverOpen` / `defaultPopoverOpen` / ' +
          '`onPopoverOpenChange`; Escape or a tap outside closes it. On touch-first layouts (phones) prefer ' +
          '`volumeControl="inline"`, or toggle the popover from your own trigger with `popoverOpen` (give the ' +
          'trigger `aria-controls={popoverId}` so tapping it again closes it). The track shows the level ' +
          'as an accent fill (grey while muted). Controlled (`muted`/`onMutedChange`, `volume`/`onVolumeChange`) ' +
          'or uncontrolled (`defaultMuted`, `defaultVolume`). It plays no audio: wire the values to your audio ' +
          'layer (and unlock autoplay with a user gesture, e.g. `Splash`). Moving the slider while muted un-mutes.',
      },
    },
  },
} satisfies Meta<typeof SoundToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Muted: Story = { args: { defaultMuted: true } }

export const InlineVolume: Story = { args: { volumeControl: 'inline', defaultVolume: 0.6 } }

/** Hover or Tab onto the button to open the volume popover. */
export const PopoverVolume: Story = {
  args: { volumeControl: 'popover', defaultVolume: 0.4 },
  decorators: [(S) => <div style={{ paddingBottom: gpx(120) }}><S /></div>],
}

/** The popover open via the typed `popoverOpen` prop (controlled; maps to `data-open`). */
export const PopoverOpen: Story = {
  args: { volumeControl: 'popover', defaultVolume: 0.7, popoverOpen: true },
  decorators: [(S) => <div style={{ paddingBottom: gpx(120) }}><S /></div>],
}

export const PopoverTop: Story = {
  args: { volumeControl: 'popover', popoverPlacement: 'top', defaultVolume: 0.7, popoverOpen: true },
  decorators: [(S) => <div style={{ paddingTop: gpx(120) }}><S /></div>],
}

/**
 * Touch-safe pattern: the popover is controlled and toggled by a separate "Volume" button, so a tap on the
 * mute button only mutes. The trigger sets `aria-controls={popoverId}` so tapping it again closes the popover
 * (it is not treated as an outside tap). A long-press of the mute button also opens it; Escape or a tap
 * elsewhere closes it.
 */
export const PopoverControlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const popoverId = 'sound-toggle-volume-popover'
    return (
      <div style={{ ...row, paddingBottom: gpx(120) }}>
        <SoundToggle {...args} volumeControl="popover" popoverId={popoverId} popoverOpen={open} onPopoverOpenChange={setOpen} />
        <Button width="auto" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={popoverId}>
          Volume
        </Button>
      </div>
    )
  },
}

export const Pressed: Story = { name: 'Pressed (forced)', args: { buttonProps: { pressed: true } } }

export const Disabled: Story = { args: { disabled: true, volumeControl: 'inline', defaultVolume: 0.5 } }

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(28), alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <span style={{ ...caption, width: 32 }}>{size}</span>
          <SoundToggle size={size} />
          <SoundToggle size={size} defaultMuted />
          <SoundToggle size={size} volumeControl="inline" defaultVolume={0.6} />
        </div>
      ))}
      <div style={row}>
        <span style={caption}>game presets</span>
        <SoundToggle size="stepper" />
        <SoundToggle size="key" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at the default scale): on, muted, and with the inline volume slider. The IconButton presets `stepper` / `key` still work.',
      },
    },
  },
}

/** Controlled from outside, with a read-out. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [muted, setMuted] = useState(false)
      const [volume, setVolume] = useState(0.8)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24), alignItems: 'flex-start' }}>
          <SoundToggle volumeControl="inline" muted={muted} onMutedChange={setMuted} volume={volume} onVolumeChange={setVolume} />
          <Text role="body" tone="muted">
            muted: {String(muted)} · volume: {Math.round(volume * 100)}%
          </Text>
        </div>
      )
    }
    return <Demo />
  },
}

export const Glyphs: Story = {
  render: () => (
    <div style={{ ...row, color: 'var(--zzz-color-text-primary)', fontSize: gpx(56) }}>
      <SpeakerIcon />
      <SpeakerLowIcon />
      <SpeakerMutedIcon />
    </div>
  ),
}
