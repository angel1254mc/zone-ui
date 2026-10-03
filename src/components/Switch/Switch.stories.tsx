import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Switch } from './Switch'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
/** Readable caption for the size rows (18 units ≈ 12.6 CSS px at the default scale). */
const sizeCaption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(18), lineHeight: 1.2, minWidth: gpx(150) }
const caption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(14), lineHeight: 1.2 }

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12), alignItems: 'center' }}>
      {children}
      <span style={caption}>{label}</span>
    </div>
  )
}

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Small toggle switch.',
          '',
          '- 76 × 45 `#161616` bezel with a 2 px black keyline, 62 × 33 grey gradient track, ~31 px dark knob (incl. rim) with a light "LED" dash on its left.',
          '- **ON**: the knob slides to the right end (120 ms out-expo) and the LED dash turns the live accent.',
          '- `role="switch"` + `aria-checked`; Space / Enter toggle. Name it with `aria-label` or a `<label htmlFor>`.',
          '- **Sizes** `size="sm" | "md" | "lg"` (default `md`): the whole control scales by 46/57 / 1 / 69/57 — bezel 61 × 36 / 76 × 45 / 92 × 54 design units (≈ 43 × 25 / 53 × 32 / 64 × 38 CSS px at the default scale).',
        ].join('\n'),
      },
    },
  },
  args: { 'aria-label': 'Toggle' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: gpx(40), background: '#0A0A0A', padding: gpx(24) }}>
      <Cell label="off">
        <Switch {...args} />
      </Cell>
      <Cell label="on">
        <Switch {...args} defaultChecked />
      </Cell>
      <Cell label="disabled off">
        <Switch {...args} disabled />
      </Cell>
      <Cell label="disabled on">
        <Switch {...args} disabled defaultChecked />
      </Cell>
    </div>
  ),
}

/** sm / md / lg, off and on, each beside a body label of the matching size. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24), background: '#0A0A0A', padding: gpx(24) }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: gpx(28) }}>
          <span style={sizeCaption}>{size}</span>
          <Switch {...args} size={size} aria-label={`Off (${size})`} />
          <Switch {...args} size={size} aria-label={`On (${size})`} defaultChecked />
          <Switch {...args} size={size} aria-label={`Disabled (${size})`} disabled />
        </div>
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  render: function Render() {
    const [on, setOn] = useState(false)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: gpx(16) }}>
        <Switch id="sb-switch" checked={on} onCheckedChange={setOn} />
        <label htmlFor="sb-switch" className="zzz-text-body" style={{ cursor: 'pointer' }}>
          Show locked items ({on ? 'on' : 'off'})
        </label>
      </div>
    )
  },
}
