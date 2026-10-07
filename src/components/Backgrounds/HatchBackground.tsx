import type { CSSProperties } from 'react'
import { cx } from '../../utils'
import type { BackgroundLayerProps } from './types'
import './Backgrounds.css'

export type HatchTone =
    | 'black'
    | 'sage'
    | 'teal'
    | 'deep'
    | { light: string; dark: string }

export interface HatchBackgroundProps extends BackgroundLayerProps {
    /**
     * `black` (default): the global white-alpha hatch on black (`.zzz-bg-hatch`).
     * `sage` / `teal` / `deep`: the sweep-transition panels (stripes between their
     * light and dark colours). `{ light, dark }`: custom stripe colours.
     */
    tone?: HatchTone
}

/** Full-bleed 39.8° hatch (pattern.hatch: 7.68 px perpendicular period, 12 × 10 px tile). */
export function HatchBackground({
    tone = 'black',
    className,
    style,
    ref,
    ...rest
}: HatchBackgroundProps) {
    const custom = typeof tone === 'object'
    const name = custom ? 'custom' : tone
    const vars = custom
        ? ({
              '--zzz-hatch-light': tone.light,
              '--zzz-hatch-dark': tone.dark,
          } as CSSProperties)
        : undefined
    return (
        <div
            ref={ref}
            aria-hidden="true"
            data-tone={name}
            className={cx(
                'zzz-bg',
                name === 'black'
                    ? 'zzz-bg-hatch'
                    : ['zzz-hatch-bg--tinted', `zzz-hatch-bg--${name}`],
                className
            )}
            style={{ ...vars, ...style }}
            {...rest}
        />
    )
}
