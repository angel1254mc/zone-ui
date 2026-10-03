import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BatteryIcon, DennyIcon, PolychromeIcon } from '../../icons'
import { GameIcon } from '../../../examples/art'
import { CurrencyPill, ResourceBar } from './CurrencyPill'
import { Specimen, Specimens } from '../StatRow/Specimens.story-helpers'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const fill = { width: '100%', height: '100%', objectFit: 'contain' as const }
const battery = <BatteryIcon />
const denny = <GameIcon kind="misc" name="coin" style={fill} fallback={<DennyIcon />} />
const film = <GameIcon kind="misc" name="polychrome" style={fill} fallback={<PolychromeIcon />} />

const meta = {
  title: 'Data Display/CurrencyPill',
  component: CurrencyPill,
  tags: ['autodocs'],
  args: { label: 'Dennies', value: 76418, icon: denny, onAdd: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Top-bar currency pill: a 222 × 56 SVG outline (round left end, right tail leaning 25°), zero-padded `bodyXl` ' +
          'counter (8 digits, grey zeros), item art on the tail and a "+" PlusBadge (`onAdd`, a separate button "Get more …"). ' +
          'Stamina (`max`): the current value is padded to 3 digits in WHITE ("020/240"). `ResourceBar` lays pills out at ' +
          'a 224 px pitch.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(24), background: '#161616' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CurrencyPill>

export default meta
type Story = StoryObj<typeof meta>

export const Dennies: Story = {}
export const Stamina: Story = { args: { label: 'Battery Charge', value: 20, max: 240, icon: battery } }
export const StaminaOverMax: Story = { args: { label: 'Battery Charge', value: 320, max: 240, icon: battery } }
export const Polychrome: Story = { args: { label: 'Polychrome', value: 193, icon: film } }
export const NoAddButton: Story = { args: { onAdd: undefined } }
export const AddPressed: Story = { args: { addProps: { 'data-pressed': '' } as object } }
export const AddDisabled: Story = { args: { addProps: { disabled: true } } }

export const Bar: StoryObj<typeof ResourceBar> = {
  render: () => (
    <ResourceBar
      items={[
        { label: 'Battery Charge', value: 20, max: 240, icon: battery, onAdd: () => {} },
        { label: 'Dennies', value: 76418, icon: denny, onAdd: () => {} },
        { label: 'Polychrome', value: 193, icon: film, onAdd: () => {} },
      ]}
    />
  ),
}

export const States: Story = {
  render: () => (
    <Specimens column>
      <Specimen label="8-digit counter, grey zeros">
        <CurrencyPill label="Dennies" value={76418} icon={denny} onAdd={() => {}} />
      </Specimen>
      <Specimen label="stamina, white 3-digit padding">
        <CurrencyPill label="Battery Charge" value={20} max={240} icon={battery} onAdd={() => {}} />
      </Specimen>
      <Specimen label="+ pressed">
        <CurrencyPill label="Dennies" value={76418} icon={denny} onAdd={() => {}} addProps={{ 'data-pressed': '' } as object} />
      </Specimen>
    </Specimens>
  ),
}
