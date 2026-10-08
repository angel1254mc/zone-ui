// Discovers content modules by folder name, so adding a page never edits a shared file:
//   content/components/<slug>/doc.tsx   default export: ComponentDoc
//   content/docs/<slug>/page.tsx        default export: PageDoc
//   content/examples/<slug>/page.tsx    default export: PageDoc
// <slug> is the catalog slug. A catalog entry without a module still gets a page (with a neutral
// fallback marked `data-pending`).
import type { ComponentDoc, PageDoc, ResolvedComponentDoc } from '../types';
import { resolveDemo } from './demos';

/** Default `--zzz-scale` of a gallery card preview. A doc can override it with `thumbnailScale`. */
export const THUMBNAIL_SCALE = 0.5;

const componentModules = import.meta.glob<{ default: ComponentDoc }>('../content/components/*/doc.tsx', {
  eager: true,
});
const docModules = import.meta.glob<{ default: PageDoc }>('../content/docs/*/page.tsx', { eager: true });
const exampleModules = import.meta.glob<{ default: PageDoc }>('../content/examples/*/page.tsx', { eager: true });

const bySlug = <T>(modules: Record<string, { default: T }>) =>
  new Map(Object.entries(modules).map(([key, mod]) => [key.split('/').at(-2)!, mod.default]));

const componentDocs = bySlug(componentModules);
const pages = { docs: bySlug(docModules), examples: bySlug(exampleModules) };

/** Slugs that have a component doc module, for checks and tests. */
export const componentDocSlugs = () => [...componentDocs.keys()].sort();
/** Slugs that have a page module in `docs` or `examples`. */
export const pageSlugs = (section: 'docs' | 'examples') => [...pages[section].keys()].sort();

const resolved = new Map<string, ResolvedComponentDoc>();

/** The component doc for a slug with its demos attached, or undefined when none is written yet. */
export function getComponentDoc(slug: string): ResolvedComponentDoc | undefined {
  const doc = componentDocs.get(slug);
  if (!doc) return undefined;
  let out = resolved.get(slug);
  if (!out) {
    const folder = `components/${slug}`;
    out = {
      ...doc,
      slug,
      hero: resolveDemo(folder, doc.hero),
      examples: doc.examples.map((x) => ({ ...resolveDemo(folder, x), title: x.title, description: x.description })),
    };
    resolved.set(slug, out);
  }
  return out;
}

/** The page module for a Docs or Examples slug, or undefined when none is written yet. */
export const getPageDoc = (section: 'docs' | 'examples', slug: string): PageDoc | undefined => pages[section].get(slug);
