import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { FilterDrawer } from './FilterDrawer'

afterEach(() => {
  document.documentElement.style.overflow = ''
})

function Harness({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Filter</button>
      <Drawer
        open={open}
        onOpenChange={(o) => {
          onOpenChange?.(o)
          setOpen(o)
        }}
        title="Filter W-Engines"
        footer={<button>Reset</button>}
      >
        <button>Chip</button>
      </Drawer>
    </>
  )
}

const groups = [
  { label: 'Rarity', options: [{ value: 's', label: 'S' }, { value: 'a', label: 'A' }, { value: 'b', label: 'B' }] },
  {
    label: 'Agent Specialties',
    options: [
      { value: 'attack', label: 'Attack' },
      { value: 'armorer', label: 'Armorer', disabled: true },
    ],
  },
]

describe('Drawer', () => {
  it('renders nothing while closed', () => {
    render(<Drawer open={false} onOpenChange={() => {}} title="T" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('is a labelled modal dialog with header, body panel and footer', () => {
    render(
      <Drawer open onOpenChange={() => {}} title="Filter W-Engines" icon={<svg data-testid="funnel" />} footer={<button>Reset</button>}>
        <p>Body</p>
      </Drawer>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Filter W-Engines' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveClass('zzz-drawer')
    expect(dialog.closest('.zzz-overlay')?.parentElement).toBe(document.body)
    expect(screen.getByTestId('funnel').closest('.zzz-drawer__icon')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Body').closest('.zzz-drawer__panel')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Reset' }).closest('.zzz-drawer__footer')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('traps focus, closes on Escape and restores focus to the opener', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Harness onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole('button', { name: 'Filter' })
    await user.click(trigger)
    const close = screen.getByRole('button', { name: 'Close' })
    expect(close).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Chip' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(trigger).toHaveFocus()
  })

  it('the Close tag and the scrim close it; the page is inert and scroll-locked while open', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { container, rerender } = render(<Drawer open onOpenChange={onOpenChange} title="T" />)
    expect(container).toHaveAttribute('inert')
    expect(document.documentElement.style.overflow).toBe('hidden')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    onOpenChange.mockClear()
    await user.pointer({ keys: '[MouseLeft]', target: document.querySelector('.zzz-drawer-scrim')! })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    rerender(<Drawer open={false} onOpenChange={onOpenChange} title="T" />)
    expect(container).not.toHaveAttribute('inert')
  })

  it('closeOnScrim={false} keeps it open; width sets the custom property', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Drawer open onOpenChange={onOpenChange} title="T" closeOnScrim={false} width={500} />)
    await user.pointer({ keys: '[MouseLeft]', target: document.querySelector('.zzz-drawer-scrim')! })
    expect(onOpenChange).not.toHaveBeenCalled()
    expect((document.querySelector('.zzz-drawer-layer') as HTMLElement).style.getPropertyValue('--zzz-drawer-width')).toBe(
      'calc(500 * var(--zzz-px))',
    )
  })

  it('works uncontrolled and keeps the closing drawer mounted for its exit slide', async () => {
    const user = userEvent.setup()
    render(<Drawer defaultOpen title="T" />)
    await user.keyboard('{Escape}')
    expect(document.querySelector('.zzz-drawer')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(document.querySelector('.zzz-drawer')).toBeNull())
  })
})

describe('FilterDrawer', () => {
  it('renders the default title, sort row, divider, sections and Reset', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    const onDirectionChange = vi.fn()
    render(
      <FilterDrawer
        open
        onOpenChange={() => {}}
        onReset={onReset}
        sort={{ options: [{ value: 'rarity', label: 'Rarity' }, { value: 'level', label: 'Level' }], defaultValue: 'rarity', onDirectionChange }}
        groups={groups}
      />,
    )
    expect(screen.getByRole('dialog', { name: 'Filter W-Engines' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Rarity' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Agent Specialties' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Armorer' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /Sort/ }))
    expect(onDirectionChange).toHaveBeenCalledWith('asc')
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('Escape inside an open Select closes the list first, then the drawer', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <FilterDrawer
        open
        onOpenChange={onOpenChange}
        sort={{ options: [{ value: 'rarity', label: 'Rarity' }], defaultValue: 'rarity' }}
        groups={groups}
      />,
    )
    const combo = screen.getByRole('combobox')
    combo.focus()
    await user.keyboard('{ArrowDown}')
    expect(combo).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(combo).toHaveAttribute('aria-expanded', 'false')
    expect(onOpenChange).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('omits the sort row when no sort is given and toggles chips', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterDrawer open onOpenChange={() => {}} title="Filter Agents" groups={[{ ...groups[0], onValueChange }]} />)
    expect(screen.getByRole('dialog', { name: 'Filter Agents' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).toBeNull()
    await user.click(screen.getByRole('checkbox', { name: 'S' }))
    expect(onValueChange).toHaveBeenCalledWith(['s'])
  })
})
