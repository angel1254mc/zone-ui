import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { SoundToggle } from './SoundToggle'

describe('SoundToggle', () => {
  it('renders a labelled toggle button, unpressed by default, with the speaker glyph', () => {
    render(<SoundToggle />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    expect(btn.querySelector('.zzz-icon--speaker')).not.toBeNull()
    expect(screen.queryByRole('slider')).toBeNull()
  })

  it('uncontrolled: click toggles muted and reports it; the glyph switches', async () => {
    const onMutedChange = vi.fn()
    render(<SoundToggle onMutedChange={onMutedChange} />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(onMutedChange).toHaveBeenLastCalledWith(true)
    expect(btn.querySelector('.zzz-icon--speaker-muted')).not.toBeNull()
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('keyboard: Enter and Space toggle', async () => {
    render(<SoundToggle />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    btn.focus()
    await userEvent.keyboard('{Enter}')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard(' ')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('controlled muted: stays until the parent changes it', async () => {
    const onMutedChange = vi.fn()
    const { rerender } = render(<SoundToggle muted={false} onMutedChange={onMutedChange} />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    await userEvent.click(btn)
    expect(onMutedChange).toHaveBeenCalledWith(true)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    rerender(<SoundToggle muted onMutedChange={onMutedChange} />)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('inline volume: labelled slider with percent value text; arrows change the volume', () => {
    const onVolumeChange = vi.fn()
    render(<SoundToggle volumeControl="inline" defaultVolume={0.5} onVolumeChange={onVolumeChange} />)
    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveAttribute('aria-valuenow', '0.5')
    expect(slider).toHaveAttribute('aria-valuetext', '50%')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onVolumeChange).toHaveBeenLastCalledWith(0.55)
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(onVolumeChange).toHaveBeenLastCalledWith(0)
    expect(screen.getByRole('button').querySelector('.zzz-icon--speaker-muted')).not.toBeNull()
  })

  it('controlled volume + muted; moving the slider while muted un-mutes', () => {
    function Harness() {
      const [muted, setMuted] = useState(true)
      const [volume, setVolume] = useState(0.3)
      return (
        <>
          <SoundToggle volumeControl="popover" muted={muted} onMutedChange={setMuted} volume={volume} onVolumeChange={setVolume} />
          <output data-testid="state">{`${muted}:${volume}`}</output>
        </>
      )
    }
    render(<Harness />)
    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveAttribute('aria-valuetext', '30%, muted')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(screen.getByTestId('state')).toHaveTextContent('false:0.35')
    expect(screen.getByRole('button', { name: 'Mute' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button').querySelector('.zzz-icon--speaker-low')).not.toBeNull()
  })

  it('popover mode keeps the slider in the tab order after the button', async () => {
    render(<SoundToggle volumeControl="popover" />)
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Mute' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveFocus()
    expect(document.querySelector('.zzz-sound-toggle')).toHaveAttribute('data-placement', 'bottom')
  })

  it('custom labels', () => {
    render(<SoundToggle label="Mute music" volumeLabel="Music volume" volumeControl="inline" />)
    expect(screen.getByRole('button', { name: 'Mute music' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Music volume' })).toBeInTheDocument()
  })

  it('disabled: the button is disabled and the slider is inert', async () => {
    const onMutedChange = vi.fn()
    render(<SoundToggle disabled volumeControl="inline" onMutedChange={onMutedChange} />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onMutedChange).not.toHaveBeenCalled()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true')
  })

  describe('popover open state', () => {
    const root = () => document.querySelector('.zzz-sound-toggle') as HTMLElement

    it('controlled popoverOpen maps to data-open', () => {
      const { rerender } = render(<SoundToggle volumeControl="popover" popoverOpen={false} />)
      expect(root()).not.toHaveAttribute('data-open')
      rerender(<SoundToggle volumeControl="popover" popoverOpen />)
      expect(root()).toHaveAttribute('data-open')
    })

    it('uncontrolled defaultPopoverOpen opens it; Escape closes and reports it', () => {
      const onPopoverOpenChange = vi.fn()
      render(<SoundToggle volumeControl="popover" defaultPopoverOpen onPopoverOpenChange={onPopoverOpenChange} />)
      expect(root()).toHaveAttribute('data-open')
      fireEvent.keyDown(screen.getByRole('slider'), { key: 'Escape' })
      expect(onPopoverOpenChange).toHaveBeenLastCalledWith(false)
      expect(root()).not.toHaveAttribute('data-open')
    })

    it('a pointer-down outside closes it', () => {
      const onPopoverOpenChange = vi.fn()
      render(
        <>
          <SoundToggle volumeControl="popover" defaultPopoverOpen onPopoverOpenChange={onPopoverOpenChange} />
          <p>outside</p>
        </>,
      )
      fireEvent.pointerDown(screen.getByText('outside'))
      expect(onPopoverOpenChange).toHaveBeenLastCalledWith(false)
      expect(root()).not.toHaveAttribute('data-open')
    })

    it('an external trigger with aria-controls toggles it open and closed (not re-opened by outside-dismiss)', async () => {
      const user = userEvent.setup()
      const onPopoverOpenChange = vi.fn()
      function Demo() {
        const [open, setOpen] = useState(false)
        return (
          <>
            <SoundToggle
              volumeControl="popover"
              popoverId="vol-pop"
              popoverOpen={open}
              onPopoverOpenChange={(o) => {
                onPopoverOpenChange(o)
                setOpen(o)
              }}
            />
            <button type="button" aria-controls="vol-pop" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span>Volume</span>
            </button>
            <p>outside</p>
          </>
        )
      }
      render(<Demo />)
      expect(document.getElementById('vol-pop')).toHaveClass('zzz-sound-toggle__popover')
      const trigger = screen.getByRole('button', { name: 'Volume' })
      await user.click(trigger)
      expect(root()).toHaveAttribute('data-open')
      // a pointer-down on the trigger (or its children) is not an outside dismiss
      await user.click(screen.getByText('Volume'))
      expect(root()).not.toHaveAttribute('data-open')
      expect(onPopoverOpenChange).not.toHaveBeenCalled()
      await user.click(trigger)
      expect(root()).toHaveAttribute('data-open')
      // anything else outside still dismisses
      await user.click(screen.getByText('outside'))
      expect(root()).not.toHaveAttribute('data-open')
      expect(onPopoverOpenChange).toHaveBeenLastCalledWith(false)
    })

    it('generates a popover id when none is given', () => {
      render(<SoundToggle volumeControl="popover" />)
      const pop = document.querySelector('.zzz-sound-toggle__popover')
      expect(pop?.id).toBeTruthy()
    })

    it('touch long-press on the button opens the popover without toggling mute', () => {
      vi.useFakeTimers()
      try {
        const onMutedChange = vi.fn()
        const onPopoverOpenChange = vi.fn()
        render(<SoundToggle volumeControl="popover" onMutedChange={onMutedChange} onPopoverOpenChange={onPopoverOpenChange} />)
        const btn = screen.getByRole('button', { name: 'Mute' })
        fireEvent.pointerDown(btn, { pointerType: 'touch' })
        act(() => vi.advanceTimersByTime(500))
        expect(onPopoverOpenChange).toHaveBeenLastCalledWith(true)
        expect(root()).toHaveAttribute('data-open')
        fireEvent.pointerUp(btn, { pointerType: 'touch' })
        fireEvent.click(btn)
        expect(onMutedChange).not.toHaveBeenCalled()
        expect(btn).toHaveAttribute('aria-pressed', 'false')
        // a normal short tap afterwards still toggles mute
        fireEvent.pointerDown(btn, { pointerType: 'touch' })
        act(() => vi.advanceTimersByTime(100))
        fireEvent.pointerUp(btn, { pointerType: 'touch' })
        fireEvent.click(btn)
        expect(onMutedChange).toHaveBeenLastCalledWith(true)
      } finally {
        vi.useRealTimers()
      }
    })

    it('a mouse press does not start the long-press', () => {
      vi.useFakeTimers()
      try {
        const onPopoverOpenChange = vi.fn()
        render(<SoundToggle volumeControl="popover" onPopoverOpenChange={onPopoverOpenChange} />)
        fireEvent.pointerDown(screen.getByRole('button'), { pointerType: 'mouse' })
        act(() => vi.advanceTimersByTime(1000))
        expect(onPopoverOpenChange).not.toHaveBeenCalled()
      } finally {
        vi.useRealTimers()
      }
    })

    it('ignored outside popover mode', () => {
      render(<SoundToggle volumeControl="inline" popoverOpen />)
      expect(root()).not.toHaveAttribute('data-open')
    })
  })

  it('forwards ref, className, style and native props to the root', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<SoundToggle ref={ref} className="extra" style={{ marginTop: 3 }} data-testid="st" />)
    const root = screen.getByTestId('st')
    expect(ref.current).toBe(root)
    expect(root).toHaveClass('zzz-sound-toggle', 'extra')
    expect(root.style.marginTop).toBe('3px')
  })
})

describe('SoundToggle sizes', () => {
  it('forwards sm / md / lg (default md) and the legacy presets to the mute IconButton', () => {
    const { rerender } = render(<SoundToggle />)
    const btn = screen.getByRole('button', { name: 'Mute' })
    expect(btn).toHaveClass('zzz-icon-button--md')
    expect(btn).toHaveAttribute('data-size', 'md')
    for (const size of ['sm', 'md', 'lg', 'stepper'] as const) {
      rerender(<SoundToggle size={size} />)
      expect(btn).toHaveClass(`zzz-icon-button--${size}`)
    }
  })

  it('marks the root with data-size so the gap can follow the size', () => {
    const { container } = render(<SoundToggle size="lg" />)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'lg')
  })
})
