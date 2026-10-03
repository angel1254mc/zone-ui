import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { WEngineImage } from '../../../examples/art'
import { FilterIcon, ResetIcon } from '../../icons'
import { Button } from '../Button'
import { HatchBackground } from '../Backgrounds'
import { ItemCard } from '../ItemCard'
import { Stage } from '../Stage'
import { Drawer } from './Drawer'
import { FilterDrawer, type FilterDrawerSection } from './FilterDrawer'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const W = 1920
const H = 1080
const RARITIES = ['s', 'a', 'a', 'b', 's'] as const
/** Real W-Engine ids per rank, so a card's rarity frame matches its engine. */
const ENGINE_IDS = {
  s: ['14102', '14104', '14105', '14107', '14109', '14110', '14114', '14116'],
  a: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008'],
  b: ['12001', '12002', '12003', '12004', '12005', '12006', '12007', '12008'],
} as const
const engineId = (r: 's' | 'a' | 'b', n: number) => ENGINE_IDS[r][n % ENGINE_IDS[r].length]

/** A stand-in W-Engine Storage page (grid on the left, a lit title, Filter pill) behind the drawer. */
function PageMock() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}>
      <HatchBackground />
      <div style={{ position: 'absolute', left: gpx(180), top: gpx(22), width: gpx(234), height: gpx(59), borderRadius: gpx(30), background: '#090909', border: `${gpx(5)} solid #333` }} />
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} style={{ position: 'absolute', left: gpx(70), top: gpx(120 + row * 170), display: 'flex', gap: gpx(17) }}>
          {RARITIES.map((r, i) => (
            <ItemCard key={i} rarity={r} level={60} stars={1} art={<WEngineImage id={engineId(r, row * 5 + i)} alt="" />} interactive={false} />
          ))}
        </div>
      ))}
      <div style={{ position: 'absolute', left: gpx(870), top: gpx(125), color: '#fff', fontSize: 'var(--zzz-font-size-title)', lineHeight: 1 }}>Cauldron of Clarity</div>
      <div style={{ position: 'absolute', left: gpx(870), top: gpx(180), width: gpx(560), height: gpx(560), background: '#111', borderRadius: gpx(24) }} />
    </div>
  )
}

/** A 1920 × 1080 Stage handing its layer to the drawer as `container` (so the docs page never goes inert). */
function GameCanvas({ children }: { children: (container: HTMLElement) => ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const inner = (
    <div ref={setEl} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <PageMock />
      {el ? children(el) : null}
    </div>
  )
  return (
    <Stage width={W} height={H} style={{ width: '100%' }}>
      {inner}
    </Stage>
  )
}

const GROUPS: FilterDrawerSection[] = [
  {
    label: 'Rarity',
    options: [
      { value: 's', label: 'S' },
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ],
  },
  {
    label: 'Agent Specialties',
    options: [
      { value: 'attack', label: 'Attack' },
      { value: 'stun', label: 'Stun' },
      { value: 'anomaly', label: 'Anomaly' },
      { value: 'support', label: 'Support' },
      { value: 'defense', label: 'Defense' },
      { value: 'rupture', label: 'Rupture' },
      { value: 'armorer', label: 'Armorer', disabled: true },
    ],
  },
]
const SORT_OPTIONS = [
  { value: 'rarity', label: 'Rarity' },
  { value: 'level', label: 'Level' },
  { value: 'baseAtk', label: 'Base ATK' },
]

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: 'Filter W-Engines', open: true, onOpenChange: () => {} },
  argTypes: {
    children: { control: false },
    footer: { control: false },
    icon: { control: false },
    container: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Right-anchored side sheet. **688** wide (`size.panel.drawerWidth`), full height, a 4 px ' +
          'black left edge; black 95 px header (icon 21 × 22, upright title, red `TagButton kind="close"`), a `#1A1A1A` ' +
          'dotted body (`.zzz-mat-drawer`) holding a `#030303` inner panel (radius 12, margins 41 / 63 / 21 / 23), and a ' +
          'black 100 px footer whose action is centred on the inner panel. The page is dimmed by a left-to-right ' +
          'gradient `rgba(12,12,12,.19)` → `.65` up to the drawer edge, no blur.\n\n' +
          'Motion: in 200 ms `cubic-bezier(.16,1,.3,1)`, out 170 ms ease-in; the scrim fades with it.\n\n' +
          'Accessibility: `role="dialog"` + `aria-modal`, labelled by the title, focus trapped (first stop: Close), ' +
          'Escape closes (an open Select inside consumes the first Escape), clicking the dimmed page closes ' +
          '(`closeOnScrim`), page inert + scroll-locked, focus back to the opener.\n\n' +
          '`FilterDrawer` is the "Filter W-Engines" content: `Select` + `SortToggle`, a divider, labelled `ChipGroup` ' +
          'sections passed as data, and the orange-disc Reset.\n\n' +
          'Stories render inside a 1920 × 1080 Stage via `container`; **Portal** shows the default.',
      },
    },
  },
  render: (args) => (
    <GameCanvas>
      {(c) => (
        <Drawer
          {...args}
          container={c}
          icon={<FilterIcon />}
          footer={
            <Button width="wide" icon={<ResetIcon />} iconTone="reset">
              Reset
            </Button>
          }
        >
          <p style={{ margin: 0, color: 'var(--zzz-color-text-muted)', fontSize: 'var(--zzz-font-size-body)', lineHeight: 1.3 }}>Any content goes in the inner panel.</p>
        </Drawer>
      )}
    </GameCanvas>
  ),
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Filter W-Engines. */
export const Filter: Story = {
  render: () => (
    <GameCanvas>
      {(c) => <FilterDrawer open onOpenChange={() => {}} container={c} sort={{ options: SORT_OPTIONS, defaultValue: 'rarity' }} groups={GROUPS} />}
    </GameCanvas>
  ),
}

/** Chips selected (accent fill), sort ascending. */
export const FilterWithSelection: Story = {
  name: 'Filter with selection',
  render: () => (
    <GameCanvas>
      {(c) => (
        <FilterDrawer
          open
          onOpenChange={() => {}}
          container={c}
          sort={{ options: SORT_OPTIONS, defaultValue: 'level', defaultDirection: 'asc' }}
          groups={[{ ...GROUPS[0], defaultValue: ['s'] }, { ...GROUPS[1], defaultValue: ['attack', 'support'] }]}
        />
      )}
    </GameCanvas>
  ),
}

/** Click Filter to slide the drawer in; Close / Escape / the dimmed page slide it out. */
export const Motion: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <GameCanvas>
          {(c) => (
            <>
              <div style={{ position: 'absolute', left: gpx(66), bottom: gpx(30), zIndex: 1 }}>
                <Button size="md" icon={<FilterIcon />} onClick={() => setOpen(true)}>
                  Filter
                </Button>
              </div>
              <FilterDrawer open={open} onOpenChange={setOpen} container={c} sort={{ options: SORT_OPTIONS, defaultValue: 'rarity' }} groups={GROUPS} />
            </>
          )}
        </GameCanvas>
      )
    }
    return <Demo />
  },
}

/** Default behaviour: fixed on `<body>`, the whole preview becomes inert while open. */
export const Portal: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div style={{ padding: gpx(40) }}>
          <Button size="md" icon={<FilterIcon />} onClick={() => setOpen(true)}>
            Filter
          </Button>
          <FilterDrawer open={open} onOpenChange={setOpen} sort={{ options: SORT_OPTIONS, defaultValue: 'rarity' }} groups={GROUPS} onReset={() => setOpen(false)} />
        </div>
      )
    }
    return <Demo />
  },
}
