import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SortToggle } from './SortToggle'

describe('SortToggle', () => {
  it('renders a button named after the current direction (default descending)', () => {
    render(<SortToggle />)
    const btn = screen.getByRole('button', { name: 'Sort descending' })
    expect(btn).not.toHaveAttribute('aria-pressed')
    expect(btn).toHaveAttribute('data-direction', 'desc')
    expect(btn).toHaveClass('zzz-sort-toggle', 'zzz-mat-pill', 'zzz-pressable', 'zzz-focusable')
  })

  it('toggles uncontrolled and reports the new direction', async () => {
    const onDirectionChange = vi.fn()
    render(<SortToggle onDirectionChange={onDirectionChange} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onDirectionChange).toHaveBeenCalledWith('asc')
    const btn = screen.getByRole('button', { name: 'Sort ascending' })
    expect(btn).not.toHaveAttribute('aria-pressed')
    expect(btn).toHaveAttribute('data-direction', 'asc')
  })

  it('is controlled by `direction`', async () => {
    function Harness() {
      const [d, setD] = useState<'asc' | 'desc'>('asc')
      return <SortToggle direction={d} onDirectionChange={setD} />
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Sort ascending' }))
    expect(screen.getByRole('button', { name: 'Sort descending' })).toBeInTheDocument()
  })

  it('toggles with Enter and Space', async () => {
    render(<SortToggle defaultDirection="asc" />)
    const btn = screen.getByRole('button')
    btn.focus()
    await userEvent.keyboard('{Enter}')
    expect(btn).toHaveAccessibleName('Sort descending')
    await userEvent.keyboard(' ')
    expect(btn).toHaveAccessibleName('Sort ascending')
  })

  it('accepts custom labels', () => {
    render(<SortToggle labels={{ asc: 'Lowest first', desc: 'Highest first' }} />)
    expect(screen.getByRole('button', { name: 'Highest first' })).toBeInTheDocument()
  })

  it('does not toggle when disabled; forwards ref and className', async () => {
    const ref = createRef<HTMLButtonElement>()
    const onDirectionChange = vi.fn()
    render(<SortToggle disabled ref={ref} className="x" onDirectionChange={onDirectionChange} />)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onDirectionChange).not.toHaveBeenCalled()
    expect(ref.current).toBe(btn)
    expect(btn).toHaveClass('x')
  })

  it('forces the pressed look with `pressed`', () => {
    render(<SortToggle pressed />)
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed')
  })
})

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
  const css = readFileSync(resolve(process.cwd(), 'src/components/SortToggle/SortToggle.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const pxDecls = css.split(/[;{}]/).map((s) => s.trim()).filter((s) => s.includes('var(--zzz-px)'))
  return { css, pxDecls }
}

describe('SortToggle size', () => {
  it('defaults to md and reflects size on data-size', () => {
    const { rerender } = render(<SortToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md')
    rerender(<SortToggle size="sm" />)
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm')
    rerender(<SortToggle size="lg" />)
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg')
  })

  it('routes every stylesheet length through the size unit', () => {
    const { css, pxDecls } = sizeUnitCss()
    expect(css).toMatch(/\[data-size='sm'\]/)
    expect(css).toMatch(/\[data-size='lg'\]/)
    for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/)
  })
})
