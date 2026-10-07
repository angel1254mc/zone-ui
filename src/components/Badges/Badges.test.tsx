import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewBadge } from './NewBadge'
import { PlusBadge } from './PlusBadge'
import { RankCoin } from './RankCoin'
import { RankBadge } from './RankBadge'
import { CombatBadge } from './CombatBadge'
import { SlotHexBadge } from './SlotHexBadge'
import { StatusCheck } from './StatusCheck'
import { RecommendBadge } from './RecommendBadge'

describe('NewBadge', () => {
    it('renders "NEW!" once for assistive tech (the stroke layer is hidden)', () => {
        const { container } = render(<NewBadge />)
        const root = container.firstElementChild as HTMLElement
        expect(root).toHaveClass(
            'zzz-new-badge',
            'zzz-new-badge--md',
            'zzz-badge--top-right'
        )
        expect(
            screen.getByText('NEW!', { selector: '.zzz-new-badge__fill' })
        ).toBeInTheDocument()
        expect(root.querySelector('.zzz-new-badge__stroke')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
    })

    it('supports size, placement, offset, custom text and pass-through props', () => {
        const ref = createRef<HTMLSpanElement>()
        const { container } = render(
            <NewBadge
                ref={ref}
                size="sm"
                placement="top-left"
                offset={[10, 12]}
                className="x"
                data-testid="nb"
            >
                UP!
            </NewBadge>
        )
        const root = container.firstElementChild as HTMLElement
        expect(ref.current).toBe(root)
        expect(root).toHaveClass(
            'zzz-new-badge--sm',
            'zzz-badge--top-left',
            'x'
        )
        expect(root.style.getPropertyValue('--zzz-badge-dx')).toBe('10')
        expect(root.style.getPropertyValue('--zzz-badge-dy')).toBe('12')
        expect(screen.getByTestId('nb')).toHaveTextContent('UP!')
    })

    it('placement inline drops the absolute positioning class', () => {
        const { container } = render(<NewBadge placement="inline" />)
        expect(container.firstElementChild).toHaveClass('zzz-badge--inline')
    })
})

describe('PlusBadge', () => {
    it('is a button named by its label', async () => {
        const onClick = vi.fn()
        render(<PlusBadge label="Get more Battery Charge" onClick={onClick} />)
        const btn = screen.getByRole('button', {
            name: 'Get more Battery Charge',
        })
        expect(btn).toHaveAttribute('type', 'button')
        await userEvent.click(btn)
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('activates from the keyboard (Enter flashes data-pressed, Space clicks)', async () => {
        const onClick = vi.fn()
        render(<PlusBadge label="More" onClick={onClick} />)
        const btn = screen.getByRole('button', { name: 'More' })
        btn.focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        expect(onClick).toHaveBeenCalledTimes(2)
    })

    it('shows the forced pressed state', () => {
        render(<PlusBadge label="More" data-pressed="" />)
        expect(screen.getByRole('button')).toHaveAttribute('data-pressed')
    })

    it('does not fire when disabled', async () => {
        const onClick = vi.fn()
        render(<PlusBadge label="More" disabled onClick={onClick} />)
        const btn = screen.getByRole('button', { name: 'More' })
        expect(btn).toBeDisabled()
        await userEvent.click(btn)
        expect(onClick).not.toHaveBeenCalled()
    })

    it('forwards ref', () => {
        const ref = createRef<HTMLButtonElement>()
        render(<PlusBadge label="More" ref={ref} />)
        expect(ref.current?.tagName).toBe('BUTTON')
    })
})

describe('RankCoin', () => {
    it.each(['S', 'A', 'B'] as const)(
        'renders rank %s as a labelled image',
        (rank) => {
            const { container } = render(<RankCoin rank={rank} />)
            expect(
                screen.getByRole('img', { name: `Rank ${rank}` })
            ).toBeInTheDocument()
            expect(container.firstElementChild).toHaveClass(
                `zzz-rank-coin--${rank.toLowerCase()}`
            )
        }
    )

    it('takes a size in design units and a custom label', () => {
        render(<RankCoin rank="S" size={44} label="S-rank" />)
        const el = screen.getByRole('img', { name: 'S-rank' })
        expect(el.style.getPropertyValue('--zzz-badge-size')).toBe('44')
    })

    it('can be decorative', () => {
        const { container } = render(<RankCoin rank="A" decorative />)
        expect(container.firstElementChild).toHaveAttribute(
            'aria-hidden',
            'true'
        )
        expect(screen.queryByRole('img')).toBeNull()
    })
})

describe('RankBadge', () => {
    it.each([
        ['S', 'Rank S'],
        ['A', 'Rank A'],
        ['infinity', 'Rank ∞'],
    ] as const)('renders %s', (rank, name) => {
        render(<RankBadge rank={rank} />)
        expect(screen.getByRole('img', { name })).toHaveClass(
            `zzz-rank-badge--${rank}`
        )
    })
})

describe('CombatBadge', () => {
    it('is labelled "Combat Readiness" by default', () => {
        render(<CombatBadge />)
        expect(
            screen.getByRole('img', { name: 'Combat Readiness' })
        ).toHaveClass('zzz-combat-badge')
    })
})

describe('SlotHexBadge', () => {
    it.each([1, 2, 3, 4, 5, 6] as const)('renders slot %s', (slot) => {
        const { container } = render(<SlotHexBadge slot={slot} />)
        expect(
            screen.getByRole('img', { name: `Slot ${slot}` })
        ).toBeInTheDocument()
        expect(
            container.querySelector(`.zzz-icon--slotDigit${slot}`)
        ).not.toBeNull()
    })

    it('can straddle the host corner', () => {
        const { container } = render(
            <SlotHexBadge slot={2} placement="top-left" />
        )
        expect(container.firstElementChild).toHaveClass('zzz-badge--top-left')
    })
})

describe('StatusCheck', () => {
    it('announces "Completed"', () => {
        render(<StatusCheck />)
        expect(screen.getByRole('img', { name: 'Completed' })).toHaveClass(
            'zzz-status-check'
        )
    })
})

describe('RecommendBadge', () => {
    it('announces "Recommended" by default and accepts a label', () => {
        const { rerender } = render(<RecommendBadge />)
        expect(
            screen.getByRole('img', { name: 'Recommended' })
        ).toBeInTheDocument()
        rerender(<RecommendBadge label="Suggested" placement="top-left" />)
        expect(screen.getByRole('img', { name: 'Suggested' })).toHaveClass(
            'zzz-badge--top-left'
        )
    })
})
