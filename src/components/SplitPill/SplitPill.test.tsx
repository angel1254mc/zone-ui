import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { SplitPill } from '.'

describe('SplitPill', () => {
  it('renders two list items with their labels and hidden icons', () => {
    render(
      <SplitPill
        items={[
          { icon: <svg data-testid="fire" />, label: 'Fire' },
          { icon: <svg data-testid="rup" />, label: 'Rupture' },
        ]}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items.map((i) => i.textContent)).toEqual(['Fire', 'Rupture'])
    expect(screen.getByTestId('fire').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(items[1]).toHaveClass('zzz-split-pill__half--second')
  })

  it('passes aria-label, className and ref through', () => {
    const ref = createRef<HTMLDivElement>()
    render(<SplitPill ref={ref} aria-label="Attribute and specialty" className="x" items={[{ label: 'Ice' }, { label: 'Attack' }]} />)
    expect(screen.getByRole('list', { name: 'Attribute and specialty' })).toBe(ref.current)
    expect(ref.current).toHaveClass('zzz-split-pill', 'x')
  })
})
