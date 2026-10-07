import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsCard } from './index'

describe('NewsCard', () => {
    it('is a link named by its title and described by date and description', () => {
        render(
            <NewsCard
                href="/news/1"
                art={<img src="x.png" alt="" />}
                date="2024/07/04"
                category="Notices"
                title="Signal Search Probability Details"
                description="Details of the exclusive channel rates."
            />
        )
        const link = screen.getByRole('link', {
            name: 'Signal Search Probability Details',
        })
        expect(link).toHaveAttribute('href', '/news/1')
        expect(link).toHaveClass('zzz-news-card')
        expect(link).toHaveAttribute('data-tone', 'dark')
        expect(link).toHaveAccessibleDescription(
            '2024/07/04 Notices Details of the exclusive channel rates.'
        )
        expect(screen.getByText('Notices')).toHaveClass('zzz-category-tag')
    })

    it('hides the art from assistive tech and accepts any node as art', () => {
        const { container } = render(
            <NewsCard href="#" title="T" art={<svg data-testid="art" />} />
        )
        const art = container.querySelector(
            '.zzz-news-card__art'
        ) as HTMLElement
        expect(art).toHaveAttribute('aria-hidden', 'true')
        expect(screen.getByTestId('art')).toBeInTheDocument()
    })

    it('renders a custom category node, and omits empty parts', () => {
        const { container } = render(
            <NewsCard href="#" title="T" category={<b>Custom</b>} />
        )
        expect(screen.getByText('Custom').tagName).toBe('B')
        expect(container.querySelector('.zzz-news-card__date')).toBeNull()
        expect(container.querySelector('.zzz-news-card__desc')).toBeNull()
    })

    it('is focusable and follows clicks', async () => {
        const onClick = vi.fn((e: { preventDefault: () => void }) =>
            e.preventDefault()
        )
        render(<NewsCard href="/x" title="Read me" onClick={onClick} />)
        await userEvent.tab()
        expect(screen.getByRole('link', { name: 'Read me' })).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('supports tone, skin, width and pass-through props', () => {
        const ref = createRef<HTMLAnchorElement>()
        render(
            <NewsCard
                ref={ref}
                href="#"
                title="T"
                category="News"
                tone="light"
                skin="game"
                width={300}
                className="extra"
                style={{ margin: 2 }}
            />
        )
        const link = screen.getByRole('link')
        expect(ref.current).toBe(link)
        expect(link).toHaveAttribute('data-tone', 'light')
        expect(link).toHaveClass('extra')
        expect(link.style.getPropertyValue('--zzz-news-card-width')).toBe(
            'calc(300 * var(--zzz-px))'
        )
        expect(link.style.margin).toBe('2px')
        expect(screen.getByText('News')).toHaveAttribute('data-skin', 'game')
    })
})
