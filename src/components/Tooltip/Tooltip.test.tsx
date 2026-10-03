import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Modal } from '../Modal'
import { Tooltip } from './Tooltip'
import { computePosition } from './floating'

describe('Tooltip', () => {
  afterEach(() => vi.useRealTimers())

  it('is closed by default and opens immediately on focus, describing the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Base ATK of the W-Engine">
        <button>ATK</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).toBeNull()
    await user.tab()
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('Base ATK of the W-Engine')
    expect(screen.getByRole('button', { name: 'ATK' })).toHaveAttribute('aria-describedby', tip.id)
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Base ATK of the W-Engine')
  })

  it('Escape on a focused trigger inside a Modal hides only the tooltip, not the dialog', async () => {
    const user = userEvent.setup()
    render(
      <Modal defaultOpen title="Edit">
        <Tooltip content="Attack power">
          <button>ATK</button>
        </Tooltip>
      </Modal>,
    )
    const btn = screen.getByRole('button', { name: 'ATK' })
    expect(document.activeElement).toBe(btn)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // A second Escape (tooltip already closed) is the dialog's again.
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not swallow Escape on the trigger while the tooltip is closed', () => {
    const outer = vi.fn()
    render(
      <div onKeyDown={(e) => outer(e.defaultPrevented)}>
        <Tooltip content="Tip">
          <button>A</button>
        </Tooltip>
      </div>,
    )
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' })
    expect(outer).toHaveBeenCalledWith(false)
  })

  it('closes on blur and on Escape', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Tooltip content="Tip">
          <button>A</button>
        </Tooltip>
        <button>B</button>
      </>,
    )
    await user.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(screen.getByRole('button', { name: 'A' })).not.toHaveAttribute('aria-describedby')
    await user.tab({ shift: true })
    await user.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.tab()
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('opens on hover only after the delay', () => {
    vi.useFakeTimers()
    render(
      <Tooltip content="Tip" delay={300}>
        <button>A</button>
      </Tooltip>,
    )
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(299))
    expect(screen.queryByRole('tooltip')).toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.pointerLeave(screen.getByRole('button'), { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(100))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('keeps existing aria-describedby and handlers of the child', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    render(
      <>
        <span id="hint">hint</span>
        <Tooltip content="Tip">
          <button aria-describedby="hint" onFocus={onFocus}>
            A
          </button>
        </Tooltip>
      </>,
    )
    await user.tab()
    expect(onFocus).toHaveBeenCalled()
    const tip = screen.getByRole('tooltip')
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe(`hint ${tip.id}`)
  })

  it('supports controlled open', async () => {
    const user = userEvent.setup()
    function C() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Tooltip content="Tip" open={open} onOpenChange={setOpen}>
            <button>A</button>
          </Tooltip>
          <span data-testid="state">{String(open)}</span>
        </>
      )
    }
    render(<C />)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByTestId('state')).toHaveTextContent('false')
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('uncontrolled defaultOpen and placement set data-side', () => {
    render(
      <Tooltip content="Tip" defaultOpen placement="right">
        <button>A</button>
      </Tooltip>,
    )
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'right')
  })

  it('never opens when disabled', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Tip" disabled>
        <button>A</button>
      </Tooltip>,
    )
    await user.tab()
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('passes className/style/ref to the bubble', () => {
    let node: HTMLDivElement | null = null
    render(
      <Tooltip content="Tip" defaultOpen className="x" style={{ color: 'red' }} ref={(n) => { node = n }}>
        <button>A</button>
      </Tooltip>,
    )
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveClass('zzz-tooltip', 'x')
    expect(tip).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    expect(node).toBe(tip)
    // portalled into a theme root
    expect(tip.closest('.zzz-theme.zzz-portal')).not.toBeNull()
  })
})

describe('computePosition', () => {
  const vp = { width: 1000, height: 800 }
  const size = { width: 100, height: 40 }
  it('places on the requested side, centred', () => {
    const r = computePosition({ top: 400, left: 450, width: 100, height: 30 }, size, 'top', 'center', 16, vp)
    expect(r).toMatchObject({ side: 'top', x: 450, y: 344, arrow: 50 })
  })
  it('flips when the requested side does not fit', () => {
    const r = computePosition({ top: 10, left: 450, width: 100, height: 30 }, size, 'top', 'center', 16, vp)
    expect(r.side).toBe('bottom')
    expect(r.y).toBe(56)
    const l = computePosition({ top: 400, left: 5, width: 50, height: 30 }, size, 'left', 'center', 16, vp)
    expect(l.side).toBe('right')
  })
  it('clamps the cross axis into the viewport', () => {
    const r = computePosition({ top: 400, left: 960, width: 30, height: 30 }, size, 'bottom', 'center', 16, vp)
    expect(r.x).toBe(1000 - 8 - 100)
    expect(r.arrow).toBe(975 - 892)
  })
})
