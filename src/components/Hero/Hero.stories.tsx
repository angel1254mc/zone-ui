import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { AgentImage } from '../../../examples/art';
import { ClockIcon, InfoAlertIcon } from '../../icons';
import { Text } from '../Text';
import { Hero } from './Hero';

/** A status row for the summary slot: a label + a fixed countdown read-out (a live Countdown fits here too). */
function PlayedToday() {
  return (
    <>
      <Text role="bodyXl" tone="primary">
        Already played today
      </Text>
      <Text role="bodyXl" tone="muted">
        Next puzzle in{' '}
        <time dateTime="PT7H12M5S" style={{ color: 'var(--zzz-accent)' }}>
          07:12:05
        </time>
      </Text>
    </>
  );
}

/** Width-limited frame so the story shows the hero at a given CSS width. */
function Frame({ width, children }: { width?: number; children: ReactNode }) {
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: 'Shell/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: {
    eyebrow: 'Daily',
    title: 'Proxy Trivia',
    meta: ['Puzzle #42', 'Oct 1'],
    description: 'Five questions about New Eridu, thirty seconds each. One try per day — share your run with friends.',
    primaryAction: { label: 'Play' },
    secondaryAction: {
      label: 'How to play',
      icon: <InfoAlertIcon />,
      iconTone: 'plain',
    },
    art: <AgentImage id="1041" crop="full" priority alt="" />,
    artPosition: 'right',
    background: 'hatch',
  },
  argTypes: {
    artPosition: {
      control: 'inline-radio',
      options: ['right', 'left', 'background'],
    },
    background: {
      control: 'inline-radio',
      options: ['hatch', 'graffiti', 'plain'],
    },
    artFit: { control: 'inline-radio', options: ['contain', 'cover'] },
    align: { control: 'inline-radio', options: ['start', 'center'] },
    art: { control: false },
    summary: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A landing / entry Hero section for apps and pages',
      },
    },
  },
  render: (args) => (
    <Frame>
      <Hero {...args} />
    </Frame>
  ),
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ArtLeft: Story = {
  args: { artPosition: 'left', background: 'graffiti' },
};

export const ArtBackground: Story = {
  args: {
    artPosition: 'background',
    // The kit's graffiti background + a real full-body agent (no scenery art exists); the Hero's own background rule crops it (cover, 70% 20%).
    background: 'graffiti',
    art: <AgentImage id="1191" crop="full" priority alt="" />,
    eyebrow: 'New season',
    title: 'Hollow Zero Nights',
    meta: ['Season 3', 'From Oct 15'],
    description: 'Ranked runs, new stages and a fresh leaderboard every week.',
    primaryAction: { label: 'Join', icon: <ClockIcon /> },
    secondaryAction: { label: 'Details' },
  },
};

export const BackgroundCentered: Story = {
  name: 'Background art, centred',
  args: { ...ArtBackground.args, align: 'center' },
};

export const Graffiti: Story = { args: { background: 'graffiti' } };

export const Plain: Story = {
  args: {
    background: 'plain',
    art: undefined,
    align: 'center',
    eyebrow: 'Beta',
  },
};

export const WithBullets: Story = {
  args: {
    description: undefined,
    bullets: ['5 questions, 30 seconds each', 'Same puzzle for everyone, every day', 'Share your result grid'],
  },
};

/** The status slot, e.g. a daily game that was already played. */
export const Summary: Story = {
  args: {
    primaryAction: { label: 'See results' },
    secondaryAction: { label: 'Archive' },
    summary: <PlayedToday />,
  },
};

export const DisabledAction: Story = {
  args: {
    primaryAction: { label: 'Play', disabled: true },
    summary: <PlayedToday />,
  },
};

/** A tall, full-screen hero. */
export const FullScreen: Story = { args: { style: { minHeight: '100vh' } } };

/** Phone width (390 CSS px) at the web default scale: art stacked above the text. */
export const Phone: Story = {
  args: { summary: <PlayedToday /> },
  render: (args) => (
    <Frame width={390}>
      <Hero {...args} />
    </Frame>
  ),
};

export const PhoneBackground: Story = {
  name: 'Phone, background art',
  args: { ...ArtBackground.args },
  render: (args) => (
    <Frame width={390}>
      <Hero {...args} />
    </Frame>
  ),
};

/** Tablet / small laptop (1024 CSS px) at the web default scale. */
export const Tablet: Story = {
  render: (args) => (
    <Frame width={1024}>
      <Hero {...args} />
    </Frame>
  ),
};
