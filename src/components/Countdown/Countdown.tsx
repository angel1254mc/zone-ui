import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { ClockIcon } from '../../icons';
import { InfoPill } from '../InfoPill';
import { useCountdown } from '../CountdownBar/useCountdown';
import './Countdown.css';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Remaining ms (≥ 0). */
  totalMs: number;
}

/**
 * - `auto` (default): `07:42:13`, with a day prefix from 24 h up (`2d 07:42:13`)
 * - `hms`: `07:42:13` (hours keep counting past 24: `55:42:13`)
 * - `ms`: `42:13` (minutes keep counting past 60)
 * - `dhms`: always `0d 07:42:13`
 * - `labels`: `7h 42m 13s` (leading zero units dropped: `2d 7h 42m 13s`, `42m 13s`)
 * - `compact`: the largest unit only, like an event timer: `66d`, `7h`, `42m`, `13s`
 */
export type CountdownFormat = 'auto' | 'hms' | 'ms' | 'dhms' | 'labels' | 'compact';

export interface CountdownOwnProps {
  /** The instant to count down to (Date, epoch ms or a Date-parsable string). */
  target: Date | number | string;
  /** Preset or a function of the remaining parts. Default 'auto'. */
  format?: CountdownFormat | ((parts: CountdownParts) => ReactNode);
  /** Text / node before the time, e.g. "Next puzzle in". */
  prefix?: ReactNode;
  /** Text / node after the time, e.g. "left". */
  suffix?: ReactNode;
  /** Leading glyph (pill variant). Default a clock; `null` hides it. */
  icon?: ReactNode;
  /** Shown instead of the time once the target is reached (default: the zeroed time). */
  reachedLabel?: ReactNode;
  /** Called once when the target is reached (again for a new target). */
  onReach?: () => void;
  /** 'pill' (default): black InfoPill look. 'plain': inline text that inherits the surrounding type. */
  variant?: 'pill' | 'plain';
  ref?: Ref<HTMLSpanElement>;
}

export type CountdownProps = CountdownOwnProps &
  Omit<ComponentPropsWithoutRef<'span'>, keyof CountdownOwnProps | 'children'>;

const pad = (n: number) => String(n).padStart(2, '0');

export function splitDuration(ms: number): CountdownParts {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    totalMs: Math.max(0, ms),
  };
}

export function formatCountdown(parts: CountdownParts, format: CountdownFormat = 'auto'): string {
  const { days, hours, minutes, seconds } = parts;
  const totalHours = days * 24 + hours;
  switch (format) {
    case 'hms':
      return `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)}`;
    case 'ms':
      return `${pad(totalHours * 60 + minutes)}:${pad(seconds)}`;
    case 'dhms':
      return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    case 'labels': {
      const units: [number, string][] = [
        [days, 'd'],
        [hours, 'h'],
        [minutes, 'm'],
        [seconds, 's'],
      ];
      const first = units.findIndex(([v]) => v > 0);
      return first < 0
        ? '0s'
        : units
            .slice(first)
            .map(([v, u]) => `${v}${u}`)
            .join(' ');
    }
    case 'compact':
      return days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : `${seconds}s`;
    default:
      return days > 0
        ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

const isoDuration = ({ days, hours, minutes, seconds }: CountdownParts) => `P${days}DT${hours}H${minutes}M${seconds}S`;

/** Each digit in a 1ch cell: stable width without the Mona Sans tnum glyphs (slashed 0). */
function Digits({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch >= '0' && ch <= '9' ? (
          <span key={i} className="zzz-countdown__digit">
            {ch}
          </span>
        ) : ch === ':' ? (
          <span key={i} className="zzz-countdown__sep">
            :
          </span>
        ) : (
          ch
        )
      )}
    </>
  );
}

/**
 * Live countdown to a target instant ("Next puzzle in 07:42:13", "Event ends in 2d 07:42:13"),
 * ticking on each second (deadline-based via `useCountdown`, so background tabs stay exact).
 * InfoPill look by default; `variant="plain"` for inline text. `role="timer"` (not live): the
 * readout is never announced on every tick.
 */
export function Countdown(props: CountdownProps) {
  const {
    target,
    format = 'auto',
    prefix,
    suffix,
    icon,
    reachedLabel,
    onReach,
    variant = 'pill',
    className,
    ref,
    ...rest
  } = props;
  const cd = useCountdown({
    deadline: target,
    onExpire: onReach,
    intervalMs: 1000,
  });
  const parts = splitDuration(cd.msLeft);

  let time: ReactNode;
  if (cd.expired && reachedLabel !== undefined) time = reachedLabel;
  else if (typeof format === 'function') time = format(parts);
  else time = <Digits text={formatCountdown(parts, format)} />;

  const content = (
    <>
      {prefix != null ? <span className="zzz-countdown__prefix">{prefix} </span> : null}
      <time className="zzz-countdown__time" dateTime={isoDuration(parts)}>
        {time}
      </time>
      {suffix != null ? <span className="zzz-countdown__suffix"> {suffix}</span> : null}
    </>
  );

  const shared = {
    ...rest,
    role: 'timer',
    'data-reached': cd.expired ? '' : undefined,
  };

  if (variant === 'plain') {
    return (
      <span {...shared} ref={ref} className={cx('zzz-countdown', 'zzz-countdown--plain', className)}>
        {content}
      </span>
    );
  }
  const glyph = icon === undefined ? <ClockIcon /> : icon;
  return (
    <InfoPill
      {...(shared as ComponentPropsWithoutRef<'button'>)}
      ref={ref}
      icon={glyph}
      className={cx('zzz-countdown', 'zzz-countdown--pill', glyph == null && 'zzz-countdown--no-icon', className)}
    >
      {content}
    </InfoPill>
  );
}
