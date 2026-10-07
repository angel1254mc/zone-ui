import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { InfoAlertIcon, FilterIcon } from '../../icons';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Hover / focus tooltip.',
      },
    },
  },
  args: {
    content: 'Base ATK of the equipped W-Engine',
    children: <Button>ATK</Button>,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or focus the button. */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: gpx(80) }}>
      <Tooltip {...args}>
        <Button>ATK</Button>
      </Tooltip>
    </div>
  ),
};

/** Forced open (`defaultOpen`) on every side. */
export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(2, ${gpx(420)})`,
        gap: `${gpx(150)} ${gpx(60)}`,
        padding: `${gpx(110)} ${gpx(170)}`,
        justifyItems: 'center',
      }}
    >
      <Tooltip content="Top tooltip" placement="top" defaultOpen>
        <Button width="compact">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom" defaultOpen>
        <Button width="compact">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left" placement="left" defaultOpen>
        <IconButton label="Filter" icon={<FilterIcon />} />
      </Tooltip>
      <Tooltip content="Right" placement="right" defaultOpen>
        <IconButton label="Stat bonuses" icon={<InfoAlertIcon />} />
      </Tooltip>
    </div>
  ),
};

/** `placement="top"` at the top edge of the viewport flips to the bottom. */
export const CollisionFlip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div
      style={{
        padding: `${gpx(8)} ${gpx(40)}`,
        display: 'flex',
        gap: gpx(40),
        alignItems: 'flex-start',
      }}
    >
      <Tooltip content="Asked for top, flipped to bottom" placement="top" defaultOpen>
        <Button width="compact">Top edge</Button>
      </Tooltip>
    </div>
  ),
};

/** Multi-line content wraps at 360 px. */
export const LongContent: Story = {
  render: () => (
    <div style={{ padding: gpx(160) }}>
      <Tooltip
        defaultOpen
        placement="bottom"
        content="Anomaly Proficiency increases the Anomaly Buildup rate of the Agent's Attribute attacks."
      >
        <Button>Anomaly Proficiency</Button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: gpx(80) }}>
      <Tooltip content="Hidden while disabled" disabled>
        <Button>Tooltip disabled</Button>
      </Tooltip>
    </div>
  ),
};
