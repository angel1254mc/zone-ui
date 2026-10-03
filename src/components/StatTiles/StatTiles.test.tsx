import { render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { StatTile, StatTiles } from './StatTiles'

describe('StatTiles', () => {
  it('renders a description list of tiles (dt label, dd value)', () => {
    render(
      <StatTiles aria-label="Your stats">
        <StatTile label="Played" value={42} />
        <StatTile label="Win rate" value="87%" />
      </StatTiles>,
    )
    const list = screen.getByLabelText('Your stats')
    expect(list.tagName).toBe('DL')
    expect(list).toHaveClass('zzz-stat-tiles')
    const terms = within(list).getAllByRole('term')
    const defs = within(list).getAllByRole('definition')
    expect(terms.map((t) => t.textContent)).toEqual(['Played', 'Win rate'])
    expect(defs[0]).toHaveTextContent('42')
    expect(defs[1]).toHaveTextContent('87%')
  })

  it('a standalone StatTile is its own <dl>', () => {
    render(<StatTile label="Streak" value={5} data-testid="t" />)
    const tile = screen.getByTestId('t')
    expect(tile.tagName).toBe('DL')
    expect(within(tile).getByRole('term')).toHaveTextContent('Streak')
  })

  it('inside StatTiles a tile is a <div> group', () => {
    render(
      <StatTiles>
        <StatTile label="Streak" value={5} data-testid="t" />
      </StatTiles>,
    )
    expect(screen.getByTestId('t').tagName).toBe('DIV')
  })

  it('renders sub-label, delta with tone, and a decorative icon', () => {
    render(
      <StatTiles>
        <StatTile
          label="Score"
          value="4/5"
          sub="Top 12% today"
          delta="+1"
          deltaTone="positive"
          icon={<svg data-testid="icon" />}
          data-testid="t"
        />
        <StatTile label="Time" value="1:42" delta="-8 s" deltaTone="negative" data-testid="t2" />
      </StatTiles>,
    )
    const tile = screen.getByTestId('t')
    expect(tile).toHaveTextContent('Top 12% today')
    const delta = tile.querySelector('.zzz-stat-tile__delta')!
    expect(delta).toHaveTextContent('+1')
    expect(delta).toHaveAttribute('data-tone', 'positive')
    expect(screen.getByTestId('icon').closest('.zzz-stat-tile__icon')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('t2').querySelector('.zzz-stat-tile__delta')).toHaveAttribute('data-tone', 'negative')
  })

  it('infers the delta tone from a number and formats the sign', () => {
    render(
      <StatTiles>
        <StatTile label="A" value={1} delta={3} data-testid="a" />
        <StatTile label="B" value={1} delta={-2} data-testid="b" />
        <StatTile label="C" value={1} delta={0} data-testid="c" />
      </StatTiles>,
    )
    const d = (id: string) => screen.getByTestId(id).querySelector('.zzz-stat-tile__delta')!
    expect(d('a')).toHaveTextContent('+3')
    expect(d('a')).toHaveAttribute('data-tone', 'positive')
    expect(d('b')).toHaveTextContent('−2')
    expect(d('b')).toHaveAttribute('data-tone', 'negative')
    expect(d('c')).toHaveAttribute('data-tone', 'neutral')
  })

  it('marks a highlighted tile', () => {
    render(<StatTile label="Best" value={9} highlight data-testid="t" />)
    expect(screen.getByTestId('t')).toHaveClass('zzz-stat-tile--highlight')
  })

  it('sets a fixed column count or an auto-fit minimum width', () => {
    const { rerender } = render(<StatTiles data-testid="g" columns={3} />)
    const g = screen.getByTestId('g')
    expect(g.style.getPropertyValue('--zzz-stat-tiles-columns')).toBe('3')
    expect(g).toHaveClass('zzz-stat-tiles--columns')
    rerender(<StatTiles data-testid="g" minTileWidth={180} />)
    expect(g.style.getPropertyValue('--zzz-stat-tiles-min')).toBe('180')
    expect(g).not.toHaveClass('zzz-stat-tiles--columns')
  })

  it('supports the compact size', () => {
    render(<StatTiles data-testid="g" size="sm" />)
    expect(screen.getByTestId('g')).toHaveClass('zzz-stat-tiles--sm')
  })

  it('passes className, style and ref through', () => {
    const gridRef = createRef<HTMLDListElement>()
    const tileRef = createRef<HTMLElement>()
    render(
      <StatTiles ref={gridRef} className="g" style={{ marginTop: 1 }}>
        <StatTile ref={tileRef} label="x" value={1} className="t" />
      </StatTiles>,
    )
    expect(gridRef.current).toHaveClass('g')
    expect(gridRef.current!.style.marginTop).toBe('1px')
    expect(tileRef.current).toHaveClass('t')
  })
})
