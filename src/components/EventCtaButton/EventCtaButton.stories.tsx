import type { Meta, StoryObj } from '@storybook/react-vite'
import { EventCtaButton } from './EventCtaButton'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Game/EventCtaButton',
  component: EventCtaButton,
  tags: ['autodocs'],
  args: { children: 'Go' },
  decorators: [
    (Story) => (
      <div style={{ background: '#000', padding: gpx(24) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Bottom-right event call to action: 284 × 57 dark pill ring whose fill is a row of right-pointing ' +
          'chevron bands (light #282828 / dark #080808, period 35) fading toward both ends and drifting right ~20 px/s. ' +
          'Italic `button` label. Pressed = the shared pressed recipe; disabled greys the label. ' +
          '`still` or `prefers-reduced-motion` stop the drift.',
      },
    },
  },
} satisfies Meta<typeof EventCtaButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Still: Story = { args: { still: true } }
export const Pressed: Story = { args: { pressed: true } }
export const Disabled: Story = { args: { disabled: true } }
export const LongLabel: Story = { args: { children: 'Enter' } }
