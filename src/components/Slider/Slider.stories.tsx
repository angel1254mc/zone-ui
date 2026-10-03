import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Slider } from './Slider'
import { QuantityBar } from '../QuantityBar'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(14), lineHeight: 1.2 }
const black: CSSProperties = { background: '#000', padding: gpx(24) }

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12), alignItems: 'flex-start' }}>
      {children}
      <span style={caption}>{label}</span>
    </div>
  )
}

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Quantity slider with steppers.',
          '',
          '- 581 wide: − stepper 47 · min number (upright, `fontSize.button` 26) centred in its slot · 34 px metallic thumb travelling over a 12 px `#373737` track (no filled portion) · max number · + stepper 47.',
          '- Steppers: ring 4 `color.border.stepper`, glyph white, `color.text.disabled` at their bound.',
          '- `min === max`: both steppers disabled, thumb at the right end.',
          '- At a bound a stepper is `aria-disabled` (not natively `disabled`), so it keeps keyboard focus while Enter / Space is pressed on it; clicks are a no-op. The `disabled` prop disables everything natively.',
          '- Thumb `role="slider"`: arrows ±step, PageUp/PageDown, Home/End; pointer drag on the rail. Steppers are "Decrease"/"Increase" buttons with the shared pressed recipe.',
          '- **Sizes** `size="sm" | "md" | "lg"` (default `md`): steppers 38 / 47 / 57, thumb 27 / 34 / 41, track 10 / 12 / 15 design units, numbers `fontSize.control.{sm,md,lg}` (21 / 26 / 30); rings and the press outset scale too. The default width (581) is the same at every size.',
        ].join('\n'),
      },
    },
  },
  args: { min: 1, max: 5, defaultValue: 1, 'aria-label': 'Craft quantity' },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={black}>
      <Slider {...args} />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ ...black, display: 'flex', flexDirection: 'column', gap: gpx(28) }}>
      <Cell label="value 1 of 1–5: − disabled">
        <Slider {...args} />
      </Cell>
      <Cell label="value 3 of 1–5">
        <Slider {...args} defaultValue={3} />
      </Cell>
      <Cell label="value 5 of 1–5: + disabled">
        <Slider {...args} defaultValue={5} />
      </Cell>
      <Cell label="1 of 1: both disabled, thumb at the right end">
        <Slider {...args} max={1} />
      </Cell>
      <Cell label="disabled">
        <Slider {...args} defaultValue={2} disabled />
      </Cell>
      <Cell label="0–100, step 5, width 700">
        <Slider {...args} min={0} max={100} step={5} defaultValue={35} width={700} />
      </Cell>
      <Cell label="without steppers">
        <Slider {...args} defaultValue={2} showSteppers={false} />
      </Cell>
    </div>
  ),
}

/** sm / md / lg: steppers 38 / 47 / 57, thumb 27 / 34 / 41 design units, numbers 21 / 26 / 30; the width stays 581. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...black, display: 'flex', flexDirection: 'column', gap: gpx(28) }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Cell key={size} label={`${size}${size === 'md' ? ' (default, the crafting slider)' : ''}`}>
          <Slider {...args} size={size} defaultValue={3} aria-label={`Quantity (${size})`} />
          <QuantityBar size={size} label="Craft Quantity" value={3} />
        </Cell>
      ))}
    </div>
  ),
}

/** Steppers with the forced pressed look (the shared recipe). */
export const PressedStepper: Story = {
  render: (args) => (
    <div style={black}>
      <Slider {...args} defaultValue={3} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('.zzz-slider__stepper--inc')?.setAttribute('data-pressed', '')
  },
}

export const WithQuantityBar: Story = {
  name: 'With QuantityBar (crafting panel)',
  render: function Render(args) {
    const [value, setValue] = useState(1)
    return (
      <div style={{ ...black, display: 'flex', flexDirection: 'column', gap: gpx(20) }}>
        <Slider {...args} value={value} onValueChange={setValue} />
        <QuantityBar label="Craft Quantity" value={value} />
      </div>
    )
  },
}
