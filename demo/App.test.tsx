import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App, parseSlug } from './App'
import { ROUTES } from './routes'

function goTo(hash: string) {
  act(() => {
    window.location.hash = hash
    fireEvent(window, new HashChangeEvent('hashchange'))
  })
}

beforeEach(() => {
  window.location.hash = ''
  try {
    window.localStorage.clear()
  } catch {
    /* ignore */
  }
})

afterEach(() => {
  window.location.hash = ''
})

describe('parseSlug', () => {
  it('reads #/<slug>; an empty hash is the launcher; a plain in-page anchor is not a route', () => {
    expect(parseSlug('')).toBe('')
    expect(parseSlug('#')).toBe('')
    expect(parseSlug('#/')).toBe('')
    expect(parseSlug('#/events')).toBe('events')
    expect(parseSlug('#/events/extra?x=1')).toBe('events')
    // '#ikd-news' etc. are in-page anchors (native scrolling), not routes
    expect(parseSlug('#events')).toBeNull()
    expect(parseSlug('#ikd-news')).toBeNull()
  })
})

describe('demo App', () => {
  it('renders the launcher with one link per example page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /example pages/i })).toBeInTheDocument()
    const main = screen.getByRole('main')
    for (const route of ROUTES) {
      const link = within(main).getByRole('link', { name: route.title })
      expect(link).toHaveAttribute('href', `#/${route.slug}`)
    }
    expect(within(main).getAllByRole('link')).toHaveLength(ROUTES.length)
    // no Home pill on the launcher itself
    expect(screen.queryByRole('link', { name: /^home$/i })).not.toBeInTheDocument()
  })

  it('every page module is wired to a unique slug', () => {
    expect(new Set(ROUTES.map((r) => r.slug)).size).toBe(ROUTES.length)
    expect(ROUTES.map((r) => r.slug)).toEqual(['trivia', 'inter-knot-dispatch'])
  })

  it('navigates to a page via the hash and back home with the Home pill', async () => {
    render(<App />)
    goTo('#/trivia')
    await waitFor(() => expect(screen.queryByRole('heading', { level: 1, name: /example pages/i })).not.toBeInTheDocument())
    expect(document.querySelector('[data-slug="trivia"]')).not.toBeNull()
    // The trivia app is a responsive web page that scales itself: it must not be letterboxed in a Stage.
    expect(document.querySelector('[data-slug="trivia"] .zzz-stage')).toBeNull()

    const home = screen.getByRole('link', { name: /^home$/i })
    expect(home).toHaveAttribute('href', '#/')
    goTo('#/')
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: /example pages/i })).toBeInTheDocument())
  })

  it('docks the controls at the top on full-screen pages and at the bottom on the launcher and web pages', async () => {
    const user = userEvent.setup()
    render(<App />)
    const chrome = () => screen.getByRole('region', { name: /demo controls/i })
    expect(chrome()).toHaveAttribute('data-dock', 'bottom')

    for (const route of ROUTES) {
      goTo(`#/${route.slug}`)
      await waitFor(() => expect(document.querySelector(`[data-slug="${route.slug}"]`)).not.toBeNull())
      expect(chrome()).toHaveAttribute('data-dock', route.frame === 'web' ? 'bottom' : 'top')
    }

    goTo('#/trivia')
    await waitFor(() => expect(chrome()).toHaveAttribute('data-dock', 'bottom'))
    await user.click(within(chrome()).getByRole('button', { name: /display options/i }))
    expect(within(chrome()).getByRole('tab', { name: '0.7x' })).toBeInTheDocument()

    goTo('#/')
    await waitFor(() => expect(chrome()).toHaveAttribute('data-dock', 'bottom'))
  })

  it('keeps the current page when an in-page anchor changes the hash', async () => {
    render(<App />)
    goTo('#/inter-knot-dispatch')
    await waitFor(() => expect(document.querySelector('[data-slug="inter-knot-dispatch"]')).not.toBeNull())
    const page = document.querySelector('[data-slug="inter-knot-dispatch"]')
    for (const anchor of ['#ikd-news', '#download', '#article-n01', '#privacy']) {
      goTo(anchor)
      expect(screen.queryByRole('heading', { level: 1, name: /example pages/i })).not.toBeInTheDocument()
      // same mounted page (not remounted), so the browser can scroll to the anchor target
      expect(document.querySelector('[data-slug="inter-knot-dispatch"]')).toBe(page)
    }
    goTo('#/')
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: /example pages/i })).toBeInTheDocument())
  })

  it('drops the stale art-mode setting and renders launcher tiles as image slots, never drawn art', () => {
    window.localStorage.setItem('zzz-demo:art', 'placeholder')
    render(<App />)
    const main = screen.getByRole('main')
    // one image slot (examples/art ArtSlot <picture class="zart">) per tile, and no SVG inside any slot
    const slots = main.querySelectorAll('.zart')
    expect(slots).toHaveLength(ROUTES.length)
    for (const slot of slots) expect(slot.querySelector('svg')).toBeNull()
    for (const img of main.querySelectorAll<HTMLImageElement>('.zart img')) {
      expect(img.src).toMatch(/^https:\/\/static\.nanoka\.cc\//)
    }
    expect(window.localStorage.getItem('zzz-demo:art')).toBeNull()
  })

  it('shows the launcher for an unknown slug', () => {
    window.location.hash = '#/nope'
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /example pages/i })).toBeInTheDocument()
  })

  it('opens the display options with the scale tabs only (no art setting)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /display options/i }))
    // Art is always the real game art loaded by URL: there is no art mode to switch.
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    expect(screen.queryByText(/game art/i)).not.toBeInTheDocument()

    // the web default is selected first
    expect(screen.getByRole('tab', { name: '0.7x' })).toHaveAttribute('aria-selected', 'true')
    expect(document.querySelector<HTMLElement>('.zzz-demo-root')!.style.getPropertyValue('--zzz-scale')).toBe('0.7')
    await user.click(screen.getByRole('tab', { name: '1x' }))
    expect(screen.getByRole('tab', { name: '1x' })).toHaveAttribute('aria-selected', 'true')
    expect(document.querySelector<HTMLElement>('.zzz-demo-root')!.style.getPropertyValue('--zzz-scale')).toBe('1')
  })

  it('display options is a disclosure: aria-expanded, aria-controls only while open, Escape closes', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByRole('button', { name: /display options/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).not.toHaveAttribute('aria-pressed')
    expect(toggle).not.toHaveAttribute('aria-controls')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panelId = toggle.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    const panel = document.getElementById(panelId!)
    expect(panel).not.toBeNull()
    expect(within(panel!).getByRole('tab', { name: '0.7x' })).toBeInTheDocument()

    // Escape from inside the panel closes it and returns focus to the button
    within(panel!).getByRole('tab', { name: '0.7x' }).focus()
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('tab', { name: '0.7x' })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('moves focus to the new page after navigation and back to the activated tile on Home', async () => {
    render(<App />)
    const route = ROUTES[0]!
    within(screen.getByRole('main')).getByRole('link', { name: route.title }).focus()
    goTo(`#/${route.slug}`)
    await waitFor(() => expect(document.querySelector(`[data-slug="${route.slug}"]`)).toHaveFocus())
    // The page itself may also contain a region with the same name (e.g. the trivia Hero), so pick the frame.
    const frame = screen.getAllByRole('region', { name: route.title }).find((el) => el.classList.contains('zzz-demo-page'))
    expect(frame).toHaveFocus()

    goTo('#/')
    await waitFor(() =>
      expect(within(screen.getByRole('main')).getByRole('link', { name: route.title })).toHaveFocus(),
    )
  })
})
