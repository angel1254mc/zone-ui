import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { EventRibbon } from './EventRibbon'

describe('EventRibbon', () => {
  it('renders the subtitle as text with decorative halftone ends', () => {
    const { container } = render(<EventRibbon>Main Story Season 3 New Chapter Unlocked</EventRibbon>)
    const text = screen.getByText('Main Story Season 3 New Chapter Unlocked')
    expect(text).toHaveClass('zzz-text-bodyXl')
    const root = container.firstElementChild!
    expect(root.tagName).toBe('P')
    expect(root).toHaveClass('zzz-event-ribbon')
    const dots = root.querySelectorAll('svg.zzz-event-ribbon__halftone')
    expect(dots).toHaveLength(2)
    dots.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'))
    expect(dots[0].querySelectorAll('circle').length).toBeGreaterThan(10)
  })
  it('passes className, native props and ref', () => {
    const ref = createRef<HTMLParagraphElement>()
    render(<EventRibbon ref={ref} className="x" id="r">Hi</EventRibbon>)
    expect(ref.current).toHaveClass('zzz-event-ribbon', 'x')
    expect(ref.current).toHaveAttribute('id', 'r')
  })
})
