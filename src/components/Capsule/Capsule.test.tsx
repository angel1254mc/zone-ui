import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Capsule } from './Capsule'

describe('Capsule', () => {
    it('renders its content in a default-tone capsule', () => {
        render(<Capsule>Lv. 60</Capsule>)
        const el = screen.getByText('Lv. 60')
        expect(el.closest('.zzz-capsule')).toHaveClass(
            'zzz-capsule--default',
            'zzz-capsule--md'
        )
    })

    it.each(['empty', 'danger'] as const)(
        'tone %s sets its modifier',
        (tone) => {
            const { container } = render(<Capsule tone={tone}>x</Capsule>)
            expect(container.firstElementChild).toHaveClass(
                `zzz-capsule--${tone}`
            )
        }
    )

    it('shows EMPTY by default in the empty tone', () => {
        render(<Capsule tone="empty" />)
        expect(screen.getByText('EMPTY')).toBeInTheDocument()
    })

    it.each(['sm', 'md', 'lg'] as const)(
        'size %s sets its modifier',
        (size) => {
            const { container } = render(<Capsule size={size}>1</Capsule>)
            expect(container.firstElementChild).toHaveClass(
                `zzz-capsule--${size}`
            )
        }
    )

    it('passes props, className, style and ref through', () => {
        const ref = createRef<HTMLSpanElement>()
        render(
            <Capsule
                ref={ref}
                className="x"
                style={{ width: 110 }}
                aria-label="Owned 20 of 60"
                data-testid="c"
            >
                20/60
            </Capsule>
        )
        const el = screen.getByTestId('c')
        expect(ref.current).toBe(el)
        expect(el).toHaveClass('x')
        expect(el).toHaveAttribute('aria-label', 'Owned 20 of 60')
        expect(el.style.width).toBe('110px')
    })
})
