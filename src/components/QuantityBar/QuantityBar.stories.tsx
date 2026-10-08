import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { QuantityBar } from './QuantityBar';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  color: 'var(--zzz-color-text-muted)',
  fontSize: gpx(14),
  lineHeight: 1.2,
};

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(12),
        alignItems: 'flex-start',
      }}
    >
      {children}
      <span style={caption}>{label}</span>
    </div>
  );
}

const meta = {
  title: 'Forms/QuantityBar',
  component: QuantityBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Crafting quantity readout.',
      },
    },
  },
  args: { label: 'Craft Quantity', value: 1 },
} satisfies Meta<typeof QuantityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ background: '#000', padding: gpx(24) }}>
      <QuantityBar {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        background: '#000',
        padding: gpx(24),
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(24),
      }}
    >
      <Cell label="label + value">
        <QuantityBar label="Craft Quantity" value={12} />
      </Cell>
      <Cell label="label only">
        <QuantityBar label="Select materials to dismantle" />
      </Cell>
      <Cell label="custom separator, width 400">
        <QuantityBar label="Selected" value="3 / 60" separator=":" style={{ width: gpx(400) }} />
      </Cell>
    </div>
  ),
};

/** sm / md / lg, matching the Slider sizes. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        background: '#000',
        padding: gpx(24),
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(24),
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Cell key={size} label={size}>
          <QuantityBar size={size} label="Craft Quantity" value={12} />
        </Cell>
      ))}
    </div>
  ),
};
