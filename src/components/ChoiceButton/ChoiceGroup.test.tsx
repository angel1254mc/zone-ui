import { useState } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChoiceGroup } from './ChoiceGroup'
import type { ChoiceItem } from './ChoiceGroup'

const ITEMS: ChoiceItem[] = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'paris', label: 'Paris', description: 'City of light' },
  { value: 'rome', label: 'Rome', disabled: true },
  { value: 'lima', label: 'Lima' },
]

describe('ChoiceGroup', () => {
  it('single: renders a labelled radiogroup of radios with auto letter badges', () => {
    render(<ChoiceGroup label="Capital of France?" items={ITEMS} />)
    const group = screen.getByRole('radiogroup', { name: 'Capital of France?' })
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(4)
    expect(group).toHaveAttribute('data-layout', 'grid')
    expect(radios.map((r) => r.querySelector('.zzz-choice__cap')?.textContent)).toEqual(['A', 'B', 'C', 'D'])
    expect(radios.every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true)
    expect(screen.getByRole('radio', { name: 'Rome' })).toBeDisabled()
  })

  it('badges="numbers" | "none" and explicit item badges', () => {
    const { rerender } = render(<ChoiceGroup aria-label="Q" items={ITEMS} badges="numbers" />)
    expect(screen.getAllByRole('radio').map((r) => r.querySelector('.zzz-choice__cap')?.textContent)).toEqual(['1', '2', '3', '4'])
    rerender(<ChoiceGroup aria-label="Q" items={ITEMS} badges="none" />)
    expect(screen.getAllByRole('radio').some((r) => r.querySelector('.zzz-choice__cap'))).toBe(false)
    rerender(<ChoiceGroup aria-label="Q" items={[{ value: 'x', label: 'X', badge: '★' }]} badges="none" />)
    expect(screen.getByRole('radio').querySelector('.zzz-choice__cap')).toHaveTextContent('★')
  })

  it('single uncontrolled: click selects, reports the value, does not deselect', async () => {
    const onValueChange = vi.fn()
    render(<ChoiceGroup aria-label="Q" items={ITEMS} defaultValue="tokyo" onValueChange={onValueChange} />)
    expect(screen.getByRole('radio', { name: 'Tokyo' })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('radio', { name: /Paris/ }))
    expect(screen.getByRole('radio', { name: /Paris/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Tokyo' })).toHaveAttribute('aria-checked', 'false')
    expect(onValueChange).toHaveBeenLastCalledWith('paris')
    await userEvent.click(screen.getByRole('radio', { name: /Paris/ }))
    expect(screen.getByRole('radio', { name: /Paris/ })).toHaveAttribute('aria-checked', 'true')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('single controlled', async () => {
    function Harness() {
      const [v, setV] = useState<string | null>(null)
      return (
        <>
          <ChoiceGroup aria-label="Q" items={ITEMS} value={v} onValueChange={setV} />
          <output>{v ?? 'none'}</output>
        </>
      )
    }
    render(<Harness />)
    expect(screen.getByRole('status')).toHaveTextContent('none')
    await userEvent.click(screen.getByRole('radio', { name: 'Lima' }))
    expect(screen.getByRole('status')).toHaveTextContent('lima')
    expect(screen.getByRole('radio', { name: 'Lima' })).toHaveAttribute('aria-checked', 'true')
  })

  it('controlled value without onValueChange does not change', async () => {
    render(<ChoiceGroup aria-label="Q" items={ITEMS} value="tokyo" />)
    await userEvent.click(screen.getByRole('radio', { name: 'Lima' }))
    expect(screen.getByRole('radio', { name: 'Tokyo' })).toHaveAttribute('aria-checked', 'true')
  })

  it('multiple: group of checkboxes, toggles, respects maxSelected', async () => {
    const onValueChange = vi.fn()
    render(
      <ChoiceGroup
        selectionMode="multiple"
        label="Pick two"
        items={ITEMS}
        defaultValue={['tokyo']}
        maxSelected={2}
        onValueChange={onValueChange}
      />,
    )
    expect(screen.getByRole('group', { name: 'Pick two' })).toBeInTheDocument()
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(4)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Lima' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['tokyo', 'lima'])
    await userEvent.click(screen.getByRole('checkbox', { name: /Paris/ }))
    expect(screen.getByRole('checkbox', { name: /Paris/ })).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tokyo' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['lima'])
    expect(screen.getByRole('checkbox', { name: 'Tokyo' })).toHaveAttribute('aria-checked', 'false')
  })

  it('multiple controlled', async () => {
    function Harness() {
      const [v, setV] = useState<string[]>([])
      return (
        <>
          <ChoiceGroup selectionMode="multiple" aria-label="Q" items={ITEMS} value={v} onValueChange={setV} />
          <output>{v.join(',') || 'none'}</output>
        </>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Lima' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tokyo' }))
    expect(screen.getByRole('status')).toHaveTextContent('lima,tokyo')
  })

  it('roving tab stop: one tabbable item (selected, else first enabled)', () => {
    const { rerender } = render(<ChoiceGroup aria-label="Q" items={ITEMS} />)
    const tabbable = () => screen.getAllByRole('radio').filter((r) => r.tabIndex === 0)
    expect(tabbable().map((r) => r.textContent)).toEqual(['ATokyo'])
    rerender(<ChoiceGroup aria-label="Q" items={ITEMS} value="lima" />)
    expect(tabbable()).toHaveLength(1)
    expect(tabbable()[0]).toHaveAccessibleName('Lima')
  })

  it('keyboard: arrows move focus (skipping disabled, wrapping) without selecting; Space/Enter select', async () => {
    const onValueChange = vi.fn()
    render(<ChoiceGroup aria-label="Q" items={ITEMS} layout="list" onValueChange={onValueChange} />)
    const [tokyo, paris, , lima] = screen.getAllByRole('radio')
    await userEvent.tab()
    expect(tokyo).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(paris).toHaveFocus()
    expect(onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{ArrowRight}')
    expect(lima).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(tokyo).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(lima).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(tokyo).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(lima).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(onValueChange).toHaveBeenLastCalledWith('lima')
    await userEvent.keyboard('{ArrowLeft}')
    expect(paris).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenLastCalledWith('paris')
  })

  it('hotkeys: badge keys select while focus is in the group', async () => {
    const onValueChange = vi.fn()
    render(<ChoiceGroup aria-label="Q" items={ITEMS} hotkeys onValueChange={onValueChange} />)
    expect(screen.getByRole('radio', { name: 'Tokyo' })).toHaveAttribute('aria-keyshortcuts', 'A')
    screen.getByRole('radio', { name: 'Tokyo' }).focus()
    await userEvent.keyboard('d')
    expect(onValueChange).toHaveBeenLastCalledWith('lima')
    expect(screen.getByRole('radio', { name: 'Lima' })).toHaveFocus()
    await userEvent.keyboard('c') // disabled
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('hotkeys="global" works from anywhere except text fields; off by default', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <>
        <input aria-label="notes" />
        <ChoiceGroup aria-label="Q" items={ITEMS} badges="numbers" onValueChange={onValueChange} />
      </>,
    )
    await userEvent.keyboard('2')
    expect(onValueChange).not.toHaveBeenCalled()
    rerender(
      <>
        <input aria-label="notes" />
        <ChoiceGroup aria-label="Q" items={ITEMS} badges="numbers" hotkeys="global" onValueChange={onValueChange} />
      </>,
    )
    ;(document.activeElement as HTMLElement | null)?.blur()
    await userEvent.keyboard('2')
    expect(onValueChange).toHaveBeenLastCalledWith('paris')
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.keyboard('4')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('results + locked: per-item data-state, accessible result text, no further selection, live announcement', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<ChoiceGroup aria-label="Q" items={ITEMS} defaultValue="tokyo" onValueChange={onValueChange} />)
    const live = document.querySelector('[aria-live="polite"]')!
    expect(live).toBeInTheDocument()
    expect(live).toHaveTextContent('')
    rerender(
      <ChoiceGroup
        aria-label="Q"
        items={ITEMS}
        defaultValue="tokyo"
        onValueChange={onValueChange}
        locked
        results={{ tokyo: 'incorrect', paris: 'revealed' }}
      />,
    )
    const tokyo = screen.getByRole('radio', { name: /Tokyo/ })
    const paris = screen.getByRole('radio', { name: /Paris/ })
    expect(tokyo).toHaveAttribute('data-state', 'incorrect')
    expect(tokyo).toHaveAccessibleName('Tokyo, Incorrect')
    expect(paris).toHaveAttribute('data-state', 'revealed')
    expect(paris).toHaveAccessibleName('Paris, Correct answer')
    expect(tokyo).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(screen.getByRole('radio', { name: 'Lima' }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(tokyo).toHaveAttribute('aria-checked', 'true')
    expect(live).toHaveTextContent('Tokyo: Incorrect. Correct answer: Paris.')
  })

  it('locked items stay focusable and navigable so results can be read', async () => {
    render(<ChoiceGroup aria-label="Q" items={ITEMS} locked results={{ paris: 'correct' }} value="paris" />)
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: /Paris/ })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Lima' })).toHaveFocus()
  })

  it('announcement can be overridden or disabled', () => {
    const { rerender } = render(
      <ChoiceGroup aria-label="Q" items={ITEMS} results={{ paris: 'correct' }} value="paris" announcement="Nice! 1 point." />,
    )
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Nice! 1 point.')
    rerender(<ChoiceGroup aria-label="Q" items={ITEMS} results={{ paris: 'correct' }} value="paris" announcement={false} />)
    expect(document.querySelector('[aria-live="polite"]')).toBeNull()
  })

  it('disabled group disables every item', () => {
    render(<ChoiceGroup aria-label="Q" items={ITEMS} disabled />)
    expect(screen.getAllByRole('radio').every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
  })

  it('layout, columns, className, style, ref pass through', () => {
    let node: HTMLDivElement | null = null
    render(
      <ChoiceGroup
        ref={(n) => {
          node = n
        }}
        aria-label="Q"
        items={ITEMS.slice(0, 3)}
        layout="grid"
        columns={3}
        className="extra"
        style={{ maxWidth: 900 }}
      />,
    )
    const group = screen.getByRole('radiogroup')
    expect(node).toBe(group)
    expect(group).toHaveClass('zzz-choice-group', 'extra')
    expect(group.style.maxWidth).toBe('900px')
    expect(group.querySelector('.zzz-choice-group__items')).toHaveAttribute('data-cols', '3')
  })

  it('default grid columns: 2x2 for four, 3 for three, 1 for one', () => {
    const cols = (n: number) => {
      const { unmount } = render(<ChoiceGroup aria-label={`Q${n}`} items={ITEMS.slice(0, n)} />)
      const v = screen.getByRole('radiogroup').querySelector('.zzz-choice-group__items')!.getAttribute('data-cols')
      unmount()
      return v
    }
    expect(cols(4)).toBe('2')
    expect(cols(3)).toBe('3')
    expect(cols(1)).toBe('1')
    expect(cols(2)).toBe('2')
  })

  it('hotkeys ignore modifier combos', async () => {
    const onValueChange = vi.fn()
    render(<ChoiceGroup aria-label="Q" items={ITEMS} hotkeys="global" onValueChange={onValueChange} />)
    await act(async () => {
      await userEvent.keyboard('{Control>}a{/Control}')
    })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('ChoiceGroup sizes', () => {
  it('defaults to md on the group and every choice', () => {
    render(<ChoiceGroup label="City" items={ITEMS} />)
    expect(screen.getByRole('radiogroup', { name: 'City' })).toHaveAttribute('data-size', 'md')
    for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('data-size', 'md')
  })

  it.each(['sm', 'lg'] as const)('size="%s" reaches the group and every choice, selection still works', async (size) => {
    const onValueChange = vi.fn()
    render(<ChoiceGroup label="City" items={ITEMS} size={size} onValueChange={onValueChange} />)
    const group = screen.getByRole('radiogroup', { name: 'City' })
    expect(group).toHaveClass(`zzz-choice-group--${size}`)
    expect(group).toHaveAttribute('data-size', size)
    const radios = screen.getAllByRole('radio')
    for (const radio of radios) {
      expect(radio).toHaveAttribute('data-size', size)
      expect(radio).toHaveClass(`zzz-choice--${size}`)
    }
    await userEvent.click(radios[1])
    expect(onValueChange).toHaveBeenCalledWith(ITEMS[1].value)
  })
})
