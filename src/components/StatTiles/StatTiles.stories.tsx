import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClockIcon, StarIcon, TargetLoopIcon } from '../../icons';
import { StatTile, StatTiles } from './StatTiles';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const meta = {
  title: 'Data Display/StatTiles',
  component: StatTiles,
  subcomponents: { StatTile },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A responsive grid of stat tiles for dashboards, profiles, results screens and game stats.',
      },
    },
  },
} satisfies Meta<typeof StatTiles>;

export default meta;
type Story = StoryObj<typeof meta>;

const results = (
  <>
    <StatTile label="Score" value="4/5" sub="Top 18% today" highlight />
    <StatTile label="Streak" value={12} delta={1} sub="best 21" />
    <StatTile label="Played" value={214} />
    <StatTile label="Avg time" value="1:42" delta="−8 s" deltaTone="positive" sub="per run" />
  </>
);

/** A results summary: highlighted score, streak with a delta, totals. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: gpx(1100) }}>
      <StatTiles {...args} aria-label="Today's results">
        {results}
      </StatTiles>
    </div>
  ),
};

/** Icons, sub-labels and the three delta tones. */
export const Content: Story = {
  render: (args) => (
    <div style={{ width: gpx(1100) }}>
      <StatTiles {...args} columns={3} aria-label="Account">
        <StatTile icon={<StarIcon />} label="Achievements" value="87/120" delta={4} sub="this week" />
        <StatTile icon={<ClockIcon />} label="Play time" value="36 h" delta={-2} sub="vs last week" />
        <StatTile icon={<TargetLoopIcon />} label="Accuracy" value="91%" delta={0} />
      </StatTiles>
    </div>
  ),
};

/** `size="sm"`: dense dashboards. */
export const Small: Story = {
  render: () => (
    <div style={{ width: gpx(1100) }}>
      <StatTiles size="sm" aria-label="Server">
        <StatTile label="Uptime" value="99.98%" />
        <StatTile label="Requests" value="1.2 M" delta="+6%" deltaTone="positive" />
        <StatTile label="Errors" value={14} delta={9} deltaTone="negative" />
        <StatTile label="P95" value="182 ms" highlight />
        <StatTile label="Regions" value={6} />
      </StatTiles>
    </div>
  ),
};

/** A single tile outside the grid (its own `<dl>`); leave room for its outside ring. */
export const Standalone: Story = {
  render: () => (
    <div style={{ padding: gpx(8), width: gpx(300) }}>
      <StatTile label="Daily players" value="8,412" delta={312} sub="since yesterday" />
    </div>
  ),
};

/** Phone width (390 px) at the web default scale: two columns of results. */
export const Phone390: Story = {
  render: () => (
    <div className="zzz-theme zzz-bg-hatch" style={{ width: 390, padding: 16, borderRadius: 12 }}>
      <StatTiles columns={2} aria-label="Today's results">
        {results}
      </StatTiles>
    </div>
  ),
};

/** Desktop width (1280 px) at the web default scale: auto-fit fills one row. */
export const Desktop1280: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="zzz-theme" style={{ width: 1280, padding: 32 }}>
      <StatTiles aria-label="Profile">
        <StatTile label="Rank" value="S" highlight sub="season 3" />
        <StatTile label="Wins" value={642} delta={12} />
        <StatTile label="Win rate" value="58%" delta={-1} />
        <StatTile label="Best streak" value={21} />
        <StatTile label="Friends" value={37} />
      </StatTiles>
    </div>
  ),
};
