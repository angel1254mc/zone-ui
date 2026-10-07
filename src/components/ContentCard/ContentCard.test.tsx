import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { ContentCard } from './ContentCard'

describe('ContentCard', () => {
    it('renders an article labelled by its title, with header, body and footer', () => {
        render(
            <ContentCard
                eyebrow="Question 3 / 5"
                trailing={<span data-testid="timer">0:24</span>}
                title="Which city hosts the finals?"
                footer={<button type="button">Next</button>}
            >
                <p>Pick one.</p>
            </ContentCard>
        )
        const card = screen.getByRole('article', {
            name: 'Which city hosts the finals?',
        })
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Which city hosts the finals?',
            })
        ).toBeInTheDocument()
        expect(
            card.querySelector('.zzz-content-card__header')
        ).toHaveTextContent('Question 3 / 5')
        expect(
            screen.getByTestId('timer').closest('.zzz-content-card__trailing')
        ).not.toBeNull()
        expect(card.querySelector('.zzz-content-card__body')).toHaveTextContent(
            'Pick one.'
        )
        expect(
            card.querySelector('.zzz-content-card__footer')
        ).toContainElement(screen.getByRole('button', { name: 'Next' }))
        expect(card).toHaveClass(
            'zzz-content-card',
            'zzz-content-card--default'
        )
    })

    it('omits the header strip, title and footer when not given', () => {
        render(<ContentCard aria-label="Plain">Body only</ContentCard>)
        const card = screen.getByRole('article', { name: 'Plain' })
        expect(card.querySelector('.zzz-content-card__header')).toBeNull()
        expect(card.querySelector('.zzz-content-card__title')).toBeNull()
        expect(card.querySelector('.zzz-content-card__footer')).toBeNull()
    })

    it('variants and media positions', () => {
        const { rerender } = render(
            <ContentCard
                title="T"
                variant="accent"
                media={<svg data-testid="m" />}
            >
                x
            </ContentCard>
        )
        const card = screen.getByRole('article')
        expect(card).toHaveClass(
            'zzz-content-card--accent',
            'zzz-content-card--media-top'
        )
        expect(card.querySelector('.zzz-content-card__edge')).not.toBeNull()
        expect(
            screen.getByTestId('m').closest('.zzz-content-card__media')
        ).not.toBeNull()
        rerender(
            <ContentCard
                title="T"
                variant="compact"
                media={<svg />}
                mediaPosition="side"
            >
                x
            </ContentCard>
        )
        expect(screen.getByRole('article')).toHaveClass(
            'zzz-content-card--compact',
            'zzz-content-card--media-side'
        )
        expect(
            screen.getByRole('article').querySelector('.zzz-content-card__edge')
        ).toBeNull()
    })

    it('titleAs sets the heading level; as sets the root element', () => {
        render(
            <ContentCard as="section" titleAs="h3" title="Settings">
                x
            </ContentCard>
        )
        expect(
            screen.getByRole('heading', { level: 3, name: 'Settings' })
        ).toBeInTheDocument()
        expect(screen.getByRole('region', { name: 'Settings' }).tagName).toBe(
            'SECTION'
        )
    })

    it('passes className, style, ref and native props through; explicit aria-labelledby wins', () => {
        const ref = createRef<HTMLElement>()
        render(
            <>
                <span id="ext">External</span>
                <ContentCard
                    ref={ref}
                    className="extra"
                    style={{ maxWidth: 600 }}
                    data-testid="c"
                    aria-labelledby="ext"
                    title="T"
                >
                    x
                </ContentCard>
            </>
        )
        const card = screen.getByTestId('c')
        expect(ref.current).toBe(card)
        expect(card).toHaveClass('extra')
        expect(card.style.maxWidth).toBe('600px')
        expect(card).toHaveAccessibleName('External')
    })
})
