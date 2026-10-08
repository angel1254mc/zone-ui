import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCountdownOptions {
  /** Length of the countdown in ms (relative mode). Ignored when `deadline` is set. */
  durationMs?: number;
  /** Absolute end instant (Date, epoch ms or a Date-parsable string). Takes precedence over `durationMs`. */
  deadline?: Date | number | string;
  /**
   * Whether the clock runs. Default true. Toggling it to false pauses, back to true resumes.
   * `pause()` / `resume()` flip the same internal flag, so the most recent of the two wins.
   */
  running?: boolean;
  /** Called once when the time reaches 0 (again after a `reset()`). */
  onExpire?: () => void;
  /**
   * Update granularity in ms. Default 250. Ticks are aligned to multiples of this value of the
   * remaining time, so a 1000 ms interval flips `secondsLeft` exactly on the second.
   */
  intervalMs?: number;
}

export interface UseCountdownResult {
  /** Remaining ms (≥ 0). */
  msLeft: number;
  /** Remaining whole seconds, rounded UP (a 30 s timer reads 30 at start, 1 during its last second). */
  secondsLeft: number;
  /** msLeft / total, 1 → 0. Total = `durationMs`, or (deadline mode) the time left at mount / reset. */
  fraction: number;
  /** Total length in ms that `fraction` is relative to. */
  totalMs: number;
  expired: boolean;
  /** Whether the clock is currently ticking (running, not paused, not expired). */
  ticking: boolean;
  /**
   * No `durationMs` and no `deadline` (and no `reset(ms)` since): nothing to count. An idle clock
   * never ticks and never fires `onExpire`; it reports `expired: false`, `fraction: 1`, `msLeft: 0`.
   * It starts as soon as a `durationMs` / `deadline` arrives (or `reset(ms)` is called).
   */
  idle: boolean;
  /**
   * Restarts from `durationMs` (or the given ms) — or re-reads `deadline` — and re-arms `onExpire`.
   * It does not change the paused flag: a paused clock stays paused at the new value until `resume()`.
   */
  reset: (nextDurationMs?: number) => void;
  /** Freezes the remaining time. In deadline mode the display freezes but the deadline does not move. */
  pause: () => void;
  /** Continues from the frozen remaining time (relative mode) or jumps back to the deadline. */
  resume: () => void;
}

const toEpoch = (d: Date | number | string): number =>
  d instanceof Date ? d.getTime() : typeof d === 'number' ? d : new Date(d).getTime();

/**
 * Deadline-based countdown. Every tick recomputes `deadline - Date.now()`, so the value is right
 * even after a throttled background tab or a sleeping laptop (it never decrements a counter).
 * Re-syncs immediately on `visibilitychange`. Works with fake timers that mock `Date`
 * (`vi.useFakeTimers()` does by default).
 */
export function useCountdown(options: UseCountdownOptions = {}): UseCountdownResult {
  const { durationMs, deadline, running = true, onExpire, intervalMs = 250 } = options;
  const deadlineMode = deadline !== undefined;
  const deadlineEpoch = deadlineMode ? toEpoch(deadline) : NaN;

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const initialMs = (): number =>
    deadlineMode ? Math.max(0, deadlineEpoch - Date.now()) : Math.max(0, durationMs ?? 0);

  // endAt: epoch ms the clock reaches 0 while ticking. frozenMs: remaining time while paused.
  const endAtRef = useRef<number>(0);
  const frozenRef = useRef<number>(0);
  const firedRef = useRef(false);
  const [paused, setPaused] = useState(!running);
  const [totalMs, setTotalMs] = useState<number>(() => {
    const ms = initialMs();
    endAtRef.current = deadlineMode ? deadlineEpoch : Date.now() + ms;
    frozenRef.current = ms;
    return ms;
  });
  const [msLeft, setMsLeft] = useState<number>(totalMs);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const [generation, setGeneration] = useState(0);
  // reset(ms) on a clock without durationMs/deadline arms it with that explicit length.
  const [manual, setManual] = useState(false);
  const idle = !deadlineMode && durationMs === undefined && !manual;

  const pause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    frozenRef.current = Math.max(0, endAtRef.current - Date.now());
    setMsLeft(frozenRef.current);
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    if (!deadlineMode) endAtRef.current = Date.now() + frozenRef.current;
    setPaused(false);
  }, [deadlineMode]);

  // `running` prop drives the same flag as pause()/resume().
  const prevRunning = useRef(running);
  useEffect(() => {
    if (prevRunning.current === running) return;
    prevRunning.current = running;
    if (running) resume();
    else pause();
  }, [running, pause, resume]);

  const compute = useCallback((): number => Math.max(0, endAtRef.current - Date.now()), []);

  const reset = useCallback(
    (nextDurationMs?: number) => {
      const ms =
        nextDurationMs !== undefined
          ? Math.max(0, nextDurationMs)
          : deadlineMode
            ? Math.max(0, deadlineEpoch - Date.now())
            : Math.max(0, durationMs ?? 0);
      endAtRef.current = deadlineMode && nextDurationMs === undefined ? deadlineEpoch : Date.now() + ms;
      frozenRef.current = ms;
      firedRef.current = false;
      setManual(nextDurationMs !== undefined);
      setTotalMs(ms);
      setMsLeft(ms);
      setGeneration((g) => g + 1);
    },
    [deadlineMode, deadlineEpoch, durationMs]
  );

  // A new deadline / duration restarts the clock.
  const key = deadlineMode ? `d${deadlineEpoch}` : durationMs === undefined ? 'idle' : `r${durationMs}`;
  const prevKey = useRef(key);
  useEffect(() => {
    if (prevKey.current === key) return;
    prevKey.current = key;
    reset();
  }, [key, reset]);

  const expired = !idle && msLeft <= 0;
  const ticking = !idle && !paused && !expired;

  // Tick loop.
  useEffect(() => {
    if (paused || idle) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const step = Math.max(16, intervalMs);
    const tick = () => {
      if (cancelled) return;
      const left = compute();
      setMsLeft(left);
      if (left <= 0) {
        if (!firedRef.current) {
          firedRef.current = true;
          onExpireRef.current?.();
        }
        return;
      }
      // Align to the next multiple of `step` of the remaining time.
      const delay = left % step || step;
      timer = setTimeout(tick, delay);
    };
    tick();
    const onVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        if (timer !== undefined) clearTimeout(timer);
        tick();
      }
    };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible);
    };
    // generation: restart the loop after reset() (which may revive an expired clock).
  }, [paused, idle, intervalMs, compute, generation]);

  const secondsLeft = Math.ceil(msLeft / 1000);
  const fraction = idle ? 1 : totalMs > 0 ? Math.min(1, Math.max(0, msLeft / totalMs)) : 0;

  return {
    msLeft,
    secondsLeft,
    fraction,
    totalMs,
    expired,
    ticking,
    idle,
    reset,
    pause,
    resume,
  };
}
