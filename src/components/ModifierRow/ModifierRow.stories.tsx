import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ModifierRow } from './ModifierRow'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Data Display/ModifierRow',
  component: ModifierRow,
  tags: ['autodocs'],
  args: { count: 8, action: { onClick: fn() } },
  parameters: {
    docs: {
      description: {
        component:
          'Agent Info modifier row: 756 × 70 capsule (5 px black rim, #202020 fill), "Active Modifier Count" in ' +
          '`text.secondary` with the count in sage, and a nested dark pill button flush right. `action` takes Button props (merged over ' +
          'the Combat Readiness defaults: CombatBadge cap, two-line italic label) or any element.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(20), background: 'var(--zzz-color-surface-agent-info)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModifierRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ActionPressed: Story = { args: { action: { pressed: true } } }
export const ActionDisabled: Story = { args: { action: { disabled: true } } }
export const WithoutAction: Story = { args: { action: undefined } }
