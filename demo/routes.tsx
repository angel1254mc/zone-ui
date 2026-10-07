import type { ReactNode } from 'react'
import { AgentImage } from '../examples/art'
import { InterKnotDispatchPage } from '../examples/pages/InterKnotDispatch'
import { TriviaPage } from '../examples/pages/Trivia'

/** Launcher tile art: an agent bust (nanoka `crop`, 384 x 384) cover-cropped into the banner slot. */
const TRIVIA_TILE_AGENT = '1031' // Nicole
/** Same agent as the Inter-Knot Dispatch hero (examples/pages/InterKnotDispatch/data.ts HERO_AGENT_ID). */
const DISPATCH_TILE_AGENT = '1191' // Ellen
const tileArt = (id: string) => () => (
    <AgentImage crop="crop" id={id} fit="cover" position="50% 28%" priority />
)

/**
 * How a page is framed in the viewport:
 * - `stage`: a full-screen game-style page; the demo wraps it in a `<Stage>` (1920 x 1080, contain);
 * - `self`: a page that renders its own `<Stage>` (or sizes itself); the demo only gives it the full viewport;
 * - `web`: a responsive web page (no Stage), scaled by the demo's Scale switch.
 */
export type DemoFrame = 'stage' | 'self' | 'web'

export type DemoGroup = 'app' | 'web'

/** Navigation handed to every page: page-to-page links go through the hash router. */
export interface DemoNav {
    /** Go to a page by slug (`''` = the launcher). */
    go: (slug: string) => void
}

export interface DemoRoute {
    /** URL slug: the page lives at `#/<slug>`. */
    slug: string
    title: string
    group: DemoGroup
    /** One-line summary shown on the launcher tile. */
    blurb: string
    /** Short tag on the launcher tile (frames / kind). */
    tag: string
    frame: DemoFrame
    /** Launcher tile art (examples/art: real game art loaded by URL; an empty frame if it cannot load). */
    art: () => ReactNode
    render: (nav: DemoNav) => ReactNode
}

export const GROUPS: { id: DemoGroup; label: string }[] = [
    { id: 'app', label: 'Web apps' },
    { id: 'web', label: 'Websites' },
]

/**
 * The example pages that ship with the repo. Each one composes the general-purpose zone-ui components;
 * the individual components (every variant and state) live in Storybook, not here.
 */
export const ROUTES: DemoRoute[] = [
    {
        slug: 'trivia',
        title: 'ZZZ Daily Trivia',
        group: 'app',
        tag: 'Daily quiz',
        blurb: 'Five 30-second questions a day, with streaks, a countdown to the next puzzle and a shareable result.',
        frame: 'web',
        art: tileArt(TRIVIA_TILE_AGENT),
        render: ({ go }) => <TriviaPage onBack={() => go('')} />,
    },
    {
        slug: 'inter-knot-dispatch',
        title: 'Inter-Knot Dispatch',
        group: 'web',
        tag: 'Website',
        blurb: 'A responsive news site: hero, news grid, featured cards, newsletter and FAQ.',
        frame: 'web',
        art: tileArt(DISPATCH_TILE_AGENT),
        render: () => <InterKnotDispatchPage />,
    },
]

export const findRoute = (slug: string) => ROUTES.find((r) => r.slug === slug)
