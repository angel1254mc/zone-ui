import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GameArtProvider, type GameArtState } from '../../art'
import { fixtureManifest } from '../Trivia/fixture'
import {
    InterKnotDispatchPage,
    type InterKnotDispatchPageProps,
} from './InterKnotDispatch'
import { FEATURED_AGENTS, HERO_AGENT_ID, NEWS_POSTS, PAGE_SIZE } from './data'

const READY: GameArtState = { status: 'ready', manifest: fixtureManifest }

/** The page with the art store pinned (default: ready with the manifest fixture). */
const renderPage = (
    props: InterKnotDispatchPageProps = {},
    state: GameArtState = READY
) =>
    render(
        <GameArtProvider state={state}>
            <InterKnotDispatchPage {...props} />
        </GameArtProvider>
    )

const grid = () => screen.getByRole('list', { name: 'Articles' })
const cards = () => within(grid()).getAllByRole('link')
const pager = () => screen.getByRole('navigation', { name: 'News pages' })
const tabs = () => screen.getByRole('tablist', { name: 'News categories' })

describe('InterKnotDispatchPage', () => {
    let errors: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
        errors = vi.spyOn(console, 'error')
    })
    afterEach(() => {
        expect(errors).not.toHaveBeenCalled()
        errors.mockRestore()
    })

    it('renders the site landmarks, hero and sections', () => {
        renderPage()
        expect(screen.getByRole('banner')).toBeInTheDocument()
        expect(
            screen.getByRole('navigation', { name: 'Main' })
        ).toBeInTheDocument()
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            /Inter-Knot Dispatch/i
        )
        expect(screen.getAllByRole('link', { name: /Download/ })).toHaveLength(
            2
        )
        expect(
            screen.getByRole('button', { name: /Trailer/ })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { name: 'Agents' })
        ).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /FAQ/ })).toBeInTheDocument()
    })

    it('shows the first page of all articles by default', () => {
        renderPage()
        expect(
            within(tabs()).getByRole('tab', { name: 'All' })
        ).toHaveAttribute('aria-selected', 'true')
        expect(cards()).toHaveLength(PAGE_SIZE)
        expect(cards()[0]).toHaveAccessibleName(NEWS_POSTS[0].title)
        expect(
            within(pager()).getByRole('button', { name: 'Page 1' })
        ).toHaveAttribute('aria-current', 'page')
    })

    it('wires the category tabs to a tabpanel holding the articles and pager', async () => {
        const user = userEvent.setup()
        renderPage()
        const panel = screen.getByRole('tabpanel', { name: 'All' })
        expect(panel).toContainElement(grid())
        expect(panel).toContainElement(pager())
        for (const tab of within(tabs()).getAllByRole('tab')) {
            expect(tab).toHaveAttribute('aria-controls', panel.id)
        }
        await user.click(within(tabs()).getByRole('tab', { name: 'Notices' }))
        expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Notices')
    })

    it('filters the grid by tab and resets to page 1', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(
            within(pager()).getByRole('button', { name: 'Page 2' })
        )
        await user.click(within(tabs()).getByRole('tab', { name: 'Notices' }))
        const notices = NEWS_POSTS.filter((p) => p.category === 'notices')
        expect(cards()).toHaveLength(notices.length)
        cards().forEach((card, i) => {
            expect(card).toHaveAccessibleName(notices[i].title)
            expect(card).toHaveAccessibleDescription(/Notices/)
        })
        expect(
            within(pager()).getByRole('button', { name: 'Page 1' })
        ).toHaveAttribute('aria-current', 'page')
        expect(
            within(pager()).queryByRole('button', { name: 'Page 2' })
        ).not.toBeInTheDocument()

        await user.click(within(tabs()).getByRole('tab', { name: 'Events' }))
        cards().forEach((card) =>
            expect(card).toHaveAccessibleDescription(/Events/)
        )
    })

    it('switches tabs with the keyboard', async () => {
        const user = userEvent.setup()
        renderPage()
        within(tabs()).getByRole('tab', { name: 'All' }).focus()
        await user.keyboard('{ArrowRight}')
        expect(
            within(tabs()).getByRole('tab', { name: 'News' })
        ).toHaveAttribute('aria-selected', 'true')
        cards().forEach((card) =>
            expect(card).toHaveAccessibleDescription(/News/)
        )
    })

    it('pages through the articles', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(
            within(pager()).getByRole('button', { name: 'Page 2' })
        )
        expect(cards()[0]).toHaveAccessibleName(NEWS_POSTS[PAGE_SIZE].title)
        await user.click(
            within(pager()).getByRole('button', { name: 'Next page' })
        )
        expect(
            within(pager()).getByRole('button', { name: 'Page 3' })
        ).toHaveAttribute('aria-current', 'page')
        expect(cards()).toHaveLength(NEWS_POSTS.length - 2 * PAGE_SIZE)
        expect(
            within(pager()).getByRole('button', { name: 'Next page' })
        ).toHaveAttribute('aria-disabled', 'true')
        await user.click(
            within(pager()).getByRole('button', { name: 'Previous page' })
        )
        expect(cards()[0]).toHaveAccessibleName(NEWS_POSTS[PAGE_SIZE].title)
    })

    it('honours initialTab / initialPage', () => {
        renderPage({ initialTab: 'all', initialPage: 3 })
        expect(cards()).toHaveLength(NEWS_POSTS.length - 2 * PAGE_SIZE)
    })

    it('marks new articles with a NEW! badge outside the link name', () => {
        renderPage()
        const newCount = NEWS_POSTS.slice(0, PAGE_SIZE).filter(
            (p) => p.isNew
        ).length
        const flagged = within(grid())
            .getAllByRole('listitem')
            .filter((li) => within(li).queryAllByText('NEW!').length > 0)
        expect(flagged).toHaveLength(newCount)
        expect(cards()[0]).not.toHaveAccessibleName(/NEW!/)
    })

    it('lists the featured agents by name', () => {
        renderPage()
        const roster = screen.getByRole('list', { name: 'Choose an agent' })
        expect(
            within(roster).getByRole('button', { name: 'Ellen' })
        ).toHaveAttribute('aria-pressed', 'true')
        expect(
            within(roster).getByRole('button', { name: 'Miyabi' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { level: 3, name: 'Ellen' })
        ).toBeInTheDocument()
    })

    it('renders the roster as agent tiles inside a horizontal ScrollArea (no archived carousel)', () => {
        const { container } = renderPage()
        expect(
            screen.queryByRole('listbox', { name: 'Featured agents' })
        ).not.toBeInTheDocument()
        const rail = container.querySelector('.ikd-agents__rail')!
        expect(rail).toHaveClass('zzz-scroll-area')
        expect(
            rail.querySelector('.zzz-scroll-area__viewport')
        ).toContainElement(
            screen.getByRole('list', { name: 'Choose an agent' })
        )
    })

    it('selects another agent from the roster', async () => {
        const user = userEvent.setup()
        renderPage()
        const roster = screen.getByRole('list', { name: 'Choose an agent' })
        const buttons = within(roster).getAllByRole('button')
        expect(buttons).toHaveLength(9)
        await user.click(
            within(roster).getByRole('button', { name: 'Zhu Yuan' })
        )
        expect(
            within(roster).getByRole('button', { name: 'Zhu Yuan' })
        ).toHaveAttribute('aria-pressed', 'true')
        expect(
            within(roster).getByRole('button', { name: 'Ellen' })
        ).toHaveAttribute('aria-pressed', 'false')
        expect(
            screen.getByRole('heading', { level: 3, name: 'Zhu Yuan' })
        ).toBeInTheDocument()
    })

    it('draws the hero as the real full-body agent art (contain, eager, high priority)', () => {
        const { container } = renderPage()
        const hero = fixtureManifest.agents.find((a) => a.id === HERO_AGENT_ID)!
        const slot = container.querySelector('.ikd-hero__art .zart')!
        expect(slot).toHaveClass('ikd-hero__agent')
        expect(slot).toHaveAttribute('data-fit', 'contain')
        const img = slot.querySelector('img')!
        expect(img.getAttribute('src')).toMatch(
            new RegExp(`${hero.images.full}$`)
        )
        expect(img).toHaveAttribute('width', String(hero.fullSize![0]))
        expect(img).toHaveAttribute('height', String(hero.fullSize![1]))
        expect(img).toHaveAttribute('loading', 'eager')
        expect(img).toHaveAttribute('fetchpriority', 'high')
    })

    it('news art: event posts show an Inter-Knot namecard, agent posts the agent bust (real art only)', () => {
        const { container } = renderPage()
        const items = container.querySelectorAll('.ikd-news__item')
        expect(items).toHaveLength(PAGE_SIZE)
        NEWS_POSTS.slice(0, PAGE_SIZE).forEach((post, i) => {
            const img = items[i].querySelector('.zart img')!
            expect(img, post.id).not.toBeNull()
            if (post.art.kind === 'namecard') {
                const card = fixtureManifest.namecards!.find(
                    (n) => n.id === (post.art as { id: string }).id
                )!
                expect(img.getAttribute('src')).toBe(
                    `${fixtureManifest.sources!.enka}${card.image}`
                )
            } else {
                const agent = fixtureManifest.agents.find(
                    (a) => a.id === (post.art as { agentId: string }).agentId
                )!
                expect(img.getAttribute('src')).toMatch(
                    new RegExp(`${agent.images.crop}$`)
                )
            }
        })
        expect(container.querySelector('.zart svg')).toBeNull()
    })

    it('every post and featured agent references art that exists in the committed manifest', async () => {
        const { default: manifest } = await import(
            '../../art/art-manifest.json'
        )
        for (const post of NEWS_POSTS) {
            if (post.art.kind === 'namecard') {
                const id = post.art.id
                expect(
                    manifest.namecards.some(
                        (n) => n.id === id && n.group === 'event'
                    ),
                    id
                ).toBe(true)
            } else {
                const id = post.art.agentId
                expect(
                    manifest.agents.find((a) => a.id === id)?.images.crop,
                    id
                ).toBeTruthy()
            }
        }
        for (const a of FEATURED_AGENTS)
            expect(manifest.agents.find((m) => m.id === a.id)?.name, a.id).toBe(
                a.name
            )
        expect(
            manifest.agents.find((a) => a.id === HERO_AGENT_ID)?.images.full
        ).toBeTruthy()
    })

    it('missing art: the page still renders with empty frames and no svg in any slot', () => {
        const { container } = renderPage(
            {},
            { status: 'missing', manifest: null }
        )
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            /Inter-Knot Dispatch/i
        )
        expect(cards()).toHaveLength(PAGE_SIZE)
        const slots = container.querySelectorAll('.zart')
        expect(slots.length).toBeGreaterThan(PAGE_SIZE)
        slots.forEach((slot) => {
            expect(slot).toHaveAttribute('data-state', 'missing')
            expect(slot.querySelector('svg, img')).toBeNull()
        })
        // Names come from the page data when the manifest is unavailable.
        expect(
            screen.getByRole('heading', { level: 3, name: 'Ellen' })
        ).toBeInTheDocument()
    })

    it('loading art: neutral skeletons only', () => {
        const { container } = renderPage(
            {},
            { status: 'loading', manifest: null }
        )
        const slots = container.querySelectorAll('.zart')
        expect(slots.length).toBeGreaterThan(PAGE_SIZE)
        slots.forEach((slot) => {
            expect(slot).toHaveAttribute('data-state', 'loading')
            expect(slot).toHaveAttribute('aria-busy', 'true')
            expect(slot.querySelector('svg, img')).toBeNull()
        })
    })

    it('credits the art sources in the footer', () => {
        renderPage()
        expect(screen.getByRole('contentinfo')).toHaveTextContent(/HoYoverse/)
    })

    describe('newsletter form', () => {
        const form = () => screen.getByRole('form', { name: 'Newsletter' })
        const email = () =>
            within(form()).getByRole('textbox', { name: 'Email' })
        const consent = () =>
            within(form()).getByRole('checkbox', { name: /weekly digest/ })
        const submit = () =>
            within(form()).getByRole('button', { name: 'Subscribe' })

        it('requires an email and consent; no toast while invalid', async () => {
            const user = userEvent.setup()
            const onSubscribe = vi.fn()
            renderPage({ onSubscribe })
            await user.click(submit())
            expect(email()).toHaveAttribute('aria-invalid', 'true')
            expect(email()).toHaveAccessibleDescription(/Enter your email/)
            expect(within(form()).getByText(/Tick the box/)).toBeInTheDocument()
            expect(email()).toHaveFocus()
            expect(onSubscribe).not.toHaveBeenCalled()
            expect(screen.queryByText(/Subscribed/)).not.toBeInTheDocument()

            await user.type(email(), 'proxy@')
            await user.click(submit())
            expect(email()).toHaveAccessibleDescription(
                /doesn.t look like an email/
            )
            expect(onSubscribe).not.toHaveBeenCalled()
        })

        it('announces and focuses the consent error when only consent is missing', async () => {
            const user = userEvent.setup()
            const onSubscribe = vi.fn()
            renderPage({ onSubscribe })
            await user.type(email(), 'phaethon@sixth-street.ne')
            await user.click(submit())
            expect(onSubscribe).not.toHaveBeenCalled()
            expect(consent()).toHaveFocus()
            expect(consent()).toHaveAttribute('aria-invalid', 'true')
            expect(consent()).toHaveAccessibleDescription(/Tick the box/)
            const alerts = within(form()).getAllByRole('alert')
            expect(
                alerts.some((el) => /Tick the box/.test(el.textContent ?? ''))
            ).toBe(true)
        })

        it('clears an error once the field is fixed', async () => {
            const user = userEvent.setup()
            renderPage()
            await user.click(submit())
            await user.type(email(), 'phaethon@sixth-street.ne')
            expect(email()).not.toHaveAttribute('aria-invalid', 'true')
            await user.click(consent())
            expect(
                within(form()).queryByText(/Tick the box/)
            ).not.toBeInTheDocument()
        })

        it('submits a valid form: toast, callback and reset', async () => {
            const user = userEvent.setup()
            const onSubscribe = vi.fn()
            renderPage({ onSubscribe })
            await user.type(email(), 'phaethon@sixth-street.ne')
            await user.click(consent())
            await user.click(submit())
            expect(onSubscribe).toHaveBeenCalledWith('phaethon@sixth-street.ne')
            expect(await screen.findByText(/Subscribed/)).toBeInTheDocument()
            expect(email()).toHaveValue('')
            expect(consent()).not.toBeChecked()
        })

        it('submits with Enter in the field', async () => {
            const user = userEvent.setup()
            const onSubscribe = vi.fn()
            renderPage({ onSubscribe })
            await user.click(consent())
            await user.type(email(), 'belle@random-play.ne{Enter}')
            expect(onSubscribe).toHaveBeenCalledWith('belle@random-play.ne')
        })
    })

    it('opens an FAQ answer', async () => {
        const user = userEvent.setup()
        renderPage()
        const q = screen.getByRole('button', { name: 'How do I unsubscribe?' })
        expect(q).toHaveAttribute('aria-expanded', 'false')
        await user.click(q)
        expect(q).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText(/one-click unsubscribe/)).toBeVisible()
    })

    it('calls the hero callbacks', async () => {
        const user = userEvent.setup()
        const onTrailer = vi.fn()
        renderPage({ onTrailer })
        await user.click(screen.getByRole('button', { name: /Trailer/ }))
        expect(onTrailer).toHaveBeenCalledTimes(1)
    })
})
