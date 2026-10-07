import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DriveDiscCategoryIcon,
  WEngineCategoryIcon,
  MaterialsCategoryIcon,
  ConsumablesCategoryIcon,
} from '../../icons';
import { IconTabs } from '../IconTabs';
import { PageTitle } from './PageTitle';
import { SectionTitleStrip } from './SectionTitleStrip';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const meta = {
  title: 'Shell/PageTitle',
  component: PageTitle,
  tags: ['autodocs'],
  args: { children: 'Manage Item' },
  parameters: {
    docs: {
      description: {
        component: 'Top-bar page title.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#000', padding: gpx(24) }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overclocking: Story = {
  args: { children: 'W-Engine Overclocking' },
};

const storageTabs = [
  { value: 'w', icon: <WEngineCategoryIcon />, label: 'W-Engines' },
  { value: 'd', icon: <DriveDiscCategoryIcon />, label: 'Drive Discs' },
  { value: 'm', icon: <MaterialsCategoryIcon />, label: 'Materials' },
  { value: 'c', icon: <ConsumablesCategoryIcon />, label: 'Consumables' },
];

export const SectionStrip: StoryObj<typeof SectionTitleStrip> = {
  decorators: [
    (Story) => (
      <div style={{ width: gpx(1400) }}>
        <Story />
      </div>
    ),
  ],
  render: () => <SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} />,
};

export const SectionStripWithTabs: StoryObj<typeof SectionTitleStrip> = {
  decorators: [
    (Story) => (
      <div style={{ width: gpx(2000) }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <SectionTitleStrip
      title="Drive Disc Storage"
      count={[161, 3000]}
      right={<IconTabs items={storageTabs} defaultValue="d" aria-label="Storage category" />}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '`right` hosts `IconTabs`, which overlap the strip.',
      },
    },
  },
};

export const SectionStripNoRule: StoryObj<typeof SectionTitleStrip> = {
  decorators: [
    (Story) => (
      <div style={{ width: gpx(1400) }}>
        <Story />
      </div>
    ),
  ],
  render: () => <SectionTitleStrip title="Drive Disc Storage" count={[161, 3000]} rule={false} />,
};
