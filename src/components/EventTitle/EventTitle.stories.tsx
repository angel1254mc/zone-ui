import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { ClockIcon, InfoAlertIcon } from '../../icons'
import { EventDescription } from '../EventDescription'
import { InfoPill } from '../InfoPill'
import { EventTitle } from './EventTitle'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
/** Pale pastel key-art stand-in. */
const pastel: CSSProperties = { background: 'linear-gradient(100deg, #E9F4F2, #F4D9E3 55%, #F6E7EC)' }

const meta = {
  title: 'Game/EventTitle',
  component: EventTitle,
  tags: ['autodocs'],
  args: { children: 'Angels Support Operation' },
  argTypes: { as: { control: 'inline-radio', options: ['h1', 'h2', 'h3'] }, align: { control: 'inline-radio', options: ['start', 'center', 'end'] } },
  decorators: [
    (Story) => (
      <div style={{ ...pastel, padding: gpx(24), width: gpx(700) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Event page title: `eventTitle` 38 white upright with the sticker outline ' +
          '(7 px black stroke behind the fill, ~3.5 px visible rim) and a hard 3 px black drop-shadow of the stroked silhouette ' +
          '(this overrides the 6 px / 4 px `shadow.textEventTitle*` tokens). Right-aligned; an `h1` by default.',
      },
    },
  },
} satisfies Meta<typeof EventTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const CheckInEvent: Story = { args: { children: 'Surprise Screening Plan' } }
export const OnDarkArt: Story = {
  args: { children: 'Their Secret Histories' },
  decorators: [(Story) => <div style={{ background: '#2B3A55', padding: gpx(12) }}><Story /></div>],
}
export const LeftAligned: Story = { args: { align: 'start' } }

/** A full event header: title, info pills, description. */
export const EventHeader: Story = {
  render: () => <Header />,
}

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <EventTitle>Angels Support Operation</EventTitle>
      <div style={{ display: 'flex', gap: gpx(4), marginTop: gpx(24) }}>
        <InfoPill icon={<ClockIcon />}>66d</InfoPill>
        <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
          Event Details
        </InfoPill>
      </div>
      <EventDescription style={{ marginTop: gpx(12) }}>
        {"Next stop: the live venue to make all\nDelulus' hearts skip a beat!\nParticipate in the version event to get\nthe Angels of Delusion's limited outfits!"}
      </EventDescription>
    </div>
  )
}
