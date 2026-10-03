import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  it('is an image labelled "3 of 5 stars"', () => {
    const { container } = render(<StarRating value={3} />)
    expect(screen.getByRole('img', { name: '3 of 5 stars' })).toBeInTheDocument()
    expect(container.querySelectorAll('.zzz-star-rating__star')).toHaveLength(5)
    expect(container.querySelectorAll('.zzz-star-rating__star[data-filled]')).toHaveLength(3)
  })

  it('fills from the left', () => {
    const { container } = render(<StarRating value={2} />)
    const stars = [...container.querySelectorAll('.zzz-star-rating__star')]
    expect(stars.map((s) => s.hasAttribute('data-filled'))).toEqual([true, true, false, false, false])
  })

  it('clamps out-of-range values and floors fractions', () => {
    const { rerender } = render(<StarRating value={9} />)
    expect(screen.getByRole('img', { name: '5 of 5 stars' })).toBeInTheDocument()
    rerender(<StarRating value={-2} />)
    expect(screen.getByRole('img', { name: '0 of 5 stars' })).toBeInTheDocument()
    rerender(<StarRating value={2.7} />)
    expect(screen.getByRole('img', { name: '2 of 5 stars' })).toBeInTheDocument()
  })

  it('honours max', () => {
    const { container } = render(<StarRating value={1} max={3} />)
    expect(screen.getByRole('img', { name: '1 of 3 stars' })).toBeInTheDocument()
    expect(container.querySelectorAll('.zzz-star-rating__star')).toHaveLength(3)
  })

  it.each(['card', 'pill', 'bar', 'large', 'onLime'] as const)('size %s sets its modifier', (size) => {
    const { container } = render(<StarRating value={1} size={size} />)
    expect(container.firstElementChild).toHaveClass(`zzz-star-rating--${size}`)
  })

  it('outlines stars by default, and can turn it off', () => {
    const { container, rerender } = render(<StarRating value={1} size="card" />)
    expect(container.firstElementChild).toHaveAttribute('data-outline')
    expect(container.querySelectorAll('.zzz-star-rating__outline').length).toBeGreaterThan(0)
    rerender(<StarRating value={1} size="pill" outline={false} />)
    expect(container.firstElementChild).not.toHaveAttribute('data-outline')
    expect(container.querySelectorAll('.zzz-star-rating__outline')).toHaveLength(0)
  })

  it('accepts a custom label, className and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<StarRating value={4} label="Refinement 4" className="x" ref={ref} />)
    const el = screen.getByRole('img', { name: 'Refinement 4' })
    expect(el).toHaveClass('x')
    expect(ref.current).toBe(el)
  })
})
