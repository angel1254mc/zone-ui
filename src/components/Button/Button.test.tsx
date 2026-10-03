import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef } from 'react'
import { Button } from './Button'

// Vitest runs with css: false, so the size rules are checked as text.
const css = readFileSync(resolve(__dirname, 'Button.css'), 'utf8')

const Glyph = () => <svg data-testid="glyph" />

describe('Button', () => {
  it('renders a native button with the pill classes and its label', () => {
    render(<Button>View</Button>)
    const btn = screen.getByRole('button', { name: 'View' })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).toHaveClass('zzz-button', 'zzz-mat-pill', 'zzz-pressable', 'zzz-focusable', 'zzz-button--md')
  })

  it('maps size and width to classes / inline width', () => {
    const { rerender } = render(<Button size="lg" width="dialog">Confirm</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('zzz-button--lg', 'zzz-button--w-dialog')
    expect(btn).toHaveAttribute('data-size', 'lg')
    rerender(<Button width={300}>Craft</Button>)
    expect(btn.style.width).toBe('calc(300 * var(--zzz-px))')
  })

  it('passes className, style, ref and native props through', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} className="extra" style={{ marginTop: 3 }} data-x="1" type="submit">
        Go
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(ref.current).toBe(btn)
    expect(btn).toHaveClass('extra')
    expect(btn).toHaveAttribute('data-x', '1')
    expect(btn).toHaveAttribute('type', 'submit')
    expect(btn.style.marginTop).toBe('3px')
  })

  it('renders an icon cap with a coloured disc, hidden from assistive tech', () => {
    const { container } = render(
      <Button icon={<Glyph />} iconTone="confirm">
        Confirm
      </Button>,
    )
    const cap = container.querySelector('.zzz-button__cap')!
    expect(cap).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.zzz-button__disc')).toHaveClass('zzz-pressable__hide')
    expect(screen.getByRole('button')).toHaveAttribute('data-icon-tone', 'confirm')
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it("defaults the cap tone to 'plain' (no disc)", () => {
    const { container } = render(<Button icon={<Glyph />}>City</Button>)
    expect(container.querySelector('.zzz-button__disc')).toBeNull()
    expect(screen.getByRole('button')).toHaveAttribute('data-icon-tone', 'plain')
  })

  it('renders an avatar in the cap (string src or node)', () => {
    const { container, rerender } = render(<Button avatar="a.png">Plan</Button>)
    expect(container.querySelector('.zzz-button__avatar img')).toHaveAttribute('src', 'a.png')
    rerender(<Button avatar={<span data-testid="av" />}>Plan</Button>)
    expect(screen.getByTestId('av')).toBeInTheDocument()
  })

  it('fires onClick; disabled blocks it and keeps the shape classes', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>View</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(
      <Button onClick={onClick} disabled>
        View
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('zzz-mat-pill')
  })

  it('aria-disabled stays focusable but swallows clicks', async () => {
    const onClick = vi.fn()
    render(
      <Button aria-disabled="true" onClick={onClick}>
        Craft
      </Button>,
    )
    const btn = screen.getByRole('button')
    btn.focus()
    expect(btn).toHaveFocus()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('forces the pressed look with pressed', () => {
    render(<Button pressed>Filter</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed', '')
  })

  it('Enter flashes data-pressed for 100 ms; Space holds it', () => {
    vi.useFakeTimers()
    try {
      render(<Button>Filter</Button>)
      const btn = screen.getByRole('button')
      fireEvent.keyDown(btn, { key: 'Enter' })
      expect(btn).toHaveAttribute('data-pressed', '')
      act(() => {
        vi.advanceTimersByTime(120)
      })
      expect(btn).not.toHaveAttribute('data-pressed')
      fireEvent.keyDown(btn, { key: ' ' })
      expect(btn).toHaveAttribute('data-pressed', '')
      fireEvent.keyUp(btn, { key: ' ' })
      expect(btn).not.toHaveAttribute('data-pressed')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not flash while disabled', () => {
    render(<Button disabled>Filter</Button>)
    const btn = screen.getByRole('button')
    fireEvent.keyDown(btn, { key: 'Enter' })
    expect(btn).not.toHaveAttribute('data-pressed')
  })

  it('pressOutset sets the outset custom property; dialog width defaults it to 0 (size stays md)', () => {
    const { rerender } = render(<Button pressOutset={2}>A</Button>)
    const btn = screen.getByRole('button')
    expect(btn.style.getPropertyValue('--zzz-press-outset')).toBe('calc(2 * var(--zzz-px))')
    rerender(<Button width="dialog">Cancel</Button>)
    expect(btn.style.getPropertyValue('--zzz-press-outset')).toBe('calc(0 * var(--zzz-px))')
    // Dialog buttons are md (57) like every other pill; the old implied `lg` (59) is gone.
    expect(btn).toHaveClass('zzz-button--md')
    expect(btn).not.toHaveClass('zzz-button--lg')
  })

  it('renders an <a> when href is given; disabled links drop href', () => {
    const { rerender } = render(<Button href="/city">City</Button>)
    const link = screen.getByRole('link', { name: 'City' })
    expect(link).toHaveAttribute('href', '/city')
    expect(link).toHaveClass('zzz-button')
    rerender(
      <Button href="/city" disabled>
        City
      </Button>,
    )
    const dead = screen.getByText('City').closest('a')!
    expect(dead).not.toHaveAttribute('href')
    expect(dead).toHaveAttribute('aria-disabled', 'true')
  })

  it('two-line and mission / sub variants set their modifiers', () => {
    const { rerender } = render(<Button twoLine>{'Stat\nBonuses'}</Button>)
    expect(screen.getByRole('button')).toHaveClass('zzz-button--two-line')
    rerender(<Button variant="mission">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('zzz-button--mission')
    expect(screen.getByRole('button')).not.toHaveClass('zzz-mat-pill')
    rerender(<Button variant="mission" missionState="claimed">Claimed</Button>)
    expect(screen.getByRole('button')).toHaveClass('zzz-button--claimed')
    expect(screen.getByRole('button')).toBeDisabled()
    rerender(<Button variant="sub" icon={<Glyph />} aria-label="Level up" />)
    const sub = screen.getByRole('button', { name: 'Level up' })
    expect(sub).toHaveClass('zzz-button--sub')
    expect(sub.querySelector('.zzz-button__cap')).toBeNull()
    expect(sub.querySelector('.zzz-button__glyph')).not.toBeNull()
  })
})

describe('Button sizes (sm / md / lg web scale)', () => {
  it('defaults to md and maps each size to a modifier class and data-size', () => {
    const { rerender } = render(<Button>View</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('zzz-button--md')
    expect(btn).toHaveAttribute('data-size', 'md')
    for (const size of ['sm', 'md', 'lg'] as const) {
      rerender(<Button size={size}>View</Button>)
      expect(btn).toHaveClass(`zzz-button--${size}`)
      expect(btn).toHaveAttribute('data-size', size)
    }
  })

  it('keeps an explicit pressOutset (absolute design units) on every size', () => {
    render(
      <Button size="sm" pressOutset={1}>
        A
      </Button>,
    )
    expect(screen.getByRole('button').style.getPropertyValue('--zzz-press-outset')).toBe('calc(1 * var(--zzz-px))')
  })

  it('sizes height, label, cap, disc, glyph and padding from the control tokens', () => {
    for (const size of ['sm', 'md', 'lg']) {
      expect(css).toContain(`var(--zzz-size-control-${size})`)
      expect(css).toContain(`var(--zzz-font-size-control-${size})`)
      expect(css).toContain(`var(--zzz-size-control-cap-${size})`)
      expect(css).toContain(`var(--zzz-size-control-disc-${size})`)
      expect(css).toContain(`var(--zzz-size-control-icon-${size})`)
      expect(css).toContain(`var(--zzz-size-control-padding-x-${size})`)
    }
  })

  it('scales ring, bevel, keyline and press outset by the size ratio (two-class selectors beat .zzz-mat-pill)', () => {
    expect(css).toMatch(/\.zzz-button\.zzz-button--sm\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-sm-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toMatch(/\.zzz-button\.zzz-button--lg\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-lg-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toMatch(/--zzz-mat-ring: calc\(var\(--zzz-border-width-ring\) \* var\(--zzz-control-ratio\)\)/)
    expect(css).toMatch(/--zzz-press-outset: calc\(var\(--zzz-size-control-press-outset\) \* var\(--zzz-control-ratio\)\)/)
    expect(css).toMatch(/--zzz-mat-bevel:[^;]*var\(--zzz-control-ratio\)/)
    expect(css).toMatch(/--zzz-shadow-keyline: 0 0 0 calc\(var\(--zzz-border-width-keyline\) \* var\(--zzz-control-ratio\)\)/)
  })
})
