import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders a status with the default label', () => {
    render(<Spinner />)
    const s = screen.getByRole('status')
    expect(s).toHaveTextContent('Loading')
    expect(s).toHaveClass('zzz-spinner', 'zzz-spinner--ring')
    expect(s).toHaveAttribute('data-tone', 'accent')
  })

  it('takes a custom label and the chevron variant (three hatched chevrons, decorative svg)', () => {
    const { container } = render(<Spinner variant="chevrons" label="Loading agents" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading agents')
    expect(container.querySelectorAll('.zzz-spinner__chevron')).toHaveLength(3)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    const ids = Array.from(container.querySelectorAll('pattern')).map((p) => p.id)
    expect(new Set(ids).size).toBe(3)
  })

  it('pattern ids stay unique across instances', () => {
    const { container } = render(
      <>
        <Spinner variant="chevrons" />
        <Spinner variant="chevrons" />
      </>,
    )
    const ids = Array.from(container.querySelectorAll('pattern')).map((p) => p.id)
    expect(new Set(ids).size).toBe(6)
  })

  it('scales size in design units and passes tone, className, style, ref', () => {
    let node: HTMLSpanElement | null = null
    render(
      <Spinner
        size={64}
        tone="white"
        className="x"
        style={{ margin: 0 }}
        ref={(n) => {
          node = n
        }}
      />,
    )
    const s = screen.getByRole('status')
    expect(s.style.getPropertyValue('--zzz-spinner-size')).toBe('calc(64 * var(--zzz-px))')
    expect(s).toHaveAttribute('data-tone', 'white')
    expect(s).toHaveClass('x')
    expect(node).toBe(s)
  })

  it('lets role be overridden (e.g. inside an existing live region)', () => {
    render(<Spinner role="img" aria-label="busy" />)
    expect(screen.getByRole('img', { name: 'busy' })).toBeInTheDocument()
  })
})
