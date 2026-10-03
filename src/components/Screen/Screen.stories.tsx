import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { fn } from 'storybook/test'
import {
  BatteryIcon,
  DennyIcon,
  FilterIcon,
  HomeIcon,
  PolychromeIcon,
  RecycleIcon,
  AchievementsIcon,
  AgentsIcon,
  CityFundIcon,
  InterKnotIcon,
  MailIcon,
  MoreIcon,
  NoticesIcon,
  OptionsIcon,
  SignalSearchIcon,
  SquadIcon,
  StorageIcon,
  StoreIcon,
} from '../../icons'
import { AgentImage, GameIcon, WEngineImage } from '../../../examples/art'
import { GraffitiLayer } from '../Backgrounds'
import { Stage } from '../Stage'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { ResourceBar } from '../CurrencyPill'
import { ItemCard } from '../ItemCard'
import { TopBar } from '../TopBar'
import { SectionTitleStrip } from '../PageTitle'
import { BottomBar } from '../BottomBar'
import { Text } from '../Text'
import { Screen } from './Screen'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const fill = { width: '100%', height: '100%', objectFit: 'contain' as const }
const denny = <GameIcon kind="misc" name="coin" style={fill} fallback={<DennyIcon />} />
const film = <GameIcon kind="misc" name="polychrome" style={fill} fallback={<PolychromeIcon />} />

const resources = (stamina: number, dennies: number, home = false) => (
  <ResourceBar
    items={[
      { label: 'Battery Charge', value: stamina, max: 240, ...(home ? { digits: 3, padTone: 'white' as const } : null), icon: <BatteryIcon />, onAdd: () => {} },
      { label: 'Dennies', value: dennies, icon: denny, onAdd: () => {} },
      { label: 'Polychrome', value: 193, icon: film, onAdd: () => {} },
    ]}
  />
)

/** A row of circle buttons for the bottom bar (plain composition of primitives). */
const dockItems: { id: string; icon: ReactNode; label: string }[] = [
  { id: 'more', icon: <MoreIcon />, label: 'More' },
  { id: 'squad', icon: <SquadIcon />, label: 'Squad' },
  { id: 'mail', icon: <MailIcon />, label: 'Mail' },
  { id: 'options', icon: <OptionsIcon />, label: 'Options' },
  { id: 'notices', icon: <NoticesIcon />, label: 'Notices' },
  { id: 'achievements', icon: <AchievementsIcon />, label: 'Achievements' },
  { id: 'interknot', icon: <InterKnotIcon />, label: 'Inter-Knot' },
  { id: 'storage', icon: <StorageIcon />, label: 'Storage' },
  { id: 'agents', icon: <AgentsIcon />, label: 'Agents' },
  { id: 'store', icon: <StoreIcon />, label: 'Store' },
  { id: 'cityfund', icon: <CityFundIcon />, label: 'City Fund' },
  { id: 'signal', icon: <SignalSearchIcon />, label: 'Signal Search' },
]
const onDock = fn()
const dock = (
  <BottomBar
    right={dockItems.map((item) => (
      <IconButton key={item.id} icon={item.icon} label={item.label} onClick={() => onDock(item.id)} />
    ))}
  />
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

/** Confirm with the cost beside it. */
const confirmBar = (
  <>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: gpx(10) }}>
      <span style={{ width: gpx(40), height: gpx(40), display: 'inline-flex' }}>{denny}</span>
      <Text role="condensedMd">76418</Text>
    </span>
    <Button width="wide" disabled>
      Confirm
    </Button>
  </>
)

/** A Stage filling the story viewport (layout fullscreen). */
const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <Stage>{children}</Stage>
  </div>
)

const abs = (x: number, y: number, extra?: CSSProperties): CSSProperties => ({ position: 'absolute', left: gpx(x), top: gpx(y), ...extra })

/**
 * A custom background node: the kit's graffiti layer plus a real full-body agent standing on the bottom
 * edge (no scenery art exists, so the figure carries the scene). Not a direct `picture` child of the
 * background layer, so the Screen's cover rule for custom art doesn't crop the figure.
 */
function AgentBackdrop({ agentId, inset = '4% 22% 0 36%' }: { agentId: string; inset?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <GraffitiLayer />
      <AgentImage id={agentId} crop="full" fit="contain" position="50% 100%" priority alt="" style={{ position: 'absolute', inset, width: 'auto', height: 'auto' }} />
    </div>
  )
}

/* ── Screen compositions ─────────────────────────────────────────────────────────────────── */

const Storage = ({ entrance = true }: { entrance?: boolean }) => (
  <Screen
    background="mural"
    entrance={entrance}
    onBack={fn()}
    uid="1000000001"
    topBar={
      <TopBar
        background="none"
        onBack={() => {}}
        left={
          <Button size="md" width="compact" icon={<HomeIcon />}>
            City
          </Button>
        }
        right={resources(320, 76418)}
      />
    }
    sectionStrip={<SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} />}
    bottomBar={<BottomBar separator hints={[{ keyCap: 'T', label: 'Unlock' }]} />}
  >
    <div style={abs(156, 43, { display: 'grid', gridTemplateColumns: `repeat(6, ${gpx(118)})`, gap: gpx(17) })}>
      {Array.from({ length: 12 }, (_, i) => (
        <ItemCard key={i} rarity={i % 3 ? 'a' : 's'} level={60} stars={1} art={<WEngineImage seed={i} alt="" />} selected={i === 0} />
      ))}
    </div>
    <div style={abs(184, 729, { display: 'flex', gap: gpx(28), alignItems: 'center' })}>
      <IconButton icon={<FilterIcon />} label="Filter" />
      <Button width="wide" icon={<RecycleIcon />} iconTone="recycle">
        Recycle
      </Button>
    </div>
  </Screen>
)

const Overclocking = ({ entrance = true }: { entrance?: boolean }) => (
  <Screen
    background="hatch"
    entrance={entrance}
    onBack={fn()}
    uid="1000000001"
    topBar={<TopBar onBack={() => {}} title="W-Engine Overclocking" />}
    bottomBar={
      <BottomBar
        right={confirmBar}
      />
    }
  />
)

const Home = ({ entrance = true }: { entrance?: boolean }) => (
  <Screen
    background={<AgentBackdrop agentId="1191" />}
    entrance={entrance}
    uid="1000000001"
    topBar={
      <TopBar
        background="translucent"
        onBack={() => {}}
        left={profile}
        right={resources(20, 75918, true)}
      />
    }
    bottomBar={dock}
  />
)

const Agent = ({ entrance = true }: { entrance?: boolean }) => (
  <Screen
    background="graffiti"
    entrance={entrance}
    uid="1000000001"
    topBar={
      <TopBar
        background="none"
        onBack={() => {}}
        left={
          <Button size="md" width={320} twoLine avatar={<AgentImage seed={3} crop="circle" alt="" />}>
            {'Special Training\nPlan'}
          </Button>
        }
      />
    }
  >
    <div style={abs(700, 150, { width: gpx(700), height: gpx(760) })}>
      <AgentImage seed={3} crop="full" alt="" style={{ width: '100%', height: '100%' }} />
    </div>
  </Screen>
)

const meta = {
  title: 'Shell/Screen',
  component: Screen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '520px' },
      description: {
        component:
          'A full-screen app frame, inspired by the game’s menu screens. It fills its container (e.g. a `Stage` canvas): ' +
          'a background layer (`black`, `hatch`, `flat`, `mural`, `graffiti` or any art ReactNode), then a column of ' +
          '`<header>` (top bar + optional section strip), `<main>` and `<footer>` (bottom bar or ' +
          'a taller custom bar), with the UID + signal bars in the bottom-right corner. Escape inside the screen calls ' +
          '`onBack`. Fades in from black (300 ms) unless `entrance={false}` or reduced motion.',
      },
    },
  },
} satisfies Meta<typeof Screen>

export default meta
type Story = StoryObj<typeof meta>

/** Storage: mural behind the top bar, City pill, section strip, key hint + separator. */
export const StorageScreen: Story = { render: () => <Frame><Storage /></Frame> }

/** Sub-page: hatch, page title, cost + Confirm in the bottom bar. */
export const SubPage: Story = { render: () => <Frame><Overclocking /></Frame> }

/** Home: art background, translucent top bar with a profile pill, a row of circle buttons as the bottom bar. */
export const HomeScreen: Story = { render: () => <Frame><Home /></Frame> }

/** Agent screens: graffiti background, no top-bar band, title pill. */
export const AgentScreen: Story = { render: () => <Frame><Agent /></Frame> }

export const BackgroundVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 8, background: '#222' }}>
      {(['black', 'hatch', 'flat', 'mural', 'graffiti'] as const).map((bg) => (
        <div key={bg} style={{ height: 180 }}>
          <Stage>
            <Screen background={bg} entrance={false} uid="1000000001">
              <div style={abs(80, 400, { font: '900 calc(120 * var(--zzz-px))/1 sans-serif', color: '#fff' })}>{bg}</div>
            </Screen>
          </Stage>
        </div>
      ))}
      <div style={{ height: 180 }}>
        <Stage>
          <Screen background={<AgentBackdrop agentId="1031" />} entrance={false} uid="1000000001">
            <div style={abs(80, 400, { font: '900 calc(120 * var(--zzz-px))/1 sans-serif', color: '#fff' })}>art node</div>
          </Screen>
        </Stage>
      </div>
    </div>
  ),
}
