import { render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { EmptyStatRow, StatGrid, StatRow } from '.'

describe('StatRow', () => {
  it('renders a standalone row as its own <dl> with a term and a definition', () => {
    const { container } = render(<StatRow label="Base ATK" value={684} />)
    const dl = container.firstElementChild as HTMLElement
    expect(dl.tagName).toBe('DL')
    expect(dl).toHaveClass('zzz-stat-row', 'zzz-stat-row--panel')
    expect(screen.getByRole('term')).toHaveTextContent('Base ATK')
    expect(screen.getByRole('definition')).toHaveTextContent('684')
  })

  it('renders a <div> group inside StatGrid, which is the <dl>', () => {
    const { container } = render(
      <StatGrid columns={2} variant="agent">
        <StatRow label="HP" value="17,066" highlight />
        <StatRow label="ATK" value="2,155" />
      </StatGrid>,
    )
    const dl = container.firstElementChild as HTMLElement
    expect(dl.tagName).toBe('DL')
    expect(dl).toHaveClass('zzz-stat-grid', 'zzz-stat-grid--cols-2', 'zzz-stat-grid--agent')
    const rows = dl.querySelectorAll(':scope > div')
    expect(rows).toHaveLength(2)
    // the grid variant is inherited by the rows
    expect(rows[0]).toHaveClass('zzz-stat-row--agent', 'zzz-stat-row--highlight')
    expect(rows[1]).not.toHaveClass('zzz-stat-row--highlight')
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['HP', 'ATK'])
  })

  it('a row variant overrides the grid variant', () => {
    render(
      <StatGrid variant="grid">
        <StatRow label="Base ATK" value={684} variant="panel" data-testid="r" />
      </StatGrid>,
    )
    expect(screen.getByTestId('r')).toHaveClass('zzz-stat-row--panel')
  })

  it('appends a roll-count tag after the label', () => {
    render(<StatRow label="CRIT Rate" value="4.8%" rollCount={2} />)
    const term = screen.getByRole('term')
    expect(term).toHaveTextContent('CRIT Rate +2')
    expect(within(term).getByText('+2')).toHaveClass('zzz-stat-row__roll')
  })

  it('renders the icon slot hidden from assistive tech', () => {
    render(<StatRow label="HP" value={1} icon={<svg data-testid="ico" />} />)
    expect(screen.getByTestId('ico').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('fit="wrap" and fit=true set modifier classes', () => {
    const { rerender } = render(<StatRow label="Automatic Adrenaline Accumulation" value={2} fit="wrap" data-testid="r" />)
    expect(screen.getByTestId('r')).toHaveClass('zzz-stat-row--wrap')
    rerender(<StatRow label="Anomaly Proficiency" value={152} fit data-testid="r" />)
    expect(screen.getByTestId('r').querySelector('.zzz-text--fit')).not.toBeNull()
  })

  it('passes className, style, native props and ref through', () => {
    const ref = createRef<HTMLElement>()
    render(<StatRow ref={ref} label="A" value="B" className="x" style={{ width: 10 }} id="row" />)
    expect(ref.current).toBe(document.getElementById('row'))
    expect(ref.current).toHaveClass('x')
    expect(ref.current).toHaveStyle({ width: '10px' })
  })
})

describe('EmptyStatRow', () => {
  it('renders the EMPTY capsule with an accessible term', () => {
    const { container } = render(<EmptyStatRow />)
    const root = container.firstElementChild as HTMLElement
    expect(root.tagName).toBe('DL')
    expect(root).toHaveClass('zzz-empty-stat-row', 'zzz-stat-row--grid')
    expect(screen.getByRole('term')).toHaveTextContent('Empty slot')
    expect(root).toHaveTextContent('EMPTY')
  })

  it('is a <div> group inside StatGrid and accepts a custom label', () => {
    const { container } = render(
      <StatGrid columns={2}>
        <StatRow label="Base ATK" value={684} />
        <EmptyStatRow label="No sub-stat" />
      </StatGrid>,
    )
    const rows = container.querySelectorAll('dl > div')
    expect(rows[1]).toHaveClass('zzz-empty-stat-row')
    expect(within(rows[1] as HTMLElement).getByRole('term')).toHaveTextContent('No sub-stat')
  })
})
