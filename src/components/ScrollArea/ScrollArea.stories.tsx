import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, type CSSProperties } from 'react'
import { ItemImage, STORY_ITEMS } from '../../../examples/art'
import { ItemCard } from '../ItemCard'
import { ScrollHint } from '../ScrollHint'
import { ScrollArea } from './ScrollArea'
import './scrollbar.css'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-micro)',
    lineHeight: 'var(--zzz-line-height-single)',
    color: 'var(--zzz-color-text-muted)',
}

function Rows({ n, prefix = 'Row' }: { n: number; prefix?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
            {Array.from({ length: n }, (_, i) => (
                <div
                    key={i}
                    style={{
                        height: gpx(41),
                        display: 'flex',
                        alignItems: 'center',
                        padding: `0 ${gpx(16)}`,
                        borderRadius: gpx(21),
                        background: 'var(--zzz-color-surface-stat-row)',
                        fontSize: 'var(--zzz-font-size-body)',
                        lineHeight: 'var(--zzz-line-height-single)',
                    }}
                >
                    {prefix} {i + 1}
                </div>
            ))}
        </div>
    )
}

/** Material tiles (ItemCard 110, real items cycled from STORY_ITEMS) at a 128.7 × 169 pitch. */
function Tiles({ n, columns }: { n: number; columns: number }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, ${gpx(110)})`,
                columnGap: gpx(18.7),
                rowGap: gpx(20),
                padding: `${gpx(8)} ${gpx(4)}`,
            }}
        >
            {Array.from({ length: n }, (_, i) => {
                const item = STORY_ITEMS[i % STORY_ITEMS.length]
                return (
                    <ItemCard
                        key={i}
                        interactive={false}
                        size="material"
                        name={item.name}
                        rarity={item.rarity}
                        count={(i * 37) % 240}
                        art={<ItemImage id={item.id} alt="" />}
                    />
                )
            })}
        </div>
    )
}

function Strip({ n, pitch = 107 }: { n: number; pitch?: number }) {
    return (
        <div
            style={{
                display: 'flex',
                gap: gpx(pitch - 87),
                padding: `${gpx(4)} ${gpx(4)}`,
                width: 'max-content',
            }}
        >
            {Array.from({ length: n }, (_, i) => {
                const item = STORY_ITEMS[(i * 3) % STORY_ITEMS.length]
                return (
                    <ItemCard
                        key={i}
                        interactive={false}
                        size="preview"
                        caption={false}
                        name={item.name}
                        rarity={item.rarity}
                        art={<ItemImage id={item.id} alt="" />}
                    />
                )
            })}
        </div>
    )
}

const meta = {
    title: 'Primitives/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
    args: { side: 'right', label: 'Items' },
    argTypes: {
        orientation: {
            control: 'inline-radio',
            options: ['vertical', 'horizontal', 'both'],
        },
        side: {
            control: 'inline-radio',
            options: ['left', 'right', 'top', 'bottom'],
        },
        horizontalSide: { control: 'inline-radio', options: ['top', 'bottom'] },
        variant: {
            control: 'inline-radio',
            options: ['grid', 'panel', 'list'],
        },
        alwaysShow: { control: 'boolean' },
        hint: { control: 'boolean' },
        gap: { control: 'number' },
        step: { control: 'number' },
        minThumb: { control: 'number' },
    },
    render: (args) => (
        <ScrollArea {...args} style={{ height: gpx(400), width: gpx(460) }}>
            <Rows n={20} />
        </ScrollArea>
    ),
    decorators: [
        (Story, ctx) =>
            ctx.name.startsWith('Native') ? (
                <Story />
            ) : (
                <div style={{ padding: gpx(24), background: '#141414' }}>
                    <Story />
                </div>
            ),
    ],
    parameters: {
        docs: {
            description: {
                component: 'Simple scrollbar component',
            },
        },
    },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/** Bar right of the content, 34 px gap. */
export const Right: Story = {}
/** Bar left of the content, 14 px gap. */
export const Left: Story = { args: { side: 'left' } }
/** Content fits: the bar stays and the thumb fills the whole run. */
export const ContentFits: Story = {
    render: (args) => (
        <ScrollArea
            {...args}
            side="left"
            style={{ height: gpx(400), width: gpx(460) }}
        >
            <Rows n={4} />
        </ScrollArea>
    ),
}
/** `alwaysShow={false}`: the bar disappears when nothing overflows. */
export const HiddenWhenFits: Story = {
    args: { alwaysShow: false },
    render: (args) => (
        <div style={{ display: 'flex', gap: gpx(40) }}>
            <ScrollArea
                {...args}
                label="Short"
                style={{ height: gpx(300), width: gpx(360) }}
            >
                <Rows n={3} />
            </ScrollArea>
            <ScrollArea
                {...args}
                label="Long"
                style={{ height: gpx(300), width: gpx(360) }}
            >
                <Rows n={12} />
            </ScrollArea>
        </div>
    ),
}

/** A vertical grid of material tiles (6 columns, bar right). */
export const VerticalGrid: Story = {
    args: { label: 'Materials' },
    render: (args) => (
        <ScrollArea
            {...args}
            gap={26}
            style={{ height: gpx(520), width: gpx(820) }}
        >
            <Tiles n={40} columns={6} />
        </ScrollArea>
    ),
}

/** Left vs right placement side by side. */
export const LeftVsRight: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: gpx(60) }}>
            {(['left', 'right'] as const).map((side) => (
                <figure
                    key={side}
                    style={{
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gpx(8),
                    }}
                >
                    <ScrollArea
                        side={side}
                        label={`Grid, bar ${side}`}
                        style={{ height: gpx(420), width: gpx(560) }}
                    >
                        <Tiles n={24} columns={4} />
                    </ScrollArea>
                    <figcaption style={caption}>
                        side="{side}" (default gap {side === 'left' ? 14 : 34})
                    </figcaption>
                </figure>
            ))}
        </div>
    ),
}

/** Horizontal row with the bar below (the vertical bar turned 90°). */
export const Horizontal: Story = {
    args: { orientation: 'horizontal', side: 'bottom', label: 'Rewards' },
    render: (args) => (
        <ScrollArea {...args} style={{ width: gpx(640) }}>
            <Strip n={14} />
        </ScrollArea>
    ),
}

/** Both axes: a 2-D canvas with a right and a bottom bar. */
export const Both: Story = {
    args: { orientation: 'both', label: 'Canvas' },
    render: (args) => (
        <ScrollArea {...args} style={{ height: gpx(420), width: gpx(620) }}>
            <div style={{ width: gpx(1200) }}>
                <Tiles n={60} columns={9} />
            </div>
        </ScrollArea>
    ),
}

/**
 * Detail-panel body: no bar, the clipped edge fades over 12 px and the
 * 32 × 15 ▼ sits on the clip edge while more content remains. Scroll to the end and both go away.
 */
export const PanelWithHint: Story = {
    args: { variant: 'panel', hint: true, label: 'Details' },
    render: (args) => (
        <div
            style={{
                width: gpx(460),
                padding: gpx(20),
                background: '#000',
                borderRadius: gpx(20),
                border: `${gpx(4)} solid #1F1F1F`,
            }}
        >
            <ScrollArea {...args} style={{ height: gpx(260) }}>
                <Rows n={8} prefix="Stat" />
            </ScrollArea>
        </div>
    ),
}

/** Sidebar list: no bar, hard clip, the 25 × 12.5 ▼ over the clipped last row. */
export const ListWithHint: Story = {
    args: { variant: 'list', hint: true, label: 'Events' },
    render: (args) => (
        <div style={{ width: gpx(292), background: 'rgba(20,16,18,.9)' }}>
            <ScrollArea {...args} style={{ height: gpx(300) }}>
                <Rows n={9} prefix="Event" />
            </ScrollArea>
        </div>
    ),
}

/** Reward Preview row: horizontal list, clipped at the right, the heavy white › as an interactive hint. */
export const RewardRow: Story = {
    render: () => {
        function Row() {
            const vp = useRef<HTMLDivElement | null>(null)
            return (
                <ScrollArea
                    orientation="horizontal"
                    variant="list"
                    label="Reward Preview"
                    viewportRef={vp}
                    style={{ width: gpx(680), paddingRight: gpx(40) }}
                    hint={
                        <ScrollHint
                            direction="right"
                            target={vp}
                            interactive
                            label="More rewards"
                        />
                    }
                >
                    <Strip n={10} />
                </ScrollArea>
            )
        }
        return <Row />
    },
}

/** `.zzz-scrollbar` on plain overflow containers (the native platform scrollbar, styled). */
export const NativeScrollbar: Story = {
    parameters: { layout: 'padded' },
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: gpx(40),
                padding: gpx(24),
                background: '#141414',
            }}
        >
            <figure
                style={{
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: gpx(8),
                }}
            >
                <div
                    className="zzz-scrollbar"
                    tabIndex={0}
                    aria-label="Native vertical"
                    role="region"
                    style={{
                        height: gpx(400),
                        width: gpx(460),
                        overflowY: 'auto',
                    }}
                >
                    <Rows n={20} />
                </div>
                <figcaption style={caption}>
                    {'<div class="zzz-scrollbar" style="overflow-y: auto">'}
                </figcaption>
            </figure>
            <figure
                style={{
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: gpx(8),
                }}
            >
                <div
                    className="zzz-scrollbar"
                    tabIndex={0}
                    aria-label="Native both"
                    role="region"
                    style={{
                        height: gpx(400),
                        width: gpx(460),
                        overflow: 'auto',
                    }}
                >
                    <div style={{ width: gpx(900) }}>
                        <Rows n={20} />
                    </div>
                </div>
                <figcaption style={caption}>
                    both axes; page: {'<html class="zzz-theme zzz-scrollbar">'}
                </figcaption>
            </figure>
        </div>
    ),
}

/**
 * `.zzz-scrollbar` on the page itself: this story adds the class to `<html>` while it is shown (and removes it
 * after), so the Storybook canvas scrolls with the kit bar. In an app: `<html class="zzz-theme zzz-scrollbar">`.
 */
export const NativePageScrollbar: Story = {
    parameters: { layout: 'padded' },
    render: () => {
        function Page() {
            useEffect(() => {
                const html = document.documentElement
                const had = html.classList.contains('zzz-scrollbar')
                html.classList.add('zzz-scrollbar')
                return () => {
                    if (!had) html.classList.remove('zzz-scrollbar')
                }
            }, [])
            return (
                <div
                    style={{
                        width: gpx(460),
                        padding: gpx(24),
                        background: '#141414',
                    }}
                >
                    <p style={{ ...caption, margin: `0 0 ${gpx(12)}` }}>
                        {
                            '<html class="zzz-theme zzz-scrollbar"> — scroll the page'
                        }
                    </p>
                    <Rows n={40} />
                </div>
            )
        }
        return <Page />
    },
}

/** Every prop on the controls panel. */
export const Playground: Story = {
    args: {
        orientation: 'vertical',
        variant: 'grid',
        alwaysShow: true,
        hint: false,
        minThumb: 20,
    },
    render: (args) => (
        <ScrollArea {...args} style={{ height: gpx(420), width: gpx(560) }}>
            {args.orientation === 'vertical' ? (
                <Tiles n={30} columns={4} />
            ) : args.orientation === 'horizontal' ? (
                <Strip n={12} />
            ) : (
                <div style={{ width: gpx(1000) }}>
                    <Tiles n={48} columns={7} />
                </div>
            )}
        </ScrollArea>
    ),
}
