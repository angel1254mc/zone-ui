import { cx } from '../../utils'
import { SweepTransition, SWEEP_COLORS, SWEEP_TIMING } from '../SweepTransition'
import type { SweepTransitionProps } from '../SweepTransition'

/** Timeline (ms) of the default sweep. Same values as `SWEEP_TIMING`. */
export const INTERSTITIAL_TIMING = {
    total: SWEEP_TIMING.total,
    midpoint: SWEEP_TIMING.midpoint,
    reducedTotal: SWEEP_TIMING.reducedTotal,
    reducedMidpoint: SWEEP_TIMING.reducedMidpoint,
} as const

export interface AgentSelectInterstitialProps
    extends Omit<
        SweepTransitionProps,
        'active' | 'runKey' | 'tone' | 'label' | 'duration'
    > {
    /** Rising edge (false → true) plays the wipe once; set it back to false (e.g. in onDone) to arm it again. */
    play: boolean
    /** Band text (default "Agent Select"). */
    label?: string
    /** Tint of the chevron panels (= `SweepTransition tone="<colour>"`). Default: sage / teal / deep. */
    agentColor?: string
}

/**
 * @deprecated Use `SweepTransition` (`active` / `runKey`, `label`, `tone`, `duration`). This is the
 * "AGENT SELECT" preset of it, kept so existing code keeps working: `play` → `active`, `agentColor` → `tone`.
 */
export function AgentSelectInterstitial({
    play,
    label = 'Agent Select',
    agentColor,
    className,
    ...rest
}: AgentSelectInterstitialProps) {
    return (
        <SweepTransition
            {...rest}
            active={play}
            label={label}
            tone={agentColor ?? 'default'}
            className={cx('zzz-interstitial', className)}
        />
    )
}

/** The default panel colours, for docs. */
export const INTERSTITIAL_COLORS = SWEEP_COLORS
