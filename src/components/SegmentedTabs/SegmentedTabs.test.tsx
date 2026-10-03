import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedTabs, TabPanel, segmentPath } from './index'
import type { SegmentedTabsItem } from './index'

const items: SegmentedTabsItem[] = [
  { value: 'craft', label: 'Craft' },
  { value: 'dismantle', label: 'Dismantle' },
  { value: 'destroy', label: 'Destroy' },
]

describe('SegmentedTabs', () => {
  it('renders a tablist of tabs with the selected one marked', () => {
    render(<SegmentedTabs aria-label="Manage" items={items} defaultValue="dismantle" />)
    const list = screen.getByRole('tablist', { name: 'Manage' })
    expect(list).toHaveClass('zzz-segmented-tabs', 'zzz-mat-pill')
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect(tabs[1]).toHaveAccessibleName('Dismantle')
  })

  it('defaults to the first enabled item and gives it the roving tab stop', () => {
    render(<SegmentedTabs items={[{ ...items[0], disabled: true }, items[1], items[2]]} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1])
  })

  it('positions the indicator by shape (start / middle / end)', () => {
    const { container, rerender } = render(<SegmentedTabs items={items} value="craft" />)
    const indicator = () => container.querySelector('.zzz-segmented-tabs__indicator') as HTMLElement
    expect(indicator()).toHaveAttribute('data-shape', 'start')
    rerender(<SegmentedTabs items={items} value="dismantle" />)
    expect(indicator()).toHaveAttribute('data-shape', 'middle')
    rerender(<SegmentedTabs items={items} value="destroy" />)
    expect(indicator()).toHaveAttribute('data-shape', 'end')
    expect(indicator()).toHaveAttribute('aria-hidden', 'true')
  })

  it('pops the indicator only after a change, not on mount', () => {
    const { container, rerender } = render(<SegmentedTabs items={items} value="craft" />)
    const indicator = () => container.querySelector('.zzz-segmented-tabs__indicator') as HTMLElement
    expect(indicator()).not.toHaveAttribute('data-pop')
    rerender(<SegmentedTabs items={items} value="destroy" />)
    expect(indicator()).toHaveAttribute('data-pop')
  })

  it('uncontrolled: clicking selects and reports the value', async () => {
    const onValueChange = vi.fn()
    render(<SegmentedTabs items={items} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Destroy' }))
    expect(onValueChange).toHaveBeenCalledWith('destroy')
    expect(screen.getByRole('tab', { name: 'Destroy' })).toHaveAttribute('aria-selected', 'true')
  })

  it('controlled: follows value, reports but does not change on its own', async () => {
    const onValueChange = vi.fn()
    render(<SegmentedTabs items={items} value="craft" onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Dismantle' }))
    expect(onValueChange).toHaveBeenCalledWith('dismantle')
    expect(screen.getByRole('tab', { name: 'Craft' })).toHaveAttribute('aria-selected', 'true')
  })

  it('controlled round trip', async () => {
    function Harness() {
      const [v, setV] = useState('craft')
      return <SegmentedTabs items={items} value={v} onValueChange={setV} />
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('tab', { name: 'Dismantle' }))
    expect(screen.getByRole('tab', { name: 'Dismantle' })).toHaveAttribute('aria-selected', 'true')
  })

  it('keyboard: arrows move + activate (wrapping, skipping disabled), Home/End jump', async () => {
    const onValueChange = vi.fn()
    const four = [...items, { value: 'x', label: 'X', disabled: true }]
    render(<SegmentedTabs items={four} defaultValue="craft" onValueChange={onValueChange} />)
    const tab = (name: string) => screen.getByRole('tab', { name })
    act(() => tab('Craft').focus())
    await userEvent.keyboard('{ArrowRight}')
    expect(tab('Dismantle')).toHaveFocus()
    expect(tab('Dismantle')).toHaveAttribute('aria-selected', 'true')
    expect(tab('Dismantle').tabIndex).toBe(0)
    expect(tab('Craft').tabIndex).toBe(-1)
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    // Destroy, then wraps past the disabled X to Craft
    expect(tab('Craft')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(tab('Destroy')).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(tab('Craft')).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(tab('Destroy')).toHaveFocus()
    expect(onValueChange).toHaveBeenLastCalledWith('destroy')
  })

  it('disabled tab: aria-disabled, not selectable by click', async () => {
    const onValueChange = vi.fn()
    render(
      <SegmentedTabs items={[items[0], { ...items[1], disabled: true }, items[2]]} onValueChange={onValueChange} />,
    )
    const tab = screen.getByRole('tab', { name: 'Dismantle' })
    expect(tab).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(tab)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(tab).toHaveAttribute('aria-selected', 'false')
  })

  it('pointer-down on an inactive tab marks it pressed and inflates the indicator until release', () => {
    const { container } = render(<SegmentedTabs items={items} defaultValue="craft" />)
    const list = container.firstElementChild as HTMLElement
    const skills = screen.getByRole('tab', { name: 'Dismantle' })
    fireEvent.pointerDown(skills, { button: 0 })
    expect(skills).toHaveAttribute('data-pressed')
    expect(list).toHaveAttribute('data-inflating')
    fireEvent.pointerUp(window)
    expect(skills).not.toHaveAttribute('data-pressed')
    expect(list).not.toHaveAttribute('data-inflating')
    // pressing the active tab does nothing
    fireEvent.pointerDown(screen.getByRole('tab', { name: 'Craft' }), { button: 0 })
    expect(list).not.toHaveAttribute('data-inflating')
  })

  it('forced pressed prop (docs / visual tests)', () => {
    const { container } = render(<SegmentedTabs items={items} value="craft" pressed="destroy" />)
    expect(screen.getByRole('tab', { name: 'Destroy' })).toHaveAttribute('data-pressed')
    expect(container.firstElementChild).toHaveAttribute('data-inflating')
  })

  it('surface and width', () => {
    const { container, rerender } = render(<SegmentedTabs items={items} />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('data-surface', 'black')
    expect(root.style.getPropertyValue('--zzz-seg-width')).toBe('calc(703 * var(--zzz-seg-u))')
    rerender(<SegmentedTabs items={items} surface="mesh" />)
    expect(root).toHaveAttribute('data-surface', 'mesh')
    expect(root.style.getPropertyValue('--zzz-seg-width')).toBe('calc(786 * var(--zzz-seg-u))')
    rerender(<SegmentedTabs items={items} width={500} />)
    expect(root.style.getPropertyValue('--zzz-seg-width')).toBe('calc(500 * var(--zzz-px))')
    rerender(<SegmentedTabs items={items} width="fill" />)
    expect(root.style.getPropertyValue('--zzz-seg-width')).toBe('100%')
  })

  it('wires tabs to panels when an id is given', () => {
    render(
      <>
        <SegmentedTabs id="agent" items={items} value="craft" />
        <TabPanel tabsId="agent" value="craft">
          Panel
        </TabPanel>
      </>,
    )
    const tab = screen.getByRole('tab', { name: 'Craft' })
    const panel = screen.getByRole('tabpanel')
    expect(tab).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', tab.id)
    expect(panel).toHaveAccessibleName('Craft')
  })

  it('no dangling aria-controls without an id or panelId', () => {
    render(<SegmentedTabs items={[{ ...items[0], panelId: 'p1' }, items[1]]} />)
    expect(screen.getByRole('tab', { name: 'Craft' })).toHaveAttribute('aria-controls', 'p1')
    expect(screen.getByRole('tab', { name: 'Dismantle' })).not.toHaveAttribute('aria-controls')
  })

  it('passes className, style and ref through', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<SegmentedTabs ref={ref} items={items} className="x" style={{ opacity: 0.5 }} />)
    expect(ref.current).toBe(container.firstElementChild)
    expect(ref.current).toHaveClass('x')
    expect(ref.current).toHaveStyle({ opacity: '0.5' })
  })

  it('builds closed SVG paths for the slanted edge', () => {
    expect(segmentPath()).toMatch(/^M.*Z$/)
  })
})

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
  const css = readFileSync(resolve(process.cwd(), 'src/components/SegmentedTabs/SegmentedTabs.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const pxDecls = css.split(/[;{}]/).map((s) => s.trim()).filter((s) => s.includes('var(--zzz-px)'))
  return { css, pxDecls }
}

describe('SegmentedTabs size', () => {
  it('defaults to md and reflects size on data-size', () => {
    const { rerender } = render(<SegmentedTabs aria-label="Manage" items={items} />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'md')
    rerender(<SegmentedTabs aria-label="Manage" items={items} size="sm" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'sm')
    rerender(<SegmentedTabs aria-label="Manage" items={items} size="lg" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'lg')
  })
  it('scales the default width with the size unit; an explicit width stays literal', () => {
    const { rerender } = render(<SegmentedTabs aria-label="Manage" items={items} size="sm" />)
    expect(screen.getByRole('tablist').style.getPropertyValue('--zzz-seg-width')).toContain('var(--zzz-seg-u)')
    rerender(<SegmentedTabs aria-label="Manage" items={items} size="sm" width={600} />)
    expect(screen.getByRole('tablist').style.getPropertyValue('--zzz-seg-width')).toBe('calc(600 * var(--zzz-px))')
  })

  it('routes every stylesheet length through the size unit', () => {
    const { css, pxDecls } = sizeUnitCss()
    expect(css).toMatch(/\[data-size='sm'\]/)
    expect(css).toMatch(/\[data-size='lg'\]/)
    for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/)
  })
})
