import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { RewardPreview } from './RewardPreview'

const ITEMS = [
    { name: 'Film', rarity: 's' as const },
    { name: 'Disc', rarity: 'a' as const },
    { name: 'Card', rarity: 'b' as const },
]

describe('RewardPreview', () => {
    it('renders a labelled section with a list of static preview cards', () => {
        render(<RewardPreview items={ITEMS} />)
        const section = screen.getByRole('region', { name: 'Reward Preview' })
        expect(
            within(section).getByRole('heading', {
                level: 3,
                name: 'Reward Preview',
            })
        ).toBeInTheDocument()
        const items = within(section).getAllByRole('listitem')
        expect(items).toHaveLength(3)
        expect(items[0].querySelector('.zzz-item-card')).toHaveClass(
            'zzz-item-card--preview'
        )
        expect(items[0].querySelector('button')).toBeNull()
        expect(within(items[0]).getByText(/Film, Rank S/)).toBeInTheDocument()
        expect(section.querySelector('.zzz-item-card__below')).toBeNull()
    })

    it('makes a card a button when it has onClick', async () => {
        const onClick = vi.fn()
        render(<RewardPreview items={[{ name: 'Film', onClick }]} />)
        await userEvent.click(screen.getByRole('button', { name: /Film/ }))
        expect(onClick).toHaveBeenCalled()
    })

    it('the ">" button calls onMore (mouse + keyboard)', async () => {
        const onMore = vi.fn()
        render(
            <RewardPreview
                items={ITEMS}
                onMore={onMore}
                moreLabel="Next rewards"
            />
        )
        const more = screen.getByRole('button', { name: 'Next rewards' })
        await userEvent.click(more)
        more.focus()
        await userEvent.keyboard('{Enter}')
        expect(onMore).toHaveBeenCalledTimes(2)
    })

    it('without onMore the ">" scrolls the list', async () => {
        render(<RewardPreview items={ITEMS} />)
        const list = screen.getByRole('list')
        const scrollTo = vi.fn()
        list.scrollTo = scrollTo as unknown as typeof list.scrollTo
        await userEvent.click(
            screen.getByRole('button', { name: 'More rewards' })
        )
        expect(scrollTo).toHaveBeenCalled()
    })

    it('notice slot, custom label, visible count, className and ref', () => {
        const ref = createRef<HTMLElement>()
        render(
            <RewardPreview
                ref={ref}
                className="x"
                items={ITEMS}
                label="Rewards"
                visible={4}
                notice={<span>Unlocked</span>}
            />
        )
        expect(screen.getByRole('region', { name: 'Rewards' })).toBe(
            ref.current
        )
        expect(ref.current).toHaveClass('zzz-reward-preview', 'x')
        expect(
            ref.current!.style.getPropertyValue('--zzz-reward-preview-visible')
        ).toBe('4')
        expect(screen.getByText('Unlocked')).toBeInTheDocument()
    })

    it('the static list is a keyboard-focusable, labelled scroller', () => {
        render(<RewardPreview items={ITEMS} />)
        const list = screen.getByRole('list', { name: 'Reward Preview' })
        expect(list).toHaveAttribute('tabindex', '0')
        expect(list).toHaveClass('zzz-focusable')
    })

    it('the list is not an extra tab stop when its tiles are buttons', () => {
        render(<RewardPreview items={[{ name: 'Film', onClick: () => {} }]} />)
        expect(screen.getByRole('list')).not.toHaveAttribute('tabindex')
    })

    it('the ">" uses the shared pressed recipe and flashes data-pressed on Enter', async () => {
        render(<RewardPreview items={ITEMS} onMore={() => {}} />)
        const more = screen.getByRole('button', { name: 'More rewards' })
        expect(more).toHaveClass('zzz-pressable')
        more.focus()
        await userEvent.keyboard('{Enter>}')
        expect(more).toHaveAttribute('data-pressed')
    })
})
