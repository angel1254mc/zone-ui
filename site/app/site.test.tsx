import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { createRoutesStub, MemoryRouter, Outlet } from 'react-router';
import { ZzzTheme } from '@angel1254mc/zone-ui';
import { CATALOG, entriesOf, entryHref, findEntry } from './catalog';
import { demoNames } from './lib/demos';
import { componentDocSlugs, getComponentDoc, getPageDoc, pageSlugs } from './lib/registry';
import routes from './routes';

// Code blocks stay plain text: the highlighter is a lazy chunk that tests never need.
vi.mock('./lib/highlight', () => ({
  useHighlightedLines: () => null,
  loadHighlighter: () => new Promise(() => {}),
}));

interface RouteModule {
  default: ComponentType;
  ErrorBoundary?: ComponentType;
}
interface RouteEntry {
  file: string;
  path?: string;
  index?: boolean;
  children?: RouteEntry[];
}

const routeModules = import.meta.glob<RouteModule>('./routes/*.tsx', { eager: true });

/** The real route config (routes.ts) as a memory router; `bare` swaps the shell for a plain outlet. */
function stubFor(bare: boolean) {
  const toStub = (e: RouteEntry): Parameters<typeof createRoutesStub>[0][number] => {
    const mod = routeModules[`./${e.file}`];
    if (!mod) throw new Error(`routes.ts points at a missing module: ${e.file}`);
    const Component = bare && e.file === 'routes/shell.tsx' ? Outlet : mod.default;
    return e.index
      ? { index: true, Component, ErrorBoundary: mod.ErrorBoundary }
      : { path: e.path, Component, ErrorBoundary: mod.ErrorBoundary, children: e.children?.map(toStub) };
  };
  return createRoutesStub((routes as RouteEntry[]).map(toStub));
}

const Bare = stubFor(true);
const Full = stubFor(false);

function expectPage(name: string) {
  expect(screen.getByRole('heading', { level: 1, name })).toBeInTheDocument();
  expect(document.querySelector('[data-not-found]')).toBeNull();
}

describe('routes', () => {
  it.each(CATALOG.map((e) => [entryHref(e), e.slug === 'introduction' ? 'Zone' : e.name]))(
    '%s renders its page',
    (href, name) => {
      render(<Bare initialEntries={[href]} />);
      expectPage(name);
    }
  );

  it.each(entriesOf('components').map((e) => [entryHref(e, 'properties'), e.name]))(
    '%s renders the Properties tab',
    (href, name) => {
      render(<Bare initialEntries={[href]} />);
      expectPage(name);
    }
  );

  it.each([
    ['/components', 'Components'],
    ['/examples', 'Examples'],
    ['/docs/introduction', 'Zone'],
  ])('%s renders', (href, name) => {
    render(<Bare initialEntries={[href]} />);
    expectPage(name);
  });

  it.each(['/nope', '/components/nope', '/components/button/nope', '/docs/nope', '/examples/nope'])(
    '%s is a 404',
    (href) => {
      render(<Bare initialEntries={[href]} />);
      expect(document.querySelector('[data-not-found]')).not.toBeNull();
    }
  );

  it.each([
    ['/', 'Zone', 'Docs'],
    ['/components/button', 'Button', 'Components'],
    ['/examples', 'Examples', 'Examples'],
  ])('%s renders inside the shell with its own sidebar', (href, name, sidebar) => {
    render(<Full initialEntries={[href]} />);
    expectPage(name);
    expect(screen.getByRole('navigation', { name: sidebar })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute(
      'href',
      'https://github.com/angel1254mc/zone-ui'
    );
    expect(screen.getByRole('combobox', { name: 'Search the docs' })).toBeInTheDocument();
  });

  it('marks pages without a content module as pending, and written ones not', () => {
    const written = new Set(componentDocSlugs());
    const missing = entriesOf('components').find((c) => !written.has(c.slug));
    if (missing) {
      const pending = render(<Bare initialEntries={[`/components/${missing.slug}`]} />);
      expect(document.querySelector('[data-pending]')).not.toBeNull();
      pending.unmount();
    }
    render(<Bare initialEntries={['/components/button']} />);
    expect(document.querySelector('[data-pending]')).toBeNull();
  });
});

describe('content contract', () => {
  const folderOf = (path: string) => path.split('/').slice(-3, -1).join('/');
  const allFolders = Object.keys(import.meta.glob('./content/*/*/*.tsx')).map(folderOf);

  it('every content folder is named after a catalog slug of its section', () => {
    for (const folder of new Set(allFolders)) {
      const [section, slug] = folder.split('/');
      expect(['components', 'docs', 'examples'], folder).toContain(section);
      expect(findEntry(section as 'components', slug), `${folder} is not in catalog.ts`).toBeDefined();
    }
  });

  it('demo files import only the package, react and examples/art', () => {
    const sources = import.meta.glob<string>('./content/*/*/demos/*.tsx', {
      eager: true,
      query: '?raw',
      import: 'default',
    });
    for (const [file, code] of Object.entries(sources)) {
      for (const m of code.matchAll(/^\s*import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/gm)) {
        const ok = m[1] === '@angel1254mc/zone-ui' || m[1] === 'react' || /(^|\/)examples\/art(\/|$)/.test(m[1]);
        expect(ok, `${file} imports "${m[1]}"`).toBe(true);
      }
      expect(code, `${file} needs a default export`).toMatch(/export default/);
    }
  });

  it.each(componentDocSlugs())('components/%s: demos, related and thumbnail are wired', (slug) => {
    const doc = getComponentDoc(slug)!;
    const used = [doc.hero.id, ...doc.examples.map((x) => x.id)];
    expect(new Set(used).size, 'each demo is used once').toBe(used.length);
    expect(
      demoNames(`components/${slug}`).filter((n) => !used.includes(n)),
      'unused demo files'
    ).toEqual([]);
    for (const id of doc.examples.map((x) => x.id)) {
      expect(['hero', 'usage', 'examples', 'related', 'playground'], `reserved example id ${id}`).not.toContain(id);
    }
    for (const r of doc.related ?? []) expect(findEntry('components', r), `related "${r}"`).toBeDefined();
    expect(typeof doc.thumbnail).toBe('function');
    if (doc.thumbnailScale !== undefined) {
      expect(doc.thumbnailScale).toBeGreaterThanOrEqual(0.2);
      expect(doc.thumbnailScale).toBeLessThanOrEqual(1);
    }
  });
});

describe('content renders', () => {
  it.each(componentDocSlugs())('components/%s: hero, examples and thumbnail render', (slug) => {
    const doc = getComponentDoc(slug)!;
    const demos: [string, ComponentType][] = [
      ['hero', doc.hero.Demo],
      ...doc.examples.map((x): [string, ComponentType] => [x.id, x.Demo]),
      ['thumbnail', doc.thumbnail],
    ];
    for (const [id, Demo] of demos) {
      const { unmount } = render(
        <ZzzTheme scale={id === 'thumbnail' ? (doc.thumbnailScale ?? 0.5) : undefined}>
          <Demo />
        </ZzzTheme>
      );
      unmount();
    }
  });

  it.each([
    ...pageSlugs('docs').map((s) => ['docs', s] as const),
    ...pageSlugs('examples').map((s) => ['examples', s] as const),
  ])('%s/%s: page body renders', (section, slug) => {
    const page = getPageDoc(section, slug)!;
    render(
      <MemoryRouter>
        <ZzzTheme>
          <page.Body />
        </ZzzTheme>
      </MemoryRouter>
    );
    for (const item of page.toc ?? []) {
      expect(document.getElementById(item.id), `toc id "${item.id}"`).not.toBeNull();
    }
  });
});
