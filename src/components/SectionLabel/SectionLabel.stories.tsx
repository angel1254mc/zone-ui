import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatRow } from '../StatRow'
import { SectionLabel } from './SectionLabel'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Data Display/SectionLabel',
  component: SectionLabel,
  tags: ['autodocs'],
  args: { children: 'Base Stat' },
  argTypes: { as: { control: 'inline-radio', options: ['h2', 'h3', 'h4', 'h5', 'div', 'p'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Grey section label above stat rows: `color.text.muted` #8C8C8C, `fontSize.label` (17.5) in a 20 px line box, upright, indented 16 px past the ' +
          "rows. Renders an `h3` by default (`as` for other levels or a non-heading). The box is one 20 px line, so the rhythm is " +
          'label → 7 px → row, row → 10 px → label box (12 px to the cap).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(20), background: '#000', width: gpx(452) }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Flush: Story = { args: { flush: true, children: 'Rarity' } }

/** The label / row rhythm: label, row, label, row. */
export const WithRows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <SectionLabel>Base Stat</SectionLabel>
      <StatRow label="Base ATK" value="684" style={{ marginTop: gpx(7) }} />
      <SectionLabel style={{ marginTop: gpx(10) }}>Advanced Stat</SectionLabel>
      <StatRow label="ATK" value="30%" style={{ marginTop: gpx(7) }} />
      <SectionLabel style={{ marginTop: gpx(10) }}>W-Engine Effect</SectionLabel>
    </div>
  ),
}
