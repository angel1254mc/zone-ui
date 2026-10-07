import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { EventTitle } from './EventTitle'

describe('EventTitle', () => {
    it('renders an h1 heading with the event title role and outline', () => {
        render(<EventTitle>Angels Support Operation</EventTitle>)
        const h = screen.getByRole('heading', {
            level: 1,
            name: 'Angels Support Operation',
        })
        expect(h).toHaveClass(
            'zzz-event-title',
            'zzz-event-title--end',
            'zzz-text-eventTitle',
            'zzz-text--outline-event'
        )
    })
    it('supports another heading level and alignment', () => {
        render(
            <EventTitle as="h2" align="start">
                Surprise Screening Plan
            </EventTitle>
        )
        expect(screen.getByRole('heading', { level: 2 })).toHaveClass(
            'zzz-event-title--start'
        )
    })
    it('size sets the font size in design units', () => {
        render(<EventTitle size={47}>Their Secret Histories</EventTitle>)
        expect(screen.getByRole('heading').style.fontSize).toBe(
            'calc(47 * var(--zzz-px))'
        )
    })
    it('passes className, style, ref and native props', () => {
        const ref = createRef<HTMLHeadingElement>()
        render(
            <EventTitle ref={ref} className="x" style={{ color: 'red' }} id="t">
                T
            </EventTitle>
        )
        expect(ref.current).toBe(screen.getByRole('heading'))
        expect(ref.current).toHaveClass('x')
        expect(ref.current).toHaveAttribute('id', 't')
        expect(ref.current?.style.color).toBe('red')
    })
})
