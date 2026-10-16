import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import { useNavigate } from 'react-router';
import { mergeRefs, SearchIcon, TextField } from '@angel1254mc/zone-ui';
import { search } from '../lib/search';

interface SearchProps {
  /** `dropdown`: results float under the field (header). `inline`: results flow under it (mobile drawer). */
  variant?: 'dropdown' | 'inline';
  inputRef?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
  /** Key hint shown in the empty field, e.g. `Ctrl K`. */
  shortcut?: string;
  /** Called after a result is opened. */
  onNavigate?: () => void;
}

/**
 * Searches every component, docs page and example by name and blurb. A combobox: ↑ / ↓ move through the
 * results, Enter opens one, Esc closes the list (and clears the field on a second press).
 */
export function Search({ variant = 'dropdown', inputRef, autoFocus, shortcut, onNavigate }: SearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(variant === 'inline');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = useMemo(() => mergeRefs(inputRef, ownRef), [inputRef]);
  const id = useId();
  const listId = `${id}-results`;
  const optionId = (i: number) => `${id}-option-${i}`;

  // A frame later than mount: an enclosing Drawer moves focus to its first control when it opens.
  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => ownRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  const results = search(query);
  const expanded = open && query.trim() !== '';
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const go = (i: number) => {
    const r = results[i];
    if (!r) return;
    setQuery('');
    setOpen(variant === 'inline');
    navigate(r.href);
    onNavigate?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      if (!results.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive(expanded ? (current + step + results.length) % results.length : 0);
    } else if (e.key === 'Enter') {
      if (expanded && results.length) {
        e.preventDefault();
        go(current);
      }
    } else if (e.key === 'Escape') {
      if (expanded && variant === 'dropdown') {
        e.preventDefault();
        setOpen(false);
      } else if (query) {
        e.preventDefault();
        e.stopPropagation();
        setQuery('');
      } else if (variant === 'dropdown') {
        e.currentTarget.blur();
      }
    }
  };

  return (
    <div className={`d-search d-search--${variant}`}>
      <TextField
        ref={ref}
        role="combobox"
        aria-label="Search the docs"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded && results.length ? listId : undefined}
        aria-activedescendant={expanded && results.length ? optionId(current) : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder="Search"
        icon={<SearchIcon />}
        size="sm"
        value={query}
        onValueChange={(v) => {
          setQuery(v);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => variant === 'dropdown' && setOpen(false)}
      />
      {shortcut && !query && (
        <kbd className="d-search__kbd" aria-hidden="true">
          {shortcut}
        </kbd>
      )}
      {expanded && (
        <div className="d-search__panel">
          {results.length ? (
            <ul role="listbox" id={listId} aria-label="Search results" className="d-search__list">
              {results.map((r, i) => (
                <li
                  key={r.href}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === current}
                  className="d-search__option"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => i !== current && setActive(i)}
                  onClick={() => go(i)}
                >
                  <span className="d-search__name">{r.entry.name}</span>
                  <span className="d-search__group">{r.group}</span>
                  <span className="d-search__blurb">{r.entry.blurb}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="d-search__empty">No results for “{query.trim()}”</p>
          )}
        </div>
      )}
      <p className="d-sr-only" aria-live="polite">
        {expanded ? `${results.length} result${results.length === 1 ? '' : 's'}` : ''}
      </p>
    </div>
  );
}
