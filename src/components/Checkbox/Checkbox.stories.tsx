import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Checkbox } from './Checkbox';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
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
};

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A checkbox for web forms. For filter-style toggles, see Forms/Chip.',
      },
    },
  },
  args: { children: 'Show locked items' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={panel}>
      <Checkbox {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ ...panel, display: 'flex', flexDirection: 'column' }}>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled defaultChecked>
        Disabled checked
      </Checkbox>
      <Checkbox aria-label="No visible label" />
    </div>
  ),
};

/** sm / md / lg: box 19 / 24 / 29, row 32 / 40 / 48 design units; label `label` / `body` / `bodyLg`. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(16),
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: gpx(28),
          }}
        >
          <span style={sizeCaption}>{size}</span>
          <Checkbox size={size}>Unchecked</Checkbox>
          <Checkbox size={size} defaultChecked>
            Checked
          </Checkbox>
          <Checkbox size={size} indeterminate>
            Mixed
          </Checkbox>
          <Checkbox size={size} disabled>
            Disabled
          </Checkbox>
        </div>
      ))}
    </div>
  ),
};

export const SelectAll: Story = {
  render: function Render() {
    const all = ['Attack', 'Stun', 'Anomaly', 'Support'];
    const [picked, setPicked] = useState<string[]>(['Attack']);
    const allOn = picked.length === all.length;
    return (
      <div style={{ ...panel, display: 'flex', flexDirection: 'column' }}>
        <Checkbox
          checked={allOn}
          indeterminate={!allOn && picked.length > 0}
          onCheckedChange={(on) => setPicked(on ? all : [])}
        >
          All specialties
        </Checkbox>
        <div
          style={{
            paddingLeft: gpx(38),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {all.map((name) => (
            <Checkbox
              key={name}
              checked={picked.includes(name)}
              onCheckedChange={(on) =>
                setPicked((p) => (on ? all.filter((n) => p.includes(n) || n === name) : p.filter((n) => n !== name)))
              }
            >
              {name}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
};
