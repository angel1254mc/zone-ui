import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryTag } from './index'

describe('CategoryTag', () => {
    it('renders its label as plain text', () => {
        render(<CategoryTag>Notices</CategoryTag>)
        const tag = screen.getByText('Notices')
        expect(tag).toHaveClass('zzz-category-tag')
        expect(tag).toHaveAttribute('data-skin', 'web')
        expect(tag.tagName).toBe('SPAN')
    })

    it('supports the game skin and pass-through props', () => {
        const ref = createRef<HTMLSpanElement>()
        render(
            <CategoryTag
                ref={ref}
                skin="game"
                className="extra"
                style={{ marginLeft: 4 }}
                title="Category"
            >
                Events
            </CategoryTag>
        )
        const tag = screen.getByText('Events')
        expect(ref.current).toBe(tag)
        expect(tag).toHaveAttribute('data-skin', 'game')
        expect(tag).toHaveClass('zzz-category-tag', 'extra')
        expect(tag).toHaveAttribute('title', 'Category')
        expect(tag.style.marginLeft).toBe('4px')
    })
})
