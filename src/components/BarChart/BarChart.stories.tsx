import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { BarChart } from './BarChart';
import type { BarChartDatum } from './BarChart';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-dialog-item)',
  color: 'var(--zzz-color-text-muted)',
};

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

/** Today's score distribution (players per number of correct answers). */
const distribution: BarChartDatum[] = [
  { label: '0', value: 112 },
  { label: '1', value: 486 },
  { label: '2', value: 1204 },
  { label: '3', value: 2371 },
  { label: '4', value: 2950 },
  { label: '5', value: 1289 },
];

/** A poll. */
const poll: BarChartDatum[] = [
  { label: 'Attack', value: 412, color: 'rarity-s' },
  { label: 'Stun', value: 268, color: 'rarity-a' },
  { label: 'Anomaly', value: 341, color: 'rarity-b' },
  { label: 'Support', value: 190, color: 'rarity-c' },
  { label: 'Defense', value: 155 },
];

const meta = {
  title: 'Data Display/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A simple categorical bar chart (vertical bars) for score distributions, poll results and stats.',
      },
    },
  },
  args: {
    data: distribution,
    highlight: 4,
    markerLabel: 'You',
    label: "Today's scores",
    xAxisLabel: 'Correct answers',
    yAxisLabel: 'Players',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Score distribution with "You" highlighted. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: gpx(900) }} data-accent-phase="lime">
      <BarChart {...args} />
    </div>
  ),
};

/** Percentages instead of counts; no axis titles. */
export const Percentages: Story = {
  args: {
    valueDisplay: 'percent',
    xAxisLabel: undefined,
    yAxisLabel: undefined,
  },
  render: Default.render,
};

/** A poll coloured by rarity, no highlight. */
export const RarityFills: Story = {
  args: {
    data: poll,
    highlight: undefined,
    label: 'Favourite specialty',
    xAxisLabel: undefined,
    yAxisLabel: 'Votes',
  },
  render: Default.render,
};

/** Fills side by side. */
export const Fills: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: gpx(40),
        width: gpx(1500),
      }}
      data-accent-phase="lime"
    >
      {(['muted', 'light', 'accent'] as const).map((fill) => (
        <Row key={fill} label={`fill="${fill}"`}>
          <BarChart data={distribution.slice(1)} fill={fill} height={180} animate={false} label={fill} />
        </Row>
      ))}
    </div>
  ),
};

/** Several highlighted bars with their own markers (datum.highlight / datum.marker). */
export const MultipleHighlights: Story = {
  args: {
    highlight: undefined,
    data: [
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 5, highlight: true, marker: 'Best' },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 4 },
      { label: 'Fri', value: 1 },
      { label: 'Sat', value: 4 },
      { label: 'Sun', value: 5, highlight: true, marker: 'Today' },
    ],
    label: 'Score per day',
    xAxisLabel: undefined,
    yAxisLabel: 'Correct',
  },
  render: Default.render,
};

/** `animate={false}` (also forced under prefers-reduced-motion). */
export const Static: Story = {
  args: { animate: false },
  render: Default.render,
};

/** Phone width (390 px) at the web default scale. */
export const Phone390: Story = {
  render: (args) => (
    <div
      className="zzz-theme zzz-bg-hatch"
      style={{ width: 390, padding: 16, borderRadius: 12 }}
      data-accent-phase="lime"
    >
      <BarChart {...args} height={240} />
    </div>
  ),
};

/** Desktop width (1280 px) at the web default scale. */
export const Desktop1280: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="zzz-theme" style={{ width: 1280, padding: 32 }} data-accent-phase="lime">
      <BarChart {...args} height={360} valueDisplay="both" />
    </div>
  ),
};
