import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Table } from './Table'
import type { TableColumn, TableSort } from './Table'
import { AgentImage, WEngineImage } from '../../../examples/art'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    color: 'var(--zzz-color-text-muted)',
    fontSize: gpx(14),
    lineHeight: 1.2,
}
const rankColor: Record<string, string> = {
    S: 'var(--zzz-color-rarity-s)',
    A: 'var(--zzz-color-rarity-a)',
    B: 'var(--zzz-color-rarity-b)',
}

interface Pull {
    no: number
    id?: string
    name: string
    kind: 'Agent' | 'W-Engine'
    rank: 'S' | 'A' | 'B'
    time: string
}

/** Real agents / W-Engines (ids, names and ranks from the art manifest), static so no text changes once the art loads. */
const PULLS: Pull[] = [
    {
        no: 1,
        id: '1471',
        name: 'Banyue',
        kind: 'Agent',
        rank: 'S',
        time: '2024-07-12 20:14:03',
    },
    {
        no: 2,
        id: '14102',
        name: 'Steel Cushion',
        kind: 'W-Engine',
        rank: 'S',
        time: '2024-07-12 20:14:03',
    },
    {
        no: 3,
        id: '1011',
        name: 'Anby',
        kind: 'Agent',
        rank: 'A',
        time: '2024-07-11 18:02:51',
    },
    {
        no: 4,
        id: '13001',
        name: 'Street Superstar',
        kind: 'W-Engine',
        rank: 'A',
        time: '2024-07-11 18:02:51',
    },
    {
        no: 5,
        id: '1061',
        name: 'Corin',
        kind: 'Agent',
        rank: 'A',
        time: '2024-07-10 09:40:12',
    },
    {
        no: 6,
        id: '12007',
        name: '[Vortex] Revolver',
        kind: 'W-Engine',
        rank: 'B',
        time: '2024-07-10 09:40:12',
    },
]

const columns: TableColumn<Pull>[] = [
    { key: 'no', header: 'No.', sortable: true, width: 90 },
    {
        key: 'name',
        header: 'Item',
        sortable: true,
        rowHeader: true,
        align: 'start',
        cell: (p) => (
            <span
                style={{ display: 'flex', alignItems: 'center', gap: gpx(12) }}
            >
                <span
                    style={{
                        width: gpx(32),
                        height: gpx(32),
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flex: 'none',
                        background: '#1a1a1a',
                    }}
                >
                    {p.kind === 'Agent' ? (
                        <AgentImage id={p.id} crop="circle" alt="" />
                    ) : (
                        <WEngineImage id={p.id} alt="" fit="cover" />
                    )}
                </span>
                <span style={{ color: rankColor[p.rank] }}>{p.name}</span>
            </span>
        ),
    },
    { key: 'kind', header: 'Type', sortable: true },
    {
        key: 'rank',
        header: 'Rank',
        sortable: true,
        sortValue: (p) => 'SAB'.indexOf(p.rank),
    },
    { key: 'time', header: 'Time', align: 'end' },
]

const meta = {
    title: 'Data Display/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Data table for web lists (e.g. a pull history).',
            },
        },
    },
} satisfies Meta

export default meta
// Stories render their own typed <Table`<Row>`> (generic), so args stay untyped.
type Story = StoryObj

export const SignalSearchHistory: Story = {
    render: function Render() {
        const rows = PULLS
        return (
            <div style={{ width: gpx(1000) }}>
                <Table
                    caption="Signal Search history"
                    columns={columns}
                    rows={rows}
                    rowKey={(r) => r.no}
                />
            </div>
        )
    },
}

export const Sorted: Story = {
    render: function Render() {
        const rows = PULLS
        const [sort, setSort] = useState<TableSort | null>({
            key: 'rank',
            direction: 'ascending',
        })
        return (
            <div
                style={{
                    width: gpx(1000),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: gpx(12),
                }}
            >
                <Table
                    caption="Sorted by rank (controlled)"
                    columns={columns}
                    rows={rows}
                    sort={sort}
                    onSortChange={setSort}
                />
                <span style={caption}>
                    sort: {sort ? `${sort.key} ${sort.direction}` : 'none'}
                </span>
            </div>
        )
    },
}

interface Stat {
    stat: string
    base: string
    bonus: string
    total: string
}
const stats: Stat[] = [
    { stat: 'HP', base: '7,673', bonus: '+9,393', total: '17,066' },
    { stat: 'ATK', base: '863', bonus: '+1,292', total: '2,155' },
    { stat: 'DEF', base: '606', bonus: '+266', total: '872' },
    { stat: 'CRIT Rate', base: '5%', bonus: '+40.8%', total: '45.8%' },
]

export const BorderedStats: Story = {
    render: () => (
        <div style={{ width: gpx(760) }}>
            <Table<Stat>
                caption="Stat comparison"
                hideCaption
                bordered
                rows={stats}
                columns={[
                    {
                        key: 'stat',
                        header: 'Stat',
                        rowHeader: true,
                        align: 'start',
                    },
                    { key: 'base', header: 'Base', align: 'end' },
                    {
                        key: 'bonus',
                        header: 'Bonus',
                        align: 'end',
                        cell: (s) => (
                            <span
                                style={{
                                    color: 'var(--zzz-color-highlight-value)',
                                }}
                            >
                                {s.bonus}
                            </span>
                        ),
                    },
                    {
                        key: 'total',
                        header: 'Total',
                        align: 'end',
                        cell: (s) => (
                            <span
                                style={{
                                    color: 'var(--zzz-color-text-primary)',
                                }}
                            >
                                {s.total}
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const Empty: Story = {
    render: () => (
        <div style={{ width: gpx(760) }}>
            <Table
                caption="Signal Search history"
                columns={columns}
                rows={[]}
                empty="No records in the last 6 months"
            />
        </div>
    ),
}
