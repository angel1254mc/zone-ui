import { createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemePortal } from '../Tooltip/floating';
import { Toast } from './Toast';
import type { ToastVariant } from './Toast';

export interface ToastOptions {
  message: ReactNode;
  /** Default `info`. */
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms. `0` or `Infinity` = stays until dismissed. Default: the provider's `duration`. */
  duration?: number;
  /** Show a close button. Default true. */
  dismissible?: boolean;
  /** Custom disc glyph (`null` hides the disc). */
  icon?: ReactNode;
  /** Reuse an id to replace a toast instead of stacking a new one. */
  id?: string;
}

export interface ToastApi {
  /** Queue a toast; returns its id. A plain node is shorthand for `{ message }`. */
  toast(options: ToastOptions | ReactNode): string;
  /** Dismiss one toast, or all when called without an id. */
  dismiss(id?: string): void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default auto-dismiss time in ms. Default 4000. */
  duration?: number;
  /** Toasts shown at once; the rest wait in the queue. Default 3. */
  max?: number;
  /** Accessible name of the notifications region. Default "Notifications". */
  label?: string;
}

interface Entry extends ToastOptions {
  id: string;
  closing: boolean;
  /** Bumped on every `toast()` call, so a replace-by-id restarts the auto-dismiss timer. */
  rev: number;
}

/** Exit animation length (ms); the entry is removed after it. */
const EXIT_MS = 210;

const ToastContext = createContext<ToastApi | null>(null);

/** The toast API of the nearest `ToastProvider`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

function isOptions(v: unknown): v is ToastOptions {
  return typeof v === 'object' && v !== null && !isValidElement(v) && 'message' in v;
}

/**
 * Hosts the toast queue: a fixed viewport 23 px from the top,
 * centred, portalled to `<body>` (keeping the host theme's scale). At most `max` toasts show;
 * the rest wait. Each auto-dismisses after its duration (paused while hovered or focused).
 * The list is an `aria-live="polite"` region, mounted before any toast so announcements work;
 * error toasts are `role="alert"`.
 */
export function ToastProvider({ children, duration = 4000, max = 3, label = 'Notifications' }: ToastProviderProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [host, setHost] = useState<HTMLSpanElement | null>(null);
  const seq = useRef(0);
  const revSeq = useRef(0);
  const exitTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timers = exitTimers.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const remove = useCallback((id: string) => {
    exitTimers.current.delete(id);
    setEntries((list) => list.filter((e) => e.id !== id));
  }, []);

  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  const dismiss = useCallback(
    (id?: string) => {
      const ids = id !== undefined ? [id] : entriesRef.current.map((e) => e.id);
      if (ids.length === 0) return;
      setEntries((list) => list.map((e) => (ids.includes(e.id) ? { ...e, closing: true } : e)));
      for (const i of ids) {
        if (!exitTimers.current.has(i))
          exitTimers.current.set(
            i,
            setTimeout(() => remove(i), EXIT_MS)
          );
      }
    },
    [remove]
  );

  const toast = useCallback((input: ToastOptions | ReactNode) => {
    const opts: ToastOptions = isOptions(input) ? input : { message: input };
    const id = opts.id ?? `zzz-toast-${++seq.current}`;
    const pending = exitTimers.current.get(id);
    if (pending !== undefined) {
      clearTimeout(pending);
      exitTimers.current.delete(id);
    }
    setEntries((list) => {
      const entry: Entry = {
        ...opts,
        id,
        closing: false,
        rev: ++revSeq.current,
      };
      const i = list.findIndex((e) => e.id === id);
      if (i === -1) return [...list, entry];
      const next = list.slice();
      next[i] = entry;
      return next;
    });
    return id;
  }, []);

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const visible = entries.slice(0, Math.max(1, max));

  return (
    <ToastContext.Provider value={api}>
      {children}
      <span ref={setHost} hidden className="zzz-toast-host" />
      <ThemePortal host={host}>
        <section className="zzz-toast-viewport" aria-label={label}>
          <ol className="zzz-toast-viewport__list" aria-live="polite" aria-relevant="additions text">
            {visible.map((e) => (
              <ToastEntry key={e.id} entry={e} defaultDuration={duration} onDismiss={dismiss} />
            ))}
          </ol>
        </section>
      </ThemePortal>
    </ToastContext.Provider>
  );
}

function ToastEntry({
  entry,
  defaultDuration,
  onDismiss,
}: {
  entry: Entry;
  defaultDuration: number;
  onDismiss(id: string): void;
}) {
  const { id, message, variant = 'info', icon, dismissible = true, closing, rev } = entry;
  const total = entry.duration ?? defaultDuration;
  const [paused, setPaused] = useState(false);
  const remaining = useRef(total);
  const startedAt = useRef(0);
  // The (rev, total) the remaining time was measured for; a new toast() call or duration starts over.
  const timedFor = useRef({ rev, total });

  useEffect(() => {
    if (timedFor.current.rev !== rev || timedFor.current.total !== total) {
      timedFor.current = { rev, total };
      remaining.current = total;
    }
    if (closing || paused || !Number.isFinite(total) || total <= 0) return;
    startedAt.current = Date.now();
    const t = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [closing, paused, total, rev, id, onDismiss]);

  return (
    <li
      className="zzz-toast-viewport__item"
      data-state={closing ? 'closing' : 'open'}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Toast
        variant={variant}
        icon={icon}
        live={variant === 'error'}
        onDismiss={dismissible ? () => onDismiss(id) : undefined}
      >
        {message}
      </Toast>
    </li>
  );
}
