import { createRef, useState } from 'react'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavBar } from './index'
import type { NavBarItem } from './index'

const items: NavBarItem[] = [
    { value: 'home', label: 'Homepage', href: '/' },
    { value: 'agents', label: 'Agents', href: '/agents' },
    { value: 'news', label: 'News & Info', href: '/news' },
]

describe('NavBar', () => {
    it('renders a banner with a labelled navigation and the active page marked', () => {
        render(
            <NavBar
                logo={<span>LOGO</span>}
                items={items}
                defaultValue="news"
                cta={{ label: 'Download Now', href: '/dl' }}
            />
        )
        const header = screen.getByRole('banner')
        expect(header).toHaveClass('zzz-navbar')
        expect(header).toHaveAttribute('data-skin', 'web')
        const nav = screen.getByRole('navigation', { name: 'Main' })
        const links = within(nav).getAllByRole('link')
        expect(links.map((l) => l.textContent)).toEqual([
            'Homepage',
            'Agents',
            'News & Info',
        ])
        expect(links[2]).toHaveAttribute('aria-current', 'page')
        expect(links[0]).not.toHaveAttribute('aria-current')
        expect(screen.getByText('LOGO')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Download Now' })
        ).toHaveAttribute('href', '/dl')
    })

    it('moves the active item on click (uncontrolled) and reports it', async () => {
        const onValueChange = vi.fn()
        render(
            <NavBar
                items={items.map(({ href: _h, ...i }) => i)}
                onValueChange={onValueChange}
            />
        )
        const nav = screen.getByRole('navigation', { name: 'Main' })
        const agents = within(nav).getByRole('button', { name: 'Agents' })
        await userEvent.click(agents)
        expect(agents).toHaveAttribute('aria-current', 'page')
        expect(onValueChange).toHaveBeenCalledWith('agents')
    })

    it('is controllable', async () => {
        function Controlled() {
            const [value, setValue] = useState('home')
            return (
                <>
                    <NavBar
                        items={items}
                        value={value}
                        onValueChange={setValue}
                    />
                    <output>{value}</output>
                </>
            )
        }
        render(<Controlled />)
        await userEvent.click(
            within(screen.getByRole('navigation', { name: 'Main' })).getByRole(
                'link',
                { name: 'Agents' }
            )
        )
        expect(screen.getByRole('status')).toHaveTextContent('agents')
    })

    it('collapses the items into the menu button when they overflow the bar (auto)', () => {
        const callbacks: ResizeObserverCallback[] = []
        const Original = globalThis.ResizeObserver
        globalThis.ResizeObserver = class {
            constructor(cb: ResizeObserverCallback) {
                callbacks.push(cb)
            }
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver
        try {
            render(<NavBar items={items} cta={{ label: 'Download Now' }} />)
            const header = screen.getByRole('banner')
            const nav = header.querySelector('.zzz-navbar__nav') as HTMLElement
            const size = { scroll: 600, client: 800 }
            Object.defineProperty(nav, 'scrollWidth', {
                configurable: true,
                get: () => size.scroll,
            })
            Object.defineProperty(nav, 'clientWidth', {
                configurable: true,
                get: () => size.client,
            })
            const fire = () =>
                act(() =>
                    callbacks.forEach((cb) => cb([], {} as ResizeObserver))
                )
            fire()
            expect(header).not.toHaveAttribute('data-overflow')
            size.client = 500
            fire()
            expect(header).toHaveAttribute('data-overflow', 'true')
            size.client = 640
            fire()
            expect(header).not.toHaveAttribute('data-overflow')
        } finally {
            globalThis.ResizeObserver = Original
        }
    })

    it('does not measure overflow unless collapse is auto', () => {
        render(<NavBar items={items} collapse="never" />)
        expect(screen.getByRole('banner')).not.toHaveAttribute('data-overflow')
    })

    it('opens and closes the collapsed menu with its toggle', async () => {
        const onMenuOpenChange = vi.fn()
        render(
            <NavBar
                items={items}
                onMenuOpenChange={onMenuOpenChange}
                cta={{ label: 'Download Now', href: '/dl' }}
            />
        )
        const toggle = screen.getByRole('button', { name: 'Menu' })
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        const menu = document.getElementById(
            toggle.getAttribute('aria-controls')!
        )!
        expect(menu).not.toBeVisible()
        await userEvent.click(toggle)
        expect(toggle).toHaveAttribute('aria-expanded', 'true')
        expect(menu).toBeVisible()
        expect(
            within(menu)
                .getAllByRole('link')
                .map((l) => l.textContent)
        ).toEqual(['Homepage', 'Agents', 'News & Info', 'Download Now'])
        // choosing an item closes the menu
        await userEvent.click(
            within(menu).getByRole('link', { name: 'Agents' })
        )
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        expect(onMenuOpenChange.mock.calls.map((c) => c[0])).toEqual([
            true,
            false,
        ])
    })

    it('closes the menu with Escape and returns focus to the toggle', async () => {
        render(<NavBar items={items} defaultMenuOpen />)
        const toggle = screen.getByRole('button', { name: 'Menu' })
        expect(toggle).toHaveAttribute('aria-expanded', 'true')
        within(document.getElementById(toggle.getAttribute('aria-controls')!)!)
            .getAllByRole('link')[0]
            .focus()
        await userEvent.keyboard('{Escape}')
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        expect(toggle).toHaveFocus()
    })

    it('marks disabled items and ignores them', async () => {
        const onValueChange = vi.fn()
        render(
            <NavBar
                items={[
                    items[0],
                    { value: 'soon', label: 'Coming soon', disabled: true },
                ]}
                onValueChange={onValueChange}
            />
        )
        const soon = within(
            screen.getByRole('navigation', { name: 'Main' })
        ).getByRole('button', { name: 'Coming soon' })
        expect(soon).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(soon)
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('supports skin, collapse, labels, actions and pass-through props', () => {
        const ref = createRef<HTMLElement>()
        render(
            <NavBar
                ref={ref}
                items={items}
                skin="game"
                collapse="always"
                navLabel="Site"
                menuLabel="Open menu"
                actions={<button type="button">Account</button>}
                className="extra"
                data-testid="n"
            />
        )
        const header = screen.getByTestId('n')
        expect(ref.current).toBe(header)
        expect(header).toHaveAttribute('data-skin', 'game')
        expect(header).toHaveAttribute('data-collapse', 'always')
        expect(header).toHaveClass('extra')
        expect(
            screen.getByRole('navigation', { name: 'Site' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Open menu' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Account' })
        ).toBeInTheDocument()
    })
})
