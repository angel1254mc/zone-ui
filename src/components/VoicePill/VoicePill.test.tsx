import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VoicePill } from './index'

describe('VoicePill', () => {
  it('renders a toggle button and the voice-actor line', () => {
    render(<VoicePill name="Blythe Melin" />)
    const button = screen.getByRole('button', { name: 'Play voice sample' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('CV:')).toBeInTheDocument()
    expect(screen.getByText('Blythe Melin')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('toggles playing (uncontrolled) with click, Enter and Space', async () => {
    const onPlayingChange = vi.fn()
    render(<VoicePill name="A" onPlayingChange={onPlayingChange} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    button.focus()
    await userEvent.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard(' ')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(onPlayingChange.mock.calls.map((c) => c[0])).toEqual([true, false, true])
  })

  it('is controllable', async () => {
    function Controlled() {
      const [playing, setPlaying] = useState(true)
      return (
        <>
          <VoicePill name="A" playing={playing} onPlayingChange={setPlaying} />
          <output>{String(playing)}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('status')).toHaveTextContent('false')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('exposes progress as a progressbar and drives the fill', () => {
    const { container } = render(<VoicePill name="A" progress={0.4} />)
    const bar = screen.getByRole('progressbar', { name: 'Playback progress' })
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    const root = container.querySelector('.zzz-voice-pill') as HTMLElement
    expect(root.style.getPropertyValue('--zzz-voice-progress')).toBe('40%')
  })

  it('clamps progress', () => {
    render(<VoicePill name="A" progress={2} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('does not toggle when disabled', async () => {
    const onPlayingChange = vi.fn()
    render(<VoicePill name="A" disabled onPlayingChange={onPlayingChange} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onPlayingChange).not.toHaveBeenCalled()
  })

  it('supports labels, trailing slot, skin/tone and pass-through props', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <VoicePill
        ref={ref}
        name="Blythe Melin"
        label="VA:"
        playLabel="Play Belle's voice line"
        trailing={<span>EN</span>}
        skin="game"
        tone="light"
        className="extra"
        data-testid="v"
      />,
    )
    const root = screen.getByTestId('v')
    expect(ref.current).toBe(root)
    expect(root).toHaveAttribute('data-skin', 'game')
    expect(root).toHaveAttribute('data-tone', 'light')
    expect(root).toHaveClass('zzz-voice-pill', 'extra')
    expect(screen.getByText('VA:')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Play Belle's voice line" })).toBeInTheDocument()
  })
})
