import { CATALOG, entryHref, sectionOfTier, tierOf } from '../catalog';
import type { CatalogEntry, Section } from '../types';

export interface SearchResult {
  entry: CatalogEntry;
  href: string;
  section: Section;
  /** Group shown next to the name: Atoms, Foundations, Examples… */
  group: string;
}

const ITEMS: SearchResult[] = CATALOG.map((entry) => ({
  entry,
  href: entryHref(entry),
  section: sectionOfTier(entry.tier),
  group: tierOf(entry.tier).label,
}));

/** Lower is better: name prefix, word prefix, name substring, component name, blurb. */
function rank(item: SearchResult, q: string): number {
  const name = item.entry.name.toLowerCase();
  if (name.startsWith(q)) return 0;
  if (name.split(/[\s-]+/).some((w) => w.startsWith(q))) return 1;
  if (name.includes(q)) return 2;
  if (item.entry.components.some((c) => c.toLowerCase().includes(q))) return 3;
  if (item.entry.blurb.toLowerCase().includes(q)) return 4;
  return -1;
}

/** Every component, docs page and example whose name (or component names, or blurb) matches. */
export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ITEMS.map((item) => ({ item, score: rank(item, q) }))
    .filter((r) => r.score >= 0)
    .sort((a, b) => a.score - b.score || a.item.entry.name.localeCompare(b.item.entry.name))
    .slice(0, limit)
    .map((r) => r.item);
}
