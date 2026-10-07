import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { SearchIcon } from '../../icons';
import { TextField } from './TextField';
import { Select } from '../Select';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  color: 'var(--zzz-color-text-muted)',
  fontSize: gpx(14),
  lineHeight: 1.2,
};
/** Readable caption for the size rows (18 units ≈ 12.6 CSS px at the default scale). */
const sizeCaption: CSSProperties = {
  color: 'var(--zzz-color-text-muted)',
  fontSize: gpx(18),
  lineHeight: 1.2,
  minWidth: gpx(150),
};
const panel: CSSProperties = {
  background: 'var(--zzz-color-surface-drawer-inner)',
  padding: gpx(24),
  width: gpx(520),
};

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(10),
        alignItems: 'stretch',
      }}
    >
      {children}
      <span style={caption}>{label}</span>
    </div>
  );
}

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Text input for web forms.',
      },
    },
  },
  args: { label: 'Redeem code', placeholder: 'Enter redemption code' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={panel}>
      <TextField {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(28),
      }}
    >
      <Cell label="placeholder">
        <TextField aria-label="Redeem code" placeholder="Enter redemption code" />
      </Cell>
      <Cell label="filled">
        <TextField aria-label="Redeem code" defaultValue="ZZZFREE2026" />
      </Cell>
      <Cell label="focused (autoFocus: accent ring)">
        <TextField aria-label="Focused" defaultValue="Banyue" autoFocus />
      </Cell>
      <Cell label="with leading icon cap (type search)">
        <TextField aria-label="Search" type="search" icon={<SearchIcon />} placeholder="Search agents" />
      </Cell>
      <Cell label="error">
        <TextField label="Redeem code" defaultValue="ZZZ-123" error="Invalid redemption code" />
      </Cell>
      <Cell label="disabled">
        <TextField aria-label="Disabled" defaultValue="Locked" disabled />
      </Cell>
      <Cell label="label + description">
        <TextField label="Nickname" description="Up to 14 characters" placeholder="Proxy" />
      </Cell>
    </div>
  ),
};

/** sm / md / lg at the current scale: 46 / 57 / 69 design units (≈ 32 / 40 / 48 CSS px at the default 0.7). */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        width: gpx(760),
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(28),
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: gpx(20),
          }}
        >
          <span style={{ ...sizeCaption, paddingBottom: gpx(12) }}>
            {size} · {{ sm: 46, md: 57, lg: 69 }[size]} units
          </span>
          <TextField
            size={size}
            label={`Nickname (${size})`}
            placeholder="Proxy"
            style={{ flex: '1 1 0', minWidth: 0 }}
          />
          <TextField
            size={size}
            aria-label={`Search (${size})`}
            type="search"
            icon={<SearchIcon />}
            placeholder="Search"
            style={{ flex: '1 1 0', minWidth: 0 }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div
        style={{
          ...panel,
          display: 'flex',
          flexDirection: 'column',
          gap: gpx(12),
        }}
      >
        <TextField label="Redeem code (upper-cased)" value={value} onValueChange={(v) => setValue(v.toUpperCase())} />
        <span style={caption}>value: {value || '—'}</span>
      </div>
    );
  },
};

/** Select md and TextField md share the 57-unit height (≈ 40 CSS px at 0.7), so they line up in a form row. */
export const WithSelect: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        width: gpx(570),
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(20),
      }}
    >
      <Select aria-label="Sort by" options={[{ value: 'rarity', label: 'Rarity' }]} defaultValue="rarity" />
      <TextField aria-label="Search" icon={<SearchIcon />} placeholder="Search" width={460} />
    </div>
  ),
};
