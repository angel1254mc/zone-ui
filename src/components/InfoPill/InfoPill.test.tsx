import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { ClockIcon, InfoAlertIcon } from '../../icons'
import { InfoPill } from './InfoPill'

describe('InfoPill', () => {
    it('renders static text without a button role when no onClick is given', () => {
        render(<InfoPill icon={<ClockIcon />}>66d</InfoPill>)
        expect(screen.queryByRole('button')).toBeNull()
        const pill = screen.getByText('66d').closest('.zzz-info-pill')!
        expect(pill.tagName).toBe('SPAN')
        expect(pill.querySelector('.zzz-info-pill__icon')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
        expect(screen.getByText('66d')).toHaveClass('zzz-text-bodyXl')
    })

    it('becomes a pressable button with onClick (mouse + keyboard)', async () => {
        const onClick = vi.fn()
        render(
            <InfoPill icon={<InfoAlertIcon />} onClick={onClick}>
                Event Details
            </InfoPill>
        )
        const btn = screen.getByRole('button', { name: 'Event Details' })
        expect(btn).toHaveClass(
            'zzz-pressable',
            'zzz-focusable',
            'zzz-info-pill--button'
        )
        await userEvent.click(btn)
        btn.focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        expect(onClick).toHaveBeenCalledTimes(3)
    })

    it('shows data-pressed while Space is held and flashes on Enter', () => {
        vi.useFakeTimers()
        render(<InfoPill onClick={() => {}}>Event Details</InfoPill>)
        const btn = screen.getByRole('button')
        fireEvent.keyDown(btn, { key: ' ' })
        expect(btn).toHaveAttribute('data-pressed')
        fireEvent.keyUp(btn, { key: ' ' })
        expect(btn).not.toHaveAttribute('data-pressed')
        fireEvent.keyDown(btn, { key: 'Enter' })
        expect(btn).toHaveAttribute('data-pressed')
        act(() => vi.advanceTimersByTime(120))
        expect(btn).not.toHaveAttribute('data-pressed')
        vi.useRealTimers()
    })

    it('forced pressed; disabled blocks clicks and pressed look', async () => {
        const onClick = vi.fn()
        const { rerender } = render(
            <InfoPill onClick={onClick} pressed>
                Go
            </InfoPill>
        )
        expect(screen.getByRole('button')).toHaveAttribute('data-pressed')
        rerender(
            <InfoPill onClick={onClick} pressed disabled>
                Go
            </InfoPill>
        )
        const btn = screen.getByRole('button')
        expect(btn).toBeDisabled()
        expect(btn).not.toHaveAttribute('data-pressed')
        await userEvent.click(btn)
        expect(onClick).not.toHaveBeenCalled()
    })

    it('passes className and ref', () => {
        const ref = createRef<HTMLButtonElement | HTMLSpanElement>()
        render(
            <InfoPill ref={ref} className="x">
                25d
            </InfoPill>
        )
        expect(ref.current).toHaveClass('zzz-info-pill', 'x')
    })
})
