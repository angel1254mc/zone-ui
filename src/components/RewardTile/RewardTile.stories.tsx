import type { Meta, StoryObj } from '@storybook/react-vite'
import { ItemImage } from '../../../examples/art'
import { RewardTile, RewardTileGroup } from './RewardTile'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const meta = {
    title: 'Inventory/RewardTile',
    component: RewardTile,
    tags: ['autodocs'],
    args: { name: 'Battery Charge', count: 300, rarity: 'a' },
    argTypes: {
        rarity: { control: 'inline-radio', options: ['s', 'a', 'b', 'c'] },
        art: { control: false },
    },
    render: (args) => (
        <RewardTile {...args} art={<ItemImage id="501" alt="" />} />
    ),
    decorators: [
        (Story) => (
            <div style={{ padding: gpx(24), background: '#000' }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component: 'Dialog reward tile',
            },
        },
    },
} satisfies Meta<typeof RewardTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongName: Story = {
    name: 'Long name (2-line clamp)',
    args: { name: 'Prepaid Power Card Deluxe Edition', count: 5 },
}

export const NoCount: Story = {
    args: { count: undefined, name: 'Denny', rarity: 'b' },
}

export const Group: Story = {
    render: () => (
        <RewardTileGroup aria-label="Rewards" style={{ width: gpx(700) }}>
            <RewardTile
                name="Battery Charge"
                count={300}
                rarity="a"
                art={<ItemImage id="501" alt="" />}
            />
            <RewardTile
                name="Prepaid Power Card"
                count={5}
                rarity="a"
                art={<ItemImage id="511" alt="" />}
            />
            <RewardTile
                name="Denny"
                count={500}
                rarity="b"
                art={<ItemImage id="10" alt="" />}
            />
        </RewardTileGroup>
    ),
}
