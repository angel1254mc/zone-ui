import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { OverclockBar, ProgressPill, XpBar } from '.'

describe('OverclockBar', () => {
    it('is an image named after the phases, with two star groups hidden', () => {
        const { container } = render(<OverclockBar current={1} next={2} />)
        const img = screen.getByRole('img', { name: 'Phase 1 → Phase 2' })
        expect(img).toHaveClass('zzz-overclock-bar')
        const groups = container.querySelectorAll('.zzz-overclock-bar__group')
        expect(groups).toHaveLength(2)
        groups.forEach((g) => expect(g).toHaveAttribute('aria-hidden', 'true'))
        expect(
            container.querySelectorAll('.zzz-overclock-bar__chevrons path')
        ).toHaveLength(4)
        expect(groups[0]!.querySelectorAll('[data-filled]')).toHaveLength(1)
        expect(groups[1]!.querySelectorAll('[data-filled]')).toHaveLength(2)
    })

    it('accepts custom slots, label and ref', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <OverclockBar
                ref={ref}
                current={5}
                next={5}
                label="Max phase"
                left={<i data-testid="l" />}
                right={<i data-testid="r" />}
            />
        )
        expect(screen.getByRole('img', { name: 'Max phase' })).toBe(ref.current)
        expect(screen.getByTestId('l')).toBeInTheDocument()
        expect(screen.getByTestId('r')).toBeInTheDocument()
    })
})

describe('XpBar', () => {
    it('is a progressbar with values and the MAX label when full', () => {
        render(<XpBar value={100} max={100} />)
        const bar = screen.getByRole('progressbar', { name: 'Level progress' })
        expect(bar).toHaveAttribute('aria-valuenow', '100')
        expect(bar).toHaveAttribute('aria-valuemax', '100')
        expect(bar).toHaveAttribute('aria-valuetext', 'MAX / MAX')
        expect(bar.textContent).toBe('MAX / MAX')
    })

    it('clamps the value and sets the fill percentage', () => {
        render(<XpBar value={150} max={600} aria-label="EXP" />)
        const bar = screen.getByRole('progressbar', { name: 'EXP' })
        expect(bar).toHaveAttribute('aria-valuenow', '150')
        expect(bar.style.getPropertyValue('--zzz-xp-pct')).toBe('25%')
        expect(bar.textContent).toBe('150 / 600')
    })

    it('clamps out-of-range values', () => {
        render(<XpBar value={-5} max={10} />)
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuenow',
            '0'
        )
    })
})

describe('ProgressPill', () => {
    it('renders label, value, icon slot and the optional NEW! badge', () => {
        const { container, rerender } = render(
            <ProgressPill
                icon={<svg data-testid="ico" />}
                label={'Polychrome\nProgress:'}
                value="19%"
            />
        )
        expect(container.firstElementChild).toHaveClass('zzz-progress-pill')
        expect(screen.getByText('19%')).toBeInTheDocument()
        expect(screen.getByTestId('ico').parentElement).toHaveAttribute(
            'aria-hidden',
            'true'
        )
        expect(container.querySelector('.zzz-new-badge')).toBeNull()
        rerender(
            <ProgressPill label="Polychrome Progress:" value="19%" isNew />
        )
        expect(container.querySelector('.zzz-new-badge')).not.toBeNull()
    })
})
