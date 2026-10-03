import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Splash, SPLASH_EXIT_MS } from './Splash'

const finishExit = () =>
  act(() => {
    vi.advanceTimersByTime(SPLASH_EXIT_MS)
  })

describe('Splash', () => {
  it('renders a modal dialog labelled by its title, with logo, subtitle, footer and a focused enter button', () => {
    render(<Splash title="Proxy Trivia" subtitle="A daily quiz" logo={<svg data-testid="logo" />} footer="v1.0" />)
    const dialog = screen.getByRole('dialog', { name: 'Proxy Trivia' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('A daily quiz')
    expect(dialog).toHaveTextContent('v1.0')
    const enter = screen.getByRole('button', { name: 'Press to enter' })
    expect(enter).toHaveFocus()
  })

  it('without a title the dialog is named by the hint', () => {
    render(<Splash hint="Tap to start" />)
    expect(screen.getByRole('dialog', { name: 'Tap to start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tap to start' })).toBeInTheDocument()
  })

  describe('dismiss', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('a click anywhere calls onEnter once (in the event) and fades out, then unmounts', () => {
      const onEnter = vi.fn()
      const onOpenChange = vi.fn()
      render(<Splash title="T" onEnter={onEnter} onOpenChange={onOpenChange} />)
      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog.querySelector('.zzz-splash__title')!)
      expect(onEnter).toHaveBeenCalledTimes(1)
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(dialog).toHaveAttribute('data-state', 'closed')
      fireEvent.click(dialog)
      expect(onEnter).toHaveBeenCalledTimes(1)
      finishExit()
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('clicking the enter button dismisses exactly once', () => {
      const onEnter = vi.fn()
      render(<Splash title="T" onEnter={onEnter} />)
      fireEvent.click(screen.getByRole('button', { name: 'Press to enter' }))
      expect(onEnter).toHaveBeenCalledTimes(1)
    })

    it('Enter or Space with focus on the dialog root dismisses', () => {
      const onEnter = vi.fn()
      const { rerender } = render(<Splash title="T" onEnter={onEnter} />)
      fireEvent.keyDown(screen.getByRole('dialog'), { key: ' ' })
      expect(onEnter).toHaveBeenCalledTimes(1)
      finishExit()
      rerender(<Splash key="2" title="T" onEnter={onEnter} />)
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' })
      expect(onEnter).toHaveBeenCalledTimes(2)
    })

    it('other keys do nothing', () => {
      const onEnter = vi.fn()
      render(<Splash title="T" onEnter={onEnter} />)
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'a' })
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      expect(onEnter).not.toHaveBeenCalled()
      expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open')
    })
  })

  it('keyboard on the focused button: Enter and Space dismiss (real key events)', async () => {
    const onEnter = vi.fn()
    const { unmount } = render(<Splash title="T" onEnter={onEnter} />)
    await userEvent.keyboard('{Enter}')
    expect(onEnter).toHaveBeenCalledTimes(1)
    unmount()
    render(<Splash title="T" onEnter={onEnter} />)
    await userEvent.keyboard(' ')
    expect(onEnter).toHaveBeenCalledTimes(2)
  })

  it('controlled: stays open until the parent closes it; open={false} renders nothing', async () => {
    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Splash title="T" open={open} onOpenChange={setOpen} />
          <output data-testid="open">{String(open)}</output>
        </>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('dialog'))
    expect(screen.getByTestId('open')).toHaveTextContent('false')

    const onOpenChange = vi.fn()
    const { rerender } = render(<Splash title="Gate" open onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('dialog', { name: 'Gate' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('dialog', { name: 'Gate' })).toHaveAttribute('data-state', 'open')
    rerender(<Splash title="Gate" open={false} defaultOpen onOpenChange={onOpenChange} />)
  })

  it('is modal: Tab stays inside, its siblings are inert, focus returns to the opener on dismiss', async () => {
    const ui = (open: boolean) => (
      <>
        <button type="button">Opener</button>
        <Splash title="T" open={open} onOpenChange={() => rerender(ui(false))} />
      </>
    )
    const { rerender } = render(ui(false))
    const opener = screen.getByRole('button', { name: 'Opener' })
    opener.focus()
    rerender(ui(true))
    const enter = screen.getByRole('button', { name: 'Press to enter' })
    expect(enter).toHaveFocus()
    expect(opener).toHaveAttribute('inert')
    await userEvent.tab()
    expect(enter).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(enter).toHaveFocus()
    await userEvent.click(enter)
    expect(opener).not.toHaveAttribute('inert')
    expect(opener).toHaveFocus()
  })

  it('defaultOpen false renders nothing', () => {
    render(<Splash title="T" defaultOpen={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('an onClick that prevents default keeps it open; contained + background map to classes; ref forwards', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Splash title="T" contained background="hatch" className="extra" ref={ref} onClick={(e) => e.preventDefault()} />)
    const dialog = screen.getByRole('dialog')
    expect(ref.current).toBe(dialog)
    expect(dialog).toHaveClass('zzz-splash', 'zzz-splash--contained', 'zzz-splash--bg-hatch', 'extra')
    fireEvent.click(dialog)
    expect(dialog).toHaveAttribute('data-state', 'open')
  })
})
