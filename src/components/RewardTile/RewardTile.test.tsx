import { createRef } from 'react'
import { render, screen, within } from '@testing-library/react'
import { RewardTile, RewardTileGroup } from './RewardTile'

describe('RewardTile', () => {
  it('renders the count and name as text and hides the decorative card', () => {
    const { container } = render(<RewardTile name="Battery Charge" count={300} rarity="a" art={<svg data-testid="art" />} />)
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getByText('Battery Charge')).toHaveClass('zzz-reward-tile__name')
    const card = container.querySelector('.zzz-item-card')!
    expect(card).toHaveClass('zzz-item-card--reward', 'zzz-item-card--rarity-a')
    expect(card).toHaveAttribute('aria-hidden', 'true')
    expect(card.tagName).toBe('DIV')
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByTestId('art').closest('.zzz-item-card__art')).not.toBeNull()
  })

  it('omits the count strip without a count', () => {
    const { container } = render(<RewardTile name="Denny" />)
    expect(container.querySelector('.zzz-reward-tile__count')).toBeNull()
  })

  it('passes props, className, style and ref through', () => {
    const ref = createRef<HTMLDivElement>()
    render(<RewardTile ref={ref} name="x" className="extra" style={{ marginTop: 2 }} data-testid="t" />)
    const el = screen.getByTestId('t')
    expect(ref.current).toBe(el)
    expect(el).toHaveClass('zzz-reward-tile', 'extra')
    expect(el.style.marginTop).toBe('2px')
  })

  it('RewardTileGroup renders a list of tiles', () => {
    render(
      <RewardTileGroup aria-label="Rewards">
        <RewardTile name="A" count={1} />
        {null}
        <RewardTile name="B" count={2} />
      </RewardTileGroup>,
    )
    const list = screen.getByRole('list', { name: 'Rewards' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })
})
