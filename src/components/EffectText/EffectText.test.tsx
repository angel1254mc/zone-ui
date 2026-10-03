import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Keyword, Value } from '../Text'
import { EffectNameBar, EffectText, parseEffectMarkup } from '.'

describe('EffectText', () => {
  it('renders a paragraph with inline Keyword / Value children', () => {
    render(
      <EffectText density="paragraph">
        For characters with the <Keyword icon={<svg data-testid="spec" />}>Attack</Keyword> specialty, ATK increases by{' '}
        <Value>3.5%</Value>.
      </EffectText>,
    )
    const p = screen.getByText(/For characters/)
    expect(p.tagName).toBe('P')
    expect(p).toHaveClass('zzz-effect-text', 'zzz-effect-text--paragraph')
    expect(screen.getByText('Attack')).toHaveClass('zzz-keyword')
    expect(screen.getByText('3.5%')).toHaveClass('zzz-value')
    expect(screen.getByTestId('spec').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('parses the {kw}/{val}/{b} markup', () => {
    render(<EffectText markup="with the {kw}Rupture{/kw} specialty, DMG +{val}4%{/val} on {b}Basic Attack{/b}." />)
    expect(screen.getByText('Rupture')).toHaveClass('zzz-keyword')
    expect(screen.getByText('4%')).toHaveClass('zzz-value')
    expect(screen.getByText('Basic Attack').tagName).toBe('STRONG')
    expect(screen.getByText(/with the/)).toHaveTextContent('with the Rupture specialty, DMG +4% on Basic Attack.')
  })

  it('parseEffectMarkup keeps plain text untouched', () => {
    expect(parseEffectMarkup('plain')).toEqual(['plain'])
  })

  it('tone muted, as, className and ref pass through', () => {
    const ref = createRef<HTMLParagraphElement>()
    render(
      <EffectText ref={ref} as="div" tone="muted" className="x">
        Next Phase
      </EffectText>,
    )
    expect(ref.current?.tagName).toBe('DIV')
    expect(ref.current).toHaveClass('zzz-effect-text--muted', 'x')
  })
})

describe('EffectNameBar', () => {
  it('renders the name without a button by default', () => {
    render(<EffectNameBar>Scorching Breath</EffectNameBar>)
    expect(screen.getByText('Scorching Breath')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('uncontrolled: the chevron toggles aria-expanded and reports changes', async () => {
    const onChange = vi.fn()
    render(
      <EffectNameBar expandable onExpandedChange={onChange} controls="fx">
        Scorching Breath
      </EffectNameBar>,
    )
    const btn = screen.getByRole('button', { name: 'Show effect details' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAttribute('aria-controls', 'fx')
    expect(btn).toHaveAccessibleDescription('Scorching Breath')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(onChange).toHaveBeenLastCalledWith(true)
  })

  it('keyboard: Enter and Space toggle', async () => {
    render(<EffectNameBar expandable>Scorching Breath</EffectNameBar>)
    const btn = screen.getByRole('button')
    btn.focus()
    await userEvent.keyboard('{Enter}')
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard(' ')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('controlled: follows the prop and only calls back', async () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <EffectNameBar expandable expanded={false} onExpandedChange={onChange}>
        X
      </EffectNameBar>,
    )
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    rerender(
      <EffectNameBar expandable expanded onExpandedChange={onChange}>
        X
      </EffectNameBar>,
    )
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('works with a parent-owned state', async () => {
    function Host() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <EffectNameBar expandable expanded={open} onExpandedChange={setOpen}>
            X
          </EffectNameBar>
          {open ? <p>details</p> : null}
        </>
      )
    }
    render(<Host />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('details')).toBeInTheDocument()
  })

  it('surface classes, forced pressed chevron, ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <EffectNameBar ref={ref} surface="sunken" expandable chevronPressed>
        X
      </EffectNameBar>,
    )
    expect(ref.current).toHaveClass('zzz-effect-name-bar--sunken', 'zzz-effect-name-bar--expandable')
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed')
  })
})
