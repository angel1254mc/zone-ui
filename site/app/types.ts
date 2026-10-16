import type { ComponentType, ReactNode } from 'react';

/** Catalog groups. `start` + `foundations` live under Docs, `examples` under Examples, the rest under Components. */
export type Tier = 'start' | 'foundations' | 'atoms' | 'molecules' | 'organisms' | 'templates' | 'examples';

/** The three top-level sections, each with its own sidebar. */
export type Section = 'docs' | 'components' | 'examples';

export interface CatalogEntry {
  /** URL segment and content folder name, e.g. `segmented-tabs`. */
  slug: string;
  /** Human name shown in headings, the sidebar, search and the gallery. */
  name: string;
  tier: Tier;
  /** One-line summary under the page title and on gallery cards. */
  blurb: string;
  /** Docgen display names whose props tables make up the Properties tab. */
  components: string[];
}

/** How a preview stage frames its demo. */
export type Frame = 'center' | 'start' | 'bleed';

/** Points at one file in the doc folder's `demos/` directory. */
export interface DemoRef {
  /** File name without extension: `'icon-tones'` for `demos/icon-tones.tsx`. Also the example's anchor id. */
  demo: string;
  /** Preview stage layout. Default `center`; `start` aligns left; `bleed` drops the padding (full-width parts). */
  frame?: Frame;
}

/** One entry under Examples on a component page. */
export interface ExampleSpec extends DemoRef {
  title: string;
  /** One sentence under the heading. */
  description?: ReactNode;
}

/** A row of an extra type table on the Properties tab (item objects, option shapes). */
export interface TypeRow {
  name: string;
  type: string;
  required?: boolean;
  /** Plain text; `backticks` render as inline code. */
  description: string;
}

export interface TypeTableSpec {
  /** Type name as exported from the package, e.g. `NavBarItem`. */
  name: string;
  rows: TypeRow[];
}

/** A short list on the Properties tab: States, Keyboard, Native attributes, Responsive behaviour… */
export interface NoteSpec {
  title: string;
  items: ReactNode[];
}

/**
 * The content of one component page: the default export of `content/components/<slug>/doc.tsx`.
 * The name, tier, blurb and docgen components come from `catalog.ts`; this object adds everything else.
 */
export interface ComponentDoc {
  /** Large preview at the top of Overview (by convention `{ demo: 'hero' }`). */
  hero: DemoRef;
  /** Usage prose: when to use it, and when to pick something else. One or two short paragraphs. */
  usage: ReactNode;
  /** Import line plus a minimal snippet, shown under Usage. */
  usageCode: string;
  /** Overview → Examples, in page order. */
  examples: ExampleSpec[];
  /** Live preview on the Components gallery card. Static, inline, no portals or timers. */
  thumbnail: ComponentType;
  /** `--zzz-scale` of the gallery card preview. Default `0.5` (`THUMBNAIL_SCALE`). */
  thumbnailScale?: number;
  /** Extra type tables on Properties (item and option shapes). */
  types?: TypeTableSpec[];
  /** Notes on Properties: states, keyboard, native attributes. */
  notes?: NoteSpec[];
  /** Catalog slugs of related components, shown as cards at the end of Overview. */
  related?: string[];
  /** Full-width page without the on-this-page rail, for organisms that need the room. */
  wide?: boolean;
  /** Live prop controls at the top of Properties. Button has one; add others only when asked. */
  playground?: ComponentType;
}

/** One entry of a page's on-this-page rail. */
export interface TocItem {
  id: string;
  label: string;
  sub?: boolean;
}

/**
 * A Docs or Examples page: the default export of `content/docs/<slug>/page.tsx` or
 * `content/examples/<slug>/page.tsx`. The page title and blurb come from `catalog.ts`.
 */
export interface PageDoc {
  /** The page content, rendered under the standard header. */
  Body: ComponentType;
  /** On-this-page rail; every `id` must be an element id inside `Body`. */
  toc?: TocItem[];
  /** Full-width layout without the rail. */
  wide?: boolean;
  /** `Body` renders its own header instead of the standard one (the Introduction landing). */
  ownHeader?: boolean;
  /** Live preview for the Examples overview card (examples only). Same rules as a component thumbnail. */
  thumbnail?: ComponentType;
  thumbnailScale?: number;
}

/** A demo file resolved by the registry: the component plus its source text. */
export interface ResolvedDemo {
  id: string;
  Demo: ComponentType;
  code: string;
  frame: Frame;
}

export interface ResolvedExample extends ResolvedDemo {
  title: string;
  description?: ReactNode;
}

export interface ResolvedComponentDoc extends Omit<ComponentDoc, 'hero' | 'examples'> {
  slug: string;
  hero: ResolvedDemo;
  examples: ResolvedExample[];
}
