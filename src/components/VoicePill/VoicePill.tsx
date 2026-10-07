import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import type { WebSkin } from '../WebTabs'
import './VoicePill.css'

export type VoicePillTone = 'dark' | 'light'

export interface VoicePillProps
    extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'onChange'> {
    /** Voice-actor name. */
    name: ReactNode
    /** Leading caption. Default `CV:`. */
    label?: ReactNode
    /** Playing state (controlled). */
    playing?: boolean
    /** Initial playing state (uncontrolled). Default false. */
    defaultPlaying?: boolean
    onPlayingChange?: (playing: boolean) => void
    /**
     * Playback progress 0..1: fills the mic glyph bottom-up and is exposed as a progressbar.
     * When omitted the glyph is fully filled while playing and empty otherwise.
     */
    progress?: number
    /** Accessible name of the play button. Default `Play voice sample`. */
    playLabel?: string
    /** Accessible name of the progressbar. Default `Playback progress`. */
    progressLabel?: string
    /** Right-hand slot, e.g. a language toggle. */
    trailing?: ReactNode
    /** Fill colour: `web` = static `#BFDB5A`, `game` = the live `--zzz-accent`. Default `web`. */
    skin?: WebSkin
    /** `dark` (default): the dark pill. `light`: an #E8E8E8 pill with a black ring. */
    tone?: VoicePillTone
    disabled?: boolean
}

/** Microphone glyph (24×33). */
function Mic({ className }: { className: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 33"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="6"
                y="1"
                width="12"
                height="19"
                rx="6"
                fill="currentColor"
            />
            <path
                d="M2.5 14.5v1.5a9.5 9.5 0 0 0 19 0v-1.5M12 25.5v4.5M6 31h12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
        </svg>
    )
}

/**
 * Voice-sample pill: 392×57 pill with a 6 px ring, a 57 px round play button whose mic
 * glyph fills bottom-up with the playback progress, then "CV:" + the voice actor.
 */
export function VoicePill({
    name,
    label = 'CV:',
    playing: playingProp,
    defaultPlaying = false,
    onPlayingChange,
    progress,
    playLabel = 'Play voice sample',
    progressLabel = 'Playback progress',
    trailing,
    skin = 'web',
    tone = 'dark',
    disabled = false,
    className,
    style,
    ...rest
}: VoicePillProps) {
    const [playing, setPlaying] = useControllableState(
        playingProp,
        defaultPlaying,
        onPlayingChange
    )
    const pct =
        progress === undefined
            ? playing
                ? 100
                : 0
            : Math.round(Math.min(1, Math.max(0, progress)) * 100)

    return (
        <div
            className={cx('zzz-voice-pill', className)}
            data-skin={skin}
            data-tone={tone}
            data-playing={playing ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            style={
                { '--zzz-voice-progress': `${pct}%`, ...style } as CSSProperties
            }
            {...rest}
        >
            <button
                type="button"
                className="zzz-voice-pill__play zzz-focusable"
                aria-label={playLabel}
                aria-pressed={playing}
                disabled={disabled}
                onClick={() => setPlaying(!playing)}
            >
                <Mic className="zzz-voice-pill__glyph" />
                <Mic className="zzz-voice-pill__glyph zzz-voice-pill__glyph--fill" />
            </button>
            <span className="zzz-voice-pill__text">
                <span className="zzz-voice-pill__label">{label}</span>
                <span className="zzz-voice-pill__name">{name}</span>
            </span>
            {trailing != null && (
                <span className="zzz-voice-pill__trailing">{trailing}</span>
            )}
            {progress !== undefined && (
                <span
                    role="progressbar"
                    className="zzz-sr-only"
                    aria-label={progressLabel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                />
            )}
        </div>
    )
}
