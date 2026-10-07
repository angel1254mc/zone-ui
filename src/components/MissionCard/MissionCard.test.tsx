import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { MissionCard } from './MissionCard'

const TITLE =
    'Check in for a total of 14 days in the "Surprise Screening Plan" to obtain'

describe('MissionCard', () => {
    it('renders an article named by its title with Go + magnifier buttons', () => {
        render(
            <MissionCard
                title={TITLE}
                reward={<svg data-testid="art" />}
                rewardLabel="Outfit"
            />
        )
        const card = screen.getByRole('article', { name: TITLE })
        expect(card).toHaveAttribute('data-status', 'go')
        expect(
            within(card).getByRole('heading', { level: 3, name: TITLE })
        ).toBeInTheDocument()
        expect(within(card).getByRole('button', { name: 'Go' })).toBeEnabled()
        expect(
            within(card).getByRole('button', { name: 'Details' })
        ).toBeInTheDocument()
        expect(
            within(card).getByRole('img', { name: 'Outfit' })
        ).toBeInTheDocument()
        expect(screen.getByTestId('art')).toBeInTheDocument()
    })

    it('fires onGo and onInspect by mouse and keyboard', async () => {
        const onGo = vi.fn()
        const onInspect = vi.fn()
        render(<MissionCard title="T" onGo={onGo} onInspect={onInspect} />)
        await userEvent.click(screen.getByRole('button', { name: 'Go' }))
        screen.getByRole('button', { name: 'Details' }).focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.tab()
        expect(screen.getByRole('button', { name: 'Go' })).toHaveFocus()
        await userEvent.keyboard(' ')
        expect(onGo).toHaveBeenCalledTimes(2)
        expect(onInspect).toHaveBeenCalledTimes(1)
    })

    it('claimed: disabled "Claimed" button, lime tick, claimed in the reward name', async () => {
        const onGo = vi.fn()
        const { container } = render(
            <MissionCard
                title="T"
                status="claimed"
                rewardLabel="Outfit"
                onGo={onGo}
            />
        )
        const btn = screen.getByRole('button', { name: 'Claimed' })
        expect(btn).toBeDisabled()
        await userEvent.click(btn)
        expect(onGo).not.toHaveBeenCalled()
        expect(container.querySelector('.zzz-claimed-check')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
        expect(
            screen.getByRole('img', { name: 'Outfit, claimed' })
        ).toBeInTheDocument()
    })

    it('locked: disabled "Stay Tuned"', () => {
        render(
            <MissionCard
                title="This mission unlocks in Version 3.3"
                status="locked"
            />
        )
        expect(
            screen.getByRole('button', { name: 'Stay Tuned' })
        ).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Details' })).toBeEnabled()
    })

    it('NEW! badge, theme colours, custom labels, className/style/ref', () => {
        const ref = createRef<HTMLElement>()
        render(
            <MissionCard
                ref={ref}
                title="T"
                isNew
                theme={{
                    ring: '#123456',
                    body: '#abcdef',
                    ornament: '#f0a040',
                }}
                actionLabel="Claim"
                inspectLabel="Reward details"
                className="x"
                style={{ marginTop: 3 }}
            />
        )
        expect(ref.current).toHaveClass('zzz-mission-card', 'x')
        expect(
            ref.current!.style.getPropertyValue('--zzz-mission-card-ring')
        ).toBe('#123456')
        expect(
            ref.current!.style.getPropertyValue('--zzz-mission-card-body')
        ).toBe('#abcdef')
        expect(ref.current!.style.marginTop).toBe('3px')
        expect(
            screen.getByText('NEW!', { selector: '.zzz-new-badge__fill' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Claim' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Reward details' })
        ).toBeInTheDocument()
        expect(
            ref.current!.querySelector('.zzz-mission-card__ornament')
        ).not.toBeNull()
    })
})
