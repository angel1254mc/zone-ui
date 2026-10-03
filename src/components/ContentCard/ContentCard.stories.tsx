import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { ClockIcon, InfoAlertIcon } from '../../icons'
import { AgentImage, NamecardImage, WEngineImage } from '../../../examples/art'
import { Button } from '../Button'
import { Capsule } from '../Capsule'
import { ChoiceGroup } from '../ChoiceButton'
import { ContentCard } from './ContentCard'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

/** A device-width frame (CSS px); the cards inside use the web default scale. */
const Frame = ({ children, width, style }: { children: ReactNode; width: number; style?: CSSProperties }) => (
  <div
    style={{
      background: '#000',
      width,
      maxWidth: '100%',
      padding: gpx(28),
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
)

const Timer = ({ children }: { children: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: gpx(8) }}>
    <ClockIcon size={22} />
    {children}
  </span>
)

const meta = {
  title: 'Data Display/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  args: {
    eyebrow: 'Daily briefing',
    trailing: <Capsule>Day 12</Capsule>,
    title: 'Hollow activity is up in Sixth Street',
    children: (
      <p>
        Patrols report three new rifts since midnight. Proxies on duty should check in before 18:00 and avoid the old subway entrance.
      </p>
    ),
    footer: (
      <>
        <Button>Dismiss</Button>
        <Button width="compact">Details</Button>
      </>
    ),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'accent', 'compact'] },
    mediaPosition: { control: 'inline-radio', options: ['top', 'side'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A general card on the kit\'s panel material (5 px lit #333 ring, black body, 3 px keyline): a textured header strip ' +
          '(eyebrow + trailing slot for a tag, timer or counter), a large heavy title, optional media (top or side), body and footer actions on the textured lower body. ' +
          'Variants: `default`, `accent` (pulsing accent edge + accent eyebrow for the featured / current item), `compact`. Fluid width; side media stacks on narrow cards.',
      },
    },
  },
  decorators: [(S, ctx) => (ctx.parameters.bare ? S() : <Frame width={760}>{S()}</Frame>)],
} satisfies Meta<typeof ContentCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Accent: Story = { args: { variant: 'accent', eyebrow: 'Featured' } }

export const Compact: Story = {
  args: {
    variant: 'compact',
    eyebrow: 'Notice',
    trailing: <InfoAlertIcon size={22} />,
    title: 'Maintenance tonight',
    children: <p>Servers go down at 02:00 for about an hour.</p>,
    footer: <Button width="compact">OK</Button>,
  },
}

export const MediaTop: Story = {
  args: {
    eyebrow: 'Event',
    trailing: <Timer>6d 4h</Timer>,
    title: 'Angels Support Operation',
    // A real Inter-Knot namecard banner (Astra Yao), cover-cropped to the card's 16:9 media window.
    media: <NamecardImage agentId="1311" alt="" />,
  },
}

export const MediaSide: Story = {
  parameters: { bare: true },
  // Static copy (the real W-Engine's name / base ATK / description), so no text changes once the art loads.
  // layout="ratio" reserves the art's square box: the side column sizes from its content, so with the default
  // fill layout the row would collapse to the body height when the <img> is dropped (unreachable art URL).
  render: () => (
    <Frame width={1100}>
      <ContentCard
        mediaPosition="side"
        eyebrow="W-Engine"
        trailing={<Capsule>Base ATK 684</Capsule>}
        title="Steel Cushion"
        media={<WEngineImage id="14102" fit="contain" layout="ratio" alt="" />}
        footer={<Button width="compact">Equip</Button>}
      >
        <p>
          A supercomputing W-Engine equipped with a motion monitoring feature. Thanks to Nekomata&apos;s modifications, it perfectly
          matches the fast reflexes and combat maneuvers of feline Thirens.
        </p>
      </ContentCard>
    </Frame>
  ),
}

/** Title and body only — no header strip, no footer. */
export const Minimal: Story = {
  args: { eyebrow: undefined, trailing: undefined, footer: undefined, title: 'Nothing here yet', children: <p>Come back tomorrow for a new puzzle.</p> },
}

/** A quiz question card: counter + timer in the header, ChoiceGroup in the body, action in the footer. */
const Question = () => (
  <ContentCard
    variant="accent"
    eyebrow="Question 2 / 5"
    trailing={<Timer>0:18</Timer>}
    title="Which of these is NOT an element in the game?"
    footer={<Button disabled>Lock in</Button>}
  >
    <ChoiceGroup
      aria-label="Answers"
      items={[
        { value: 'fire', label: 'Fire' },
        { value: 'ether', label: 'Ether' },
        { value: 'wind', label: 'Wind' },
        { value: 'ice', label: 'Ice' },
      ]}
    />
  </ContentCard>
)

export const QuizQuestionDesktop: Story = {
  parameters: { bare: true, layout: 'fullscreen' },
  render: () => (
    <Frame width={1280}>
      <Question />
    </Frame>
  ),
}

export const QuizQuestionPhone: Story = {
  name: 'Quiz Question (phone 390)',
  parameters: { bare: true, layout: 'fullscreen' },
  render: () => (
    <Frame width={390} style={{ padding: gpx(26) }}>
      <Question />
    </Frame>
  ),
}

/** A dashboard / landing grid of mixed cards. */
export const Grid: Story = {
  parameters: { bare: true, layout: 'fullscreen' },
  render: () => (
    <Frame width={1400}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: gpx(24), alignItems: 'start' }}>
        <ContentCard variant="accent" eyebrow="Today" trailing={<Timer>14h left</Timer>} title="Daily puzzle #212" media={<AgentImage id="1191" crop="crop" fit="cover" position="50% 28%" priority alt="" />}>
          <p>Five questions, thirty seconds each.</p>
        </ContentCard>
        <ContentCard eyebrow="Your stats" trailing={<Capsule>Streak 6</Capsule>} title="83% correct" footer={<Button width="compact">Share</Button>}>
          <p>Best streak: 14 days. Played 212 times.</p>
        </ContentCard>
        <ContentCard variant="compact" eyebrow="Host" title="Today's host" media={<AgentImage id="1071" crop="crop" fit="cover" position="50% 28%" alt="" />}>
          <p>Says hi.</p>
        </ContentCard>
      </div>
    </Frame>
  ),
}
