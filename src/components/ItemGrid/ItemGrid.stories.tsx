import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { AnomalyIcon, AttackIcon, DefenseIcon, RuptureIcon, StunIcon, SupportIcon } from '../../icons'
import { AgentImage, DriveDiscImage, ItemImage, STORY_ITEMS, WEngineImage, useGameArt } from '../../../examples/art'
import { ItemCard, type Rarity } from '../ItemCard'
import { ItemGrid } from './ItemGrid'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
}

const SPECIALTY: Record<string, ReactNode> = {
  Attack: <AttackIcon />,
  Rupture: <RuptureIcon />,
  Stun: <StunIcon />,
  Support: <SupportIcon />,
  Anomaly: <AnomalyIcon />,
  Defense: <DefenseIcon />,
}
const SPECIALTY_NAMES = Object.keys(SPECIALTY)
const AGENTS = ['1041', '1191', '1141', '1011', '1031', '1061', '1081']

interface WItem {
  id: string
  name: string
  rarity: Rarity
  specialty: string
  stars: number
  locked: boolean
  agent?: string
}

/**
 * W-Engines from the committed art manifest (real names / ranks / specialties). The manifest is a static
 * import, so names never change after load; without one the slots stay unnamed (empty frames).
 */
function useWEngineItems(count: number): WItem[] {
  const art = useGameArt()
  const order: Record<string, number> = { S: 0, A: 1, B: 2 }
  const source = art
    ? [...art.wEngines].sort((a, b) => (order[a.rank ?? 'B'] ?? 3) - (order[b.rank ?? 'B'] ?? 3))
    : null
  return Array.from({ length: count }, (_, i) => {
    const w = source?.[i % source.length]
    const rarity = ((w?.rank ?? ['S', 'A', 'B'][Math.min(2, Math.floor(i / 12))]).toLowerCase() as Rarity)
    return {
      id: w ? `${w.id}-${i}` : `slot-${i}`,
      name: w?.name ?? '',
      rarity,
      specialty: w?.specialty ?? SPECIALTY_NAMES[i % SPECIALTY_NAMES.length],
      stars: 1 + ((i * 7) % 5),
      locked: i % 3 !== 2,
      agent: i % 4 === 3 ? undefined : AGENTS[i % AGENTS.length],
    }
  })
}

function wEngineCard(it: WItem, i: number) {
  const wid = it.id.split('-')[0]
  const known = !it.id.startsWith('slot')
  return (
    <ItemCard
      name={it.name}
      rarity={it.rarity}
      level={60}
      stars={it.stars}
      locked={it.locked}
      specialty={SPECIALTY[it.specialty] ?? <AttackIcon />}
      art={<WEngineImage id={known ? wid : undefined} seed={i} alt="" />}
      avatar={it.agent ? <AgentImage id={it.agent} crop="circle" /> : undefined}
    />
  )
}

/** Selection that defaults to the first item (and survives the item list changing). */
function useFirstSelected(ids: string[]) {
  const [picked, setPicked] = useState<string | null>(null)
  const value = picked !== null && ids.includes(picked) ? picked : (ids[0] ?? null)
  return [value, setPicked] as const
}

function StorageDemo({ stagger = 'fast' as 'fast' | 'slow' | 'none' }) {
  const items = useWEngineItems(52)
  const [value, setValue] = useFirstSelected(items.map((it) => it.id))
  return (
    <ItemGrid
      aria-label="W-Engine Storage"
      items={items}
      getId={(it) => it.id}
      columns={13}
      density="storage"
      value={value}
      onValueChange={setValue}
      stagger={stagger}
      scrollbar="right"
      style={{ height: gpx(4 * 174.7 - 22.7 + 17 + 12), width: 'fit-content', maxWidth: '100%' }}
      renderItem={(it, { index }) => wEngineCard(it, index)}
    />
  )
}

const meta = {
  title: 'Inventory/ItemGrid',
  component: ItemGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Inventory grid of `ItemCard`s at a fixed pitch: storage 118 at 135.2 × 174.7, list 115 at ' +
          '130 × 170.8, material 110 at 128.7 × 169, slot 87 at 104. Single selection (controlled or uncontrolled), ' +
          '`role="listbox"` with a roving tabindex and 2-D arrow keys (selection follows focus; Home / End = row, ' +
          'Ctrl+Home / End = first / last; Enter / Space activate). Tiles fade in at 33 ms + i × 8.5 ms (`fast`) or ' +
          '18 ms (`slow`), replayed when the item set changes, off under reduced motion. `scrollbar` wraps it in a ' +
          '`ScrollArea`. Not virtualised.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(24), background: '#141414' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ItemGrid>

export default meta
type Story = StoryObj<typeof meta>

/** W-Engine Storage: 13 columns, 4 visible rows, scrollbar on the right. */
export const Storage: Story = {
  args: {} as never,
  render: () => <StorageDemo />,
}

export const StorageNoStagger: Story = {
  name: 'Storage (stagger none)',
  args: {} as never,
  render: () => <StorageDemo stagger="none" />,
}

/** Drive Disc Storage: slot hexagons instead of specialty glyphs. */
export const DriveDiscs: Story = {
  args: {} as never,
  render: () => {
    const items = Array.from({ length: 26 }, (_, i) => ({ id: `d${i}`, slot: ((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6, set: i % 4 }))
    const sets = ['31000', '31100', '31200', '31300']
    return (
      <ItemGrid
        aria-label="Drive Disc Storage"
        items={items}
        getId={(it) => it.id}
        columns={13}
        defaultValue="d0"
        renderItem={(it) => (
          <ItemCard name="Drive Disc" rarity="s" slot={it.slot} level={15} art={<DriveDiscImage id={sets[it.set]} seed={it.set} />} avatar={<AgentImage id={AGENTS[it.set]} crop="circle" />} />
        )}
      />
    )
  },
}

/** Manage Item materials: 110 cards, counts, slow entrance stagger, scrollbar on the left. */
export const Materials: Story = {
  args: {} as never,
  render: () => {
    // Real items (static names + rarities, so labels never change after the art loads).
    const items = Array.from({ length: 30 }, (_, i) => ({ ...STORY_ITEMS[i % STORY_ITEMS.length], key: `m${i}`, count: (i * 37) % 12 }))
    return (
      <ItemGrid
        aria-label="Materials"
        items={items}
        getId={(it) => it.key}
        columns={10}
        density="material"
        stagger="slow"
        scrollbar="left"
        scrollbarGap={64}
        defaultValue="m0"
        style={{ height: gpx(3 * 169) }}
        renderItem={(it) => <ItemCard name={it.name} rarity={it.rarity} count={it.count} art={<ItemImage id={it.id} alt="" />} />}
      />
    )
  },
}

/** Overclock grid: 115 EMPTY slots, 9 columns, scrollbar on the left 14 px away. */
export const OverclockEmpty: Story = {
  name: 'Overclock (EMPTY slots)',
  args: {} as never,
  render: () => {
    const items = Array.from({ length: 27 }, (_, i) => `e${i}`)
    return (
      <div className="zzz-bg-hatch" style={{ padding: gpx(12) }}>
        <ItemGrid
          aria-label="Overclock materials"
          items={items}
          getId={(it) => it}
          columns={9}
          density="list"
          scrollbar="left"
          stagger="none"
          style={{ height: gpx(2 * 170.8 + 17) }}
          renderItem={() => <ItemCard empty />}
        />
      </div>
    )
  },
}

/** Equip list: 5 columns of 115 cards. */
export const EquipList: Story = {
  args: {} as never,
  render: function EquipListStory() {
    const items = useWEngineItems(15)
    const [value, setValue] = useFirstSelected(items.map((it) => it.id))
    return (
      <ItemGrid
        aria-label="Equip W-Engine"
        items={items}
        getId={(it) => it.id}
        columns={5}
        density="list"
        scrollbar="left"
        value={value}
        onValueChange={setValue}
        style={{ height: gpx(2 * 170.8 + 17) }}
        renderItem={(it, { index }) => wEngineCard(it, index)}
      />
    )
  },
}

/** Controlled selection with an external readout; the heartbeat flourish is on. */
export const Controlled: Story = {
  args: {} as never,
  render: function ControlledStory() {
    const items = useWEngineItems(12)
    const [picked, setValue] = useState<string | null>(null)
    const value = picked !== null && items.some((it) => it.id === picked) ? picked : (items[2]?.id ?? null)
    const current = items.find((it) => it.id === value)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
        <ItemGrid
          aria-label="W-Engines"
          items={items}
          getId={(it) => it.id}
          columns={6}
          value={value}
          onValueChange={setValue}
          renderItem={(it, { index }) => (
            <ItemCard
              name={it.name}
              rarity={it.rarity}
              level={60}
              stars={it.stars}
              beat
              specialty={SPECIALTY[it.specialty]}
              art={<WEngineImage id={it.id.startsWith('slot') ? undefined : it.id.split('-')[0]} seed={index} alt="" />}
            />
          )}
        />
        <span style={{ ...caption, fontSize: 'var(--zzz-font-size-body)' }}>Selected: {current?.name ?? '—'}</span>
      </div>
    )
  },
}
