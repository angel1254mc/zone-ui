import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StarsPill } from './StarsPill'

describe('StarsPill', () => {
    it('holds a star rating (panel size by default)', () => {
        const { container } = render(<StarsPill value={1} />)
        expect(container.firstElementChild).toHaveClass(
            'zzz-stars-pill',
            'zzz-stars-pill--panel'
        )
        expect(screen.getByRole('img', { name: '1 of 5 stars' })).toHaveClass(
            'zzz-star-rating--pill'
        )
        expect(screen.queryByRole('button')).toBeNull()
    })

    it('uses large stars in the large size', () => {
        render(<StarsPill value={3} size="large" />)
        expect(screen.getByRole('img', { name: '3 of 5 stars' })).toHaveClass(
            'zzz-star-rating--large'
        )
    })

    it('renders the Enhance >> sub-pill when onEnhance is given (click + keyboard)', async () => {
        const onEnhance = vi.fn()
        render(<StarsPill value={1} size="large" onEnhance={onEnhance} />)
        const btn = screen.getByRole('button', { name: 'Enhance' })
        await userEvent.click(btn)
        btn.focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        expect(onEnhance).toHaveBeenCalledTimes(3)
    })

    it('custom enhance label, forced pressed and disabled via enhanceProps', async () => {
        const onEnhance = vi.fn()
        const { rerender } = render(
            <StarsPill
                value={1}
                size="large"
                onEnhance={onEnhance}
                enhanceLabel="Refine"
                enhanceProps={{ 'data-pressed': '' } as object}
            />
        )
        expect(screen.getByRole('button', { name: 'Refine' })).toHaveAttribute(
            'data-pressed'
        )
        rerender(
            <StarsPill
                value={1}
                size="large"
                onEnhance={onEnhance}
                enhanceProps={{ disabled: true }}
            />
        )
        const btn = screen.getByRole('button', { name: 'Enhance' })
        expect(btn).toBeDisabled()
        await userEvent.click(btn)
        expect(onEnhance).not.toHaveBeenCalled()
    })

    it('renders a custom action slot instead of the built-in button', () => {
        render(
            <StarsPill
                value={2}
                size="large"
                action={<button type="button">Go</button>}
                onEnhance={() => {}}
            />
        )
        expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Enhance' })).toBeNull()
    })

    it('shows EMPTY instead of stars when empty', () => {
        render(<StarsPill value={0} empty />)
        expect(screen.getByText('EMPTY')).toBeInTheDocument()
        expect(screen.queryByRole('img')).toBeNull()
    })

    it('passes props and ref to the root', () => {
        const ref = createRef<HTMLDivElement>()
        render(<StarsPill ref={ref} value={1} className="x" data-testid="sp" />)
        expect(ref.current).toBe(screen.getByTestId('sp'))
        expect(ref.current).toHaveClass('x')
    })
})
