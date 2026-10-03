import { act, render } from '@testing-library/react'
import { AgentSelectInterstitial, INTERSTITIAL_TIMING } from './AgentSelectInterstitial'

const layer = () => document.querySelector('.zzz-interstitial') as HTMLElement | null
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

describe('AgentSelectInterstitial', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders nothing until play rises', () => {
    render(<AgentSelectInterstitial play={false} />)
    expect(layer()).toBeNull()
  })

  it('plays once on the rising edge: decorative layer with 3 panels + band, midpoint and done callbacks', () => {
    const onMidpoint = vi.fn()
    const onDone = vi.fn()
    const { rerender } = render(<AgentSelectInterstitial play={false} onMidpoint={onMidpoint} onDone={onDone} reducedMotion={false} />)
    rerender(<AgentSelectInterstitial play onMidpoint={onMidpoint} onDone={onDone} reducedMotion={false} />)
    const el = layer()!
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.parentElement).toBe(document.body)
    expect(el.querySelectorAll('.zzz-sweep__panel')).toHaveLength(3)
    expect(el.querySelector('.zzz-sweep__label')).toHaveTextContent('Agent Select')
    advance(INTERSTITIAL_TIMING.midpoint)
    expect(onMidpoint).toHaveBeenCalledTimes(1)
    expect(onDone).not.toHaveBeenCalled()
    advance(INTERSTITIAL_TIMING.total - INTERSTITIAL_TIMING.midpoint)
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(layer()).toBeNull()
  })

  it('plays on mount when play starts true, and again after re-arming', () => {
    const onDone = vi.fn()
    const { rerender } = render(<AgentSelectInterstitial play onDone={onDone} reducedMotion={false} />)
    expect(layer()).not.toBeNull()
    advance(INTERSTITIAL_TIMING.total)
    expect(onDone).toHaveBeenCalledTimes(1)
    rerender(<AgentSelectInterstitial play={false} onDone={onDone} reducedMotion={false} />)
    rerender(<AgentSelectInterstitial play onDone={onDone} reducedMotion={false} />)
    expect(layer()).toHaveAttribute('data-run', '2')
    advance(INTERSTITIAL_TIMING.total)
    expect(onDone).toHaveBeenCalledTimes(2)
  })

  it('reduced motion runs the quick fade with shorter timings', () => {
    const onMidpoint = vi.fn()
    const onDone = vi.fn()
    render(<AgentSelectInterstitial play reducedMotion onMidpoint={onMidpoint} onDone={onDone} label="Agent Stats" />)
    expect(layer()).toHaveAttribute('data-reduced')
    expect(layer()!.querySelector('.zzz-sweep__label')).toHaveTextContent('Agent Stats')
    advance(INTERSTITIAL_TIMING.reducedMidpoint)
    expect(onMidpoint).toHaveBeenCalled()
    advance(INTERSTITIAL_TIMING.reducedTotal - INTERSTITIAL_TIMING.reducedMidpoint)
    expect(onDone).toHaveBeenCalled()
  })

  it('`at` freezes the timeline and renders without play; container keeps it inside', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    render(<AgentSelectInterstitial play={false} at={300} container={host} agentColor="#C0506A" />)
    const el = host.querySelector('.zzz-interstitial') as HTMLElement
    expect(el).toHaveAttribute('data-frozen')
    expect(el).toHaveClass('zzz-overlay--contained')
    expect(el.style.getPropertyValue('--zzz-sweep-at')).toBe('-300ms')
    const tinted = el.querySelector('.zzz-sweep__panel--light .zzz-hatch-bg--tinted') as HTMLElement
    expect(tinted.style.getPropertyValue('--zzz-hatch-light')).toContain('#C0506A')
    host.remove()
  })

  it('forwards ref, className, style and native div props to the layer root; aria-hidden stays', () => {
    const ref = { current: null as HTMLDivElement | null }
    const { rerender } = render(
      <AgentSelectInterstitial
        play
        ref={ref}
        id="wipe"
        data-testid="inter"
        title="ignored by AT"
        aria-hidden="false"
        className="extra"
        style={{ zIndex: 7 }}
      />,
    )
    const el = layer()!
    expect(ref.current).toBe(el)
    expect(el).toHaveAttribute('id', 'wipe')
    expect(el).toHaveAttribute('data-testid', 'inter')
    expect(el).toHaveAttribute('title', 'ignored by AT')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveClass('zzz-interstitial', 'zzz-sweep', 'extra')
    expect(el.style.zIndex).toBe('7')
    advance(INTERSTITIAL_TIMING.total)
    rerender(<AgentSelectInterstitial play ref={ref} />)
    expect(layer()).toBeNull()
    expect(ref.current).toBeNull()
  })

  it('calls a callback ref with the layer and with null when it unmounts', () => {
    const calls: Array<HTMLDivElement | null> = []
    const cbRef = (n: HTMLDivElement | null) => {
      calls.push(n)
    }
    const { unmount } = render(<AgentSelectInterstitial play={false} at={100} ref={cbRef} />)
    expect(calls[calls.length - 1]).toBe(layer())
    unmount()
    expect(calls[calls.length - 1]).toBeNull()
  })
})
