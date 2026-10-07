import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
    it('renders a labelled native checkbox', () => {
        render(<Checkbox>Show locked</Checkbox>)
        const cb = screen.getByRole('checkbox', { name: 'Show locked' })
        expect(cb).not.toBeChecked()
        expect(cb).toHaveClass('zzz-checkbox__input')
    })

    it('uncontrolled: click, Space and the label toggle; onCheckedChange fires', async () => {
        const onCheckedChange = vi.fn()
        render(
            <Checkbox onCheckedChange={onCheckedChange}>Show locked</Checkbox>
        )
        const cb = screen.getByRole('checkbox')
        await userEvent.click(cb)
        expect(cb).toBeChecked()
        expect(onCheckedChange).toHaveBeenLastCalledWith(true)
        await userEvent.keyboard(' ')
        expect(cb).not.toBeChecked()
        await userEvent.click(screen.getByText('Show locked'))
        expect(cb).toBeChecked()
    })

    it('controlled', async () => {
        function Harness() {
            const [on, setOn] = useState(true)
            return (
                <>
                    <Checkbox checked={on} onCheckedChange={setOn}>
                        x
                    </Checkbox>
                    <output>{String(on)}</output>
                </>
            )
        }
        render(<Harness />)
        const cb = screen.getByRole('checkbox')
        expect(cb).toBeChecked()
        await userEvent.click(cb)
        expect(screen.getByRole('status')).toHaveTextContent('false')
        expect(cb).not.toBeChecked()
    })

    it('reflects state on the root for styling', async () => {
        const { container } = render(<Checkbox defaultChecked>x</Checkbox>)
        expect(container.firstChild).toHaveAttribute('data-checked')
        await userEvent.click(screen.getByRole('checkbox'))
        expect(container.firstChild).not.toHaveAttribute('data-checked')
    })

    it('indeterminate sets the DOM property and the mixed state', () => {
        render(<Checkbox indeterminate>All</Checkbox>)
        const cb = screen.getByRole('checkbox') as HTMLInputElement
        expect(cb.indeterminate).toBe(true)
        expect(cb).toBePartiallyChecked()
    })

    it('disabled does not toggle', async () => {
        const onCheckedChange = vi.fn()
        render(
            <Checkbox disabled onCheckedChange={onCheckedChange}>
                x
            </Checkbox>
        )
        const cb = screen.getByRole('checkbox')
        expect(cb).toBeDisabled()
        await userEvent.click(cb)
        expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('ref to the input, className on the root', () => {
        const ref = createRef<HTMLInputElement>()
        const { container } = render(
            <Checkbox ref={ref} className="c" aria-label="Solo" />
        )
        expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Solo' }))
        expect(container.firstChild).toHaveClass('zzz-checkbox', 'c')
    })
})

// Vitest runs with css: false, so the size rules are checked as text.
const checkboxCss = readFileSync(resolve(__dirname, 'Checkbox.css'), 'utf8')

describe('Checkbox sizes', () => {
    it('defaults to md', () => {
        const { container } = render(<Checkbox>Remember me</Checkbox>)
        expect(container.firstChild).toHaveClass('zzz-checkbox--md')
        expect(container.firstChild).toHaveAttribute('data-size', 'md')
    })

    it.each(['sm', 'md', 'lg'] as const)(
        'size="%s" sets the class + data-size and keeps the checkbox working',
        async (size) => {
            const onCheckedChange = vi.fn()
            const { container } = render(
                <Checkbox size={size} onCheckedChange={onCheckedChange}>
                    Remember me
                </Checkbox>
            )
            expect(container.firstChild).toHaveClass(`zzz-checkbox--${size}`)
            expect(container.firstChild).toHaveAttribute('data-size', size)
            const box = screen.getByRole('checkbox', { name: 'Remember me' })
            expect(box).not.toHaveAttribute('size')
            await userEvent.click(box)
            expect(onCheckedChange).toHaveBeenCalledWith(true)
        }
    )

    it('scales sm and lg from the control size tokens', () => {
        expect(checkboxCss).toMatch(
            /\.zzz-checkbox--sm\s*\{[^}]*--zzz-size-control-sm-n/
        )
        expect(checkboxCss).toMatch(
            /\.zzz-checkbox--lg\s*\{[^}]*--zzz-size-control-lg-n/
        )
    })
})
