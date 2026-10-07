import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import {
    AgentImage,
    DriveDiscImage,
    ItemImage,
    WEngineImage,
} from '../../../examples/art'
import { CheckInCalendar } from './CheckInCalendar'
import { CheckInTile } from './CheckInTile'
import type { CheckInTileProps } from './CheckInTile'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
/** Stand-in for blue / pink key art behind the calendar. */
const art: CSSProperties = {
    background:
        'linear-gradient(120deg, #3F5FB8, #6F8FE0 45%, #E27FA8 80%, #F0B5C8)',
}

/** A real item icon by id (labels below are the items' real names, so nothing changes once art loads). */
const item = (id: string) => <ItemImage id={id} alt="" />

/** Sample "Surprise Screening Plan" rewards: a 14-day check-in schedule (real item art by URL). */
const DAYS: CheckInTileProps[] = [
    {
        day: 1,
        count: 30,
        itemName: 'Polychrome',
        item: item('100'),
        claimed: true,
    },
    { day: 2, count: 6, itemName: 'Boopon', item: item('112') },
    { day: 3, count: 30, itemName: 'Polychrome', item: item('100') },
    {
        day: 4,
        count: 1,
        itemName: 'W-Engine',
        item: <WEngineImage id="14102" alt="" />,
        special: true,
    },
    { day: 5, count: 40, itemName: 'Polychrome', item: item('100') },
    { day: 6, count: 6, itemName: 'Battery Charge', item: item('501') },
    { day: 7, count: 40, itemName: 'Polychrome', item: item('100') },
    {
        day: 8,
        count: 20,
        itemName: 'Drive Disc',
        item: <DriveDiscImage id="31000" alt="" />,
    },
    { day: 9, count: 40, itemName: 'Polychrome', item: item('100') },
    {
        day: 10,
        count: 1,
        itemName: 'W-Engine Energy Module',
        item: item('301003'),
    },
    { day: 11, count: 60, itemName: 'Polychrome', item: item('100') },
    { day: 12, count: 6, itemName: 'Lost Supply Box', item: item('404') },
    { day: 13, count: 60, itemName: 'Polychrome', item: item('100') },
    {
        day: 14,
        count: 1,
        itemName: 'Outfit',
        item: <AgentImage crop="circle" id="1011" alt="" />,
        special: true,
        tag: 'Outfit\nSelect',
    },
]

const meta = {
    title: 'Game/CheckInCalendar',
    component: CheckInCalendar,
    tags: ['autodocs'],
    args: { days: DAYS, columns: 7 },
    argTypes: { days: { control: false } },
    decorators: [
        (Story) => (
            <div style={{ ...art, padding: gpx(24) }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Daily check-in calendar. Customizable with respect to the amounts of slots (days) and the content within each.',
            },
        },
    },
} satisfies Meta<typeof CheckInCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const FourteenDays: Story = {}

export const Week: Story = { args: { days: DAYS.slice(0, 7) } }

export const Tiles: Story = {
    name: 'Tile states',
    render: () => (
        <div style={{ display: 'flex', gap: gpx(16) }}>
            <CheckInTile {...DAYS[0]} />
            <CheckInTile {...DAYS[1]} />
            <CheckInTile {...DAYS[3]} />
            <CheckInTile {...DAYS[13]} />
            <CheckInTile {...DAYS[13]} claimed />
        </div>
    ),
}
