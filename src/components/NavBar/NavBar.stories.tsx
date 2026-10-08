import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { NavBar } from './NavBar';
import type { NavBarItem } from './NavBar';
import { DemoActions, DemoLogo, demoSocial } from './storyArt.story-helpers';
import { WebTabs } from '../WebTabs';
import { NewsCard } from '../NewsCard';
import { Pagination } from '../Pagination';
import { SiteFooter } from '../SiteFooter';
import { VoicePill } from '../VoicePill';
import { NamecardImage } from '../../../examples/art';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-dialog-item)',
  color: 'var(--zzz-color-text-muted)',
  padding: `0 ${gpx(16)}`,
};

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(10) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

const items: NavBarItem[] = [
  { value: 'home', label: 'Homepage', href: '#home' },
  { value: 'agents', label: 'Characters', href: '#agents' },
  { value: 'videos', label: 'Videos', href: '#videos' },
  { value: 'news', label: 'News & Info', href: '#news' },
  { value: 'world', label: 'Background', href: '#world' },
  { value: 'more', label: 'More ▾', href: '#more' },
];
const cta = { label: 'Download Now', href: '#download' };

const meta = {
  title: 'Shell/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Site header for web pages.',
      },
    },
  },
  args: {
    logo: <DemoLogo />,
    items,
    defaultValue: 'news',
    cta,
    actions: <DemoActions />,
  },
  argTypes: {
    logo: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Game skin: the CTA takes the live accent. */
export const GameSkin: Story = { args: { skin: 'game' } };

/** Forced collapsed layout with the menu open (what a phone sees). */
export const Collapsed: Story = {
  args: { collapse: 'always', defaultMenuOpen: true },
  render: (args) => (
    <div style={{ minHeight: gpx(700) }}>
      <NavBar {...args} />
    </div>
  ),
};

/** Auto layout by the bar's own width: full spacing ≥ 1800, tight spacing below, items folded into the menu button once they overflow (CTA kept), everything folded ≤ 900. */
export const Responsive: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(30),
        paddingTop: gpx(16),
      }}
    >
      <Row label="1600 px wide (tight spacing)">
        <div style={{ width: '1600px', maxWidth: '100%' }}>
          <NavBar {...args} />
        </div>
      </Row>
      <Row label="1280 px wide (all items fit at the web default scale)">
        <div style={{ width: '1280px', maxWidth: '100%' }}>
          <NavBar {...args} />
        </div>
      </Row>
      <Row label="1024 px wide (items folded, CTA and actions kept)">
        <div
          style={{
            width: '1024px',
            maxWidth: '100%',
            minHeight: gpx(560),
          }}
        >
          <NavBar {...args} />
        </div>
      </Row>
      <Row label="700 px wide (collapsed; click the menu button)">
        <div
          style={{
            width: '700px',
            maxWidth: '100%',
            minHeight: gpx(560),
          }}
        >
          <NavBar {...args} />
        </div>
      </Row>
    </div>
  ),
};

/** A disabled item: label `color.text.disabled`, no pill. */
export const DisabledItem: Story = {
  args: {
    items: [...items.slice(0, 3), { value: 'shop', label: 'Shop (soon)', disabled: true }],
  },
};

/** Controlled with button items (client routing). */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('home');
    return (
      <div>
        <NavBar {...args} items={items.map(({ href: _h, ...i }) => i)} value={value} onValueChange={setValue} />
        <p style={{ ...caption, paddingTop: gpx(16) }}>value: {value}</p>
      </div>
    );
  },
};

const posts = [
  {
    date: '2024/07/04',
    category: 'Notices',
    title: 'Signal Search Probability Details',
    description: 'Exclusive Channel, W-Engine Channel and Bangboo Channel rates and guarantees.',
  },
  {
    date: '2024/07/03',
    category: 'Events',
    title: 'Surprise Screening Plan',
    description: 'Check in every day during the event to claim Polychromes and Master Tapes.',
  },
  {
    date: '2024/06/28',
    category: 'News',
    title: 'Version 1.0 Special Program Recap',
    description: 'New Agents, new W-Engines and more from the livestream.',
  },
];

/** The seven web components composed into a mini page: header, tabs, cards, pager, voice line, footer. */
export const MiniPage: Story = {
  render: () => {
    const [tab, setTab] = useState('latest');
    return (
      <div
        className="zzz-bg-hatch"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <NavBar logo={<DemoLogo />} items={items} defaultValue="news" cta={cta} actions={<DemoActions />} />
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: gpx(56),
            padding: `${gpx(64)} ${gpx(24)}`,
          }}
        >
          <WebTabs
            aria-label="News categories"
            items={[
              { value: 'latest', label: 'Latest' },
              { value: 'news', label: 'News' },
              { value: 'notices', label: 'Notices' },
              { value: 'events', label: 'Events' },
            ]}
            value={tab}
            onValueChange={setTab}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(3, ${gpx(396)})`,
              columnGap: gpx(46),
              maxWidth: '100%',
            }}
          >
            {posts.map((p, i) => (
              <NewsCard key={p.title} href="#" art={<NamecardImage group="event" seed={i + 4} alt="" />} {...p} />
            ))}
          </div>
          <Pagination count={175} />
          <VoicePill name="Blythe Melin" progress={0.35} playing />
        </main>
        <SiteFooter
          social={demoSocial}
          logo={<DemoLogo />}
          links={[
            { label: 'Privacy Policy', href: '#privacy' },
            { label: 'Terms of Service', href: '#terms' },
            { label: 'About Us', href: '#about' },
            { label: 'Contact Us', href: '#contact' },
          ]}
          legal="A fan-made demo page built with Zone. Not affiliated with the game's publisher."
        />
      </div>
    );
  },
};
