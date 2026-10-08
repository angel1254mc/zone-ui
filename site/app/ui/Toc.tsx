import type { TocItem } from '../types';

/** The on-this-page rail. Links scroll to an id on the page. */
export function Toc({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <aside className="d-toc" aria-label="On this page">
      <p className="d-toc__title">On this page</p>
      <ul>
        {items.map((i) => (
          <li key={i.id} data-sub={i.sub || undefined}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                const target = document.getElementById(i.id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView();
                history.replaceState(history.state, '', `#${i.id}`);
              }}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
