import { act, render } from '@testing-library/react'
import { SweepTransition, SWEEP_TIMING, sweepTones } from './SweepTransition'

const layer = () => document.querySelector('.zzz-sweep') as HTMLElement | null
const advance = (ms: number) =>
    act(() => {
        vi.advanceTimersByTime(ms)
    })

describe('SweepTransition', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('renders nothing until active rises', () => {
        render(<SweepTransition active={false} />)
        expect(layer()).toBeNull()
    })

    it('plays once on the rising edge: decorative layer, 3 panels, label, onMidpoint then onDone', () => {
        const onMidpoint = vi.fn()
        const onDone = vi.fn()
        const { rerender } = render(
            <SweepTransition
                label="Question 3"
                onMidpoint={onMidpoint}
                onDone={onDone}
                reducedMotion={false}
            />
        )
        rerender(
            <SweepTransition
                active
                label="Question 3"
                onMidpoint={onMidpoint}
                onDone={onDone}
                reducedMotion={false}
            />
        )
        const el = layer()!
        expect(el).toHaveAttribute('aria-hidden', 'true')
        expect(el.parentElement).toBe(document.body)
        expect(el.querySelectorAll('.zzz-sweep__panel')).toHaveLength(3)
        expect(el.querySelector('.zzz-sweep__label')).toHaveTextContent(
            'Question 3'
        )
        advance(SWEEP_TIMING.midpoint - 1)
        expect(onMidpoint).not.toHaveBeenCalled()
        advance(1)
        expect(onMidpoint).toHaveBeenCalledTimes(1)
        expect(onDone).not.toHaveBeenCalled()
        advance(SWEEP_TIMING.total - SWEEP_TIMING.midpoint)
        expect(onDone).toHaveBeenCalledTimes(1)
        expect(layer()).toBeNull()
    })

    it('duration scales the timers and the CSS timeline', () => {
        const onMidpoint = vi.fn()
        const onDone = vi.fn()
        render(
            <SweepTransition
                active
                duration={1866}
                onMidpoint={onMidpoint}
                onDone={onDone}
                reducedMotion={false}
            />
        )
        expect(layer()!.style.getPropertyValue('--zzz-sweep-duration')).toBe(
            '1866ms'
        )
        advance(1133)
        expect(onMidpoint).not.toHaveBeenCalled()
        advance(1)
        expect(onMidpoint).toHaveBeenCalledTimes(1)
        advance(1866 - 1134 - 1)
        expect(onDone).not.toHaveBeenCalled()
        advance(1)
        expect(onDone).toHaveBeenCalledTimes(1)
    })

    it('keyed mode: plays on mount and on every new runKey', () => {
        const onDone = vi.fn()
        const { rerender } = render(
            <SweepTransition runKey={1} onDone={onDone} reducedMotion={false} />
        )
        expect(layer()).toHaveAttribute('data-run', '1')
        advance(SWEEP_TIMING.total)
        expect(onDone).toHaveBeenCalledTimes(1)
        rerender(
            <SweepTransition runKey={1} onDone={onDone} reducedMotion={false} />
        )
        expect(layer()).toBeNull()
        rerender(
            <SweepTransition runKey={2} onDone={onDone} reducedMotion={false} />
        )
        expect(layer()).toHaveAttribute('data-run', '2')
        advance(SWEEP_TIMING.total)
        expect(onDone).toHaveBeenCalledTimes(2)
    })

    it('null runKey does not play', () => {
        render(<SweepTransition runKey={null} />)
        expect(layer()).toBeNull()
    })

    it('reduced motion: quick fade with the fixed short timings (ignores duration)', () => {
        const onMidpoint = vi.fn()
        const onDone = vi.fn()
        render(
            <SweepTransition
                active
                reducedMotion
                duration={3000}
                onMidpoint={onMidpoint}
                onDone={onDone}
            />
        )
        expect(layer()).toHaveAttribute('data-reduced')
        advance(SWEEP_TIMING.reducedMidpoint)
        expect(onMidpoint).toHaveBeenCalledTimes(1)
        advance(SWEEP_TIMING.reducedTotal - SWEEP_TIMING.reducedMidpoint)
        expect(onDone).toHaveBeenCalledTimes(1)
        expect(layer()).toBeNull()
    })

    it('reduced motion follows the OS setting', () => {
        const original = window.matchMedia
        window.matchMedia = ((q: string) => ({
            matches: q.includes('reduce'),
            media: q,
            addEventListener() {},
            removeEventListener() {},
        })) as never
        try {
            render(<SweepTransition active />)
            expect(layer()).toHaveAttribute('data-reduced')
        } finally {
            window.matchMedia = original
        }
    })

    it('tones: default presets, accent, tint and custom tuples', () => {
        expect(sweepTones()).toEqual(['sage', 'teal', 'deep'])
        expect(JSON.stringify(sweepTones('accent'))).toContain(
            'var(--zzz-accent)'
        )
        expect(JSON.stringify(sweepTones('#B0506A'))).toContain('#B0506A')
        const custom = sweepTones([
            '#111111',
            { light: '#222222', dark: '#202020' },
            '#333333',
        ])
        expect(custom[1]).toEqual({ light: '#222222', dark: '#202020' })
        expect(JSON.stringify(custom[0])).toContain('#111111')
    })

    it('`at` freezes the timeline inside a container; the tint reaches the hatch', () => {
        const host = document.createElement('div')
        document.body.appendChild(host)
        render(<SweepTransition at={300} container={host} tone="#C0506A" />)
        const el = host.querySelector('.zzz-sweep') as HTMLElement
        expect(el).toHaveAttribute('data-frozen')
        expect(el).toHaveAttribute('data-tone', 'tint')
        expect(el).toHaveClass('zzz-overlay--contained')
        expect(el.style.getPropertyValue('--zzz-sweep-at')).toBe('-300ms')
        const tinted = el.querySelector(
            '.zzz-sweep__panel--light .zzz-hatch-bg--tinted'
        ) as HTMLElement
        expect(tinted.style.getPropertyValue('--zzz-hatch-light')).toContain(
            '#C0506A'
        )
        host.remove()
    })

    it('forwards ref, className, style and native props; aria-hidden stays', () => {
        const ref = { current: null as HTMLDivElement | null }
        render(
            <SweepTransition
                active
                ref={ref}
                id="wipe"
                aria-hidden="false"
                className="extra"
                style={{ zIndex: 7 }}
            />
        )
        const el = layer()!
        expect(ref.current).toBe(el)
        expect(el).toHaveAttribute('id', 'wipe')
        expect(el).toHaveAttribute('aria-hidden', 'true')
        expect(el).toHaveClass('zzz-sweep', 'extra')
        expect(el.style.zIndex).toBe('7')
        advance(SWEEP_TIMING.total)
        expect(ref.current).toBeNull()
    })
})
