import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { WebTabs } from './WebTabs'
import type { WebTabsItem } from './WebTabs'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-label)',
    lineHeight: 'var(--zzz-line-height-dialog-item)',
    color: 'var(--zzz-color-text-muted)',
}
/** A light news-page background. */
const lightPage: CSSProperties = {
    background: '#EFEFEF',
    padding: gpx(13),
    width: 'fit-content',
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(12) }}>
            <span style={caption}>{label}</span>
            {children}
        </div>
    )
}

const news: WebTabsItem[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'news', label: 'News' },
    { value: 'notices', label: 'Notices' },
    { value: 'events', label: 'Events' },
]

const meta = {
    title: 'Forms/WebTabs',
    component: WebTabs,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Section tabs for web pages.',
            },
        },
    },
    args: {
        items: news,
        defaultValue: 'latest',
        'aria-label': 'News categories',
    },
} satisfies Meta<typeof WebTabs>

export default meta
type Story = StoryObj<typeof meta>

/** Web skin on the dark theme. */
export const Default: Story = {}

/** Web skin on a light page. */
export const OnLightPage: Story = {
    render: (args) => (
        <div style={lightPage}>
            <WebTabs {...args} />
        </div>
    ),
}

/** The game skin: dark mesh pill, accent chip, 26.5° slant. */
export const GameSkin: Story = { args: { skin: 'game' } }

/** Each item active (web and game skin). */
export const Positions: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
            {news.map((item) => (
                <Row key={item.value} label={`${item.value} active`}>
                    <div style={{ display: 'flex', gap: gpx(24) }}>
                        <WebTabs
                            aria-label="News categories"
                            items={news}
                            value={item.value}
                        />
                        <WebTabs
                            aria-label="News categories"
                            items={news}
                            value={item.value}
                            skin="game"
                        />
                    </div>
                </Row>
            ))}
        </div>
    ),
}

/** Disabled item: label turns `color.text.disabled`; shape unchanged. Game skin: forced pressed on "News". */
export const States: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
            <Row label="web — Events disabled">
                <WebTabs
                    aria-label="News categories"
                    items={news.map((i) =>
                        i.value === 'events' ? { ...i, disabled: true } : i
                    )}
                    defaultValue="latest"
                />
            </Row>
            <Row label="game — Events disabled">
                <WebTabs
                    skin="game"
                    aria-label="News categories"
                    items={news.map((i) =>
                        i.value === 'events' ? { ...i, disabled: true } : i
                    )}
                    defaultValue="latest"
                />
            </Row>
            <Row label="game — News held (pressed)">
                <WebTabs
                    skin="game"
                    aria-label="News categories"
                    items={news}
                    defaultValue="latest"
                    pressed="news"
                />
            </Row>
        </div>
    ),
}

/** Controlled, with the selected value echoed. */
export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState('notices')
        return (
            <Row label={`value: ${value}`}>
                <WebTabs
                    aria-label="News categories"
                    items={news}
                    value={value}
                    onValueChange={setValue}
                />
            </Row>
        )
    },
}

const SIZES = ['sm', 'md', 'lg'] as const

/** sm / md / lg at the default scale, both skins (skew angles do not change with size). */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
            {SIZES.map((size) => (
                <Row key={size} label={`size="${size}" (web / game skin)`}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: gpx(16),
                        }}
                    >
                        <WebTabs
                            aria-label={`News (${size}, web)`}
                            items={news}
                            defaultValue="news"
                            size={size}
                        />
                        <WebTabs
                            aria-label={`News (${size}, game)`}
                            items={news}
                            defaultValue="news"
                            skin="game"
                            size={size}
                        />
                    </div>
                </Row>
            ))}
        </div>
    ),
}
