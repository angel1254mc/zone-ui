import type { ReactNode } from 'react';

/**
 * Neutral stand-in for content that has no module yet. Every fallback carries `data-pending`, so a sweep
 * (`document.querySelectorAll('[data-pending]')`) finds the pages and cards still to write.
 */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <div className="d-pending" data-pending="">
      <p>{children}</p>
    </div>
  );
}

/** Gallery-card stand-in: the entry's name set large and faint over the preview mesh. */
export function PendingThumb({ name }: { name: string }) {
  return (
    <span className="d-card__placeholder" aria-hidden="true">
      {name}
    </span>
  );
}
