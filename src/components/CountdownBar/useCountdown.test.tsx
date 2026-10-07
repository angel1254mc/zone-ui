import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-01T12:00:00Z'))
})
afterEach(() => {
    vi.useRealTimers()
})

const advance = (ms: number) =>
    act(() => {
        vi.advanceTimersByTime(ms)
    })

describe('useCountdown', () => {
    it('counts down a relative duration', () => {
        const { result } = renderHook(() => useCountdown({ durationMs: 5000 }))
        expect(result.current.secondsLeft).toBe(5)
        expect(result.current.fraction).toBe(1)
        advance(2000)
        expect(result.current.msLeft).toBe(3000)
        expect(result.current.secondsLeft).toBe(3)
        expect(result.current.fraction).toBeCloseTo(0.6)
        advance(250)
        expect(result.current.secondsLeft).toBe(3) // ceil: 2.75 s → 3
        expect(result.current.expired).toBe(false)
    })

    it('expires and calls onExpire exactly once', () => {
        const onExpire = vi.fn()
        const { result } = renderHook(() =>
            useCountdown({ durationMs: 5000, onExpire })
        )
        advance(4999)
        expect(onExpire).not.toHaveBeenCalled()
        advance(1)
        expect(result.current.expired).toBe(true)
        expect(result.current.msLeft).toBe(0)
        expect(result.current.fraction).toBe(0)
        advance(5000)
        expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('follows the wall clock, not the number of ticks (throttled tab)', () => {
        const { result } = renderHook(() =>
            useCountdown({ durationMs: 30_000 })
        )
        // Jump the clock without firing timers (a background tab that got no ticks).
        vi.setSystemTime(Date.now() + 10_000)
        advance(250) // the next (single) tick
        expect(result.current.secondsLeft).toBe(20)
    })

    it('re-syncs on visibilitychange', () => {
        const { result } = renderHook(() =>
            useCountdown({ durationMs: 30_000, intervalMs: 1000 })
        )
        vi.setSystemTime(Date.now() + 12_000)
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'))
        })
        expect(result.current.secondsLeft).toBe(18)
    })

    it('pause freezes, resume continues', () => {
        const { result } = renderHook(() =>
            useCountdown({ durationMs: 10_000 })
        )
        advance(3000)
        act(() => result.current.pause())
        expect(result.current.ticking).toBe(false)
        advance(5000)
        expect(result.current.msLeft).toBe(7000)
        act(() => result.current.resume())
        advance(2000)
        expect(result.current.msLeft).toBe(5000)
    })

    it('running=false never starts; toggling to true starts', () => {
        const onExpire = vi.fn()
        const { result, rerender } = renderHook(
            (p: { running: boolean }) =>
                useCountdown({
                    durationMs: 2000,
                    running: p.running,
                    onExpire,
                }),
            {
                initialProps: { running: false },
            }
        )
        advance(5000)
        expect(result.current.msLeft).toBe(2000)
        expect(onExpire).not.toHaveBeenCalled()
        rerender({ running: true })
        advance(2000)
        expect(result.current.expired).toBe(true)
        expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('reset restarts and re-arms onExpire', () => {
        const onExpire = vi.fn()
        const { result } = renderHook(() =>
            useCountdown({ durationMs: 1000, onExpire })
        )
        advance(1000)
        expect(onExpire).toHaveBeenCalledTimes(1)
        act(() => result.current.reset())
        expect(result.current.secondsLeft).toBe(1)
        expect(result.current.expired).toBe(false)
        advance(1000)
        expect(onExpire).toHaveBeenCalledTimes(2)
        act(() => result.current.reset(4000))
        expect(result.current.totalMs).toBe(4000)
        expect(result.current.secondsLeft).toBe(4)
    })

    it('deadline mode: fraction relative to the time left at mount, past deadline expires at once', () => {
        const deadline = Date.now() + 8000
        const { result } = renderHook(() => useCountdown({ deadline }))
        expect(result.current.totalMs).toBe(8000)
        advance(2000)
        expect(result.current.fraction).toBeCloseTo(0.75)

        const onExpire = vi.fn()
        const past = renderHook(() =>
            useCountdown({ deadline: new Date(Date.now() - 1000), onExpire })
        )
        expect(past.result.current.expired).toBe(true)
        expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('restarts when durationMs changes and cleans up on unmount', () => {
        const { result, rerender, unmount } = renderHook(
            (p: { d: number }) => useCountdown({ durationMs: p.d }),
            { initialProps: { d: 3000 } }
        )
        advance(1000)
        rerender({ d: 9000 })
        expect(result.current.secondsLeft).toBe(9)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })

    it('is idle without durationMs/deadline: no ticks, no onExpire, not expired', () => {
        const onExpire = vi.fn()
        const { result, rerender } = renderHook(
            (p: { d?: number }) => useCountdown({ durationMs: p.d, onExpire }),
            {
                initialProps: {} as { d?: number },
            }
        )
        advance(5000)
        expect(onExpire).not.toHaveBeenCalled()
        expect(result.current.idle).toBe(true)
        expect(result.current.expired).toBe(false)
        expect(result.current.ticking).toBe(false)
        expect(result.current.fraction).toBe(1)
        rerender({ d: 1000 })
        expect(result.current.idle).toBe(false)
        advance(1100)
        expect(onExpire).toHaveBeenCalledTimes(1)
        expect(result.current.expired).toBe(true)
    })

    it('an explicit durationMs of 0 still expires immediately', () => {
        const onExpire = vi.fn()
        renderHook(() => useCountdown({ durationMs: 0, onExpire }))
        advance(10)
        expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('reset(ms) arms an idle clock', () => {
        const onExpire = vi.fn()
        const { result } = renderHook(() => useCountdown({ onExpire }))
        act(() => result.current.reset(1000))
        expect(result.current.idle).toBe(false)
        advance(1100)
        expect(onExpire).toHaveBeenCalledTimes(1)
    })
})
