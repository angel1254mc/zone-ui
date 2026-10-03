import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { DriveDiscImage, ItemImage, WEngineImage } from '../../../examples/art'
import { Notice } from '../InlineError'
import type { ItemCardProps } from '../ItemCard'
import { RewardPreview } from './RewardPreview'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const sky: CSSProperties = { background: 'linear-gradient(170deg, #8FA3BF, #D9E0EA 45%, #6E7E96)' }
const NOTICE = '"Unlock Early" has been unlocked'

/** Real items with their real names (static, so nothing changes once the art loads). */
const ITEMS: ItemCardProps[] = [
  { name: 'Master Tape', rarity: 's', art: <ItemImage id="110" alt="" /> },
  { name: 'Street Superstar', rarity: 'a', art: <WEngineImage id="13001" alt="" /> },
  { name: 'Puffer Electro', rarity: 'a', art: <DriveDiscImage id="31100" alt="" /> },
  { name: 'Battery Charge', rarity: 'a', art: <ItemImage id="501" alt="" /> },
  { name: 'Senior Investigator Log', rarity: 'a', art: <ItemImage id="300003" alt="" /> },
  { name: 'Bangboo Algorithm Module', rarity: 'b', art: <ItemImage id="303002" alt="" /> },
  { name: 'Denny', rarity: 'b', art: <ItemImage id="10" alt="" /> },
  { name: 'Lost Supply Box', rarity: 'a', art: <ItemImage id="404" alt="" /> },
]

const meta = {
  title: 'Game/RewardPreview',
  component: RewardPreview,
  tags: ['autodocs'],
  args: { items: ITEMS },
  argTypes: { items: { control: false }, notice: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ ...sky, padding: gpx(24) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Event "Reward Preview" row: right-aligned outlined `bodyXl` label, a row of `ItemCard size="preview"` ' +
          '(95 outer) at a ~107 pitch clipped after `visible` tiles, a white ">" affordance (a button: `onMore`, else it scrolls ' +
          'the row) and an optional `notice` slot (the `Notice` pill). Cards are static unless an item has `onClick`.',
      },
    },
  },
} satisfies Meta<typeof RewardPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithNotice: Story = { args: { notice: <Notice>{NOTICE}</Notice> } }
export const FourVisible: Story = { args: { visible: 4 } }
export const ClickableCards: Story = {
  args: { items: ITEMS.map((i) => ({ ...i, onClick: () => {} })), onMore: () => {} },
}
/** The ">" in its forced pressed state (`.zzz-pressable`: accent fill outset 4, black chevron). */
export const MorePressed: Story = {
  render: (args) => (
    <div
      ref={(el) => {
        el?.querySelector('.zzz-reward-preview__more')?.setAttribute('data-pressed', '')
      }}
    >
      <RewardPreview {...args} />
    </div>
  ),
}
