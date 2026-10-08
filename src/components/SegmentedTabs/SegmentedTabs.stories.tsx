import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { SegmentedTabs } from './SegmentedTabs';
import { TabPanel } from './TabPanel';
import type { SegmentedTabsItem } from './SegmentedTabs';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const manage: SegmentedTabsItem[] = [
  { value: 'craft', label: 'Craft' },
  { value: 'dismantle', label: 'Dismantle' },
  { value: 'destroy', label: 'Destroy' },
];
const agent: SegmentedTabsItem[] = [
  { value: 'stats', label: 'Base Stats' },
  { value: 'skills', label: 'Skills' },
  { value: 'equipment', label: 'Equipment' },
];

const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-dialog-item)',
  color: 'var(--zzz-color-text-muted)',
};

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(14) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

const meta = {
  title: 'Forms/SegmentedTabs',
  component: SegmentedTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text tab bar: e.g. Craft / Dismantle / Destroy (top bar) or Base Stats / Skills / Equipment (bottom bar).',
      },
    },
  },
  args: { items: manage, defaultValue: 'craft', 'aria-label': 'Manage item' },
} satisfies Meta<typeof SegmentedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Craft / Dismantle / Destroy on the black track. */
export const Default: Story = {};

/** Base Stats / Skills / Equipment on the mesh track. */
export const Mesh: Story = {
  args: {
    items: agent,
    defaultValue: 'stats',
    surface: 'mesh',
    'aria-label': 'Agent',
  },
};

/** Every position of the active fill on both surfaces. */
export const Positions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(40) }}>
      {manage.map((item) => (
        <Row key={item.value} label={`black — ${item.value} active`}>
          <SegmentedTabs aria-label="Manage item" items={manage} value={item.value} />
        </Row>
      ))}
      {agent.map((item) => (
        <Row key={item.value} label={`mesh — ${item.value} active`}>
          <SegmentedTabs aria-label="Agent" items={agent} value={item.value} surface="mesh" />
        </Row>
      ))}
    </div>
  ),
};

/**
 * Pointer held on an inactive tab (forced with `pressed`): its label greys and the current fill
 * inflates +8 px.
 */
export const Pressed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(48) }}>
      <Row label="Base Stats active, Skills held">
        <SegmentedTabs aria-label="Agent" items={agent} value="stats" pressed="skills" surface="mesh" />
      </Row>
      <Row label="Equipment active, Base Stats held">
        <SegmentedTabs aria-label="Agent" items={agent} value="equipment" pressed="stats" surface="mesh" />
      </Row>
    </div>
  ),
};

/** Disabled tab: label `color.text.disabled`, skipped by the arrow keys. */
export const Disabled: Story = {
  args: {
    items: [manage[0], { ...manage[1], disabled: true }, manage[2]],
    defaultValue: 'craft',
  },
};

/** Four tabs and a fluid width (`width="fill"`), e.g. a web section bar. */
export const FourTabsFill: Story = {
  render: () => (
    <div style={{ width: gpx(1000) }}>
      <SegmentedTabs
        aria-label="News"
        width="fill"
        surface="mesh"
        defaultValue="news"
        items={[
          { value: 'all', label: 'All' },
          { value: 'news', label: 'News' },
          { value: 'notices', label: 'Notices' },
          { value: 'events', label: 'Events' },
        ]}
      />
    </div>
  ),
};

/** Controlled, with tab panels. Click or use the arrow keys: the fill snaps and pops. */
export const WithPanels: Story = {
  render: () => {
    const [value, setValue] = useState('stats');
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: gpx(28),
          alignItems: 'flex-start',
        }}
      >
        <SegmentedTabs
          id="agent-tabs"
          aria-label="Agent"
          items={agent}
          value={value}
          onValueChange={setValue}
          surface="mesh"
        />
        {agent.map((item) => (
          <TabPanel
            key={item.value}
            tabsId="agent-tabs"
            value={item.value}
            hidden={item.value !== value}
            style={{
              ...caption,
              color: 'var(--zzz-color-text-soft)',
            }}
          >
            {item.label} panel
          </TabPanel>
        ))}
      </div>
    );
  },
};

const SIZES = ['sm', 'md', 'lg'] as const;

/**
 * sm / md / lg at the default scale (≈ 32 / 40 / 48 CSS px controls; the segmented track is 59/57 of
 * that). Fill, slant caps, ring and the held-tab swell all scale; labels use `fontSize.control.{size}`.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(40) }}>
      {SIZES.map((size) => (
        <Row key={size} label={`size="${size}"`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: gpx(32),
            }}
          >
            <SegmentedTabs aria-label={`Manage (${size})`} items={manage} defaultValue="dismantle" size={size} />
            <SegmentedTabs
              aria-label={`Agent (${size})`}
              items={agent}
              value="stats"
              pressed="skills"
              surface="mesh"
              size={size}
            />
          </div>
        </Row>
      ))}
    </div>
  ),
};
