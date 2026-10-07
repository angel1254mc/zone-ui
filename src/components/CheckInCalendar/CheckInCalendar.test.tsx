import { render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { CheckInCalendar } from './CheckInCalendar'
import { CheckInTile } from './CheckInTile'

const DAYS = Array.from({ length: 14 }, (_, i) => ({
    day: i + 1,
    count: [30, 6, 30, 1, 40, 6, 40, 20, 40, 1, 60, 6, 60, 1][i],
    itemName: 'Film',
    claimed: i === 0,
    special: i === 3 || i === 13,
    tag: i === 13 ? 'Outfit\nSelect' : undefined,
}))

describe('CheckInTile', () => {
    it('renders a named group with the padded day and count', () => {
        render(
            <CheckInTile
                day={2}
                count={6}
                itemName="Bangboo Reel"
                item={<svg data-testid="art" />}
            />
        )
        const tile = screen.getByRole('group', {
            name: 'Day 2, 6 × Bangboo Reel',
        })
        expect(within(tile).getByText('02')).toBeInTheDocument()
        expect(within(tile).getByText('DAY')).toBeInTheDocument()
        expect(
            tile.querySelector('.zzz-check-in-tile__count')
        ).toHaveTextContent('× 06')
        expect(screen.getByTestId('art')).toBeInTheDocument()
        expect(tile.querySelector('.zzz-claimed-check')).toBeNull()
        expect(
            tile.querySelector('.zzz-check-in-tile__type svg')
        ).not.toBeNull()
    })

    it('claimed: lime tick, greyed count class, "claimed" in the name', () => {
        render(<CheckInTile day={1} count={30} itemName="Film" claimed />)
        const tile = screen.getByRole('group', {
            name: 'Day 1, 30 × Film, claimed',
        })
        expect(tile).toHaveClass('zzz-check-in-tile--claimed')
        expect(tile.querySelector('.zzz-claimed-check')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
    })

    it('special + tag; typeIcon null hides the disc; className/ref pass through', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <CheckInTile
                ref={ref}
                className="x"
                day={14}
                count={1}
                special
                tag={'Outfit\nSelect'}
                typeIcon={null}
            />
        )
        const tile = screen.getByRole('group', {
            name: 'Day 14, 1 × reward, special reward, Outfit Select',
        })
        expect(tile).toBe(ref.current)
        expect(tile).toHaveClass('zzz-check-in-tile--special', 'x')
        expect(tile.querySelector('.zzz-check-in-tile__tag')).toHaveTextContent(
            'Outfit Select'
        )
        expect(tile.querySelector('.zzz-check-in-tile__type')).toBeNull()
    })
})

describe('CheckInCalendar', () => {
    it('renders an ordered list of 14 tiles in 7 columns', () => {
        render(
            <CheckInCalendar
                days={DAYS}
                aria-label="Surprise Screening Plan check-in"
            />
        )
        const list = screen.getByRole('list', {
            name: 'Surprise Screening Plan check-in',
        })
        expect(list.tagName).toBe('OL')
        expect(within(list).getAllByRole('listitem')).toHaveLength(14)
        expect(list.style.getPropertyValue('--zzz-check-in-columns')).toBe('7')
        expect(
            within(list).getByRole('group', {
                name: 'Day 1, 30 × Film, claimed',
            })
        ).toBeInTheDocument()
    })

    it('columns, className, ref', () => {
        const ref = createRef<HTMLOListElement>()
        render(
            <CheckInCalendar
                ref={ref}
                className="x"
                columns={4}
                days={DAYS.slice(0, 4)}
            />
        )
        expect(ref.current).toHaveClass('zzz-check-in-calendar', 'x')
        expect(
            ref.current!.style.getPropertyValue('--zzz-check-in-columns')
        ).toBe('4')
    })
})
