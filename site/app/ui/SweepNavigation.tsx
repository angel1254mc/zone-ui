import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { PrefetchPageLinks, useLocation, useNavigate } from 'react-router';
import { SWEEP_TIMING, SweepTransition } from '@angel1254mc/zone-ui';

type SweepNavigate = (to: string, label?: string) => void;

const SweepContext = createContext<SweepNavigate | null>(null);

/**
 * When the route swaps, in ms after the sweep starts. The kit's `onMidpoint` (567 ms) is the last covered frame:
 * the panels slide off from there, so a page still rendering would show the one before it in the gap. The teal
 * panel covers the screen from 467 ms, so the full sweep swaps then. The reduced-motion fade stays opaque until
 * 300 ms, so its midpoint (150 ms) leaves enough time.
 */
export const SWEEP_SWAP = {
  full: SWEEP_TIMING.midpoint - 100,
  reduced: SWEEP_TIMING.reducedMidpoint,
} as const;

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A plain left click. Modified and middle clicks open a tab or window, so links leave them to the browser. */
export function isPlainClick(e: MouseEvent) {
  return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/**
 * One full-screen Sweep Transition above the routes, played by `useSweepNavigate`. The route swaps while the
 * screen is covered (`SWEEP_SWAP`), so the new page starts at the top and focus stays where any other route
 * change leaves it. The destination's route modules preload as the sweep starts, and the swap commits at once
 * (`flushSync`) instead of as a transition, so the page is on screen before the panels slide off.
 */
export function SweepNavigation({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = useRef(location);
  current.current = location;
  const [sweep, setSweep] = useState<{ to: string; label: string; from: string; reduced: boolean } | null>(null);
  // Set synchronously, so a second click before the next render is ignored too.
  const running = useRef(false);

  const sweepTo = useCallback<SweepNavigate>(
    (to, label = 'Loading') => {
      if (running.current) return;
      // Already there: a plain Link to the current page replaces it without a transition.
      if (to === current.current.pathname) {
        navigate(to, { replace: true });
        return;
      }
      running.current = true;
      setSweep({ to, label, from: current.current.key, reduced: prefersReducedMotion() });
    },
    [navigate]
  );

  useEffect(() => {
    if (!sweep) return;
    const swap = window.setTimeout(
      () => {
        // Back, forward or another link during the sweep wins over the sweep's own destination.
        if (current.current.key === sweep.from) navigate(sweep.to, { flushSync: true });
      },
      sweep.reduced ? SWEEP_SWAP.reduced : SWEEP_SWAP.full
    );
    return () => window.clearTimeout(swap);
  }, [sweep, navigate]);

  return (
    <SweepContext.Provider value={sweepTo}>
      {children}
      {sweep ? <PrefetchPageLinks page={sweep.to} /> : null}
      <SweepTransition
        active={sweep !== null}
        label={sweep?.label}
        reducedMotion={sweep?.reduced}
        onDone={() => {
          running.current = false;
          setSweep(null);
        }}
      />
    </SweepContext.Provider>
  );
}

/**
 * `(to, label?)`: plays the sweep with `label` in its band and goes to `to` while the screen is covered. Calls
 * during a sweep are ignored. Outside `SweepNavigation` it navigates at once.
 */
export function useSweepNavigate(): SweepNavigate {
  const sweepTo = useContext(SweepContext);
  const navigate = useNavigate();
  const instant = useCallback<SweepNavigate>((to) => navigate(to), [navigate]);
  return sweepTo ?? instant;
}

/** `onClick` for a link to `to`: a plain click sweeps there; modified clicks keep the link's own behaviour. */
export function useSweepClick(to: string, label?: string) {
  const sweepTo = useSweepNavigate();
  return (e: MouseEvent<HTMLElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    sweepTo(to, label);
  };
}
