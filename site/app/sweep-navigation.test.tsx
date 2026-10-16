import { useEffect } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRoutesStub, useLocation, useNavigate } from 'react-router';
import type { NavigateFunction } from 'react-router';
import { SWEEP_TIMING } from '@angel1254mc/zone-ui';
import Doc from './routes/doc';
import Home from './routes/home';
import Shell from './routes/shell';
import { SWEEP_SWAP } from './ui/SweepNavigation';

// Code blocks stay plain text: the highlighter is a lazy chunk that tests never need.
vi.mock('./lib/highlight', () => ({
  useHighlightedLines: () => null,
  loadHighlighter: () => new Promise(() => {}),
}));

/** Every location the app lands on, in order, and the router's navigate for back / forward. */
let visits: string[] = [];
let go: NavigateFunction;

function TrackedShell() {
  const location = useLocation();
  go = useNavigate();
  useEffect(() => {
    visits.push(location.pathname);
  }, [location.key, location.pathname]);
  return <Shell />;
}

const App = createRoutesStub([
  {
    Component: TrackedShell,
    children: [
      { index: true, Component: Home },
      { path: 'docs/:slug', Component: Doc },
    ],
  },
]);

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

const pageTitle = () => screen.getByRole('heading', { level: 1 }).textContent;
const sweep = () => document.querySelector<HTMLElement>('.zzz-sweep');
const heroGetStarted = () => within(screen.getByRole('main')).getByRole('link', { name: 'Get started' });
// The Introduction's own <header> also counts as a banner here, so find the site header by its class.
const headerGetStarted = () =>
  within(document.querySelector<HTMLElement>('.d-header')!).getByRole('link', { name: 'Get started' });

async function openMenuGetStarted() {
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
  await advance(0);
  return within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', { name: 'Get started' });
}

async function renderAt(path: string) {
  render(<App initialEntries={[path]} />);
  await advance(0);
}

beforeEach(() => {
  visits = [];
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Get started sweep', () => {
  it.each([
    ['the landing page', '/', heroGetStarted],
    ['the Introduction page', '/docs/introduction', heroGetStarted],
    ['the header', '/', headerGetStarted],
    ['the header on another page', '/docs/theming', headerGetStarted],
  ])('from %s: plays the sweep and swaps to Installation under cover', async (_, path, link) => {
    await renderAt(path);
    const before = pageTitle();

    expect(fireEvent.click(link())).toBe(false);
    expect(sweep()).toHaveTextContent('Installation');
    expect(sweep()).toHaveAttribute('aria-hidden', 'true');
    expect(sweep()).not.toHaveAttribute('data-reduced');

    await advance(SWEEP_SWAP.full - 1);
    expect(pageTitle()).toBe(before);

    await advance(1);
    expect(pageTitle()).toBe('Installation');
    expect(sweep()).not.toBeNull();

    await advance(SWEEP_TIMING.total - SWEEP_SWAP.full);
    expect(sweep()).toBeNull();
    expect(visits.at(-1)).toBe('/docs/installation');
  });

  it('from the narrow-screen menu: closes the menu and plays the sweep', async () => {
    await renderAt('/docs/theming');
    fireEvent.click(await openMenuGetStarted());
    expect(sweep()).toHaveTextContent('Installation');

    await advance(SWEEP_SWAP.full - 1);
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();
    expect(pageTitle()).toBe('Theming');

    await advance(1);
    expect(pageTitle()).toBe('Installation');
  });

  it('ignores more clicks while the sweep is running', async () => {
    await renderAt('/');
    fireEvent.click(heroGetStarted());
    await advance(200);

    expect(fireEvent.click(headerGetStarted())).toBe(false);
    expect(fireEvent.click(heroGetStarted())).toBe(false);
    expect(pageTitle()).toBe('Zone');
    expect(sweep()).toHaveAttribute('data-run', '1');

    await advance(SWEEP_TIMING.total);
    expect(sweep()).toBeNull();
    expect(visits).toEqual(['/', '/docs/installation']);
  });

  it('plays again once the previous sweep has finished', async () => {
    await renderAt('/');
    fireEvent.click(heroGetStarted());
    await advance(SWEEP_TIMING.total);
    act(() => void go(-1));
    await advance(0);

    fireEvent.click(heroGetStarted());
    expect(sweep()).not.toBeNull();
    await advance(SWEEP_SWAP.full);
    expect(pageTitle()).toBe('Installation');
  });

  it('leaves the destination alone when the reader navigates during the sweep', async () => {
    await renderAt('/');
    fireEvent.click(heroGetStarted());
    await advance(200);

    fireEvent.click(within(screen.getByRole('navigation', { name: 'Docs' })).getByRole('link', { name: 'Theming' }));
    await advance(0);
    expect(pageTitle()).toBe('Theming');

    await advance(SWEEP_TIMING.total);
    expect(pageTitle()).toBe('Theming');
    expect(visits).toEqual(['/', '/docs/theming']);
  });

  it('swaps while the screen is fully covered, before the panels start to slide off at the midpoint', () => {
    // The teal panel covers the screen from 467 ms; the reduced-motion fade is opaque from 100 to 300 ms.
    expect(SWEEP_SWAP.full).toBeGreaterThanOrEqual(467);
    expect(SWEEP_SWAP.full).toBeLessThan(SWEEP_TIMING.midpoint);
    expect(SWEEP_SWAP.reduced).toBeGreaterThanOrEqual(SWEEP_TIMING.reducedTotal * 0.25);
    expect(SWEEP_SWAP.reduced).toBeLessThan(SWEEP_TIMING.reducedTotal * 0.75);
  });

  it('with reduced motion: plays the quick fade and swaps at its midpoint', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      await renderAt('/');
      fireEvent.click(heroGetStarted());
      expect(sweep()).toHaveAttribute('data-reduced');

      await advance(SWEEP_SWAP.reduced - 1);
      expect(pageTitle()).toBe('Zone');
      await advance(1);
      expect(pageTitle()).toBe('Installation');

      await advance(SWEEP_TIMING.reducedTotal - SWEEP_SWAP.reduced);
      expect(sweep()).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('on Installation itself, the header link stays on the page without a sweep', async () => {
    await renderAt('/docs/installation');
    fireEvent.click(headerGetStarted());
    expect(sweep()).toBeNull();
    await advance(0);
    expect(pageTitle()).toBe('Installation');
  });
});

describe('modified clicks', () => {
  /** Whether the click reached the browser's default action (a new tab or window) uncancelled. */
  let leftToBrowser: boolean | undefined;
  const observe = (e: Event) => {
    leftToBrowser = !e.defaultPrevented;
    e.preventDefault(); // jsdom can't open the tab
  };
  beforeEach(() => {
    leftToBrowser = undefined;
    window.addEventListener('click', observe);
  });
  afterEach(() => window.removeEventListener('click', observe));

  it.each([
    ['Ctrl', { ctrlKey: true }],
    ['Cmd', { metaKey: true }],
    ['Shift', { shiftKey: true }],
    ['Alt', { altKey: true }],
    ['middle', { button: 1 }],
  ])('a %s click is left to the browser', async (_, init) => {
    await renderAt('/');
    for (const find of [heroGetStarted, headerGetStarted, openMenuGetStarted]) {
      const link = await find();
      expect(link).toHaveAttribute('href', '/docs/installation');
      leftToBrowser = undefined;
      fireEvent.click(link, init);
      expect(leftToBrowser).toBe(true);
      expect(sweep()).toBeNull();
    }
    await advance(SWEEP_TIMING.total);
    expect(pageTitle()).toBe('Zone');
    expect(visits).toEqual(['/']);
  });
});

describe('other ways to Installation stay instant', () => {
  it('the sidebar link', async () => {
    await renderAt('/');
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Docs' })).getByRole('link', { name: 'Installation' })
    );
    await advance(0);
    expect(pageTitle()).toBe('Installation');
    expect(sweep()).toBeNull();
  });

  it('a search result', async () => {
    await renderAt('/');
    const field = screen.getByRole('combobox', { name: 'Search the docs' });
    fireEvent.change(field, { target: { value: 'Installation' } });
    fireEvent.keyDown(field, { key: 'Enter' });
    await advance(0);
    expect(pageTitle()).toBe('Installation');
    expect(sweep()).toBeNull();
  });

  it('a typed URL or a reload', async () => {
    await renderAt('/docs/installation');
    expect(pageTitle()).toBe('Installation');
    expect(sweep()).toBeNull();
  });

  it('back and forward', async () => {
    await renderAt('/');
    fireEvent.click(heroGetStarted());
    await advance(SWEEP_TIMING.total);

    act(() => void go(-1));
    await advance(0);
    expect(pageTitle()).toBe('Zone');
    expect(sweep()).toBeNull();

    act(() => void go(1));
    await advance(0);
    expect(pageTitle()).toBe('Installation');
    expect(sweep()).toBeNull();
  });
});
