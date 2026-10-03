import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { PageTitle, SectionTitleStrip } from '.'

describe('PageTitle', () => {
  it('renders an upright h1 in the title role/tone', () => {
    render(<PageTitle>Manage Item</PageTitle>)
    const h = screen.getByRole('heading', { level: 1, name: 'Manage Item' })
    expect(h).toHaveClass('zzz-page-title', 'zzz-text-title', 'zzz-tone-title')
    expect(h.querySelector('.zzz-italic')).toBeNull()
  })

  it('renders another heading level / element via `as`', () => {
    render(<PageTitle as="h2">W-Engine Overclocking</PageTitle>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('W-Engine Overclocking')
  })

  it('passes className, style and ref through', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <PageTitle ref={ref} className="x" style={{ color: 'red' }} data-testid="t">
        T
      </PageTitle>,
    )
    expect(ref.current).toBe(screen.getByTestId('t'))
    expect(ref.current).toHaveClass('x')
    expect(ref.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })
})

describe('SectionTitleStrip', () => {
  it('renders the title with a bracketed count (spaces inside the brackets)', () => {
    render(<SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} />)
    const h = screen.getByRole('heading', { level: 2 })
    expect(h).toHaveTextContent('W-Engine Storage [ 113/2000 ]')
    expect(h).toHaveClass('zzz-text-bodyLg', 'zzz-tone-subtle')
  })

  it('draws the Storage rule by default and can drop it', () => {
    const { container, rerender } = render(<SectionTitleStrip title="A" />)
    expect(container.querySelector('.zzz-section-strip__rule')).toBeInTheDocument()
    rerender(<SectionTitleStrip title="A" rule={false} />)
    expect(container.querySelector('.zzz-section-strip__rule')).toBeNull()
  })

  it('renders the right slot and passes className / ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<SectionTitleStrip ref={ref} className="c" title="A" right={<button>tab</button>} />)
    expect(screen.getByRole('button', { name: 'tab' })).toBeInTheDocument()
    expect(ref.current).toHaveClass('zzz-section-strip', 'c')
  })
})
