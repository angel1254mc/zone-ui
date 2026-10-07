import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Countdown, formatCountdown, splitDuration } from './Countdown'

const NOW = new Date('2026-10-01T12:00:00Z').getTime()
const H = 3_600_000
const M = 60_000
const S = 1000

beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
})
afterEach(() => {
    vi.useRealTimers()
})

const advance = (ms: number) =>
    act(() => {
        vi.advanceTimersByTime(ms)
    })

const timeText = () =>
    screen.getByRole('timer').querySelector('time')!.textContent

describe('Countdown', () => {
    it('renders a timer pill with the hh:mm:ss readout and ticks each second', () => {
        render(
            <Countdown
                target={NOW + 7 * H + 42 * M + 13 * S}
                prefix="Next puzzle in"
            />
        )
        const timer = screen.getByRole('timer')
        expect(timer).toHaveClass('zzz-info-pill', 'zzz-countdown--pill')
        expect(timer).not.toHaveAttribute('aria-live')
        expect(timer.textContent).toContain('Next puzzle in')
        expect(timeText()).toBe('07:42:13')
        expect(timer.querySelector('time')).toHaveAttribute(
            'dateTime',
            'P0DT7H42M13S'
        )
        expect(timer.querySelector('svg')).not.toBeNull() // default clock glyph
        advance(1000)
        expect(timeText()).toBe('07:42:12')
        advance(60_000)
        expect(timeText()).toBe('07:41:12')
    })

    it('calls onReach once at the target and shows reachedLabel', () => {
        const onReach = vi.fn()
        render(
            <Countdown
                target={new Date(NOW + 3 * S)}
                onReach={onReach}
                reachedLabel="Ready!"
            />
        )
        advance(2000)
        expect(timeText()).toBe('00:00:01')
        expect(onReach).not.toHaveBeenCalled()
        advance(1000)
        expect(onReach).toHaveBeenCalledTimes(1)
        expect(timeText()).toBe('Ready!')
        expect(screen.getByRole('timer')).toHaveAttribute('data-reached')
        advance(10_000)
        expect(onReach).toHaveBeenCalledTimes(1)
    })

    it('formats presets and custom functions', () => {
        const p = splitDuration(2 * 86_400_000 + 7 * H + 42 * M + 13 * S)
        expect(p).toMatchObject({ days: 2, hours: 7, minutes: 42, seconds: 13 })
        expect(formatCountdown(p)).toBe('2d 07:42:13')
        expect(formatCountdown(p, 'hms')).toBe('55:42:13')
        expect(formatCountdown(p, 'dhms')).toBe('2d 07:42:13')
        expect(formatCountdown(p, 'labels')).toBe('2d 7h 42m 13s')
        expect(formatCountdown(p, 'compact')).toBe('2d')
        const q = splitDuration(42 * M + 13 * S)
        expect(formatCountdown(q, 'ms')).toBe('42:13')
        expect(formatCountdown(q, 'labels')).toBe('42m 13s')
        expect(formatCountdown(splitDuration(0), 'labels')).toBe('0s')
        expect(formatCountdown(splitDuration(0), 'compact')).toBe('0s')

        render(
            <Countdown
                target={NOW + 5 * S}
                format={({ seconds }) => `T-${seconds}`}
            />
        )
        expect(timeText()).toBe('T-5')
    })

    it('plain variant, slots, icon null, and pass-through props', () => {
        const ref = createRef<HTMLSpanElement>()
        render(
            <Countdown
                ref={ref}
                variant="plain"
                target={NOW + 90 * S}
                format="labels"
                suffix="left"
                className="x"
                data-testid="cd"
                icon={null}
            />
        )
        const el = screen.getByTestId('cd')
        expect(ref.current).toBe(el)
        expect(el).toHaveClass('zzz-countdown--plain', 'x')
        expect(el).toHaveAttribute('role', 'timer')
        expect(el.textContent).toBe('1m 30s left')
        expect(el.querySelector('svg')).toBeNull()
    })

    it('restarts for a new target', () => {
        const onReach = vi.fn()
        const { rerender } = render(
            <Countdown target={NOW + S} onReach={onReach} />
        )
        advance(1000)
        expect(onReach).toHaveBeenCalledTimes(1)
        rerender(<Countdown target={Date.now() + 2 * S} onReach={onReach} />)
        expect(timeText()).toBe('00:00:02')
        advance(2000)
        expect(onReach).toHaveBeenCalledTimes(2)
    })

    it('marks the pill without a glyph so it can pad both ends evenly', () => {
        const { rerender } = render(
            <Countdown target={NOW + 90 * S} icon={null} />
        )
        expect(screen.getByRole('timer')).toHaveClass('zzz-countdown--no-icon')
        rerender(<Countdown target={NOW + 90 * S} />)
        expect(screen.getByRole('timer')).not.toHaveClass(
            'zzz-countdown--no-icon'
        )
    })
})
