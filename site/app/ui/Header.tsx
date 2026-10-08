import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Drawer, IconButton, SearchIcon } from '@angel1254mc/zone-ui';
import type { Section } from '../types';
import { Search } from './Search';

export const GITHUB_URL = 'https://github.com/angel1254mc/zone-ui';

const SECTIONS: { id: Section; label: string; to: string }[] = [
  { id: 'docs', label: 'Docs', to: '/' },
  { id: 'components', label: 'Components', to: '/components' },
  { id: 'examples', label: 'Examples', to: '/examples' },
];

/** Below this width the section links fold into the menu and the search field into an icon button. */
export const MOBILE_QUERY = '(max-width: 960px)';

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
      />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M3 5.5h18v2.6H3zM3 10.7h18v2.6H3zM3 15.9h18v2.6H3z" />
    </svg>
  );
}

function SectionLinks({ section, onNavigate }: { section: Section; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <ul className="d-nav__list">
      {SECTIONS.map((s) => {
        const active = s.id === section;
        return (
          <li key={s.id}>
            <Link
              to={s.to}
              className="d-nav__link"
              aria-current={active ? (pathname === s.to ? 'page' : 'true') : undefined}
              onClick={onNavigate}
            >
              {s.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Full-bleed site header: wordmark, section links, GitHub, search and the Get started call to action. */
export function Header({ section }: { section: Section }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setShortcut('⌘ K');
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      if (window.matchMedia(MOBILE_QUERY).matches) {
        setMenuOpen(false);
        setSearchOpen(true);
      } else {
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="d-header">
      <Link to="/" className="d-wordmark" aria-label="Zone docs home">
        <span className="d-wordmark__word">ZONE</span>
        <span className="d-wordmark__tag">Docs</span>
      </Link>
      <nav className="d-nav" aria-label="Sections">
        <SectionLinks section={section} />
      </nav>
      <div className="d-header__end">
        <a className="d-header__icon" href={GITHUB_URL} aria-label="GitHub repository">
          <GitHubMark />
        </a>
        <div className="d-header__search">
          <Search inputRef={searchRef} shortcut={shortcut} />
        </div>
        <Link to="/docs/installation" className="d-cta d-header__cta">
          Get started
        </Link>
        <IconButton
          className="d-header__mobile"
          size="sm"
          icon={<SearchIcon />}
          label="Search"
          onClick={() => setSearchOpen(true)}
        />
        <IconButton
          className="d-header__mobile"
          size="sm"
          icon={<MenuGlyph />}
          label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        />
      </div>

      <Drawer title="Menu" open={menuOpen} onOpenChange={setMenuOpen} width={460}>
        <nav className="d-menu" aria-label="Sections">
          <SectionLinks section={section} onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="d-menu__actions">
          <Link to="/docs/installation" className="d-cta" onClick={() => setMenuOpen(false)}>
            Get started
          </Link>
          <a className="d-menu__github" href={GITHUB_URL}>
            <GitHubMark />
            GitHub repository
          </a>
        </div>
      </Drawer>
      <Drawer title="Search" icon={<SearchIcon />} open={searchOpen} onOpenChange={setSearchOpen} width={460}>
        <Search variant="inline" autoFocus onNavigate={() => setSearchOpen(false)} />
      </Drawer>
    </header>
  );
}
