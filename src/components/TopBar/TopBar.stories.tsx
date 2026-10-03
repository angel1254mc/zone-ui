import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BatteryIcon, DennyIcon, FilterIcon, HomeIcon, LockIcon, PolychromeIcon, RecycleIcon } from '../../icons'
import { AgentImage, GameIcon, NamecardImage } from '../../../examples/art'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { KeyHint } from '../KeyHint'
import { ResourceBar } from '../CurrencyPill'
import { Text } from '../Text'
import { TopBar } from './TopBar'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const fill = { width: '100%', height: '100%', objectFit: 'contain' as const }
const resources = (
  <ResourceBar
    items={[
      { label: 'Battery Charge', value: 320, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
      { label: 'Dennies', value: 76418, icon: <GameIcon kind="misc" name="coin" style={fill} fallback={<DennyIcon />} />, onAdd: () => {} },
      { label: 'Polychrome', value: 193, icon: <GameIcon kind="misc" name="polychrome" style={fill} fallback={<PolychromeIcon />} />, onAdd: () => {} },
    ]}
  />
)
const homeResources = (
  <ResourceBar
    items={[
      { label: 'Battery Charge', value: 20, max: 240, digits: 3, padTone: 'white', icon: <BatteryIcon />, onAdd: () => {} },
      { label: 'Dennies', value: 75918, icon: <GameIcon kind="misc" name="coin" style={fill} fallback={<DennyIcon />} />, onAdd: () => {} },
      { label: 'Polychrome', value: 193, icon: <GameIcon kind="misc" name="polychrome" style={fill} fallback={<PolychromeIcon />} />, onAdd: () => {} },
    ]}
  />
)
const city = (
  <Button size="md" width="compact" icon={<HomeIcon />}>
    City
  </Button>
)
const filterPill = (
  <Button size="md" width="compact" icon={<FilterIcon />}>
    Filter
  </Button>
)
const actionsRight = (
  <>
    <span style={{ display: 'flex', alignItems: 'center', gap: gpx(10) }}>
      <KeyHint keyCap="T" />
      <IconButton icon={<LockIcon />} label="Lock" tone="lockOn" />
    </span>
    <Button width="compact" icon={<RecycleIcon />} iconTone="recycle">
      Recycle
    </Button>
  </>
)
/** A profile pill in plain markup: avatar circle + name + level on the pill material. */
const profile = (
  <span
    className="zzz-mat-pill"
    style={{ display: 'inline-flex', alignItems: 'center', gap: gpx(14), height: gpx(64), padding: `0 ${gpx(28)} 0 ${gpx(4)}`, borderRadius: gpx(32) }}
  >
    <span style={{ width: gpx(56), height: gpx(56), borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
      <AgentImage seed={7} crop="circle" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </span>
    <Text role="label">Proxy</Text>
    <Text role="condensedSm" tone="secondary">
      Lv.60
    </Text>
  </span>
)

const meta = {
  title: 'Shell/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  args: { onBack: fn(), left: city, right: resources, background: 'solid' },
  argTypes: {
    left: { control: false },
    right: { control: false },
    title: { control: 'text' },
    background: { control: 'inline-radio', options: ['solid', 'translucent', 'none', 'mural'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Top bar, inspired by the game’s menu header: a full-width band 102 tall with a 59 px control row 22 px from the top and 68 px side margins. `onBack` ' +
          'renders the red Back `TagButton`; `left` takes the location pill ("City" with the house cap), a title pill (avatar ' +
          'cap, two lines) or any profile/avatar markup (24 px after Back); `title` renders a `PageTitle` 28 px after Back; `right` takes a ' +
          '`ResourceBar`, `IconTabs` or buttons. Band: `solid` black (sub-pages), `translucent` (over a scene), `none` (over art), ' +
          '`mural` (over the sticker mural). No bottom line: the section rule belongs to `SectionTitleStrip`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', background: '#1a1a1a' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

/** Back + City + the resource pills. */
export const Location: Story = {}

/** The band over the dimmed sticker mural. */
export const StorageMural: Story = { args: { background: 'mural' } }

/** Back + page title, nothing on the right. */
export const PageTitle: Story = { args: { left: undefined, right: undefined, title: 'Manage Item' } }

/** Back + Filter pill; T key, lock toggle and Recycle at the right. */
export const FilterAndActions: Story = { args: { left: filterPill, right: actionsRight } }

/** The title pill with an avatar cap and a two-line label. */
export const TitlePill: Story = {
  args: {
    left: (
      <Button size="md" width={320} twoLine avatar={<AgentImage seed={3} crop="circle" alt="" />}>
        {'Special Training\nPlan'}
      </Button>
    ),
    right: undefined,
    background: 'none',
  },
  decorators: [(Story) => <div style={{ background: '#24302b' }}><Story /></div>],
}

/** Home: translucent band over the scene (a real Inter-Knot namecard banner by URL), a profile pill at the left. */
export const Home: Story = {
  args: { left: profile, right: homeResources, background: 'translucent' },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: gpx(220), overflow: 'hidden' }}>
        <NamecardImage id="ImgCardEvent04" priority alt="" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

/** Back pressed (accent fill, +2.5 px) — forced via `backProps`. */
export const BackPressed: Story = { args: { backProps: { pressed: true } } }
