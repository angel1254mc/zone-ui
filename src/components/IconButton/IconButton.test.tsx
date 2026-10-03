import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { IconButton } from './IconButton'

// Vitest runs with css: false, so the size rules are checked as text.
const css = readFileSync(resolve(__dirname, 'IconButton.css'), 'utf8')

const Glyph = () => <svg data-testid="glyph" />

describe('IconButton', () => {
  it('renders a button named by label, glyph hidden', () => {
    const { container } = render(<IconButton icon={<Glyph />} label="Filter" />)
    const btn = screen.getByRole('button', { name: 'Filter' })
    expect(btn).toHaveAttribute('aria-label', 'Filter')
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).toHaveClass('zzz-icon-button', 'zzz-mat-pill', 'zzz-pressable', 'zzz-focusable', 'zzz-icon-button--md')
    expect(container.querySelector('.zzz-icon-button__glyph')).toHaveAttribute('aria-hidden', 'true')
  })

  it('an explicit aria-label wins over label', () => {
    render(<IconButton icon={<Glyph />} label="Filter" aria-label="Open filters" />)
    expect(screen.getByRole('button', { name: 'Open filters' })).toBeInTheDocument()
  })

  it('applies size and tone modifiers', () => {
    const { rerender } = render(<IconButton icon={<Glyph />} label="Sort" size="sort" />)
    expect(screen.getByRole('button')).toHaveClass('zzz-icon-button--sort')
    rerender(<IconButton icon={<Glyph />} label="Lock" tone="lockOn" />)
    expect(screen.getByRole('button')).toHaveClass('zzz-icon-button--lock-on')
    rerender(<IconButton icon={<Glyph />} label="Minus" size="stepper" />)
    expect(screen.getByRole('button')).toHaveClass('zzz-icon-button--stepper')
    rerender(<IconButton icon={<Glyph />} label="Search" size="mission" />)
    expect(screen.getByRole('button')).toHaveClass('zzz-icon-button--mission')
  })

  it('passes ref, className and native props', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<IconButton ref={ref} icon={<Glyph />} label="Trash" className="x" title="Discard" />)
    expect(ref.current).toBe(screen.getByRole('button'))
    expect(ref.current).toHaveClass('x')
    expect(ref.current).toHaveAttribute('title', 'Discard')
  })

  it('is not a toggle unless asked (no aria-pressed)', () => {
    render(<IconButton icon={<Glyph />} label="Info" />)
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed')
  })

  it('uncontrolled toggle flips aria-pressed and reports changes', async () => {
    const onChange = vi.fn()
    render(<IconButton toggle icon={<Glyph />} label="Lock" onPressedStateChange={onChange} />)
    const btn = screen.getByRole('button', { name: 'Lock' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(onChange).toHaveBeenLastCalledWith(true)
    await userEvent.keyboard(' ')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('controlled toggle follows pressedState', async () => {
    function Harness() {
      const [on, setOn] = useState(true)
      return (
        <>
          <IconButton toggle pressedState={on} onPressedStateChange={setOn} icon={<Glyph />} label="Favourite" />
          <span data-testid="state">{String(on)}</span>
        </>
      )
    }
    render(<Harness />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('state')).toHaveTextContent('false')
  })

  it('controlled without onChange stays put', async () => {
    render(<IconButton toggle pressedState={false} icon={<Glyph />} label="Lock" />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('iconOn swaps the glyph while on', () => {
    render(
      <IconButton
        toggle
        defaultPressedState
        icon={<svg data-testid="off" />}
        iconOn={<svg data-testid="on" />}
        label="Lock"
      />,
    )
    expect(screen.getByTestId('on')).toBeInTheDocument()
    expect(screen.queryByTestId('off')).toBeNull()
  })

  it('onClick can cancel the toggle with preventDefault', async () => {
    render(<IconButton toggle icon={<Glyph />} label="Lock" onClick={(e) => e.preventDefault()} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('disabled blocks clicks and toggling', async () => {
    const onClick = vi.fn()
    render(<IconButton toggle disabled onClick={onClick} icon={<Glyph />} label="Plus" />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('pressed forces data-pressed; Enter flashes it', () => {
    vi.useFakeTimers()
    try {
      const { rerender } = render(<IconButton pressed icon={<Glyph />} label="Star" />)
      expect(screen.getByRole('button')).toHaveAttribute('data-pressed', '')
      rerender(<IconButton icon={<Glyph />} label="Star" />)
      const btn = screen.getByRole('button')
      expect(btn).not.toHaveAttribute('data-pressed')
      fireEvent.keyDown(btn, { key: 'Enter' })
      expect(btn).toHaveAttribute('data-pressed', '')
      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(btn).not.toHaveAttribute('data-pressed')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('IconButton sizes (sm / md / lg web scale + legacy presets)', () => {
  it('defaults to md and maps sm / md / lg to modifier classes and data-size', () => {
    const { rerender } = render(<IconButton icon={<Glyph />} label="Filter" />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-size', 'md')
    for (const size of ['sm', 'md', 'lg'] as const) {
      rerender(<IconButton icon={<Glyph />} label="Filter" size={size} />)
      expect(btn).toHaveClass(`zzz-icon-button--${size}`)
      expect(btn).toHaveAttribute('data-size', size)
    }
  })

  it('keeps the legacy preset values working', () => {
    const { rerender } = render(<IconButton icon={<Glyph />} label="Sort" size="sort" />)
    const btn = screen.getByRole('button')
    for (const size of ['sort', 'stepper', 'key', 'mission'] as const) {
      rerender(<IconButton icon={<Glyph />} label="Sort" size={size} />)
      expect(btn).toHaveClass(`zzz-icon-button--${size}`)
      expect(btn).toHaveAttribute('data-size', size)
    }
  })

  it('sizes the circle and glyph from the control tokens and scales ring / bevel / keyline / outset', () => {
    for (const size of ['sm', 'md', 'lg']) {
      expect(css).toContain(`var(--zzz-size-control-${size})`)
      expect(css).toContain(`var(--zzz-size-control-icon-${size})`)
    }
    expect(css).toMatch(/\.zzz-icon-button\.zzz-icon-button--sm\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-sm-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toMatch(/\.zzz-icon-button\.zzz-icon-button--lg\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-lg-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toMatch(/--zzz-mat-ring: calc\(var\(--zzz-border-width-ring\) \* var\(--zzz-control-ratio\)\)/)
    expect(css).toMatch(/--zzz-press-outset: calc\(var\(--zzz-size-control-press-outset\) \* var\(--zzz-control-ratio\)\)/)
    expect(css).toMatch(/--zzz-mat-bevel:[^;]*var\(--zzz-control-ratio\)/)
    expect(css).toMatch(/--zzz-shadow-keyline: 0 0 0 calc\(var\(--zzz-border-width-keyline\) \* var\(--zzz-control-ratio\)\)/)
  })
})
