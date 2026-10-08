import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ModifierRow } from './ModifierRow';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const meta = {
  title: 'Data Display/ModifierRow',
  component: ModifierRow,
  tags: ['autodocs'],
  args: { count: 8, action: { onClick: fn() } },
  parameters: {
    docs: {
      description: {
        component: 'Agent Info modifier row',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: gpx(20),
          background: 'var(--zzz-color-surface-agent-info)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModifierRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ActionPressed: Story = { args: { action: { pressed: true } } };
export const ActionDisabled: Story = { args: { action: { disabled: true } } };
export const WithoutAction: Story = { args: { action: undefined } };
