import type { CSSProperties } from 'react'
import { cx } from '../../utils'
import type { BackgroundLayerProps } from './types'
import './Backgrounds.css'

export interface DotTextureProps extends BackgroundLayerProps {
    /** Lattice pitch: `sm` 4.64 (pills), `md` 5.2 (drawer), `lg` 7 (textured headers). Default `sm`. */
    size?: 'sm' | 'md' | 'lg'
    /** White alpha of the light dots (default 0.035). */
    alpha?: number
    /** Black alpha of the dark dots between them (default 0). */
    shade?: number
}

/** Absolutely positioned diamond dot lattice (pattern.dots), transparent between the dots. */
export function DotTexture({
    size = 'sm',
    alpha,
    shade,
    className,
    style,
    ref,
    ...rest
}: DotTextureProps) {
    const vars: Record<string, string> = {
        '--zzz-dots-size': `var(--zzz-pattern-dots-${size})`,
    }
    if (alpha != null) vars['--zzz-dots-alpha'] = String(alpha)
    if (shade != null) vars['--zzz-dots-shade'] = String(shade)
    return (
        <div
            ref={ref}
            aria-hidden="true"
            data-size={size}
            className={cx('zzz-bg', 'zzz-dots', className)}
            style={{ ...(vars as CSSProperties), ...style }}
            {...rest}
        />
    )
}
