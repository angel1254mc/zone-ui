import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventCtaButton } from './EventCtaButton';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

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
          'CTA Button built around the base `Button` component that mimics the CTA used on the F1 menu for events.',
      },
    },
  },
} satisfies Meta<typeof EventCtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Still: Story = { args: { still: true } };
export const Pressed: Story = { args: { pressed: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongLabel: Story = { args: { children: 'Enter' } };
