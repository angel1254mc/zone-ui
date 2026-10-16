import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import {
  Button,
  HatchBackground,
  HomeIcon,
  IconButton,
  NewsCard,
  OptionsIcon,
  SectionLabel,
  SegmentedTabs,
  Stage,
  Text,
  ZZZ_DEFAULT_SCALE,
  ZzzTheme,
} from '@angel1254mc/zone-ui';
import { GROUPS, ROUTES, findRoute, type DemoNav, type DemoRoute } from './routes';

/* ------------------------------------------------------------------ hash router */

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};
const readHash = () => window.location.hash;

/**
 * The slug from a route hash `#/<slug>` (`''` = the launcher, also for an empty hash or `#`). Any other hash
 * (`#ikd-news`, `#download`, ...) is an in-page anchor, not a route: returns `null`.
 */
export function parseSlug(hash: string): string | null {
  if (hash === '' || hash === '#') return '';
  if (!hash.startsWith('#/')) return null;
  return hash.slice(2).split(/[/?]/)[0] ?? '';
}

/**
 * The current route slug. A hash change to an in-page anchor keeps the last route, so the page stays mounted
 * and the browser's native anchor scrolling works (pages use plain `#id` links for their own nav).
 */
export function useHashSlug(): string {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => '');
  const last = useRef('');
  const parsed = parseSlug(hash);
  if (parsed !== null) last.current = parsed;
  return last.current;
}

export const hrefFor = (slug: string) => (slug ? `#/${slug}` : '#/');

const navigate = (slug: string) => {
  window.location.hash = hrefFor(slug);
};

/* ------------------------------------------------------------------ persisted settings */

/** Density presets: 0.7 = the web default, 1 = game density. */
export const SCALES = ['0.5', '0.7', '1', '1.333'] as const;
type Scale = (typeof SCALES)[number];

function usePersisted<T extends string>(key: string, initial: T, valid: readonly T[]): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key) as T | null;
      return stored && valid.includes(stored) ? stored : initial;
    } catch {
      return initial;
    }
  });
  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        window.localStorage.setItem(key, v);
      } catch {
        /* storage unavailable: keep the in-memory value */
      }
    },
    [key]
  );
  return [value, set];
}

/* ------------------------------------------------------------------ launcher */

function Launcher() {
  return (
    <main className="zzz-demo-launcher">
      <HatchBackground className="zzz-demo-launcher__bg" />
      <header className="zzz-demo-launcher__head">
        <Text as="p" role="condensedMd" className="zzz-demo-launcher__kicker">
          Zone
        </Text>
        <Text as="h1" role="eventTitle" italic className="zzz-demo-launcher__title">
          Example pages
        </Text>
        <Text as="p" role="bodyLg" tone="secondary" className="zzz-demo-launcher__lede">
          Example pages built with Zone, a general-purpose Zenless Zone Zero–inspired UI kit for game-flavoured web apps
          and sites. Pick a page; the Home pill brings you back here.
        </Text>
      </header>
      {GROUPS.map((group) => {
        const routes = ROUTES.filter((r) => r.group === group.id);
        if (routes.length === 0) return null;
        return (
          <section key={group.id} className="zzz-demo-launcher__group" aria-labelledby={`zzz-demo-group-${group.id}`}>
            <SectionLabel as="h2" id={`zzz-demo-group-${group.id}`}>
              {group.label}
            </SectionLabel>
            <ul className="zzz-demo-launcher__grid">
              {routes.map((route) => (
                <li key={route.slug}>
                  <NewsCard
                    href={hrefFor(route.slug)}
                    art={route.art()}
                    date={route.frame === 'web' ? 'Responsive web' : 'Full screen'}
                    category={route.tag}
                    skin="game"
                    title={route.title}
                    description={route.blurb}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <section className="zzz-demo-launcher__group" aria-labelledby="zzz-demo-group-gallery">
        <SectionLabel as="h2" id="zzz-demo-group-gallery">
          Component gallery
        </SectionLabel>
        <Text as="p" role="body" tone="secondary" className="zzz-demo-launcher__note">
          Every component, with live examples and its props, is documented on the docs site: run{' '}
          <code>npm run site:dev</code> in the repository and open http://localhost:5180.
        </Text>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ page frames */

function PageView({ route, nav }: { route: DemoRoute; nav: DemoNav }) {
  const page = route.render(nav);
  return (
    // tabIndex -1: the programmatic focus target after a route change (see App), so keyboard and
    // screen-reader users land on the new page instead of <body>.
    <div
      className="zzz-demo-page"
      data-frame={route.frame}
      data-slug={route.slug}
      role="region"
      aria-label={route.title}
      tabIndex={-1}
    >
      {route.frame === 'stage' ? <Stage>{page}</Stage> : page}
    </div>
  );
}

/* ------------------------------------------------------------------ corner chrome */

function Chrome({
  scale,
  onScale,
  atHome,
  dock,
}: {
  scale: Scale;
  onScale: (s: Scale) => void;
  atHome: boolean;
  /** 'top' on full-screen (Stage) pages: the top-centre spot sits in the letterbox when there is one, else over
   * the top bar's free centre. 'bottom' on the launcher and the scrolling web pages. */
  dock: 'top' | 'bottom';
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the disclosure; focus goes back to its button when it was inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const panel = document.getElementById(panelId);
      const focusInside = panel?.contains(document.activeElement) ?? false;
      setOpen(false);
      if (focusInside) toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, panelId]);

  return (
    // Pinned to the web default so the controls keep their size while the Scale switch previews other densities.
    <ZzzTheme
      scale={ZZZ_DEFAULT_SCALE}
      className="zzz-demo-chrome"
      data-dock={dock}
      role="region"
      aria-label="Demo controls"
    >
      {open && (
        <div className="zzz-demo-chrome__panel zzz-mat-panel" id={panelId}>
          <div className="zzz-demo-chrome__row">
            <Text as="span" role="label" id="zzz-demo-scale-label">
              Scale
            </Text>
            <SegmentedTabs
              aria-labelledby="zzz-demo-scale-label"
              items={SCALES.map((s) => ({
                value: s,
                label: `${s}x`,
              }))}
              value={scale}
              onValueChange={(v) => onScale(v as Scale)}
              width={480}
            />
          </div>
          <Text as="p" role="caption" tone="tertiary" className="zzz-demo-chrome__note">
            Scale applies to the launcher and the web pages; full-screen pages fit the window.
          </Text>
        </div>
      )}
      <div className="zzz-demo-chrome__bar">
        {!atHome && (
          <Button href="#/" icon={<HomeIcon />} width="auto">
            Home
          </Button>
        )}
        {/* A disclosure, not a toggle: aria-expanded, and aria-controls only while the panel exists. */}
        <IconButton
          ref={toggleRef}
          icon={<OptionsIcon />}
          label="Display options"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen((o) => !o)}
        />
      </div>
    </ZzzTheme>
  );
}

/* ------------------------------------------------------------------ app */

export function App() {
  const slug = useHashSlug();
  const route = findRoute(slug);
  const [scale, setScale] = usePersisted<Scale>('zzz-demo:scale', '0.7', SCALES);

  // The demo once persisted an art mode ('zzz-demo:art'); art is now always real game art by URL. Drop the key.
  useEffect(() => {
    try {
      window.localStorage.removeItem('zzz-demo:art');
    } catch {
      /* storage unavailable */
    }
  }, []);

  // The slug we came from: on returning Home its launcher tile gets focus back (and is scrolled into view).
  const prevSlug = useRef<string | null>(null);

  useEffect(() => {
    document.title = route ? `${route.title} · Zone` : 'Zone Examples';
    const from = prevSlug.current;
    prevSlug.current = route ? route.slug : '';
    if (from === null) return; // first render: leave focus and scroll to the browser

    if (route) {
      // A new page: the launcher's scroll position does not apply; focus the page frame so focus is not
      // dropped on <body> when the activated tile unmounts.
      document.documentElement.scrollTop = 0;
      document.querySelector<HTMLElement>(`.zzz-demo-page[data-slug="${route.slug}"]`)?.focus({ preventScroll: true });
      return;
    }
    // Back on the launcher: restore focus to the tile that was activated, else the launcher heading region.
    const tile = from ? document.querySelector<HTMLElement>(`.zzz-demo-launcher a[href="${hrefFor(from)}"]`) : null;
    if (tile) {
      tile.focus({ preventScroll: true });
      tile.scrollIntoView?.({ block: 'center' });
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [route]);

  const nav: DemoNav = { go: navigate };

  return (
    <ZzzTheme scale={Number(scale)} className="zzz-demo-root">
      {/* keyed so every visit remounts the page fresh (entrance animations, initial state) */}
      {route ? <PageView key={route.slug} route={route} nav={nav} /> : <Launcher />}
      <Chrome
        scale={scale}
        onScale={setScale}
        atHome={!route}
        dock={route && route.frame !== 'web' ? 'top' : 'bottom'}
      />
    </ZzzTheme>
  );
}
