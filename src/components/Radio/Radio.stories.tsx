import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Radio, RadioGroup } from './Radio'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(14), lineHeight: 1.2 }
const panel: CSSProperties = { background: 'var(--zzz-color-surface-drawer-inner)', padding: gpx(24) }

const meta = {
  title: 'Forms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Radio group for web forms. For filter-style single choice, see Forms/Chip (`multiple={false}`).',
          '',
          '- `RadioGroup`: `role="radiogroup"` with a muted label; native radios share one `name`; arrow keys move and select (wrapping, skipping disabled).',
          '- `Radio`: 24 px circle, 3 px `color.border.button` ring, 1 px black keyline; checked = live accent fill + black dot, label white. Disabled: `color.text.disabled`. Row height 40.',
          '- **Sizes** `size="sm" | "md" | "lg"` on the group (or a single radio, which wins): circle 19 / 24 / 29 and row 32 / 40 / 48 design units; label `fontSize.label` / `body` / `bodyLg`. Default `md`.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Difficulty', defaultValue: 'normal' },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={panel}>
      <RadioGroup {...args}>
        <Radio value="normal">Normal</Radio>
        <Radio value="hard">Hard</Radio>
        <Radio value="hell" disabled>
          Hell (locked)
        </Radio>
      </RadioGroup>
    </div>
  ),
}

/** `RadioGroup size` sizes every radio (circle 19 / 24 / 29, row 32 / 40 / 48 design units); a radio's own `size` wins. */
export const Sizes: Story = {
  render: () => (
    <div style={{ ...panel, display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioGroup key={size} size={size} label={`Difficulty (${size})`} orientation="horizontal" defaultValue="hard">
          <Radio value="normal">Normal</Radio>
          <Radio value="hard">Hard</Radio>
          <Radio value="hell" disabled>
            Hell (locked)
          </Radio>
        </RadioGroup>
      ))}
    </div>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <div style={panel}>
      <RadioGroup {...args} orientation="horizontal">
        <Radio value="normal">Normal</Radio>
        <Radio value="hard">Hard</Radio>
        <Radio value="hell">Hell</Radio>
      </RadioGroup>
    </div>
  ),
}

export const DisabledGroup: Story = {
  render: (args) => (
    <div style={panel}>
      <RadioGroup {...args} disabled>
        <Radio value="normal">Normal</Radio>
        <Radio value="hard">Hard</Radio>
      </RadioGroup>
    </div>
  ),
}

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('hard')
    return (
      <div style={{ ...panel, display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
        <RadioGroup label="Difficulty" value={value} onValueChange={setValue}>
          <Radio value="normal">Normal</Radio>
          <Radio value="hard">Hard</Radio>
          <Radio value="hell">Hell</Radio>
        </RadioGroup>
        <span style={caption}>value: {value}</span>
      </div>
    )
  },
}
