import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { LockIcon } from '../../icons'
import { IconButton } from '../IconButton'
import { KeyHint, KeyHints } from './KeyHint'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = { font: '600 13px/1.3 system-ui, sans-serif', color: '#9a9a9a' }

const meta = {
  title: 'Primitives/KeyHint',
  component: KeyHint,
  tags: ['autodocs'],
  args: { keyCap: 'T', label: 'Unlock' },
  decorators: [(S) => <div style={{ background: '#000', padding: gpx(28) }}>{S()}</div>],
  parameters: {
    docs: {
      description: {
        component: [
          'Keyboard hint: a 38 px key circle (3 px `#2F2F2F` ring, black) with the upright key letter as',
          '`<kbd>`, then an upright white label 14 px later. `KeyHints` lays hints out 48 px apart, right-aligned (the',
          'bottom-right band of Storage screens).',
          '',
          '`onActivate` also registers the key as a window shortcut (ignored while typing in a field, on auto-repeat and',
          'with Ctrl/Alt/Meta). The hint is informational: wire it to the same handler as the real control.',
          '',
          '`size` `sm` / `md` (default) / `lg` follows the shared control scale (circle ≈ 21 / 27 / 32 px at',
          'the default scale). Set it on `KeyHints` to size the whole row; a hint\'s own `size` wins.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof KeyHint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Row: Story = {
  render: () => (
    <div style={{ width: gpx(600) }}>
      <KeyHints
        hints={[
          { keyCap: 'R', label: 'Discard' },
          { keyCap: 'T', label: 'Lock' },
        ]}
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(28), width: gpx(760) }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: gpx(24) }}>
          <span style={{ ...caption, width: 32 }}>{size}</span>
          <KeyHints
            size={size}
            align="start"
            hints={[
              { keyCap: 'R', label: 'Discard' },
              { keyCap: 'T', label: 'Lock' },
              { keyCap: 'F', label: 'Filter' },
            ]}
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: '`KeyHints size` sizes every hint in the row and the gap between them (sm / md / lg).' } },
  },
}

export const BareKey: Story = {
  args: { label: undefined },
  parameters: { docs: { description: { story: 'The bare key circle, as drawn under a lock button.' } } },
}

function HotkeyDemo() {
  const [locked, setLocked] = useState(false)
  const toggle = () => setLocked((v) => !v)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gpx(24) }}>
      <IconButton toggle pressedState={locked} onPressedStateChange={setLocked} icon={<LockIcon />} tone={locked ? 'lockOn' : 'default'} label="Lock" />
      <KeyHint keyCap="T" label={locked ? 'Unlock' : 'Lock'} onActivate={toggle} />
    </div>
  )
}

export const WithHotkey: Story = {
  render: () => <HotkeyDemo />,
  parameters: { docs: { description: { story: 'Press **T** (focus inside the story frame) to toggle the lock.' } } },
}
