import type { Section } from '../types';

/** The section a path belongs to: /components…, /examples…, everything else is Docs. */
export function sectionOfPath(pathname: string): Section {
  if (pathname === '/components' || pathname.startsWith('/components/')) return 'components';
  if (pathname === '/examples' || pathname.startsWith('/examples/')) return 'examples';
  return 'docs';
}

/** `Keyboard`, `Native attributes` → `keyboard`, `native-attributes` (anchor ids). */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Page title for the document head. */
export const pageTitle = (name?: string) => (name ? `${name} · Zone` : 'Zone · React UI kit');

const DESCRIPTION = 'Zone: a Zenless Zone Zero–inspired React UI kit for game-flavoured web apps.';

/** Route `meta` for a page: its title, and its blurb as the description. */
export const pageMeta = (entry?: { name: string; blurb: string }) => [
  { title: pageTitle(entry?.name) },
  { name: 'description', content: entry?.blurb ?? DESCRIPTION },
];
