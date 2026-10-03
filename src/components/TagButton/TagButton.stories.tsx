import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { HomeIcon } from '../../icons'
import { Button } from '../Button'
import { TagButton } from './TagButton'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: gpx(24) }
const caption: CSSProperties = { font: '600 13px/1.3 system-ui, sans-serif', color: '#9a9a9a' }

const meta = {
  title: 'Primitives/TagButton',
  component: TagButton,
  tags: ['autodocs'],
  args: { kind: 'back' },
  argTypes: {
    kind: { control: 'inline-radio', options: ['back', 'close'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
  decorators: [(S) => <div style={{ background: '#000', padding: gpx(28) }}>{S()}</div>],
  parameters: {
    docs: {
      description: {
        component: [
          'The tag-shaped **Back** (top-left of a screen) and the drawer **Close** (its mirror).',
          'A 90×58 SVG tag: one side a semicircle, the other slanted 30° (`skew.backButton`).',
          '',
          '- Back: 5 px red ring, dark dotted interior, red U-turn glyph. Close: red ring, 2 px dark-red line, red interior, black ×.',
          '- **Pressed**: the whole tag fills with the live accent, grows 2.5 px per side, glyph black.',
          '- `aria-label` defaults to "Back" / "Close". Map `Escape` to it at the screen / drawer level.',
          '- `size`: `sm` / `md` (default, the 90×58 tag) / `lg` — the shared control scale; the whole tag (ring, glyph,',
          '  pressed growth) scales by 46/57 and 69/57 so it lines up with a `Button` / `IconButton` of the same size.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof TagButton>

export default meta
type Story = StoryObj<typeof meta>

export const Back: Story = {}

export const Close: Story = { args: { kind: 'close' } }

export const Pressed: Story = {
  render: () => (
    <div style={row}>
      <TagButton kind="back" pressed />
      <TagButton kind="close" pressed />
    </div>
  ),
  parameters: { docs: { description: { story: 'Forced with `pressed`.' } } },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(28) }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <span style={{ ...caption, width: 32 }}>{size}</span>
          <TagButton kind="back" size={size} />
          <TagButton kind="back" size={size} pressed />
          <TagButton kind="close" size={size} />
          <TagButton kind="close" size={size} pressed />
          <Button size={size} width="compact" icon={<HomeIcon />}>
            City
          </Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` / `md` / `lg` (tag ≈ 47 / 58 / 70 design units tall ≈ 32 / 41 / 49 px at the default scale): Back and Close at rest and pressed, next to a `Button` of the same size.',
      },
    },
  },
}

export const WithLocationPill: Story = {
  render: () => (
    <div style={{ ...row, gap: gpx(23) }}>
      <TagButton kind="back" />
      <Button width="compact" icon={<HomeIcon />}>
        City
      </Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'Top-bar start: Back, 23 px gap, the City location pill (`md` 57).' } } },
}
