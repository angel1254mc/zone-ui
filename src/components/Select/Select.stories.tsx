import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Select } from './Select'
import { SortToggle } from '../SortToggle'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const panel: CSSProperties = {
  background: 'var(--zzz-color-surface-drawer-inner)',
  borderRadius: 'var(--zzz-radius-inner)',
  padding: gpx(24),
}
const caption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(14), lineHeight: 1.2 }

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(10), alignItems: 'flex-start' }}>
      {children}
      <span style={caption}>{label}</span>
    </div>
  )
}

const OPTIONS = [
  { value: 'rarity', label: 'Rarity' },
  { value: 'level', label: 'Level' },
  { value: 'atk', label: 'Base ATK' },
  { value: 'refinement', label: 'Refinement' },
  { value: 'recent', label: 'Recently Obtained' },
]

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Sort select for filter drawers.',
          '',
          '- **Trigger**: `.zzz-mat-pill` 460 × 53 in a filter drawer (`size="drawer"`), value italic `fontSize.bodyLg` 31 px from the left, solid white 15 × 14 caret 15 px from the right.',
          '- **Open list**: dotted dark popover under the trigger (radius 24, same ring), 48 px items, selected item on the live accent with a black label, 130 ms scaleY + opacity entrance.',
          '- **Keyboard**: WAI-ARIA select-only combobox. Enter / Space / Down / Up open; Up, Down, Home, End move; Enter / Space pick; Escape closes; type-ahead.',
          '- **Pressed**: shared pressed recipe while the pointer is down on the trigger.',
          '- **Sizes**: `size` sm / md / lg (default md) puts the trigger on the shared control heights `size.control.{sm,md,lg}` = 46 / 57 / 69 units (≈ 32 / 40 / 48 CSS px at the default 0.7 scale), the same as TextField and Button, so fields and selects line up in a form row. md keeps the base proportions (ring, caret, padding, text) on the 57-unit height; sm / lg scale every length by 46/57 and 69/57, so the ring, caret, value text and open list keep their proportions.',
          '- **`size="drawer"`** (opt-in): the filter-drawer select, 460 × 53 units (`size.control.select`) with md proportions, for game-style drawer scenes.',
        ].join('\n'),
      },
    },
  },
  args: { options: OPTIONS, defaultValue: 'rarity', 'aria-label': 'Sort by' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div style={{ ...panel, display: 'flex', flexDirection: 'column', gap: gpx(28) }}>
      <Cell label="default">
        <Select {...args} />
      </Cell>
      <Cell label="placeholder (nothing selected)">
        <Select {...args} defaultValue={undefined} placeholder="Sort by" />
      </Cell>
      <Cell label="pressed (forced data-pressed)">
        <Select {...args} pressed />
      </Cell>
      <Cell label="disabled">
        <Select {...args} disabled />
      </Cell>
      <Cell label="width 300">
        <Select {...args} width={300} defaultValue="recent" />
      </Cell>
    </div>
  ),
}

/** Open list. */
export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div style={{ ...panel, height: gpx(420) }}>
      <Select {...args} />
    </div>
  ),
}

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('level')
    return (
      <div style={{ ...panel, height: gpx(420), display: 'flex', flexDirection: 'column', gap: gpx(16) }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <span style={caption}>value: {value}</span>
      </div>
    )
  },
}

const SIZES = ['sm', 'md', 'lg'] as const

/**
 * sm / md / lg at the default scale, each with a SortToggle of the same size beside it (closed,
 * pressed, open): select and circle share the 46 / 57 / 69 control height. `width="fill"` makes the
 * trigger follow its container in responsive forms; `size="drawer"` is the opt-in 53-unit drawer select.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ ...panel, display: 'flex', flexDirection: 'column', gap: gpx(36) }}>
      {SIZES.map((size) => (
        <Cell key={size} label={`size="${size}"`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: gpx(20) }}>
            <Select aria-label={`Sort by (${size})`} options={OPTIONS} defaultValue="rarity" size={size} />
            <SortToggle size={size} />
            <Select aria-label={`Sort by (${size}, pressed)`} options={OPTIONS} defaultValue="level" size={size} pressed />
          </div>
        </Cell>
      ))}
      <Cell label='size="drawer" (opt-in drawer select, 53 units)'>
        <div style={{ display: 'flex', alignItems: 'center', gap: gpx(20) }}>
          <Select aria-label="Sort by (drawer)" options={OPTIONS} defaultValue="rarity" size="drawer" />
          <SortToggle />
        </div>
      </Cell>
      <Cell label='size="sm", open'>
        <div style={{ height: gpx(330) }}>
          <Select aria-label="Sort by (sm, open)" options={OPTIONS} defaultValue="atk" size="sm" defaultOpen />
        </div>
      </Cell>
      <Cell label='width="fill" in a 300-unit column'>
        <div style={{ width: gpx(300) }}>
          <Select aria-label="Sort by (fill)" options={OPTIONS} defaultValue="recent" size="sm" width="fill" />
        </div>
      </Cell>
    </div>
  ),
}
