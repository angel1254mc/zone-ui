import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ItemImage, WEngineImage } from '../../../examples/art'
import { CheckIcon, CloseIcon } from '../../icons'
import { Button } from '../Button'
import { HatchBackground } from '../Backgrounds'
import { ItemCard } from '../ItemCard'
import { RewardTile, RewardTileGroup } from '../RewardTile'
import { Stage } from '../Stage'
import { ConfirmDialog } from './ConfirmDialog'
import { DialogBand } from './DialogBand'
import { DialogBackdrop } from './DialogBackdrop'
import { RewardDialog } from './RewardDialog'

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`
const caption: CSSProperties = {
    fontSize: 'var(--zzz-font-size-micro)',
    lineHeight: 'var(--zzz-line-height-single)',
    color: 'var(--zzz-color-text-muted)',
}

const W = 1920
const H = 1080
const RARITIES = [
    's',
    'a',
    'a',
    'b',
    'a',
    's',
    'b',
    'a',
    'b',
    'b',
    'a',
    'b',
    's',
] as const
/** Real W-Engine ids per rank, so a card's rarity frame matches its engine. */
const ENGINE_IDS = {
    s: ['14102', '14104', '14105', '14107', '14109', '14110', '14114', '14116'],
    a: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008'],
    b: ['12001', '12002', '12003', '12004', '12005', '12006', '12007', '12008'],
} as const
const engineId = (r: 's' | 'a' | 'b', n: number) =>
    ENGINE_IDS[r][n % ENGINE_IDS[r].length]

/** A stand-in Storage page behind the band (hatch + two rows of W-Engine cards + a lime tab). */
function PageMock() {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                background: '#000',
            }}
        >
            <HatchBackground />
            <div
                style={{
                    position: 'absolute',
                    left: gpx(1600),
                    top: gpx(22),
                    width: gpx(260),
                    height: gpx(59),
                    borderRadius: gpx(30),
                    background: 'var(--zzz-accent)',
                }}
            />
            {[0, 1].map((row) => (
                <div
                    key={row}
                    style={{
                        position: 'absolute',
                        left: gpx(140),
                        top: gpx(135 + row * 170),
                        display: 'flex',
                        gap: gpx(17),
                    }}
                >
                    {RARITIES.map((r, i) => (
                        <ItemCard
                            key={i}
                            rarity={r}
                            level={60}
                            stars={1}
                            art={
                                <WEngineImage
                                    id={engineId(r, row * 13 + i)}
                                    alt=""
                                />
                            }
                            interactive={false}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

/**
 * A 1920 × 1080 Stage scaled to the story width, with a mock page, handing its layer element to the overlay as
 * `container`, so the overlay stays inside the story (the docs page is never made inert).
 */
function GameCanvas({
    children,
}: {
    children: (container: HTMLElement | null) => ReactNode
}) {
    const [el, setEl] = useState<HTMLDivElement | null>(null)
    const inner = (
        <div
            ref={setEl}
            style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
        >
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

const materials = (
    <RewardTileGroup aria-label="Materials">
        <RewardTile
            name="Battery Charge"
            count={300}
            rarity="a"
            art={<ItemImage id="501" alt="" />}
        />
        <RewardTile
            name="Prepaid Power Card"
            count={5}
            rarity="a"
            art={<ItemImage id="511" alt="" />}
        />
        <RewardTile
            name="Denny"
            count={500}
            rarity="b"
            art={<ItemImage id="10" alt="" />}
        />
    </RewardTileGroup>
)

const meta = {
    title: 'Overlays/DialogBand',
    component: DialogBand,
    tags: ['autodocs'],
    args: {
        title: 'Use these materials to craft 5 Ether Battery?',
        open: true,
        onOpenChange: () => {},
    },
    argTypes: {
        children: { control: false },
        actions: { control: false },
        container: { control: false },
        initialFocus: { control: false },
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'An internal band element used primarily within the `Dialog` component. Lays out the children of the Dialog and enforces the background.',
            },
        },
    },
    render: (args) => (
        <GameCanvas>
            {(c) => (
                <DialogBand
                    {...args}
                    container={c}
                    actions={
                        <>
                            <Button
                                width="dialog"
                                icon={<CloseIcon />}
                                iconTone="cancel"
                            >
                                Cancel
                            </Button>
                            <Button
                                width="dialog"
                                icon={<CheckIcon />}
                                iconTone="confirm"
                            >
                                Confirm
                            </Button>
                        </>
                    }
                >
                    {materials}
                </DialogBand>
            )}
        </GameCanvas>
    ),
} satisfies Meta<typeof DialogBand>

export default meta
type Story = StoryObj<typeof meta>

/** "Use these materials to craft 5 Ether Battery?" with the three material tiles. */
export const Confirm: Story = {
    render: (args) => (
        <GameCanvas>
            {(c) => (
                <ConfirmDialog
                    title={args.title}
                    open
                    onOpenChange={() => {}}
                    onConfirm={() => {}}
                    container={c}
                >
                    {materials}
                </ConfirmDialog>
            )}
        </GameCanvas>
    ),
}

/** "Obtained" + one tile + a single Confirm. */
export const Obtained: Story = {
    render: () => (
        <GameCanvas>
            {(c) => (
                <RewardDialog
                    open
                    onOpenChange={() => {}}
                    container={c}
                    items={[
                        {
                            name: 'Ether Battery',
                            count: 5,
                            rarity: 'a',
                            art: <ItemImage id="502" alt="" />,
                        },
                    ]}
                />
            )}
        </GameCanvas>
    ),
}

/** Confirm held down: full accent fill, no growth (`pressOutset` 0), ring and disc gone. */
export const ConfirmPressed: Story = {
    render: (args) => (
        <GameCanvas>
            {(c) => (
                <DialogBand
                    {...args}
                    container={c}
                    actions={
                        <>
                            <Button
                                width="dialog"
                                icon={<CloseIcon />}
                                iconTone="cancel"
                            >
                                Cancel
                            </Button>
                            <Button
                                width="dialog"
                                icon={<CheckIcon />}
                                iconTone="confirm"
                                pressed
                            >
                                Confirm
                            </Button>
                        </>
                    }
                >
                    {materials}
                </DialogBand>
            )}
        </GameCanvas>
    ),
}

export const TitleOnly: Story = {
    name: 'Title only (no content)',
    args: { title: 'Discard unsaved changes?' },
    render: (args) => (
        <GameCanvas>
            {(c) => (
                <ConfirmDialog
                    title={args.title}
                    open
                    onOpenChange={() => {}}
                    onConfirm={() => {}}
                    container={c}
                />
            )}
        </GameCanvas>
    ),
}

export const NoWatermark: Story = {
    args: { watermark: false },
}

/** Confirm disabled (e.g. not enough materials): label grey, shape unchanged; focus starts on Cancel. */
export const ConfirmDisabled: Story = {
    render: (args) => (
        <GameCanvas>
            {(c) => (
                <ConfirmDialog
                    title={args.title}
                    open
                    onOpenChange={() => {}}
                    onConfirm={() => {}}
                    confirmDisabled
                    container={c}
                >
                    {materials}
                </ConfirmDialog>
            )}
        </GameCanvas>
    ),
}

/** Click to open / close and watch the motion (band pop + flash; close fade; optional pixelate freeze). */
export const Motion: Story = {
    render: () => {
        function Demo() {
            const [open, setOpen] = useState(false)
            const [pixelate, setPixelate] = useState(false)
            return (
                <GameCanvas>
                    {(c) => (
                        <>
                            <div
                                style={{
                                    position: 'absolute',
                                    left: gpx(66),
                                    bottom: gpx(30),
                                    display: 'flex',
                                    gap: gpx(20),
                                    zIndex: 1,
                                }}
                            >
                                <Button onClick={() => setOpen(true)}>
                                    Craft
                                </Button>
                                <Button
                                    onClick={() => setPixelate((p) => !p)}
                                    icon={pixelate ? <CheckIcon /> : undefined}
                                    iconTone="confirm"
                                >
                                    Pixelate
                                </Button>
                            </div>
                            <ConfirmDialog
                                title="Use these materials to craft 5 Ether Battery?"
                                open={open}
                                onOpenChange={setOpen}
                                onConfirm={() => {}}
                                pixelate={pixelate}
                                container={c}
                            >
                                {materials}
                            </ConfirmDialog>
                        </>
                    )}
                </GameCanvas>
            )
        }
        return <Demo />
    },
}

/** Default behaviour: a fixed layer portalled to `<body>` (the whole preview becomes inert while open). */
export const Portal: Story = {
    render: () => {
        function Demo() {
            const [open, setOpen] = useState(false)
            const [done, setDone] = useState<string>('')
            return (
                <div
                    style={{
                        padding: gpx(40),
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gpx(20),
                        alignItems: 'flex-start',
                    }}
                >
                    <Button onClick={() => setOpen(true)}>Open dialog</Button>
                    <span style={caption}>{done || 'Closed'}</span>
                    <ConfirmDialog
                        title="Recycle 3 W-Engines?"
                        open={open}
                        onOpenChange={setOpen}
                        onConfirm={() => setDone('Confirmed')}
                        onCancel={() => setDone('Cancelled')}
                    />
                </div>
            )
        }
        return <Demo />
    },
}

/** The backdrop on its own over the mock page (blur 13 + stripes). */
export const Backdrop: Story = {
    render: () => <GameCanvas>{() => <DialogBackdrop />}</GameCanvas>,
}
