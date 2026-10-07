import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { BottomBar, UidFooter, SignalBars } from '.'

describe('BottomBar', () => {
    it('renders left and right slots', () => {
        render(
            <BottomBar
                left={<button>Compare</button>}
                right={<button>Enhance</button>}
            />
        )
        expect(
            screen
                .getByRole('button', { name: 'Compare' })
                .closest('.zzz-bottom-bar__left')
        ).not.toBeNull()
        expect(
            screen
                .getByRole('button', { name: 'Enhance' })
                .closest('.zzz-bottom-bar__right')
        ).not.toBeNull()
    })

    it('renders key hints at the right and the storage separator on request', () => {
        const { container } = render(
            <BottomBar hints={[{ keyCap: 'T', label: 'Unlock' }]} separator />
        )
        expect(
            container.querySelector('.zzz-bottom-bar__hints')
        ).toHaveTextContent('Unlock')
        expect(container.querySelector('.zzz-bottom-bar')).toHaveAttribute(
            'data-separator'
        )
    })

    it('passes ref / className / native props', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <BottomBar
                ref={ref}
                className="c"
                aria-label="Actions"
                role="group"
            />
        )
        expect(screen.getByRole('group', { name: 'Actions' })).toBe(ref.current)
        expect(ref.current).toHaveClass('zzz-bottom-bar', 'c')
    })
})

describe('UidFooter', () => {
    it('renders "UID: <uid>" and 3 signal bars', () => {
        const { container } = render(<UidFooter uid="1000000001" />)
        expect(screen.getByText('UID: 1000000001')).toBeInTheDocument()
        expect(
            container.querySelectorAll('.zzz-signal-bars__bar')
        ).toHaveLength(3)
        expect(
            container.querySelectorAll('.zzz-signal-bars__bar[data-on]')
        ).toHaveLength(3)
    })

    it('dims the bars above the signal level and labels the strength', () => {
        const { container } = render(<UidFooter uid="1" signal={1} />)
        expect(
            container.querySelectorAll('.zzz-signal-bars__bar[data-on]')
        ).toHaveLength(1)
        expect(
            screen.getByRole('img', { name: 'Connection 1 of 3' })
        ).toBeInTheDocument()
    })

    it('SignalBars can be decorative', () => {
        const { container } = render(<SignalBars decorative />)
        expect(container.querySelector('svg')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
    })
})
