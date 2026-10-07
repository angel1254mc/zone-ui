import { useId } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../utils';
import './Spinner.css';

/** `ring` = a conic ring; `chevrons` = three hatched chevrons (SweepTransition flavoured). */
export type SpinnerVariant = 'ring' | 'chevrons';
/** Ring colour: the live accent (default), white, or `current` (inherit `color`). */
export type SpinnerTone = 'accent' | 'white' | 'current';

export interface SpinnerProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Default `ring`. */
  variant?: SpinnerVariant;
  /** Height in design units. Default 40 (ring) / 44 (chevrons). */
  size?: number;
  /** Ring colour. Default `accent`. (The chevrons use the interstitial sage / teal / deep.) */
  tone?: SpinnerTone;
  /** Accessible status text (visually hidden). Default "Loading". */
  label?: string;
}

/* Chevron geometry on a 0 0 72 44 grid (design units at size 44): three ">" bands 16 wide at a
 * 22 pitch; each half leans skew.chevron 16.2deg -> tip offset 22 * tan(16.2deg) = 6.4. */
const TIP = 6.4;
const BAND = 16;
const PITCH = 22;
const TONES = ['sage', 'teal', 'deep'] as const;

function chevron(x: number) {
  return `M${x} 0 H${x + BAND} L${x + BAND + TIP} 22 L${x + BAND} 44 H${x} L${x + TIP} 22 Z`;
}

/**
 * Loading spinner: a conic ring, or (`chevrons`) the hatched chevron panels of the sweep
 * transition.
 * `role="status"` with a visually-hidden label; rotation / sweep stop under reduced motion.
 */
export function Spinner({
  variant = 'ring',
  size,
  tone = 'accent',
  label = 'Loading',
  className,
  style,
  ...rest
}: SpinnerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const h = size ?? (variant === 'ring' ? 40 : 44);
  // The hatch keeps its game period (pattern.hatch.period 7.68 px, stripes 39.8deg below the
  // horizontal like .zzz-bg-hatch) whatever the spinner size: convert to viewBox units.
  const period = (7.68 * 44) / h;
  const rootStyle = {
    '--zzz-spinner-size': `calc(${h} * var(--zzz-px))`,
    ...style,
  } as CSSProperties;
  return (
    <span
      role="status"
      {...rest}
      className={cx('zzz-spinner', `zzz-spinner--${variant}`, className)}
      data-tone={variant === 'ring' ? tone : undefined}
      style={rootStyle}
    >
      {variant === 'ring' ? (
        <span className="zzz-spinner__ring" aria-hidden="true" />
      ) : (
        <svg className="zzz-spinner__chevrons" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
          <defs>
            {TONES.map((c) => (
              <pattern
                key={c}
                id={`zzz-sp-${uid}-${c}`}
                width={period}
                height={period}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(39.8)"
              >
                <rect width={period} height={period} className={`zzz-spinner__base--${c}`} />
                <rect width={period} height={period / 2} className={`zzz-spinner__stripe--${c}`} />
              </pattern>
            ))}
          </defs>
          {TONES.map((c, i) => (
            <path key={c} className="zzz-spinner__chevron" d={chevron(i * PITCH)} fill={`url(#zzz-sp-${uid}-${c})`} />
          ))}
        </svg>
      )}
      <span className="zzz-sr-only">{label}</span>
    </span>
  );
}
