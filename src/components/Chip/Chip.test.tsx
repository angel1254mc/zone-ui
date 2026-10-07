import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from './Chip'
import { ChipGroup } from './ChipGroup'

const RARITY = [
    { value: 's', label: 'S' },
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
]

describe('Chip', () => {
    it('renders a toggle button with aria-pressed', () => {
        render(<Chip>Attack</Chip>)
        const chip = screen.getByRole('button', { name: 'Attack' })
        expect(chip).toHaveAttribute('aria-pressed', 'false')
        expect(chip).toHaveAttribute('type', 'button')
        expect(chip).toHaveClass('zzz-chip', 'zzz-pressable', 'zzz-focusable')
    })

    it('toggles uncontrolled (defaultSelected) and reports changes', async () => {
        const onSelectedChange = vi.fn()
        render(
            <Chip defaultSelected onSelectedChange={onSelectedChange}>
                Stun
            </Chip>
        )
        const chip = screen.getByRole('button', { name: 'Stun' })
        expect(chip).toHaveAttribute('aria-pressed', 'true')
        await userEvent.click(chip)
        expect(chip).toHaveAttribute('aria-pressed', 'false')
        expect(onSelectedChange).toHaveBeenCalledWith(false)
    })

    it('is controlled by `selected`', async () => {
        const onSelectedChange = vi.fn()
        render(
            <Chip selected={false} onSelectedChange={onSelectedChange}>
                Stun
            </Chip>
        )
        const chip = screen.getByRole('button', { name: 'Stun' })
        await userEvent.click(chip)
        expect(onSelectedChange).toHaveBeenCalledWith(true)
        expect(chip).toHaveAttribute('aria-pressed', 'false')
    })

    it('toggles with the keyboard', async () => {
        render(<Chip>Anomaly</Chip>)
        const chip = screen.getByRole('button', { name: 'Anomaly' })
        chip.focus()
        await userEvent.keyboard('{Enter}')
        expect(chip).toHaveAttribute('aria-pressed', 'true')
        await userEvent.keyboard(' ')
        expect(chip).toHaveAttribute('aria-pressed', 'false')
    })

    it('does not toggle when disabled', async () => {
        const onSelectedChange = vi.fn()
        render(
            <Chip disabled onSelectedChange={onSelectedChange}>
                Armorer
            </Chip>
        )
        const chip = screen.getByRole('button', { name: 'Armorer' })
        expect(chip).toBeDisabled()
        await userEvent.click(chip)
        expect(onSelectedChange).not.toHaveBeenCalled()
    })

    it('forces the pressed look with `pressed` and passes className/style/ref', () => {
        const ref = createRef<HTMLButtonElement>()
        render(
            <Chip pressed ref={ref} className="extra" style={{ width: 100 }}>
                S
            </Chip>
        )
        const chip = screen.getByRole('button', { name: 'S' })
        expect(chip).toHaveAttribute('data-pressed')
        expect(chip).toHaveClass('extra')
        expect(chip.style.width).toBe('100px')
        expect(ref.current).toBe(chip)
    })
})

describe('ChipGroup', () => {
    it('multiple: a labelled group of checkboxes', async () => {
        const onValueChange = vi.fn()
        render(
            <ChipGroup
                label="Rarity"
                options={RARITY}
                onValueChange={onValueChange}
            />
        )
        const group = screen.getByRole('group', { name: 'Rarity' })
        expect(group).toBeInTheDocument()
        const s = screen.getByRole('checkbox', { name: 'S' })
        const a = screen.getByRole('checkbox', { name: 'A' })
        expect(s).toHaveAttribute('aria-checked', 'false')
        await userEvent.click(s)
        await userEvent.click(a)
        expect(s).toHaveAttribute('aria-checked', 'true')
        expect(a).toHaveAttribute('aria-checked', 'true')
        expect(onValueChange).toHaveBeenLastCalledWith(['s', 'a'])
        await userEvent.click(s)
        expect(onValueChange).toHaveBeenLastCalledWith(['a'])
    })

    it('keeps option order in the value regardless of click order', async () => {
        const onValueChange = vi.fn()
        render(
            <ChipGroup
                label="Rarity"
                options={RARITY}
                defaultValue={['b']}
                onValueChange={onValueChange}
            />
        )
        await userEvent.click(screen.getByRole('checkbox', { name: 'S' }))
        expect(onValueChange).toHaveBeenLastCalledWith(['s', 'b'])
    })

    it('single: a radiogroup with radios; clicking the selected one keeps it', async () => {
        const onValueChange = vi.fn()
        render(
            <ChipGroup
                label="Rarity"
                options={RARITY}
                multiple={false}
                defaultValue={['a']}
                onValueChange={onValueChange}
            />
        )
        expect(
            screen.getByRole('radiogroup', { name: 'Rarity' })
        ).toBeInTheDocument()
        const a = screen.getByRole('radio', { name: 'A' })
        const b = screen.getByRole('radio', { name: 'B' })
        expect(a).toHaveAttribute('aria-checked', 'true')
        await userEvent.click(b)
        expect(b).toHaveAttribute('aria-checked', 'true')
        expect(a).toHaveAttribute('aria-checked', 'false')
        expect(onValueChange).toHaveBeenLastCalledWith(['b'])
    })

    it('controlled value', async () => {
        function Harness() {
            const [v, setV] = useState<string[]>(['s'])
            return (
                <>
                    <ChipGroup
                        label="Rarity"
                        options={RARITY}
                        value={v}
                        onValueChange={setV}
                    />
                    <output>{v.join(',')}</output>
                </>
            )
        }
        render(<Harness />)
        await userEvent.click(screen.getByRole('checkbox', { name: 'B' }))
        expect(screen.getByRole('status')).toHaveTextContent('s,b')
    })

    it('arrow keys move focus between chips (skipping disabled ones), Home/End jump', async () => {
        render(
            <ChipGroup
                label="Agent Specialties"
                options={[
                    { value: 'attack', label: 'Attack' },
                    { value: 'armorer', label: 'Armorer', disabled: true },
                    { value: 'stun', label: 'Stun' },
                ]}
            />
        )
        const attack = screen.getByRole('checkbox', { name: 'Attack' })
        const stun = screen.getByRole('checkbox', { name: 'Stun' })
        attack.focus()
        await userEvent.keyboard('{ArrowRight}')
        expect(stun).toHaveFocus()
        await userEvent.keyboard('{ArrowRight}')
        expect(attack).toHaveFocus()
        await userEvent.keyboard('{End}')
        expect(stun).toHaveFocus()
        await userEvent.keyboard('{Home}')
        expect(attack).toHaveFocus()
    })

    it('single: arrow keys select (radio behaviour) and only the checked chip is tabbable', async () => {
        const onValueChange = vi.fn()
        render(
            <ChipGroup
                label="Rarity"
                options={RARITY}
                multiple={false}
                defaultValue={['a']}
                onValueChange={onValueChange}
            />
        )
        const s = screen.getByRole('radio', { name: 'S' })
        const a = screen.getByRole('radio', { name: 'A' })
        expect(s).toHaveAttribute('tabindex', '-1')
        expect(a).toHaveAttribute('tabindex', '0')
        a.focus()
        await userEvent.keyboard('{ArrowRight}')
        expect(screen.getByRole('radio', { name: 'B' })).toHaveFocus()
        expect(onValueChange).toHaveBeenLastCalledWith(['b'])
    })

    it('disabled options are not toggled', async () => {
        const onValueChange = vi.fn()
        render(
            <ChipGroup
                label="Agent Specialties"
                options={[
                    { value: 'armorer', label: 'Armorer', disabled: true },
                ]}
                onValueChange={onValueChange}
            />
        )
        const chip = screen.getByRole('checkbox', { name: 'Armorer' })
        expect(chip).toBeDisabled()
        await userEvent.click(chip)
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('renders a visible section label and a column count variable', () => {
        const { container } = render(
            <ChipGroup label="Rarity" options={RARITY} columns={3} />
        )
        expect(screen.getByText('Rarity')).toHaveClass('zzz-chip-group__label')
        const grid = container.querySelector(
            '.zzz-chip-group__grid'
        ) as HTMLElement
        expect(grid.style.getPropertyValue('--zzz-chip-columns')).toBe('3')
    })
})

describe('Chip.css', () => {
    // jsdom runs with css: false, so guard the cascade in the stylesheet itself: a `box-shadow` on a
    // chip state rule (0,2,0, declared after base.css) would override .zzz-focusable:focus-visible and
    // hide the focus ring on a selected chip — the roving tab stop of a single-select group.
    it('no chip rule sets box-shadow (the focus ring must win on selected/disabled chips)', () => {
        const chipCss = readFileSync(
            resolve(process.cwd(), 'src/components/Chip/Chip.css'),
            'utf8'
        )
        const css = chipCss.replace(/\/\*[\s\S]*?\*\//g, '')
        const chipRules = css.match(/\.zzz-chip[^{]*\{[^}]*\}/g) ?? []
        expect(chipRules.length).toBeGreaterThan(0)
        for (const rule of chipRules) expect(rule).not.toMatch(/box-shadow/)
    })
})

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
    const css = readFileSync(
        resolve(process.cwd(), 'src/components/Chip/Chip.css'),
        'utf8'
    ).replace(/\/\*[\s\S]*?\*\//g, '')
    const pxDecls = css
        .split(/[;{}]/)
        .map((s) => s.trim())
        .filter((s) => s.includes('var(--zzz-px)'))
    return { css, pxDecls }
}

describe('Chip / ChipGroup size', () => {
    it('Chip defaults to md and reflects size on data-size', () => {
        const { rerender } = render(<Chip>Attack</Chip>)
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md')
        rerender(<Chip size="sm">Attack</Chip>)
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm')
        rerender(<Chip size="lg">Attack</Chip>)
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg')
    })
    it('ChipGroup sizes itself and passes the size to every chip', () => {
        render(<ChipGroup label="Rarity" options={RARITY} size="sm" />)
        expect(screen.getByRole('group', { name: 'Rarity' })).toHaveAttribute(
            'data-size',
            'sm'
        )
        for (const chip of screen.getAllByRole('checkbox'))
            expect(chip).toHaveAttribute('data-size', 'sm')
    })
    it('ChipGroup defaults to md', () => {
        render(<ChipGroup label="Rarity" options={RARITY} multiple={false} />)
        expect(screen.getByRole('radiogroup')).toHaveAttribute(
            'data-size',
            'md'
        )
        for (const chip of screen.getAllByRole('radio'))
            expect(chip).toHaveAttribute('data-size', 'md')
    })

    it('routes every stylesheet length through the size unit', () => {
        const { css, pxDecls } = sizeUnitCss()
        expect(css).toMatch(/\.zzz-chip\[data-size='sm'\]/)
        expect(css).toMatch(/\.zzz-chip-group\[data-size='lg'\]/)
        for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/)
    })
})
