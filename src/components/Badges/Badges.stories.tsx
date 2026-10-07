import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { NewBadge } from './NewBadge'
import { PlusBadge } from './PlusBadge'
import { RankCoin } from './RankCoin'
import { RankBadge } from './RankBadge'
import { CombatBadge } from './CombatBadge'
import { SlotHexBadge } from './SlotHexBadge'
import { StatusCheck } from './StatusCheck'
import { RecommendBadge } from './RecommendBadge'
import {
    BatteryIcon,
    HourglassIcon,
    TargetLoopIcon,
    StorageIcon,
} from '../../icons'
import { DriveDiscImage } from '../../../examples/art'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-micro)',
    lineHeight: 'var(--zzz-line-height-single)',
    color: 'var(--zzz-color-text-muted)',
}

const meta = {
    title: 'Primitives/Badges',
    component: NewBadge,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Small indicators that get carried on the corners of other larger components. E.g. a "New!" badge.',
            },
        },
    },
} satisfies Meta<typeof NewBadge>

export default meta
type Story = StoryObj<typeof meta>

function Cell({
    label,
    children,
    style,
}: {
    label: ReactNode
    children: ReactNode
    style?: CSSProperties
}) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: gpx(12),
                ...style,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: gpx(16),
                    minHeight: gpx(48),
                }}
            >
                {children}
            </div>
            <span style={caption}>{label}</span>
        </div>
    )
}

const row: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: gpx(48),
}

/** A dark host box (e.g. a dock icon cell or list icon) that corner badges hang on. */
function Host({
    w,
    h,
    children,
    style,
}: {
    w: number
    h: number
    children?: ReactNode
    style?: CSSProperties
}) {
    return (
        <div
            style={{
                position: 'relative',
                width: gpx(w),
                height: gpx(h),
                borderRadius: gpx(6),
                background: 'var(--zzz-color-surface-dock-icon-band-top)',
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

export const NewBadges: Story = {
    render: () => (
        <div style={row}>
            <Cell label="md (17.5) inline">
                <NewBadge placement="inline" />
            </Cell>
            <Cell label="sm (15) inline">
                <NewBadge placement="inline" size="sm" />
            </Cell>
            <Cell label="top-right on a dock cell">
                <Host w={96} h={96}>
                    <StorageIcon size={56} />
                    <NewBadge />
                </Host>
            </Cell>
            <Cell label="top-left, offset [12, 10]">
                <Host w={96} h={96}>
                    <StorageIcon size={56} />
                    <NewBadge placement="top-left" offset={[12, 10]} />
                </Host>
            </Cell>
        </div>
    ),
}

export const PlusBadges: Story = {
    render: () => (
        <div style={row}>
            <Cell label="default">
                <PlusBadge label="Get more Battery Charge" />
            </Cell>
            <Cell label="pressed (forced)">
                <PlusBadge label="Get more" data-pressed="" />
            </Cell>
            <Cell label="disabled">
                <PlusBadge label="Get more" disabled />
            </Cell>
            <Cell label="on a currency icon">
                <span
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: gpx(44),
                        height: gpx(52),
                    }}
                >
                    <BatteryIcon size={44} style={{ color: '#3E8BF0' }} />
                    <PlusBadge
                        label="Get more Battery Charge"
                        style={{
                            position: 'absolute',
                            right: gpx(-4),
                            bottom: gpx(2),
                        }}
                    />
                </span>
            </Cell>
        </div>
    ),
}

export const RankCoins: Story = {
    render: () => (
        <div style={row}>
            <Cell label="S (30)">
                <RankCoin rank="S" />
            </Cell>
            <Cell label="A (30)">
                <RankCoin rank="A" />
            </Cell>
            <Cell label="B">
                <RankCoin rank="B" />
            </Cell>
            <Cell label="size 29 / 60">
                <RankCoin rank="S" size={29} />
                <RankCoin rank="S" size={60} />
                <RankCoin rank="A" size={60} />
            </Cell>
        </div>
    ),
}

export const RankBadges: Story = {
    render: () => (
        <div style={row}>
            <Cell label="S">
                <RankBadge rank="S" />
            </Cell>
            <Cell label="A">
                <RankBadge rank="A" />
            </Cell>
            <Cell label="∞">
                <RankBadge rank="infinity" />
            </Cell>
            <Cell label="size 74">
                <RankBadge rank="S" size={74} />
            </Cell>
        </div>
    ),
}

export const CombatBadges: Story = {
    render: () => (
        <div style={row}>
            <Cell label="40">
                <CombatBadge />
            </Cell>
            <Cell label="80">
                <CombatBadge size={80} />
            </Cell>
        </div>
    ),
}

export const SlotHexBadges: Story = {
    render: () => (
        <div style={row}>
            <Cell label="slots 1–6">
                {([1, 2, 3, 4, 5, 6] as const).map((s) => (
                    <SlotHexBadge key={s} slot={s} />
                ))}
            </Cell>
            <Cell label="top-left on a drive-disc card">
                <div
                    style={{
                        position: 'relative',
                        width: gpx(118),
                        height: gpx(118),
                        boxSizing: 'border-box',
                        border: `${gpx(4)} solid #414040`,
                        borderRadius: gpx(14),
                        background: 'var(--zzz-color-rarity-s)',
                        overflow: 'visible',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: `0 0 ${gpx(16)} 0`,
                            background: '#000',
                            borderRadius: `0 0 ${gpx(8)} ${gpx(8)}`,
                            overflow: 'hidden',
                        }}
                    >
                        <DriveDiscImage
                            seed={2}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                    <SlotHexBadge slot={2} placement="top-left" />
                </div>
            </Cell>
        </div>
    ),
}

/** An Events-list row icon with the corner badges. */
function EventRow({
    icon,
    badge,
    title,
}: {
    icon: ReactNode
    badge: ReactNode
    title: string
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: gpx(14),
                padding: `${gpx(10)} ${gpx(16)}`,
                background: '#1F1F1F',
                width: gpx(300),
            }}
        >
            <span
                style={{
                    position: 'relative',
                    display: 'inline-grid',
                    placeItems: 'center',
                    width: gpx(34),
                    height: gpx(34),
                    color: '#FFFFFF',
                }}
            >
                {icon}
                {badge}
            </span>
            <span
                className="zzz-italic"
                style={{
                    fontSize: 'var(--zzz-font-size-body)',
                    lineHeight: 'var(--zzz-line-height-single)',
                }}
            >
                {title}
            </span>
        </div>
    )
}

export const StatusAndRecommend: Story = {
    render: () => (
        <div style={row}>
            <Cell label="StatusCheck / RecommendBadge inline">
                <StatusCheck />
                <RecommendBadge />
            </Cell>
            <Cell label="on Events-list icons (top-left)">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gpx(4),
                    }}
                >
                    <EventRow
                        icon={<TargetLoopIcon size={30} />}
                        badge={<RecommendBadge placement="top-left" />}
                        title="Phaethon's Story"
                    />
                    <EventRow
                        icon={<HourglassIcon size={30} />}
                        badge={<StatusCheck placement="top-left" />}
                        title="Pinball Knight!"
                    />
                </div>
            </Cell>
        </div>
    ),
}
