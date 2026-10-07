import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ItemCard } from '../ItemCard'
import { ItemGrid } from './ItemGrid'

interface Item {
    id: string
    name: string
}
const items: Item[] = Array.from({ length: 7 }, (_, i) => ({
    id: `w${i}`,
    name: `Item ${i}`,
}))
const getId = (it: Item) => it.id
const renderItem = (it: Item) => (
    <ItemCard name={it.name} level={60} rarity="s" />
)

function Grid(props: Partial<Parameters<typeof ItemGrid<Item>>[0]>) {
    return (
        <ItemGrid
            aria-label="W-Engines"
            items={items}
            getId={getId}
            renderItem={renderItem}
            columns={3}
            {...props}
        />
    )
}

const options = () => screen.getAllByRole('option')

describe('ItemGrid', () => {
    it('renders a named listbox of options named by their cards (no nested buttons)', () => {
        render(<Grid />)
        expect(screen.getByRole('listbox', { name: 'W-Engines' })).toHaveClass(
            'zzz-item-grid',
            'zzz-item-grid--storage'
        )
        expect(options()).toHaveLength(7)
        expect(options()[0]).toHaveAccessibleName('Item 0, Level 60, Rank S')
        expect(screen.queryByRole('button')).toBeNull()
        // cards take the density size
        expect(options()[0].firstElementChild).toHaveClass(
            'zzz-item-card--storage'
        )
    })

    it('uses the density card size', () => {
        render(<Grid density="material" />)
        expect(options()[0].firstElementChild).toHaveClass(
            'zzz-item-card--material'
        )
    })

    it('uncontrolled: defaultValue selects, click selects and calls onValueChange / onActivate', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const onActivate = vi.fn()
        render(
            <Grid
                defaultValue="w1"
                onValueChange={onValueChange}
                onActivate={onActivate}
            />
        )
        expect(options()[1]).toHaveAttribute('aria-selected', 'true')
        expect(options()[1].firstElementChild).toHaveAttribute('data-selected')
        await user.click(options()[4])
        expect(options()[4]).toHaveAttribute('aria-selected', 'true')
        expect(options()[1]).toHaveAttribute('aria-selected', 'false')
        expect(onValueChange).toHaveBeenCalledWith('w4', items[4])
        expect(onActivate).toHaveBeenCalledWith('w4', items[4])
    })

    it('controlled: follows value and reports changes', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const { rerender } = render(
            <Grid value="w0" onValueChange={onValueChange} />
        )
        await user.click(options()[2])
        expect(onValueChange).toHaveBeenCalledWith('w2', items[2])
        expect(options()[0]).toHaveAttribute('aria-selected', 'true')
        rerender(<Grid value="w2" onValueChange={onValueChange} />)
        expect(options()[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('roving tabindex: one tab stop, on the selected item', async () => {
        const user = userEvent.setup()
        render(<Grid defaultValue="w3" />)
        expect(options().filter((o) => o.tabIndex === 0)).toEqual([
            options()[3],
        ])
        await user.tab()
        expect(options()[3]).toHaveFocus()
    })

    it('2-D arrow keys move focus and selection; Home/End and Ctrl+Home/End', async () => {
        const user = userEvent.setup()
        function Controlled() {
            const [v, setV] = useState<string | null>('w0')
            return <Grid value={v} onValueChange={setV} />
        }
        render(<Controlled />)
        await user.tab()
        expect(options()[0]).toHaveFocus()
        await user.keyboard('{ArrowRight}')
        expect(options()[1]).toHaveFocus()
        expect(options()[1]).toHaveAttribute('aria-selected', 'true')
        await user.keyboard('{ArrowDown}')
        expect(options()[4]).toHaveFocus()
        await user.keyboard('{ArrowDown}')
        expect(options()[4]).toHaveFocus() // no item 7 below: stays
        await user.keyboard('{ArrowLeft}{ArrowUp}')
        expect(options()[0]).toHaveFocus()
        await user.keyboard('{ArrowUp}{ArrowLeft}')
        expect(options()[0]).toHaveFocus() // clamped
        await user.keyboard('{End}')
        expect(options()[2]).toHaveFocus()
        await user.keyboard('{Home}')
        expect(options()[0]).toHaveFocus()
        await user.keyboard('{Control>}{End}{/Control}')
        expect(options()[6]).toHaveFocus()
        expect(options()[6]).toHaveAttribute('aria-selected', 'true')
        await user.keyboard('{Control>}{Home}{/Control}')
        expect(options()[0]).toHaveFocus()
    })

    it('Enter and Space activate the focused item', async () => {
        const user = userEvent.setup()
        const onActivate = vi.fn()
        render(<Grid onActivate={onActivate} />)
        await user.tab()
        await user.keyboard('{Enter}')
        await user.keyboard(' ')
        expect(onActivate).toHaveBeenCalledTimes(2)
        expect(onActivate).toHaveBeenLastCalledWith('w0', items[0])
        expect(options()[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('stagger sets per-tile index and can be turned off', () => {
        const { rerender } = render(<Grid />)
        expect(screen.getByRole('listbox')).toHaveAttribute(
            'data-stagger',
            'fast'
        )
        expect(options()[5].style.getPropertyValue('--zzz-i')).toBe('5')
        rerender(<Grid stagger="slow" />)
        expect(screen.getByRole('listbox')).toHaveAttribute(
            'data-stagger',
            'slow'
        )
        rerender(<Grid stagger="none" />)
        expect(screen.getByRole('listbox')).not.toHaveAttribute('data-stagger')
    })

    it('wraps in a ScrollArea when scrollbar is set', () => {
        const { container } = render(
            <Grid scrollbar="left" className="outer" />
        )
        const root = container.firstElementChild!
        expect(root).toHaveClass(
            'zzz-scroll-area',
            'zzz-scroll-area--left',
            'outer'
        )
        expect(
            root.querySelector('.zzz-scroll-area__viewport [role="listbox"]')
        ).not.toBeNull()
        expect(
            root.querySelector('.zzz-scroll-area__viewport')
        ).toHaveAttribute('tabindex', '-1')
    })

    it('passes props, className, style and ref to the listbox', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <Grid
                ref={ref}
                className="x"
                style={{ marginTop: 4 }}
                data-testid="g"
            />
        )
        const el = screen.getByTestId('g')
        expect(ref.current).toBe(el)
        expect(el).toHaveAttribute('role', 'listbox')
        expect(el).toHaveClass('x')
        expect(el.style.marginTop).toBe('4px')
        expect(el.style.getPropertyValue('--zzz-grid-cols')).toBe('3')
    })

    it('renders nothing selected and index 0 tabbable with no value', () => {
        render(<Grid />)
        expect(
            options().every((o) => o.getAttribute('aria-selected') === 'false')
        ).toBe(true)
        expect(options()[0].tabIndex).toBe(0)
    })
    describe('item set changes keep keyboard focus', () => {
        const letters = (list: string[]) =>
            list.map((id) => ({ id, name: id.toUpperCase() }))
        const G = ({
            list,
            stagger,
        }: {
            list: string[]
            stagger?: 'fast' | 'none'
        }) => (
            <ItemGrid
                aria-label="g"
                items={letters(list)}
                getId={getId}
                columns={4}
                stagger={stagger}
                renderItem={(x) => <span>{x.name}</span>}
            />
        )

        it.each(['none', 'fast'] as const)(
            'reorder keeps the same option node and its focus (stagger %s)',
            (stagger) => {
                const { rerender } = render(
                    <G list={['a', 'b', 'c', 'd']} stagger={stagger} />
                )
                const a = options()[0]
                a.focus()
                rerender(<G list={['b', 'a', 'c', 'd']} stagger={stagger} />)
                expect(options()[1]).toBe(a)
                expect(document.activeElement).toBe(a)
                // roving tab stop follows the focused id, not its old index
                expect(a.tabIndex).toBe(0)
                expect(options()[0].tabIndex).toBe(-1)
            }
        )

        it('replays the entrance by flipping the grid replay attribute, not by remounting', () => {
            const { rerender } = render(<G list={['a', 'b', 'c']} />)
            const grid = screen.getByRole('listbox')
            const before = grid.getAttribute('data-replay')
            rerender(<G list={['c', 'b', 'a']} />)
            expect(grid.getAttribute('data-replay')).not.toBe(before)
            rerender(<G list={['c', 'b', 'a']} />)
            expect(grid.getAttribute('data-replay')).not.toBe(before)
        })

        it('removing the focused item moves focus to the option now at its index', () => {
            const { rerender } = render(<G list={['a', 'b', 'c', 'd']} />)
            options()[1].focus()
            rerender(<G list={['a', 'c', 'd']} />)
            expect(document.activeElement).toBe(options()[1])
            expect(options()[1]).toHaveTextContent('C')
            expect(options()[1].tabIndex).toBe(0)
        })

        it('does not steal focus when focus was outside the grid', () => {
            const { rerender } = render(
                <>
                    <button type="button">sort</button>
                    <G list={['a', 'b', 'c']} />
                </>
            )
            screen.getByRole('button', { name: 'sort' }).focus()
            rerender(
                <>
                    <button type="button">sort</button>
                    <G list={['c', 'a']} />
                </>
            )
            expect(document.activeElement).toBe(
                screen.getByRole('button', { name: 'sort' })
            )
        })
    })
})
