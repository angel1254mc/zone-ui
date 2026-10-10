import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx, mergeRefs } from '../../utils';
import { tokens } from '../../styles/tokens';
import { HatchBackground, type HatchTone } from '../Backgrounds';
import { Text } from '../Text';
import { OverlayPortal, prefersReducedMotion } from '../DialogBand/overlay';
import './SweepTransition.css';

/**
 * Sweep timeline. `duration` scales the whole sweep; the midpoint
 * stays at the same fraction (567 / 933). Reduced motion always runs a fixed 400 ms quick fade.
 */
export const SWEEP_TIMING = {
  /** Default total in ms (the band collapses to 0 at 933 ms). */
  total: 933,
  /** Default midpoint in ms: the screen is fully covered and the stack starts to exit. */
  midpoint: 567,
  /** Midpoint as a fraction of `duration`. */
  midpointFraction: 567 / 933,
  /** Reduced motion: fade in, hold, fade out. */
  reducedTotal: 400,
  reducedMidpoint: 150,
} as const;

/** One chevron panel: a colour (the hatch stripes are derived from it) or explicit stripe colours. */
export type SweepPanelTone = string | { light: string; dark: string };

/**
 * Panel colours, lead → last:
 * - `default`: sage / teal / deep
 * - `accent`: the live pulsing accent (lime ↔ yellow), then two darker mixes of it
 * - any other string: a tint (lead panel), darker two derived by mixing with black
 * - a 3-tuple: custom panels
 */
export type SweepTone =
  | 'default'
  | 'accent'
  | (string & {})
  | readonly [SweepPanelTone, SweepPanelTone, SweepPanelTone];

export interface SweepTransitionProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Rising edge (false → true) plays the sweep once; set it back to false (e.g. in `onDone`) to arm it again. */
  active?: boolean;
  /**
   * Keyed mode: every new non-null value plays the sweep (also on mount), e.g. `runKey={questionIndex}`.
   * Can be combined with `active`.
   */
  runKey?: string | number | null;
  /** Band text (e.g. "Question 3", "Loading", "Stage Clear"). Shown tracked, condensed, upper-case. */
  label?: ReactNode;
  /** Panel colours. Default `default` (sage / teal / deep). */
  tone?: SweepTone;
  /** Total length in ms (default 933). Every keyframe scales with it. */
  duration?: number;
  /** The screen is fully covered: swap the content underneath here. */
  onMidpoint?(): void;
  /** The sweep has finished and unmounted. */
  onDone?(): void;
  /** Render inside this element (position: absolute) instead of a fixed layer on `<body>`. */
  container?: HTMLElement | null;
  /** Freeze the timeline at this time in ms (of `duration`) for demos / visual tests; renders regardless of `active`. */
  at?: number;
  /** Force (true) or suppress (false) the reduced-motion quick fade. Default: the OS setting / a `data-reduced-motion` ancestor. */
  reducedMotion?: boolean;
}

const mix = (color: string, pct: number, other: string) => `color-mix(in srgb, ${color} ${pct}%, ${other})`;

function panel(t: SweepPanelTone): HatchTone {
  if (typeof t === 'object') return t;
  return { light: mix(t, 88, '#FFFFFF'), dark: mix(t, 86, '#000000') };
}

function derived(color: string): [HatchTone, HatchTone, HatchTone] {
  return [
    { light: mix(color, 86, '#FFFFFF'), dark: mix(color, 85, '#000000') },
    { light: mix(color, 51, '#000000'), dark: mix(color, 40, '#000000') },
    { light: mix(color, 28, '#000000'), dark: mix(color, 25, '#000000') },
  ];
}

/** Resolve a `tone` to the three hatch tones. */
export function sweepTones(tone: SweepTone = 'default'): [HatchTone, HatchTone, HatchTone] {
  if (tone === 'default') return ['sage', 'teal', 'deep'];
  if (tone === 'accent') return derived('var(--zzz-accent)');
  if (typeof tone === 'string') return derived(tone);
  return [panel(tone[0]), panel(tone[1]), panel(tone[2])];
}

/**
 * Full-screen sweep transition, inspired by the game's "AGENT SELECT" wipe: a black
 * centre band grows with a tracked condensed italic label, three hatched chevron panels sweep
 * in from the right, the stack exits left revealing the new content, the label blinks and the band collapses
 * (~930 ms by default). Use it between steps, levels, questions or routes.
 *
 * Trigger with `active` (rising edge) or `runKey` (each new value). Swap content in `onMidpoint`. Decorative
 * (`aria-hidden`): announce the new content yourself (focus its heading or use a live region).
 * Reduced motion: a 400 ms quick fade.
 */
export function SweepTransition({
  active = false,
  runKey,
  label = 'Loading',
  tone = 'default',
  duration = SWEEP_TIMING.total,
  onMidpoint,
  onDone,
  container,
  at,
  reducedMotion,
  className,
  style,
  ref,
  ...rest
}: SweepTransitionProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [lastActive, setLastActive] = useState(false);
  const [lastKey, setLastKey] = useState<string | number | null | undefined>(undefined);
  const cb = useRef({ onMidpoint, onDone });
  cb.current = { onMidpoint, onDone };

  // Triggers are derived during render (StrictMode double effects are harmless).
  let trigger = false;
  if (active !== lastActive) {
    setLastActive(active);
    if (active) trigger = true;
  }
  if (runKey !== lastKey) {
    setLastKey(runKey);
    if (runKey != null) trigger = true;
  }
  if (trigger && at === undefined) {
    setReduced(reducedMotion ?? (typeof window !== 'undefined' && prefersReducedMotion(container)));
    setRun((n) => n + 1);
    setRunning(true);
  }

  const total = Math.max(1, duration);
  useEffect(() => {
    if (run === 0 || !running) return;
    const midMs = reduced ? SWEEP_TIMING.reducedMidpoint : Math.round(total * SWEEP_TIMING.midpointFraction);
    const endMs = reduced ? SWEEP_TIMING.reducedTotal : total;
    const mid = window.setTimeout(() => cb.current.onMidpoint?.(), midMs);
    const end = window.setTimeout(() => {
      setRunning(false);
      cb.current.onDone?.();
    }, endMs);
    return () => {
      window.clearTimeout(mid);
      window.clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const frozen = at !== undefined;
  const shown = running || frozen;

  // Forward the layer root (rendered by OverlayPortal, which takes a RefObject) to the caller's ref.
  useLayoutEffect(() => {
    if (!ref || !shown) return;
    const set = mergeRefs(ref);
    set(layerRef.current);
    return () => {
      set(null);
    };
  }, [ref, shown, container]);

  if (!shown) return null;
  const [light, mid, deep] = sweepTones(tone);
  const rootStyle = {
    '--zzz-sweep-duration': `${total}ms`,
    ...(frozen ? { '--zzz-sweep-at': `${-at}ms` } : null),
    ...style,
  } as CSSProperties;

  return (
    <OverlayPortal
      container={container}
      state="open"
      className={cx('zzz-sweep', className)}
      style={rootStyle}
      layerRef={layerRef}
      data={{
        ...(rest as Record<string, string | undefined>),
        'aria-hidden': 'true',
        'data-frozen': frozen ? '' : undefined,
        'data-reduced': (frozen ? reducedMotion : reduced) ? '' : undefined,
        'data-run': String(run),
        'data-tone': typeof tone === 'string' ? (tone === 'default' || tone === 'accent' ? tone : 'tint') : 'custom',
      }}
    >
      <div key={`l${run}`} className="zzz-sweep__panel zzz-sweep__panel--light">
        <HatchBackground tone={light} />
      </div>
      <div key={`m${run}`} className="zzz-sweep__panel zzz-sweep__panel--mid">
        <HatchBackground tone={mid} />
      </div>
      <div key={`d${run}`} className="zzz-sweep__panel zzz-sweep__panel--deep">
        <HatchBackground tone={deep} />
      </div>
      <div key={`b${run}`} className="zzz-sweep__band">
        <Text role="condensedInterstitial" italic className="zzz-sweep__label">
          {label}
        </Text>
      </div>
    </OverlayPortal>
  );
}

/** The `default` tone's panel colours, for docs. */
export const SWEEP_COLORS = {
  sage: tokens.color.interstitial.sage,
  teal: tokens.color.interstitial.teal,
  deep: tokens.color.interstitial.deep,
};
