import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Accordion, AccordionItem } from './Accordion'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    color: 'var(--zzz-color-text-muted)',
    fontSize: gpx(14),
    lineHeight: 1.2,
}
const frame: CSSProperties = { width: gpx(640), padding: gpx(12) }

function Cell({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(10) }}>
            {children}
            <span style={caption}>{label}</span>
        </div>
    )
}

const FAQ = [
    {
        value: 'wengine',
        title: 'What is a W-Engine?',
        body: 'W-Engines are weapons that Agents equip. Each one has a Base ATK, an Advanced Stat and a passive effect that grows with Overclock.',
    },
    {
        value: 'polychrome',
        title: 'How do I earn Polychrome?',
        body: 'Complete events, Commissions and Inter-Knot achievements. Some check-in plans also reward it.',
    },
    {
        value: 'drive',
        title: 'How do Drive Disc set bonuses work?',
        body: 'Equipping two discs of a set grants its 2-piece bonus; four discs add the 4-piece effect.',
    },
]

const meta = {
    title: 'Data Display/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'A disclosure list for FAQ-style web pages.',
            },
        },
    },
    args: { type: 'single', defaultValue: ['wengine'] },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => (
        <div style={frame}>
            <Accordion {...args}>
                {FAQ.map((f) => (
                    <AccordionItem
                        key={f.value}
                        value={f.value}
                        title={f.title}
                    >
                        {f.body}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    ),
}

export const Multiple: Story = {
    render: () => (
        <div style={frame}>
            <Accordion type="multiple" defaultValue={['wengine', 'drive']}>
                {FAQ.map((f) => (
                    <AccordionItem
                        key={f.value}
                        value={f.value}
                        title={f.title}
                    >
                        {f.body}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    ),
}

export const States: Story = {
    render: () => (
        <div
            style={{
                ...frame,
                display: 'flex',
                flexDirection: 'column',
                gap: gpx(26),
            }}
        >
            <Cell label="closed">
                <Accordion>
                    <AccordionItem value="a" title="Closed item">
                        hidden
                    </AccordionItem>
                </Accordion>
            </Cell>
            <Cell label="open (caret turned 180°)">
                <Accordion defaultValue={['a']}>
                    <AccordionItem value="a" title="Open item">
                        Content in body / tertiary with 12 / 28 / 8 padding.
                    </AccordionItem>
                </Accordion>
            </Cell>
            <Cell label="pressed (forced: data-pressed)">
                <Accordion>
                    <AccordionItem
                        value="a"
                        title="Pressed item"
                        pressed
                        meta="3"
                    >
                        hidden
                    </AccordionItem>
                </Accordion>
            </Cell>
            <Cell label="with meta">
                <Accordion>
                    <AccordionItem value="a" title="Skills" meta="5 / 5">
                        hidden
                    </AccordionItem>
                </Accordion>
            </Cell>
            <Cell label="disabled">
                <Accordion>
                    <AccordionItem
                        value="a"
                        title="Locked until Inter-Knot Lv. 20"
                        disabled
                    >
                        hidden
                    </AccordionItem>
                </Accordion>
            </Cell>
            <Cell label="variant plain (#222 header, muted content)">
                <Accordion variant="plain" defaultValue={['a']}>
                    <AccordionItem value="a" title="Plain variant">
                        Muted content.
                    </AccordionItem>
                </Accordion>
            </Cell>
        </div>
    ),
}

export const Controlled: Story = {
    render: function Render() {
        const [open, setOpen] = useState<string[]>([])
        return (
            <div
                style={{
                    ...frame,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: gpx(12),
                }}
            >
                <Accordion type="multiple" value={open} onValueChange={setOpen}>
                    {FAQ.map((f) => (
                        <AccordionItem
                            key={f.value}
                            value={f.value}
                            title={f.title}
                        >
                            {f.body}
                        </AccordionItem>
                    ))}
                </Accordion>
                <span style={caption}>open: {open.join(', ') || '—'}</span>
            </div>
        )
    },
}
