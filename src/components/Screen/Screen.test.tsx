import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Screen } from '.'

describe('Screen', () => {
  it('renders header / main / footer landmarks around the slots', () => {
    render(
      <Screen topBar={<div>top</div>} bottomBar={<div>bottom</div>}>
        content
      </Screen>,
    )
    expect(screen.getByRole('banner')).toHaveTextContent('top')
    expect(screen.getByRole('main')).toHaveTextContent('content')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('bottom')
  })

  it('omits empty header / footer and renders the section strip in the header', () => {
    const { rerender } = render(<Screen>c</Screen>)
    expect(screen.queryByRole('banner')).toBeNull()
    expect(screen.queryByRole('contentinfo')).toBeNull()
    rerender(<Screen sectionStrip={<div>strip</div>}>c</Screen>)
    expect(screen.getByRole('banner')).toHaveTextContent('strip')
  })

  it('renders the UID footer from a string', () => {
    render(<Screen uid="1000000001">c</Screen>)
    expect(screen.getByText('UID: 1000000001')).toBeInTheDocument()
  })

  it('maps background variants and custom art', () => {
    const { container, rerender } = render(<Screen>c</Screen>)
    const root = container.firstElementChild!
    expect(root).toHaveAttribute('data-background', 'black')
    rerender(<Screen background="hatch">c</Screen>)
    expect(container.querySelector('.zzz-bg-hatch')).not.toBeNull()
    rerender(<Screen background="graffiti">c</Screen>)
    expect(container.querySelector('.zzz-graffiti')).not.toBeNull()
    rerender(<Screen background="mural">c</Screen>)
    expect(container.querySelector('.zzz-mural')).not.toBeNull()
    rerender(<Screen background={<img alt="" data-testid="art" />}>c</Screen>)
    expect(root).toHaveAttribute('data-background', 'art')
    expect(screen.getByTestId('art').closest('.zzz-screen__bg')).not.toBeNull()
  })

  it('calls onBack on Escape inside the screen', () => {
    const onBack = vi.fn()
    render(
      <Screen onBack={onBack}>
        <button>inside</button>
      </Screen>,
    )
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' })
    expect(onBack).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' })
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('does not call onBack when a child already handled Escape', () => {
    const onBack = vi.fn()
    render(
      <Screen onBack={onBack}>
        <button onKeyDown={(e) => e.preventDefault()}>inside</button>
      </Screen>,
    )
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' })
    expect(onBack).not.toHaveBeenCalled()
  })

  it('entrance fade can be switched off; ref / className pass through', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Screen ref={ref} className="c" entrance={false}>
        c
      </Screen>,
    )
    expect(ref.current).toHaveClass('zzz-screen', 'c')
    expect(ref.current).not.toHaveAttribute('data-entrance')
  })
})
