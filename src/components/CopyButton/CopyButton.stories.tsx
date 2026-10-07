import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { CopyButton } from './CopyButton'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-label)',
    lineHeight: 'var(--zzz-line-height-dialog-item)',
    color: 'var(--zzz-color-text-muted)',
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: gpx(12),
                alignItems: 'flex-start',
            }}
        >
            <span style={caption}>{label}</span>
            {children}
        </div>
    )
}

/** A clipboard that always fails, simulated with getText(). */
const failing = () => Promise.reject(new Error('Clipboard blocked'))

const shareText = [
    'Daily Trivia #214  4/5',
    '🟩🟩🟥🟩🟩',
    'Streak 12 · Top 18%',
].join('\n')

const meta = {
    title: 'Data Display/CopyButton',
    component: CopyButton,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Copy-to-clipboard button built on the `Button` component',
            },
        },
    },
    args: { text: shareText },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

/** Copies a share message. Click it. */
export const Default: Story = {}

/** Labels and the leading glyph are configurable. */
export const CustomLabels: Story = {
    args: {
        children: 'Share results',
        copiedLabel: 'Link copied!',
        failedLabel: 'Could not copy',
        width: 'default',
    },
}

/** Every state, side by side (`status` forces the copied / failed look; the last one is wired to a blocked clipboard — click it). */
export const States: Story = {
    render: (args) => (
        <div
            style={{
                display: 'flex',
                gap: gpx(40),
                flexWrap: 'wrap',
                alignItems: 'flex-start',
            }}
        >
            <Row label="idle">
                <CopyButton {...args} />
            </Row>
            <Row label="pressed">
                <CopyButton {...args} pressed />
            </Row>
            <Row label="copied">
                <CopyButton {...args} status="copied" />
            </Row>
            <Row label="failed">
                <CopyButton {...args} status="failed" />
            </Row>
            <Row label="click → failed">
                <CopyButton {...args} getText={failing} />
            </Row>
            <Row label="disabled">
                <CopyButton {...args} disabled />
            </Row>
            <Row label="no idle glyph">
                <CopyButton {...args} icon={null} />
            </Row>
        </div>
    ),
}

/** `sm` / `md` / `lg` (46 / 57 / 69 design units ≈ 32 / 40 / 48 px at the default scale), idle and copied. */
export const Sizes: Story = {
    render: (args) => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: gpx(24),
                alignItems: 'flex-start',
            }}
        >
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <Row key={size} label={size}>
                    <div
                        style={{
                            display: 'flex',
                            gap: gpx(24),
                            alignItems: 'center',
                        }}
                    >
                        <CopyButton {...args} size={size} />
                        <CopyButton {...args} size={size} status="copied" />
                        <CopyButton {...args} size={size} pressed />
                    </div>
                </Row>
            ))}
        </div>
    ),
}

/** Phone width (390 px, default web scale): a full-width `lg` share button (48 px tap target) under a results card. */
export const Phone390: Story = {
    render: (args) => (
        <div
            className="zzz-theme zzz-bg-hatch"
            style={
                {
                    width: 390,
                    padding: 16,
                    borderRadius: 12,
                    display: 'grid',
                    gap: 16,
                } as CSSProperties
            }
        >
            <pre
                style={{
                    margin: 0,
                    padding: gpx(20),
                    borderRadius: gpx(14),
                    background: 'var(--zzz-color-surface-stat-row)',
                    fontFamily: 'inherit',
                    fontSize: 'var(--zzz-font-size-body)',
                    lineHeight: 'var(--zzz-line-height-paragraph)',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {shareText}
            </pre>
            <CopyButton {...args} size="lg" style={{ width: '100%' }}>
                Copy results
            </CopyButton>
        </div>
    ),
}

/** Desktop width (1280 px, default web scale): share row under a results line. */
export const Desktop1280: Story = {
    parameters: { layout: 'fullscreen' },
    render: (args) => (
        <div
            className="zzz-theme"
            style={{
                width: 1280,
                padding: 32,
                display: 'flex',
                gap: 24,
                alignItems: 'center',
            }}
        >
            <span
                style={{
                    fontSize: 'var(--zzz-font-size-title)',
                    lineHeight: 'var(--zzz-line-height-single)',
                    marginRight: 'auto',
                }}
            >
                Daily Trivia #214 — 4/5
            </span>
            <CopyButton {...args}>Copy results</CopyButton>
            <CopyButton
                text="https://example.com/trivia/214"
                copiedLabel="Link copied"
            >
                Copy link
            </CopyButton>
        </div>
    ),
}
