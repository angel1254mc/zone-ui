import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { LevelPill } from '.'

describe('LevelPill', () => {
    it('panel: a named group with the coin and hidden digits', () => {
        const { container } = render(<LevelPill level={60} max={60} rank="S" />)
        const group = screen.getByRole('group', { name: 'Level 60 of 60' })
        expect(group).toHaveClass('zzz-level-pill', 'zzz-level-pill--panel')
        expect(group).toHaveTextContent('Lv. 60/60')
        expect(container.querySelector('.zzz-rank-coin')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
        expect(
            container.querySelector('.zzz-level-pill__text')
        ).toHaveAttribute('aria-hidden', 'true')
    })

    it('equip renders without a coin when no rank is given', () => {
        const { container } = render(
            <LevelPill variant="equip" level={45} max={60} />
        )
        expect(
            screen.getByRole('group', { name: 'Level 45 of 60' })
        ).toHaveClass('zzz-level-pill--equip')
        expect(container.querySelector('.zzz-rank-coin')).toBeNull()
    })

    it('large: ghost max digits are aria-hidden; the (i) sub-pill is a named button', async () => {
        const onInfo = vi.fn()
        const { container } = render(
            <LevelPill
                variant="large"
                level={60}
                max={60}
                rank="S"
                onInfo={onInfo}
            />
        )
        expect(
            container.querySelector('.zzz-level-pill__ghost')
        ).toHaveAttribute('aria-hidden', 'true')
        const btn = screen.getByRole('button', { name: 'Details' })
        await userEvent.click(btn)
        expect(onInfo).toHaveBeenCalledTimes(1)
    })

    it('large: keyboard activates Details, disabled blocks it', async () => {
        const onInfo = vi.fn()
        const { rerender } = render(
            <LevelPill variant="large" level={1} max={60} onInfo={onInfo} />
        )
        screen.getByRole('button').focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')
        expect(onInfo).toHaveBeenCalledTimes(2)
        rerender(
            <LevelPill
                variant="large"
                level={1}
                max={60}
                onInfo={onInfo}
                infoProps={{ disabled: true }}
            />
        )
        await userEvent.click(screen.getByRole('button'))
        expect(onInfo).toHaveBeenCalledTimes(2)
    })

    it('large without onInfo has no button', () => {
        render(<LevelPill variant="large" level={60} max={60} />)
        expect(screen.queryByRole('button')).toBeNull()
    })

    it('agent: MAX capsule at max level, empty below it unless showMax', () => {
        const { container, rerender } = render(
            <LevelPill variant="agent" level={60} max={60} />
        )
        expect(
            container.querySelector('.zzz-level-pill__max')
        ).toHaveTextContent('MAX')
        rerender(<LevelPill variant="agent" level={50} max={60} />)
        expect(
            container.querySelector('.zzz-level-pill__max')
        ).toHaveTextContent('')
        rerender(<LevelPill variant="agent" level={50} max={60} showMax />)
        expect(
            container.querySelector('.zzz-level-pill__max')
        ).toHaveTextContent('MAX')
    })

    it('custom label, className, ref pass through', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <LevelPill
                ref={ref}
                level={3}
                max={10}
                label="Agent level 3"
                className="x"
            />
        )
        expect(ref.current).toBe(
            screen.getByRole('group', { name: 'Agent level 3' })
        )
        expect(ref.current).toHaveClass('x')
    })
})
