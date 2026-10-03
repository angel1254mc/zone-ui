import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef } from 'react'
import { KeyHint, KeyHints } from './KeyHint'

describe('KeyHint', () => {
  it('renders the key cap as <kbd> and the label', () => {
    const { container } = render(<KeyHint keyCap="T" label="Unlock" />)
    const kbd = container.querySelector('kbd')!
    expect(kbd).toHaveTextContent('T')
    expect(kbd).toHaveClass('zzz-key-hint__cap')
    expect(screen.getByText('Unlock')).toHaveClass('zzz-key-hint__label')
    expect(container.firstChild).toHaveClass('zzz-key-hint')
  })

  it('renders a bare cap without a label', () => {
    const { container } = render(<KeyHint keyCap="T" />)
    expect(container.querySelector('.zzz-key-hint__label')).toBeNull()
  })

  it('passes className, style, ref and native props', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<KeyHint ref={ref} keyCap="R" label="Discard" className="x" data-k="1" style={{ opacity: 1 }} />)
    expect(ref.current).toHaveClass('zzz-key-hint', 'x')
    expect(ref.current).toHaveAttribute('data-k', '1')
  })

  it('fires onActivate on its key (case-insensitive), not on others or with modifiers', () => {
    const onActivate = vi.fn()
    render(<KeyHint keyCap="T" label="Lock" onActivate={onActivate} />)
    fireEvent.keyDown(window, { key: 't' })
    fireEvent.keyDown(window, { key: 'T' })
    fireEvent.keyDown(window, { key: 'r' })
    fireEvent.keyDown(window, { key: 't', ctrlKey: true })
    expect(onActivate).toHaveBeenCalledTimes(2)
  })

  it('ignores the hotkey while typing in a field, when repeated, or disabled', () => {
    const onActivate = vi.fn()
    const { rerender } = render(
      <>
        <input aria-label="name" />
        <KeyHint keyCap="T" label="Lock" onActivate={onActivate} />
      </>,
    )
    fireEvent.keyDown(screen.getByLabelText('name'), { key: 't' })
    fireEvent.keyDown(window, { key: 't', repeat: true })
    expect(onActivate).not.toHaveBeenCalled()
    rerender(
      <>
        <input aria-label="name" />
        <KeyHint keyCap="T" label="Lock" onActivate={onActivate} disabled />
      </>,
    )
    fireEvent.keyDown(window, { key: 't' })
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('maps named caps via hotkey', () => {
    const onActivate = vi.fn()
    render(<KeyHint keyCap="Esc" hotkey="Escape" label="Back" onActivate={onActivate} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('removes its listener on unmount', () => {
    const onActivate = vi.fn()
    const { unmount } = render(<KeyHint keyCap="T" label="Lock" onActivate={onActivate} />)
    unmount()
    fireEvent.keyDown(window, { key: 't' })
    expect(onActivate).not.toHaveBeenCalled()
  })
})

describe('KeyHints', () => {
  it('renders hints from data or children in a row', () => {
    const { container, rerender } = render(
      <KeyHints hints={[{ keyCap: 'R', label: 'Discard' }, { keyCap: 'T', label: 'Lock' }]} />,
    )
    expect(container.firstChild).toHaveClass('zzz-key-hints')
    expect(container.querySelectorAll('.zzz-key-hint')).toHaveLength(2)
    rerender(
      <KeyHints align="start">
        <KeyHint keyCap="T" label="Unlock" />
      </KeyHints>,
    )
    expect(container.firstChild).toHaveClass('zzz-key-hints--start')
    expect(screen.getByText('Unlock')).toBeInTheDocument()
  })
})

describe('KeyHint sizes (sm / md / lg web scale)', () => {
  it('a standalone hint is md unless sized; size maps to a class and data-size', () => {
    const { container, rerender } = render(<KeyHint keyCap="T" label="Lock" />)
    const root = container.firstElementChild!
    expect(root).not.toHaveAttribute('data-size') // inherits: md at the root, or the KeyHints row size
    for (const size of ['sm', 'md', 'lg'] as const) {
      rerender(<KeyHint keyCap="T" label="Lock" size={size} />)
      expect(root).toHaveClass(`zzz-key-hint--${size}`)
      expect(root).toHaveAttribute('data-size', size)
    }
  })

  it('KeyHints size marks the row (children inherit it through CSS) and data hints keep their own size', () => {
    const { container } = render(
      <KeyHints
        size="lg"
        hints={[
          { keyCap: 'R', label: 'Discard' },
          { keyCap: 'T', label: 'Lock', size: 'sm' },
        ]}
      />,
    )
    const row = container.firstElementChild!
    expect(row).toHaveClass('zzz-key-hints--lg')
    expect(row).toHaveAttribute('data-size', 'lg')
    const hints = row.querySelectorAll('.zzz-key-hint')
    expect(hints[0]).not.toHaveAttribute('data-size')
    expect(hints[1]).toHaveAttribute('data-size', 'sm')
  })

  it('scales circle, ring, letter, gap and label by an inherited ratio', () => {
    const css = readFileSync(resolve(__dirname, 'KeyHint.css'), 'utf8')
    expect(css).toMatch(/\.zzz-key-hints?--sm[^{]*\{[^}]*--zzz-key-hint-ratio: calc\(var\(--zzz-size-control-sm-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toMatch(/\.zzz-key-hints?--lg[^{]*\{[^}]*--zzz-key-hint-ratio: calc\(var\(--zzz-size-control-lg-n\) \/ var\(--zzz-size-control-md-n\)\)/)
    expect(css).toContain('width: calc(var(--zzz-size-control-key) * var(--zzz-key-hint-ratio, 1))')
    expect(css).toContain('border: calc(var(--zzz-border-width-ring-key) * var(--zzz-key-hint-ratio, 1))')
    expect(css).toContain('font-size: calc(var(--zzz-font-size-label) * var(--zzz-key-hint-ratio, 1))')
  })
})
