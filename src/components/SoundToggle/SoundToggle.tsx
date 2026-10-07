import { useEffect, useId, useRef } from 'react'
import type {
    ComponentPropsWithRef,
    CSSProperties,
    KeyboardEvent,
    MouseEvent,
    PointerEvent,
} from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import {
    IconButton,
    type IconButtonProps,
    type IconButtonSize,
} from '../IconButton'
import { Slider } from '../Slider'
import { SpeakerIcon, SpeakerLowIcon, SpeakerMutedIcon } from './icons'
import './SoundToggle.css'

/**
 * Where the volume slider lives: none, next to the button, or in a popover. The popover opens on hover, on
 * keyboard focus, on a touch long-press of the button, or through `popoverOpen`. On touch-first layouts
 * prefer `inline` (always reachable) or drive `popoverOpen` from your own trigger.
 */
export type SoundToggleVolumeControl = 'none' | 'inline' | 'popover'

export interface SoundToggleProps
    extends Omit<
        ComponentPropsWithRef<'div'>,
        'onChange' | 'defaultValue' | 'onVolumeChange'
    > {
    /** Muted (controlled). The button is `aria-pressed` while muted. */
    muted?: boolean
    /** Initial muted state (uncontrolled). Default false. */
    defaultMuted?: boolean
    onMutedChange?(muted: boolean): void
    /** Volume 0–1 (controlled), the scale of `HTMLMediaElement.volume`. */
    volume?: number
    /** Initial volume (uncontrolled). Default 1. */
    defaultVolume?: number
    onVolumeChange?(volume: number): void
    /** Default `none` (mute button only). */
    volumeControl?: SoundToggleVolumeControl
    /**
     * Popover open state (controlled). Maps to `data-open` on the root; hover and keyboard focus still open it
     * visually on top of this. Only used with `volumeControl="popover"`.
     */
    popoverOpen?: boolean
    /** Initial popover open state (uncontrolled). Default false. */
    defaultPopoverOpen?: boolean
    /**
     * Called when the popover asks to open or close: a touch long-press of the button opens it (without
     * toggling mute); Escape or a pointer-down outside closes it (except on an element whose `aria-controls`
     * names `popoverId` — your own trigger).
     */
    onPopoverOpenChange?(open: boolean): void
    /**
     * `id` of the popover element (default: generated). Give your own popover trigger
     * `aria-controls={popoverId}`: a pointer-down on an element that controls the popover is not treated as an
     * outside dismiss, so the trigger can toggle it closed again.
     */
    popoverId?: string
    /** Touch long-press delay in ms that opens the popover. Default 450. */
    longPressDelay?: number
    /** Popover side. Default `bottom`. */
    popoverPlacement?: 'top' | 'bottom'
    /** Accessible name of the mute button (a toggle: pressed = muted). Default "Mute". */
    label?: string
    /** Accessible name of the volume slider. Default "Volume". */
    volumeLabel?: string
    /** Volume step for arrows / snapping. Default 0.05. */
    step?: number
    /** Slider track width in design units. Default 240. */
    sliderWidth?: number
    /**
     * Mute-button size: the shared control scale `sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at
     * the default scale; the button-to-slider gap follows it), or an IconButton preset size. Default `md`.
     */
    size?: IconButtonSize
    disabled?: boolean
    /** Extra props for the mute button. */
    buttonProps?: Omit<
        IconButtonProps,
        'icon' | 'label' | 'toggle' | 'pressedState' | 'onPressedStateChange'
    >
}

const pct = (v: number) => `${Math.round(v * 100)}%`

/**
 * Sound on/off toggle with an optional volume slider. The mute button
 * is the round pill IconButton with original speaker glyphs (muted / low / on); it is a toggle button
 * (`aria-pressed` = muted). The slider (`role="slider"`, labelled "Volume", value text "50%") sits inline
 * or in a popover that opens on hover, on keyboard focus, on a touch long-press of the button (which does not
 * toggle mute), or via `popoverOpen` / `defaultPopoverOpen` / `onPopoverOpenChange`; Escape or a pointer-down
 * outside closes it. An external trigger should set `aria-controls={popoverId}` so it can toggle it closed.
 * Fully controlled or uncontrolled; it plays no audio itself — wire `muted` / `volume` to your audio layer. Moving the slider while muted un-mutes.
 */
export function SoundToggle({
    muted: mutedProp,
    defaultMuted = false,
    onMutedChange,
    volume: volumeProp,
    defaultVolume = 1,
    onVolumeChange,
    volumeControl = 'none',
    popoverOpen: popoverOpenProp,
    defaultPopoverOpen = false,
    onPopoverOpenChange,
    popoverId: popoverIdProp,
    longPressDelay = 450,
    popoverPlacement = 'bottom',
    label = 'Mute',
    volumeLabel = 'Volume',
    step = 0.05,
    sliderWidth = 240,
    size = 'md',
    disabled = false,
    buttonProps,
    className,
    style,
    ref,
    ...rest
}: SoundToggleProps) {
    const [muted, setMuted] = useControllableState(
        mutedProp,
        defaultMuted,
        onMutedChange
    )
    const [volume, setVolume] = useControllableState(
        volumeProp,
        defaultVolume,
        onVolumeChange
    )
    const silent = muted || volume <= 0
    const icon = silent ? (
        <SpeakerMutedIcon />
    ) : volume < 0.5 ? (
        <SpeakerLowIcon />
    ) : (
        <SpeakerIcon />
    )

    const isPopover = volumeControl === 'popover'
    const [popoverOpenState, setPopoverOpen] = useControllableState(
        popoverOpenProp,
        defaultPopoverOpen,
        onPopoverOpenChange
    )
    const open = isPopover && popoverOpenState && !disabled
    const autoId = useId()
    const popoverId = popoverIdProp ?? `zzz-sound-toggle-popover-${autoId}`

    const rootRef = useRef<HTMLDivElement | null>(null)
    const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined
    )
    const swallowClick = useRef(false)
    const clearPress = () => {
        if (pressTimer.current !== undefined) clearTimeout(pressTimer.current)
        pressTimer.current = undefined
    }
    useEffect(() => clearPress, [])

    // Close on a pointer-down outside while open.
    useEffect(() => {
        if (!open) return
        const onDown = (e: Event) => {
            const node = rootRef.current
            if (node && e.target instanceof Node && node.contains(e.target))
                return
            // An external trigger (aria-controls = popoverId) toggles the popover itself; closing here would let
            // its click re-open it.
            for (
                let el = e.target instanceof Element ? e.target : null;
                el;
                el = el.parentElement
            ) {
                if (
                    (el.getAttribute('aria-controls') ?? '')
                        .split(/\s+/)
                        .includes(popoverId)
                )
                    return
            }
            setPopoverOpen(false)
        }
        document.addEventListener('pointerdown', onDown)
        return () => document.removeEventListener('pointerdown', onDown)
    }, [open, setPopoverOpen, popoverId])

    const onButtonPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        swallowClick.current = false
        if (!isPopover || disabled || e.pointerType === 'mouse') return
        if (
            !(e.target instanceof Element) ||
            !e.target.closest('.zzz-sound-toggle__button')
        )
            return
        clearPress()
        pressTimer.current = setTimeout(() => {
            pressTimer.current = undefined
            swallowClick.current = true
            setPopoverOpen(true)
        }, longPressDelay)
    }

    const changeVolume = (v: number) => {
        setVolume(v)
        if (muted && v > 0) setMuted(false)
    }

    const slider =
        volumeControl === 'none' ? null : (
            <Slider
                className="zzz-sound-toggle__slider"
                min={0}
                max={1}
                step={step}
                value={Math.min(1, Math.max(0, volume))}
                onValueChange={changeVolume}
                showSteppers={false}
                showBounds={false}
                width={sliderWidth}
                disabled={disabled}
                aria-label={volumeLabel}
                getValueText={(v) => (muted ? `${pct(v)}, muted` : pct(v))}
            />
        )

    return (
        <div
            {...rest}
            ref={mergeRefs(ref, rootRef)}
            onPointerDown={(e) => {
                rest.onPointerDown?.(e)
                onButtonPointerDown(e)
            }}
            onPointerUp={(e) => {
                rest.onPointerUp?.(e)
                clearPress()
            }}
            onPointerCancel={(e) => {
                rest.onPointerCancel?.(e)
                clearPress()
            }}
            onPointerLeave={(e) => {
                rest.onPointerLeave?.(e)
                clearPress()
            }}
            onClickCapture={(e: MouseEvent<HTMLDivElement>) => {
                rest.onClickCapture?.(e)
                if (swallowClick.current) {
                    // The click that ends a long-press must not toggle mute.
                    swallowClick.current = false
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
            onContextMenu={(e) => {
                rest.onContextMenu?.(e)
                // Long-press on touch fires contextmenu (Android) — keep the browser menu away from the button.
                if (isPopover && swallowClick.current) e.preventDefault()
            }}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                rest.onKeyDown?.(e)
                if (open && e.key === 'Escape' && !e.defaultPrevented) {
                    e.preventDefault()
                    setPopoverOpen(false)
                }
            }}
            className={cx(
                'zzz-sound-toggle',
                `zzz-sound-toggle--${volumeControl}`,
                className
            )}
            style={style as CSSProperties}
            data-size={size}
            data-muted={muted ? '' : undefined}
            data-placement={isPopover ? popoverPlacement : undefined}
            data-open={open ? '' : undefined}
        >
            <IconButton
                {...buttonProps}
                icon={icon}
                label={label}
                size={size}
                toggle
                pressedState={muted}
                onPressedStateChange={setMuted}
                disabled={disabled}
                className={cx(
                    'zzz-sound-toggle__button',
                    buttonProps?.className
                )}
            />
            {volumeControl === 'popover' ? (
                <div
                    id={popoverId}
                    className="zzz-sound-toggle__popover zzz-mat-panel"
                >
                    {slider}
                </div>
            ) : (
                slider
            )}
        </div>
    )
}
