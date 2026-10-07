import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import {
    AttackIcon,
    RuptureIcon,
    StunIcon,
    SupportIcon,
    AnomalyIcon,
    DefenseIcon,
} from '../../icons'
import {
    AgentImage,
    DriveDiscImage,
    ItemImage,
    WEngineImage,
    useWEngine,
} from '../../../examples/art'
import { ItemCard, type ItemCardProps, type Rarity } from './ItemCard'

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

/** A W-Engine card filled from the art manifest (real name / rank / specialty). */
function WEngineCard({
    id,
    fallbackRarity = 's',
    ...props
}: ItemCardProps & { id: string; fallbackRarity?: Rarity }) {
    const w = useWEngine({ id })
    const rarity =
        (w?.rank?.toLowerCase() as Rarity | undefined) ?? fallbackRarity
    return (
        <ItemCard
            name={w?.name ?? 'W-Engine'}
            rarity={rarity}
            art={<WEngineImage id={id} alt="" />}
            specialty={SPECIALTY[w?.specialty ?? 'Attack']}
            level={60}
            stars={1}
            {...props}
        />
    )
}

const avatar = (id: string) => <AgentImage id={id} crop="circle" />

const meta = {
    title: 'Inventory/ItemCard',
    component: ItemCard,
    tags: ['autodocs'],
    args: {
        name: 'The Brimstone',
        rarity: 's',
        size: 'storage',
        level: 60,
        stars: 1,
        locked: true,
        selected: false,
        empty: false,
    },
    argTypes: {
        size: {
            control: 'select',
            options: [
                'storage',
                'list',
                'material',
                'slot',
                'ingredient',
                'reward',
                'preview',
            ],
        },
        rarity: { control: 'inline-radio', options: ['s', 'a', 'b', 'c'] },
        art: { control: false },
        avatar: { control: false },
        specialty: { control: false },
        caption: { control: false },
    },
    render: (args) => (
        <ItemCard
            {...args}
            art={<WEngineImage id="14104" alt="" />}
            specialty={<AttackIcon />}
            avatar={avatar('1041')}
            equippedBy="Soldier 11"
        />
    ),
    decorators: [
        (Story) => (
            <div style={{ padding: gpx(24), background: '#161616' }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'A single inventory tile. Optionally can be wrapped with a badge, rank indicator, and an image.',
            },
        },
    },
} satisfies Meta<typeof ItemCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = { args: { selected: true } }

/** Optional flourish: the ring contracts every 667 ms. Off by default. */
export const SelectedHeartbeat: Story = {
    name: 'Selected (heartbeat)',
    args: { selected: true, beat: true },
}

const row: CSSProperties = {
    display: 'flex',
    gap: gpx(17.2),
    alignItems: 'flex-start',
}

export const Rarities: Story = {
    render: () => (
        <div style={row}>
            <WEngineCard id="14104" />
            <WEngineCard id="13001" fallbackRarity="a" stars={3} />
            <WEngineCard
                id="12001"
                fallbackRarity="b"
                stars={5}
                locked={false}
            />
            <ItemCard
                name="Basic Physical Chip"
                rarity="c"
                size="storage"
                art={<ItemImage id="100110" alt="" />}
                count={12}
            />
        </div>
    ),
}

export const Decorations: Story = {
    name: 'Stars, lock, specialty, avatar',
    render: () => (
        <div style={row}>
            <WEngineCard id="14104" />
            <WEngineCard
                id="14104"
                locked
                avatar={avatar('1041')}
                equippedBy="Soldier 11"
            />
            <WEngineCard
                id="14102"
                stars={3}
                locked={false}
                avatar={avatar('1191')}
                equippedBy="Ellen"
            />
            <WEngineCard id="14105" stars={5} locked specialty={undefined} />
        </div>
    ),
}

export const DriveDisc: Story = {
    name: 'Drive Disc (slot hexagon)',
    render: () => (
        <div style={row}>
            {([1, 2, 3, 4] as const).map((slot) => (
                <ItemCard
                    key={slot}
                    name="Woodpecker Electro"
                    rarity="s"
                    slot={slot}
                    level={15}
                    art={<DriveDiscImage id="31000" />}
                    avatar={avatar('1141')}
                    equippedBy="Lycaon"
                    selected={slot === 1}
                />
            ))}
        </div>
    ),
}

export const Materials: Story = {
    render: () => (
        <div style={{ ...row, gap: gpx(18.7) }}>
            <ItemCard
                size="material"
                name="Ether Battery"
                rarity="a"
                count={7}
                selected
                art={<ItemImage id="502" alt="" />}
            />
            <ItemCard
                size="material"
                name="Bangboo Algorithm Module"
                rarity="b"
                count={1}
                art={<ItemImage id="303002" alt="" />}
            />
            <ItemCard
                size="material"
                name="W-Engine Energy Module"
                rarity="a"
                count={0}
                art={<ItemImage id="301003" alt="" />}
            />
            <ItemCard
                size="material"
                name="Basic Physical Chip"
                rarity="c"
                count={5}
                art={<ItemImage id="100110" alt="" />}
            />
        </div>
    ),
}

export const Ingredients: Story = {
    name: 'Ingredient (danger count)',
    render: () => (
        <div style={{ ...row, gap: gpx(28) }}>
            <ItemCard
                size="ingredient"
                name="Prepaid Power Card"
                rarity="a"
                count={{ owned: 1, required: 1 }}
                art={<ItemImage id="511" alt="" />}
            />
            <ItemCard
                size="ingredient"
                name="Battery Charge"
                rarity="a"
                count={{ owned: 20, required: 60 }}
                art={<ItemImage id="501" alt="" />}
            />
        </div>
    ),
}

export const Empty: Story = {
    name: 'EMPTY',
    render: () => (
        <div style={{ ...row, gap: gpx(15) }}>
            <ItemCard size="list" empty />
            <ItemCard size="material" empty />
            <ItemCard size="slot" empty />
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div style={{ ...row, gap: gpx(24), alignItems: 'flex-end' }}>
            {(
                [
                    'ingredient',
                    'storage',
                    'reward',
                    'list',
                    'material',
                    'slot',
                    'preview',
                ] as const
            ).map((size) => (
                <figure
                    key={size}
                    style={{
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gpx(8),
                        alignItems: 'center',
                    }}
                >
                    <ItemCard
                        size={size}
                        name={size}
                        rarity="a"
                        level={size === 'reward' ? undefined : 60}
                        count={size === 'reward' ? 300 : undefined}
                        art={<ItemImage id="502" alt="" />}
                    />
                    <figcaption style={caption}>{size}</figcaption>
                </figure>
            ))}
        </div>
    ),
}

export const Static: Story = {
    name: 'Static (interactive=false)',
    args: { interactive: false },
}
