import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChoiceButton } from './ChoiceButton'

describe('ChoiceButton', () => {
    it('renders a button with label, description, badge and media', () => {
        render(
            <ChoiceButton
                badge="A"
                description="Recommended for most people"
                media={<svg data-testid="media" />}
            >
                Standard plan
            </ChoiceButton>
        )
        const btn = screen.getByRole('button', { name: /Standard plan/ })
        expect(btn).toHaveAttribute('type', 'button')
        expect(btn).toHaveTextContent('Recommended for most people')
        expect(btn).toHaveAttribute('data-state', 'idle')
        expect(btn.querySelector('.zzz-choice__cap')).toHaveTextContent('A')
        expect(
            screen.getByTestId('media').closest('.zzz-choice__media')
        ).toHaveAttribute('aria-hidden', 'true')
        expect(btn).toHaveClass(
            'zzz-choice',
            'zzz-mat-pill',
            'zzz-pressable',
            'zzz-focusable'
        )
    })

    it('standalone selected uses aria-pressed and data-state="selected"', () => {
        const { rerender } = render(
            <ChoiceButton selected={false}>Yes</ChoiceButton>
        )
        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-pressed',
            'false'
        )
        rerender(<ChoiceButton selected>Yes</ChoiceButton>)
        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-pressed',
            'true'
        )
        expect(screen.getByRole('button')).toHaveAttribute(
            'data-state',
            'selected'
        )
    })

    it('with a toggle role it uses aria-checked instead of aria-pressed', () => {
        render(
            <ChoiceButton role="radio" selected>
                Yes
            </ChoiceButton>
        )
        const r = screen.getByRole('radio', { name: 'Yes' })
        expect(r).toHaveAttribute('aria-checked', 'true')
        expect(r).not.toHaveAttribute('aria-pressed')
    })

    it.each([
        ['correct', 'correct', 'Correct'],
        ['success', 'correct', 'Correct'],
        ['incorrect', 'incorrect', 'Incorrect'],
        ['error', 'incorrect', 'Incorrect'],
        ['revealed', 'revealed', 'Correct answer'],
    ] as const)(
        'result %s -> data-state %s and an accessible result label',
        (result, state, text) => {
            render(
                <ChoiceButton badge="B" result={result}>
                    Paris
                </ChoiceButton>
            )
            const btn = screen.getByRole('button')
            expect(btn).toHaveAttribute('data-state', state)
            expect(btn).toHaveAccessibleName(`Paris, ${text}`)
        }
    )

    it('result labels can be localised', () => {
        render(
            <ChoiceButton result="correct" resultLabel="Richtig">
                Paris
            </ChoiceButton>
        )
        expect(screen.getByRole('button')).toHaveAccessibleName(
            'Paris, Richtig'
        )
    })

    it('shows the result glyph in a trailing mark when there is no badge', () => {
        render(<ChoiceButton result="incorrect">Rome</ChoiceButton>)
        const btn = screen.getByRole('button')
        expect(btn.querySelector('.zzz-choice__cap')).toBeNull()
        expect(btn.querySelector('.zzz-choice__mark svg')).not.toBeNull()
    })

    it('click fires onClick; disabled does not', async () => {
        const onClick = vi.fn()
        const { rerender } = render(
            <ChoiceButton onClick={onClick}>Go</ChoiceButton>
        )
        await userEvent.click(screen.getByRole('button'))
        expect(onClick).toHaveBeenCalledTimes(1)
        rerender(
            <ChoiceButton onClick={onClick} disabled>
                Go
            </ChoiceButton>
        )
        await userEvent.click(screen.getByRole('button'))
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('aria-disabled swallows clicks but stays focusable', async () => {
        const onClick = vi.fn()
        render(
            <ChoiceButton onClick={onClick} aria-disabled="true">
                Go
            </ChoiceButton>
        )
        const btn = screen.getByRole('button')
        await userEvent.click(btn)
        expect(onClick).not.toHaveBeenCalled()
        btn.focus()
        expect(btn).toHaveFocus()
    })

    it('pressed forces data-pressed; Space holds it', async () => {
        const { rerender } = render(<ChoiceButton pressed>Go</ChoiceButton>)
        expect(screen.getByRole('button')).toHaveAttribute('data-pressed')
        rerender(<ChoiceButton>Go</ChoiceButton>)
        const btn = screen.getByRole('button')
        expect(btn).not.toHaveAttribute('data-pressed')
        fireEvent.keyDown(btn, { key: ' ' })
        expect(btn).toHaveAttribute('data-pressed')
        fireEvent.keyUp(btn, { key: ' ' })
        expect(btn).not.toHaveAttribute('data-pressed')
    })

    it('media layout and correct tone are exposed as classes / data attributes', () => {
        render(
            <ChoiceButton
                media={<svg />}
                mediaLayout="cover"
                result="correct"
                correctTone="accent"
            >
                Pick
            </ChoiceButton>
        )
        const btn = screen.getByRole('button')
        expect(btn).toHaveClass('zzz-choice--media-cover')
        expect(btn).toHaveAttribute('data-tone', 'accent')
    })

    it('passes className, style, ref and native props through', () => {
        const ref = createRef<HTMLButtonElement>()
        render(
            <ChoiceButton
                ref={ref}
                className="extra"
                style={{ width: 300 }}
                data-testid="c"
                value="x"
            >
                Go
            </ChoiceButton>
        )
        const btn = screen.getByTestId('c')
        expect(ref.current).toBe(btn)
        expect(btn).toHaveClass('extra')
        expect(btn.style.width).toBe('300px')
        expect(btn).toHaveAttribute('data-value', 'x')
    })
})

// Vitest runs with css: false, so the size rules are checked as text.
const choiceCss = readFileSync(resolve(__dirname, 'ChoiceButton.css'), 'utf8')

describe('ChoiceButton sizes', () => {
    it('defaults to md', () => {
        render(<ChoiceButton badge="A">Paris</ChoiceButton>)
        const btn = screen.getByRole('button', { name: 'Paris' })
        expect(btn).toHaveClass('zzz-choice--md')
        expect(btn).toHaveAttribute('data-size', 'md')
    })

    it.each(['sm', 'md', 'lg'] as const)(
        'size="%s" sets the class + data-size, never the `size` attribute',
        async (size) => {
            const onClick = vi.fn()
            render(
                <ChoiceButton
                    size={size}
                    badge="A"
                    description="Capital"
                    onClick={onClick}
                >
                    Paris
                </ChoiceButton>
            )
            const btn = screen.getByRole('button', { name: 'Paris' })
            expect(btn).toHaveClass(`zzz-choice--${size}`)
            expect(btn).toHaveAttribute('data-size', size)
            expect(btn).not.toHaveAttribute('size')
            expect(btn).toHaveAccessibleDescription('Capital')
            await userEvent.click(btn)
            expect(onClick).toHaveBeenCalledTimes(1)
        }
    )

    it('sizes the label from the control label tokens and scales sm / lg from the control size tokens', () => {
        for (const size of ['sm', 'md', 'lg'])
            expect(choiceCss).toContain(`var(--zzz-font-size-control-${size})`)
        expect(choiceCss).toMatch(
            /\.zzz-choice--sm\s*\{[^}]*--zzz-size-control-sm-n/
        )
        expect(choiceCss).toMatch(
            /\.zzz-choice--lg\s*\{[^}]*--zzz-size-control-lg-n/
        )
    })
})
