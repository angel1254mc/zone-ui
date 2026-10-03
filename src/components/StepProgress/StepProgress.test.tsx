import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { StepProgress } from './StepProgress'

describe('StepProgress', () => {
  it('renders a labelled list with derived statuses and aria-current', () => {
    render(<StepProgress steps={5} current={2} label="Quiz progress" />)
    const list = screen.getByRole('list', { name: 'Quiz progress' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(5)
    expect(items.map((li) => li.getAttribute('data-status'))).toEqual(['complete', 'complete', 'current', 'pending', 'pending'])
    expect(items[2]).toHaveAttribute('aria-current', 'step')
    expect(items[1]).not.toHaveAttribute('aria-current')
    expect(items[0]).toHaveTextContent('Step 1: complete')
    expect(items[2]).toHaveTextContent('Step 3: current')
    expect(list.querySelectorAll('.zzz-step-progress__pip')).toHaveLength(5)
  })

  it('honours explicit statuses, custom words and stepName', () => {
    render(
      <StepProgress
        steps={[{ status: 'success' }, { status: 'error' }, { status: 'skipped' }, {}, {}]}
        current={3}
        stepName="Question"
        statusLabels={{ success: 'correct', error: 'wrong' }}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items.map((li) => li.getAttribute('data-status'))).toEqual(['success', 'error', 'skipped', 'current', 'pending'])
    expect(items[0]).toHaveTextContent('Question 1: correct')
    expect(items[1]).toHaveTextContent('Question 2: wrong')
    expect(items[2]).toHaveTextContent('Question 3: skipped')
  })

  it('capsules show labels, numbers and status glyphs', () => {
    const { container } = render(
      <StepProgress variant="capsules" steps={[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Review', 'aria-label': 'Last step' }]} current={1} />,
    )
    expect(container.querySelectorAll('.zzz-step-progress__capsule')).toHaveLength(4)
    const items = screen.getAllByRole('listitem')
    expect(items[0].querySelector('.zzz-step-progress__disc svg')).not.toBeNull() // complete → check
    expect(items[1].querySelector('.zzz-step-progress__disc')).toHaveTextContent('2')
    expect(items[1]).toHaveTextContent('Shipping')
    expect(items[1]).toHaveTextContent('Step 2, Shipping: current')
    expect(items[3]).toHaveTextContent('Last step')
  })

  it('text variant reads "Step 3 of 5" and accepts formatText', () => {
    const { rerender } = render(<StepProgress variant="text" steps={5} current={2} />)
    expect(screen.getByText(/Step/).closest('p')).toHaveTextContent('Step 3 of 5')
    rerender(<StepProgress variant="text" steps={5} current={2} formatText={(n, t) => `${n}/${t}`} />)
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('passes className, size and ref through; nothing current when current ≥ length', () => {
    const ref = createRef<HTMLElement>()
    render(<StepProgress ref={ref} steps={3} current={3} size="sm" className="x" />)
    const list = screen.getByRole('list')
    expect(ref.current).toBe(list)
    expect(list).toHaveClass('zzz-step-progress--sm', 'x')
    expect(list.querySelector('[aria-current]')).toBeNull()
    expect(screen.getAllByRole('listitem').every((li) => li.getAttribute('data-status') === 'complete')).toBe(true)
  })
})

// Vitest runs with css: false, so the size rules are checked as text.
const stepCss = readFileSync(resolve(__dirname, 'StepProgress.css'), 'utf8')

describe('StepProgress sizes', () => {
  it('defaults to md', () => {
    render(<StepProgress steps={3} />)
    const list = screen.getByRole('list')
    expect(list).toHaveClass('zzz-step-progress--md')
    expect(list).toHaveAttribute('data-size', 'md')
  })

  it.each(['pips', 'capsules'] as const)('%s: sm / md / lg set the class + data-size', (variant) => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { unmount } = render(<StepProgress steps={3} current={1} variant={variant} size={size} />)
      const list = screen.getByRole('list')
      expect(list).toHaveClass(`zzz-step-progress--${size}`)
      expect(list).toHaveAttribute('data-size', size)
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
      unmount()
    }
  })

  it('text variant takes lg too', () => {
    const { container } = render(<StepProgress steps={5} current={2} variant="text" size="lg" />)
    expect(container.firstChild).toHaveClass('zzz-step-progress--lg')
    expect(container.firstChild).toHaveAttribute('data-size', 'lg')
    expect(container.firstChild).toHaveTextContent('Step 3 of 5')
  })

  it('has lg rules for every variant, scaled from the control size tokens', () => {
    expect(stepCss).toMatch(/\.zzz-step-progress--lg\s*\{[^}]*--zzz-size-control-lg-n/)
    for (const size of ['sm', 'md', 'lg']) expect(stepCss).toContain(`var(--zzz-font-size-control-${size})`)
  })

  it('keeps sm capsule text at the fontSize.label floor (no micro text, ≈ 12 px at the default scale)', () => {
    expect(stepCss).not.toContain('--zzz-font-size-micro')
    const smDisc = stepCss.match(/\.zzz-step-progress--sm \.zzz-step-progress__disc\s*\{([^}]*)\}/)
    const smLabel = stepCss.match(/\.zzz-step-progress--sm \.zzz-step-progress__label\s*\{([^}]*)\}/)
    // Either the sm rule is gone (inherits the md label size) or it sets font-size to the label token.
    for (const rule of [smDisc, smLabel]) {
      if (rule && /font-size/.test(rule[1])) expect(rule[1]).toMatch(/font-size:\s*var\(--zzz-font-size-label\)/)
    }
  })
})
