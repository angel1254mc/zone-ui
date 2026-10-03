import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { SectionLabel } from '.'

describe('SectionLabel', () => {
  it('renders an h3 heading by default', () => {
    render(<SectionLabel>Base Stat</SectionLabel>)
    const h = screen.getByRole('heading', { level: 3, name: 'Base Stat' })
    expect(h).toHaveClass('zzz-section-label')
  })

  it('supports other heading levels and a non-heading div', () => {
    const { rerender } = render(<SectionLabel as="h4">Main Stat</SectionLabel>)
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Main Stat')
    rerender(<SectionLabel as="div">Sub-Stats</SectionLabel>)
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByText('Sub-Stats').tagName).toBe('DIV')
  })

  it('flush removes the indent class; className, id and ref pass through', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <SectionLabel ref={ref} flush className="x" id="lbl">
        Rarity
      </SectionLabel>,
    )
    expect(ref.current).toBe(document.getElementById('lbl'))
    expect(ref.current).toHaveClass('zzz-section-label--flush', 'x')
  })
})
