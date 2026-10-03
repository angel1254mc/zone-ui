import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { DropdownMenu } from './DropdownMenu'
import type { DropdownMenuItem } from './DropdownMenu'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { MoreIcon, MailIcon, OptionsIcon, NoticesIcon, SortIcon } from '../../icons'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = { color: 'var(--zzz-color-text-muted)', fontSize: gpx(14), lineHeight: 1.2 }

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(10), alignItems: 'flex-start' }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  )
}

const sections: DropdownMenuItem[] = [
  { id: 'news', label: 'News' },
  { id: 'notices', label: 'Notices' },
  { id: 'events', label: 'Events' },
  { id: 'agents', label: 'Agents' },
  { id: 'archive', label: 'Archive (coming soon)', disabled: true },
]

const withIcons: DropdownMenuItem[] = [
  { id: 'mail', label: 'Mail', icon: <MailIcon /> },
  { id: 'notices', label: 'Notices', icon: <NoticesIcon /> },
  { id: 'options', label: 'Options', icon: <OptionsIcon /> },
]

const moreTrigger = <Button width="compact">More</Button>

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A menu button with a dropdown list for web navigation and actions.',
          '',
          '- Panel #111 with a 3 px #323232 ring + the 3 px black keyline, radius 24, padding 4; items are 40-tall full pills (padding 0 30, 4 apart), `fontSize.body` in `color.text.secondary`.',
          '- The active item (keyboard or pointer) takes the live accent with a black label. A 7.5 px accent bar runs across the top (`topBar`, the live `var(--zzz-accent)`). Disabled: #222 fill, grey label.',
          '- WAI-ARIA menu button: Enter / Space / ↓ open on the first item, ↑ on the last; ↑ ↓ Home End move (skipping disabled); typeahead; Enter / Space choose; Escape closes and returns focus; Tab / outside click closes.',
          '- Portalled to `<body>` (fixed, collision flip), keeping the host scale. 130 ms scaleY + opacity entrance.',
        ].join('\n'),
      },
    },
  },
  args: { trigger: moreTrigger, items: sections },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Click (or focus + ↓) the trigger. */
export const Default: Story = {
  render: function Render(args) {
    const [picked, setPicked] = useState<string>('—')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12), minHeight: gpx(420) }}>
        <DropdownMenu {...args} onSelect={setPicked} />
        <span style={caption}>selected: {picked}</span>
      </div>
    )
  },
}

/** Forced open (`defaultOpen`); the first item is shown active via the accent (hover an item to move it). */
export const Open: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: gpx(340), minHeight: gpx(420), alignItems: 'flex-start' }}>
      <Cell label="default (top bar, disabled last item)">
        <DropdownMenu trigger={moreTrigger} items={sections} defaultOpen />
      </Cell>
      <Cell label="with icons, no top bar, end-aligned">
        <DropdownMenu
          trigger={<IconButton label="More" icon={<MoreIcon />} />}
          items={withIcons}
          topBar={false}
          placement="bottom-end"
          width={220}
          defaultOpen
        />
      </Cell>
    </div>
  ),
}

/**
 * Keyboard-opened (a play step focuses the trigger and presses ↓ twice): the active item takes the
 * live accent with a black label. Rendered in its own iframe in the docs so it never steals focus.
 */
export const ActiveItem: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <div style={{ minHeight: gpx(420) }}>
      <DropdownMenu trigger={moreTrigger} items={sections} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button')
    if (!btn) return
    btn.focus()
    const down = () => (document.activeElement ?? btn).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    down()
    await new Promise((r) => setTimeout(r, 50))
    down()
  },
}

/** Placement `top-start` near the bottom edge; `bottom-*` near the bottom flips up. */
export const Placement: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'flex-end', gap: gpx(300), padding: gpx(30) }}>
      <DropdownMenu trigger={<Button width="compact">Top</Button>} items={sections} placement="top-start" defaultOpen />
      <DropdownMenu
        trigger={<IconButton label="Sort" size="md" icon={<SortIcon />} />}
        items={withIcons}
        placement="bottom"
        defaultOpen
      />
    </div>
  ),
}
