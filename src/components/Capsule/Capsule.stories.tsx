import type { Meta, StoryObj } from '@storybook/react-vite';
import { Capsule } from './Capsule';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const meta = {
  title: 'Data Display/Capsule',
  component: Capsule,
  tags: ['autodocs'],
  args: { children: 'Lv. 60', tone: 'default', size: 'md' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['default', 'empty', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: gpx(118),
          padding: gpx(12),
          background: '#161616',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'The black pill under item cards: level, count or EMPTY. Not interactive.',
      },
    },
  },
} satisfies Meta<typeof Capsule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Count: Story = { args: { children: '×30' } };
export const Empty: Story = {
  args: { tone: 'empty', size: 'sm', children: undefined },
};
export const Danger: Story = {
  args: {
    tone: 'default',
    size: 'lg',
    children: (
      <>
        <span style={{ color: 'var(--zzz-color-danger-text)' }}>20</span>
        /60
      </>
    ),
  },
};
