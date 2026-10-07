import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { EventCtaButton } from './EventCtaButton'

describe('EventCtaButton', () => {
    it('renders a "Go" button with the pill + pressable classes and a hidden chevron layer', () => {
        render(<EventCtaButton />)
        const btn = screen.getByRole('button', { name: 'Go' })
        expect(btn).toHaveAttribute('type', 'button')
        expect(btn).toHaveClass(
            'zzz-event-cta',
            'zzz-mat-pill',
            'zzz-pressable',
            'zzz-focusable'
        )
        const chev = btn.querySelector('.zzz-event-cta__chevrons')!
        expect(chev).toHaveClass('zzz-pressable__hide')
        expect(chev).toHaveAttribute('aria-hidden', 'true')
    })

    it('clicks by mouse, Enter and Space', async () => {
        const onClick = vi.fn()
        render(<EventCtaButton onClick={onClick}>Enter</EventCtaButton>)
        const btn = screen.getByRole('button', { name: 'Enter' })
        await userEvent.click(btn)
        btn.focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        expect(onClick).toHaveBeenCalledTimes(3)
    })

    it('Enter flashes data-pressed for 100 ms, Space holds it', () => {
        vi.useFakeTimers()
        render(<EventCtaButton />)
        const btn = screen.getByRole('button')
        fireEvent.keyDown(btn, { key: 'Enter' })
        expect(btn).toHaveAttribute('data-pressed')
        act(() => vi.advanceTimersByTime(120))
        expect(btn).not.toHaveAttribute('data-pressed')
        fireEvent.keyDown(btn, { key: ' ' })
        expect(btn).toHaveAttribute('data-pressed')
        fireEvent.keyUp(btn, { key: ' ' })
        expect(btn).not.toHaveAttribute('data-pressed')
        vi.useRealTimers()
    })

    it('disabled and aria-disabled block clicks and the pressed look', async () => {
        const onClick = vi.fn()
        const { rerender } = render(
            <EventCtaButton disabled pressed onClick={onClick} />
        )
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByRole('button')).not.toHaveAttribute('data-pressed')
        rerender(
            <EventCtaButton aria-disabled="true" pressed onClick={onClick} />
        )
        const btn = screen.getByRole('button')
        await userEvent.click(btn)
        expect(onClick).not.toHaveBeenCalled()
        expect(btn).not.toHaveAttribute('data-pressed')
    })

    it('forced pressed, still, className and ref', () => {
        const ref = createRef<HTMLButtonElement>()
        render(<EventCtaButton ref={ref} pressed still className="x" />)
        expect(ref.current).toHaveAttribute('data-pressed')
        expect(ref.current).toHaveClass('zzz-event-cta--still', 'x')
    })
})
