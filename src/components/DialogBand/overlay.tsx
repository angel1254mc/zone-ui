import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { tokens } from '../../styles/tokens';
import './overlay.css';

/*
 * Shared modal-layer plumbing for DialogBand and Drawer. No external library.
 *
 *   OverlayPortal ..... portals a layer to `<body>` (re-creating the host's .zzz-theme scale and pinned
 *                       accent phase on its root) or into a `container` element (position: absolute).
 *   usePresence ....... keeps a closing layer mounted while its exit animation runs (setTimeout, not
 *                       animationend, so it also works in jsdom and under reduced motion).
 *   useModalLayer ..... focus in / Tab trap / Escape / scroll lock / inert page / frozen page accent /
 *                       focus restore, with a LIFO stack so a dialog over a drawer only traps itself.
 */

/** A motion duration token (e.g. tokens.motion.duration.bandOut = '60ms') in ms. */
export function ms(value: string | number): number {
  return typeof value === 'number' ? value : parseFloat(value);
}

export const MOTION = {
  bandIn: ms(tokens.motion.duration.bandIn),
  bandOut: ms(tokens.motion.duration.bandOut),
  scrimOut: ms(tokens.motion.duration.scrimOut),
  freeze: ms(tokens.motion.duration.backdropFreeze),
  drawerIn: ms(tokens.motion.duration.drawerIn),
  drawerOut: ms(tokens.motion.duration.drawerOut),
} as const;

/** Reduced motion: the OS setting, or a `data-reduced-motion` ancestor of `el`. */
export function prefersReducedMotion(el?: Element | null): boolean {
  if (el?.closest('[data-reduced-motion]')) return true;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface ThemeVars {
  px?: string;
  accentPhase?: string;
  reducedMotion?: boolean;
}

function readThemeVars(host: Element | null): ThemeVars {
  if (!host || typeof window === 'undefined') return {};
  const px = window.getComputedStyle(host).getPropertyValue('--zzz-px').trim();
  return {
    px: px || undefined,
    accentPhase: host.closest('[data-accent-phase]')?.getAttribute('data-accent-phase') ?? undefined,
    reducedMotion: host.closest('[data-reduced-motion]') != null || undefined,
  };
}

export interface OverlayPortalProps {
  /** Render into this element instead of `<body>`; the layer then fills it (position: absolute). */
  container?: HTMLElement | null;
  className?: string;
  style?: CSSProperties;
  /** data-state of the layer root ('open' | 'closed'). */
  state: 'open' | 'closed';
  layerRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  /** Extra data-* attributes for the layer root. */
  data?: Record<string, string | undefined>;
}

/**
 * The layer root. With `container` it is a plain absolutely positioned div inside the container's own
 * theme; on `<body>` it is a fixed `.zzz-theme` carrying the host's --zzz-px, accent phase and
 * reduced-motion flag (read from a hidden inline anchor where the component is rendered).
 */
export function OverlayPortal({ container, className, style, state, layerRef, children, data }: OverlayPortalProps) {
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null);
  const [vars, setVars] = useState<ThemeVars>({});
  useLayoutEffect(() => {
    if (container) return;
    const next = readThemeVars(anchor);
    setVars((prev) =>
      prev.px === next.px && prev.accentPhase === next.accentPhase && prev.reducedMotion === next.reducedMotion
        ? prev
        : next
    );
  }, [anchor, container]);

  if (typeof document === 'undefined') return null;
  const contained = container != null;
  const rootStyle = { ...style } as CSSProperties & Record<string, string | undefined>;
  if (!contained && vars.px) rootStyle['--zzz-px'] = vars.px;
  const root = (
    <div
      ref={layerRef}
      className={[contained ? 'zzz-overlay zzz-overlay--contained' : 'zzz-theme zzz-overlay', className]
        .filter(Boolean)
        .join(' ')}
      style={rootStyle}
      data-state={state}
      data-accent-phase={contained ? undefined : vars.accentPhase}
      data-reduced-motion={!contained && vars.reducedMotion ? '' : undefined}
      {...data}
    >
      {children}
    </div>
  );
  return (
    <>
      {contained ? null : <span ref={setAnchor} hidden className="zzz-overlay-anchor" />}
      {createPortal(root, container ?? document.body)}
    </>
  );
}

/**
 * Mount/exit bookkeeping. `open` true → mounted + 'open'; false → 'closed' for `exitMs`, then unmounted.
 */
export function usePresence(open: boolean, exitMs: number): { mounted: boolean; state: 'open' | 'closed' } {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    if (exitMs <= 0) {
      setMounted(false);
      return;
    }
    const t = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(t);
  }, [open, mounted, exitMs]);
  return { mounted: mounted || open, state: open ? 'open' : 'closed' };
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/** Tabbable descendants in DOM order (skips hidden / aria-hidden subtrees). */
export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]') && !el.closest('[inert]')
  );
}

const LIVE_REGION = '[aria-live]:not([aria-live="off"]), [role="status"], [role="alert"], [role="log"]';

/**
 * A `<body>` child that must stay out of the inert page: it carries `data-zzz-live-layer`, or it is a
 * theme portal (`.zzz-portal`, e.g. ToastProvider's always-mounted viewport) hosting a live region.
 * Inerting those would drop the toast list from the accessibility tree, so a toast raised from inside
 * an open dialog would never be announced and its Dismiss button could not be reached. The app root
 * is never exempted, even when it contains a live region.
 */
export function isLiveLayer(el: HTMLElement): boolean {
  if (el.hasAttribute('data-zzz-live-layer')) return true;
  return el.classList.contains('zzz-portal') && (el.matches(LIVE_REGION) || el.querySelector(LIVE_REGION) != null);
}

/** Open layers, bottom → top. Only the top one handles Escape / Tab. */
const stack: object[] = [];

export interface ModalLayerOptions {
  /** True while the layer is open (not while it animates out). */
  active: boolean;
  /** The portal root (its siblings become inert). */
  layerRef: RefObject<HTMLDivElement | null>;
  /** The dialog element (focus fallback, Tab trap root). */
  dialogRef: RefObject<HTMLElement | null>;
  /** Element to focus on open; default the first tabbable in the dialog, else the dialog. */
  getInitialFocus?: () => HTMLElement | null | undefined;
  /** Lock page scroll (not for contained layers). */
  lockScroll: boolean;
  /** Freeze the accent pulse of the page behind (a dialog backdrop freezes the page pulse). */
  freezeAccent?: boolean;
  /** Escape pressed and not handled by a child (e.g. an open Select). */
  onEscape?: () => void;
}

/**
 * Modal behaviour. Returns an onKeyDown for the dialog element (Escape + Tab trap).
 * Order on close: page un-inerted BEFORE focus goes back to the opener (an inert trigger can't take focus).
 */
export function useModalLayer({
  active,
  layerRef,
  dialogRef,
  getInitialFocus,
  lockScroll,
  freezeAccent = false,
  onEscape,
}: ModalLayerOptions) {
  const token = useRef<object>({});
  const openerRef = useRef<HTMLElement | null>(null);
  const initialFocusRef = useRef(getInitialFocus);
  initialFocusRef.current = getInitialFocus;
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useLayoutEffect(() => {
    if (!active) return;
    const me = token.current;
    stack.push(me);
    openerRef.current =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : null;
    const layer = layerRef.current;

    // Inert page + frozen accent: every sibling of the layer root that is not already inert.
    const touched: { el: HTMLElement; accent: string | null }[] = [];
    if (layer?.parentElement) {
      const accent = freezeAccent
        ? getComputedStyle(layer.parentElement).getPropertyValue('--zzz-accent').trim() || '#93BA00'
        : '';
      for (const child of Array.from(layer.parentElement.children)) {
        if (child === layer || !(child instanceof HTMLElement)) continue;
        if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE' || child.hasAttribute('inert')) continue;
        if (child.classList.contains('zzz-overlay-anchor') || isLiveLayer(child)) continue;
        touched.push({
          el: child,
          accent: child.style.getPropertyValue('--zzz-accent') || null,
        });
        child.setAttribute('inert', '');
        if (freezeAccent) child.style.setProperty('--zzz-accent', accent);
      }
    }

    // Scroll lock without layout shift: hiding the page scrollbar would widen the page by the
    // scrollbar's width, so reserve that space while locked (only when a scrollbar is present).
    let restoreScroll: (() => void) | null = null;
    if (lockScroll) {
      const root = document.documentElement;
      const body = document.body;
      const gutter = window.innerWidth - root.clientWidth;
      const prev = {
        overflow: root.style.overflow,
        gutter: root.style.scrollbarGutter,
        padding: body.style.paddingRight,
      };
      if (gutter > 0 && gutter < 100) {
        if (typeof CSS !== 'undefined' && CSS.supports?.('scrollbar-gutter', 'stable')) {
          root.style.scrollbarGutter = 'stable';
        } else {
          const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
          body.style.paddingRight = `${current + gutter}px`;
        }
      }
      root.style.overflow = 'hidden';
      restoreScroll = () => {
        root.style.overflow = prev.overflow;
        root.style.scrollbarGutter = prev.gutter;
        body.style.paddingRight = prev.padding;
      };
    }

    const dialog = dialogRef.current;
    const target = initialFocusRef.current?.() ?? (dialog ? getFocusable(dialog)[0] : undefined) ?? dialog;
    target?.focus({ preventScroll: true });

    return () => {
      const i = stack.lastIndexOf(me);
      if (i >= 0) stack.splice(i, 1);
      for (const { el, accent } of touched) {
        el.removeAttribute('inert');
        if (freezeAccent) {
          if (accent) el.style.setProperty('--zzz-accent', accent);
          else el.style.removeProperty('--zzz-accent');
        }
      }
      restoreScroll?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Focus goes back to the opener in a PASSIVE cleanup: React restores the pre-commit focus right
  // after the mutation phase (where layout cleanups run), which would undo a restore made there.
  // Passive cleanups also run after the layout cleanup above has removed `inert` from the page.
  useEffect(() => {
    if (!active) return;
    return () => {
      const opener = openerRef.current;
      openerRef.current = null;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!active || e.defaultPrevented) return;
    if (stack[stack.length - 1] !== token.current) return;
    if (e.key === 'Escape') {
      if (escapeRef.current) {
        e.preventDefault();
        e.stopPropagation();
        escapeRef.current();
      }
      return;
    }
    if (e.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const f = getFocusable(dialog);
    if (f.length === 0) {
      e.preventDefault();
      dialog.focus();
      return;
    }
    const first = f[0];
    const last = f[f.length - 1];
    const cur = document.activeElement;
    if (e.shiftKey && (cur === first || cur === dialog || !dialog.contains(cur))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (cur === last || !dialog.contains(cur))) {
      e.preventDefault();
      first.focus();
    }
  };

  return { onKeyDown };
}
