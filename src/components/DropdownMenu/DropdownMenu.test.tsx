import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { DropdownMenu } from './DropdownMenu'
import type { DropdownMenuItem, DropdownMenuProps } from './DropdownMenu'

const items: DropdownMenuItem[] = [
    { id: 'news', label: 'News' },
    { id: 'notices', label: 'Notices' },
    { id: 'locked', label: 'Nightly build', disabled: true },
    { id: 'events', label: 'Events' },
    { id: 'media', label: 'Media' },
]

function Menu(props: Partial<DropdownMenuProps>) {
    return (
        <DropdownMenu
            trigger={<button>More</button>}
            items={items}
            {...props}
        />
    )
}

describe('DropdownMenu', () => {
    it('Tab closes and moves focus to the element AFTER the trigger (menu button pattern)', async () => {
        const user = userEvent.setup()
        render(
            <>
                <button>Before</button>
                <Menu />
                <button>After</button>
            </>
        )
        screen.getByRole('button', { name: 'More' }).focus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        await user.tab()
        expect(screen.queryByRole('menu')).toBeNull()
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
    })

    it('Shift+Tab closes and moves focus to the element BEFORE the trigger', async () => {
        const user = userEvent.setup()
        render(
            <>
                <button>Before</button>
                <Menu />
                <button>After</button>
            </>
        )
        screen.getByRole('button', { name: 'More' }).focus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        await user.tab({ shift: true })
        expect(screen.queryByRole('menu')).toBeNull()
        expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus()
    })

    it('on Tab the trigger holds focus when the browser default runs (not prevented)', async () => {
        const user = userEvent.setup()
        render(<Menu />)
        await user.click(screen.getByRole('button', { name: 'More' }))
        const item = screen.getByRole('menuitem', { name: 'News' })
        const notPrevented = fireEvent.keyDown(item, { key: 'Tab' })
        expect(notPrevented).toBe(true)
        expect(screen.getByRole('button', { name: 'More' })).toHaveFocus()
    })

    it('trigger is a menu button, closed by default', () => {
        render(<Menu />)
        const btn = screen.getByRole('button', { name: 'More' })
        expect(btn).toHaveAttribute('aria-haspopup', 'menu')
        expect(btn).toHaveAttribute('aria-expanded', 'false')
        expect(screen.queryByRole('menu')).toBeNull()
    })

    it('click opens on the first item; the menu is labelled by the trigger', async () => {
        const user = userEvent.setup()
        render(<Menu />)
        const btn = screen.getByRole('button', { name: 'More' })
        await user.click(btn)
        const menu = screen.getByRole('menu', { name: 'More' })
        expect(btn).toHaveAttribute('aria-expanded', 'true')
        expect(btn).toHaveAttribute('aria-controls', menu.id)
        expect(screen.getAllByRole('menuitem')).toHaveLength(5)
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        expect(
            screen.getByRole('menuitem', { name: 'Nightly build' })
        ).toHaveAttribute('aria-disabled', 'true')
    })

    it('arrow keys move (skipping disabled, wrapping), Home / End jump', async () => {
        const user = userEvent.setup()
        render(<Menu />)
        screen.getByRole('button').focus()
        await user.keyboard('{ArrowDown}')
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        await user.keyboard('{ArrowDown}{ArrowDown}')
        expect(screen.getByRole('menuitem', { name: 'Events' })).toHaveFocus()
        await user.keyboard('{ArrowUp}')
        expect(screen.getByRole('menuitem', { name: 'Notices' })).toHaveFocus()
        await user.keyboard('{End}')
        expect(screen.getByRole('menuitem', { name: 'Media' })).toHaveFocus()
        await user.keyboard('{ArrowDown}')
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        await user.keyboard('{Home}{ArrowUp}')
        expect(screen.getByRole('menuitem', { name: 'Media' })).toHaveFocus()
    })

    it('ArrowUp on the trigger opens on the last item', async () => {
        const user = userEvent.setup()
        render(<Menu />)
        screen.getByRole('button').focus()
        await user.keyboard('{ArrowUp}')
        expect(screen.getByRole('menuitem', { name: 'Media' })).toHaveFocus()
    })

    it('typeahead jumps to matching items', async () => {
        const user = userEvent.setup()
        render(<Menu />)
        await user.click(screen.getByRole('button'))
        await user.keyboard('e')
        expect(screen.getByRole('menuitem', { name: 'Events' })).toHaveFocus()
        await user.keyboard('m')
        // "em" matches nothing → focus stays; after the timeout a fresh "m" finds Media
        expect(screen.getByRole('menuitem', { name: 'Events' })).toHaveFocus()
        await new Promise((r) => setTimeout(r, 550))
        await user.keyboard('m')
        expect(screen.getByRole('menuitem', { name: 'Media' })).toHaveFocus()
        await user.keyboard('{Home}')
        await new Promise((r) => setTimeout(r, 550))
        await user.keyboard('n')
        // repeated single letter cycles: News → Notices (Nightly build is disabled)
        expect(screen.getByRole('menuitem', { name: 'Notices' })).toHaveFocus()
    })

    it('Enter selects, closes and returns focus to the trigger', async () => {
        const user = userEvent.setup()
        const onSelect = vi.fn()
        const itemSelect = vi.fn()
        render(
            <DropdownMenu
                trigger={<button>More</button>}
                items={[{ id: 'a', label: 'Alpha', onSelect: itemSelect }]}
                onSelect={onSelect}
            />
        )
        screen.getByRole('button').focus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('menuitem', { name: 'Alpha' })).toHaveFocus()
        await user.keyboard('{Enter}')
        expect(onSelect).toHaveBeenCalledWith('a')
        expect(itemSelect).toHaveBeenCalled()
        expect(screen.queryByRole('menu')).toBeNull()
        expect(screen.getByRole('button', { name: 'More' })).toHaveFocus()
    })

    it('click on an item selects; disabled items do nothing', async () => {
        const user = userEvent.setup()
        const onSelect = vi.fn()
        render(<Menu onSelect={onSelect} />)
        await user.click(screen.getByRole('button'))
        await user.click(
            screen.getByRole('menuitem', { name: 'Nightly build' })
        )
        expect(onSelect).not.toHaveBeenCalled()
        expect(screen.getByRole('menu')).toBeInTheDocument()
        await user.click(screen.getByRole('menuitem', { name: 'Events' }))
        expect(onSelect).toHaveBeenCalledWith('events')
        expect(screen.queryByRole('menu')).toBeNull()
    })

    it('Escape closes and returns focus; click outside closes', async () => {
        const user = userEvent.setup()
        render(
            <>
                <Menu />
                <p>outside</p>
            </>
        )
        await user.click(screen.getByRole('button'))
        await user.keyboard('{Escape}')
        expect(screen.queryByRole('menu')).toBeNull()
        expect(screen.getByRole('button')).toHaveFocus()
        await user.click(screen.getByRole('button'))
        await user.click(screen.getByText('outside'))
        expect(screen.queryByRole('menu')).toBeNull()
    })

    it('controlled open + onOpenChange', async () => {
        const user = userEvent.setup()
        const spy = vi.fn()
        function C() {
            const [open, setOpen] = useState(false)
            return (
                <>
                    <Menu
                        open={open}
                        onOpenChange={(o) => {
                            spy(o)
                            setOpen(o)
                        }}
                    />
                    <span data-testid="s">{String(open)}</span>
                </>
            )
        }
        render(<C />)
        await user.click(screen.getByRole('button'))
        expect(spy).toHaveBeenLastCalledWith(true)
        expect(screen.getByTestId('s')).toHaveTextContent('true')
        await user.keyboard('{Escape}')
        expect(spy).toHaveBeenLastCalledWith(false)
    })

    it('defaultOpen renders without stealing focus; className / ref / aria-label go to the menu', () => {
        let node: HTMLDivElement | null = null
        render(
            <Menu
                defaultOpen
                aria-label="Site sections"
                className="x"
                topBar={false}
                ref={(n) => {
                    node = n
                }}
            />
        )
        const menu = screen.getByRole('menu', { name: 'Site sections' })
        expect(menu).toHaveClass('zzz-dropdown', 'x')
        expect(menu).not.toHaveAttribute('data-top-bar')
        expect(node).toBe(menu)
        expect(document.body).toHaveFocus()
    })
    it('a user onKeyDown on the menu runs first; preventDefault skips the built-in handling', async () => {
        const user = userEvent.setup()
        const onKeyDown = vi.fn()
        const { unmount } = render(<Menu onKeyDown={onKeyDown} />)
        await user.click(screen.getByRole('button', { name: 'More' }))
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
        await user.keyboard('{ArrowDown}')
        expect(onKeyDown).toHaveBeenCalledTimes(1)
        expect(onKeyDown.mock.calls[0][0].key).toBe('ArrowDown')
        expect(screen.getByRole('menuitem', { name: 'Notices' })).toHaveFocus()
        unmount()

        const blocker = vi.fn(
            (e: { key: string; preventDefault: () => void }) => {
                if (e.key === 'ArrowDown') e.preventDefault()
            }
        )
        render(<Menu onKeyDown={blocker} />)
        await user.click(screen.getByRole('button', { name: 'More' }))
        await user.keyboard('{ArrowDown}')
        expect(blocker).toHaveBeenCalled()
        expect(screen.getByRole('menuitem', { name: 'News' })).toHaveFocus()
    })
})
