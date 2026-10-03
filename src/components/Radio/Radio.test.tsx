import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio, RadioGroup } from './Radio'
import type { RadioGroupProps } from './Radio'
import type { ReactNode } from 'react'

function Group(props: Partial<RadioGroupProps>) {
  return (
    <RadioGroup label="Difficulty" {...props}>
      <Radio value="normal">Normal</Radio>
      <Radio value="hard" disabled>
        Hard
      </Radio>
      <Radio value="hell">Hell</Radio>
    </RadioGroup>
  )
}

describe('RadioGroup / Radio', () => {
  it('renders a labelled radiogroup of native radios sharing a name', () => {
    render(<Group defaultValue="normal" />)
    expect(screen.getByRole('radiogroup', { name: 'Difficulty' })).toBeInTheDocument()
    const radios = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(radios).toHaveLength(3)
    expect(new Set(radios.map((r) => r.name)).size).toBe(1)
    expect(screen.getByRole('radio', { name: 'Normal' })).toBeChecked()
  })

  it('uncontrolled: clicking selects and reports', async () => {
    const onValueChange = vi.fn()
    render(<Group defaultValue="normal" onValueChange={onValueChange} />)
    await userEvent.click(screen.getByText('Hell'))
    expect(screen.getByRole('radio', { name: 'Hell' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Normal' })).not.toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('hell')
  })

  it('controlled', async () => {
    function Harness() {
      const [v, setV] = useState('hell')
      return (
        <>
          <Group value={v} onValueChange={setV} />
          <output>{v}</output>
        </>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('radio', { name: 'Normal' }))
    expect(screen.getByRole('status')).toHaveTextContent('normal')
  })

  it('arrow keys move and select, skipping disabled radios and wrapping', async () => {
    const onValueChange = vi.fn()
    render(<Group defaultValue="normal" onValueChange={onValueChange} />)
    const normal = screen.getByRole('radio', { name: 'Normal' })
    const hell = screen.getByRole('radio', { name: 'Hell' })
    normal.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(hell).toHaveFocus()
    expect(hell).toBeChecked()
    await userEvent.keyboard('{ArrowRight}')
    expect(normal).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(hell).toHaveFocus()
    expect(onValueChange).toHaveBeenLastCalledWith('hell')
  })

  it('disabled radio and disabled group', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<Group defaultValue="normal" onValueChange={onValueChange} />)
    expect(screen.getByRole('radio', { name: 'Hard' })).toBeDisabled()
    rerender(<Group defaultValue="normal" onValueChange={onValueChange} disabled />)
    for (const r of screen.getAllByRole('radio')) expect(r).toBeDisabled()
    await userEvent.click(screen.getByText('Hell'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('standalone Radio works with its own checked state; ref + className', async () => {
    const ref = createRef<HTMLInputElement>()
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Radio name="solo" value="a" ref={ref} className="c" onCheckedChange={onCheckedChange}>
        Solo
      </Radio>,
    )
    const r = screen.getByRole('radio', { name: 'Solo' })
    await userEvent.click(r)
    expect(r).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(ref.current).toBe(r)
    expect(container.firstChild).toHaveClass('zzz-radio', 'c')
  })

  describe('roving tab stop', () => {
    async function tabIn(group: ReactNode) {
      render(
        <>
          <button>before</button>
          {group}
          <button>after</button>
        </>,
      )
      screen.getByRole('button', { name: 'before' }).focus()
      await userEvent.tab()
      return document.activeElement
    }

    it("falls back to the first enabled radio when the controlled value is ''", async () => {
      const active = await tabIn(<Group value="" onValueChange={() => {}} />)
      expect(active).toBe(screen.getByRole('radio', { name: 'Normal' }))
      expect(screen.getAllByRole('radio').map((r) => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
    })

    it('falls back to the first enabled radio when the value matches no option', async () => {
      const active = await tabIn(<Group value="gone" onValueChange={() => {}} />)
      expect(active).toBe(screen.getByRole('radio', { name: 'Normal' }))
    })

    it('falls back to the first enabled radio when the value is a disabled option', async () => {
      const active = await tabIn(<Group defaultValue="hard" />)
      expect(active).toBe(screen.getByRole('radio', { name: 'Normal' }))
    })

    it('is the checked radio when it is enabled', async () => {
      const active = await tabIn(<Group defaultValue="hell" />)
      expect(active).toBe(screen.getByRole('radio', { name: 'Hell' }))
      expect(screen.getAllByRole('radio').map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '-1', '0'])
    })

    it('is the first enabled radio when nothing is selected (uncontrolled)', async () => {
      const active = await tabIn(<Group />)
      expect(active).toBe(screen.getByRole('radio', { name: 'Normal' }))
    })
  })
})

// Vitest runs with css: false, so the size rules are checked as text.
const radioCss = readFileSync(resolve(__dirname, 'Radio.css'), 'utf8')

describe('Radio sizes', () => {
  it('defaults to md', () => {
    render(<Radio value="a">Alpha</Radio>)
    const root = screen.getByRole('radio', { name: 'Alpha' }).closest('label')
    expect(root).toHaveClass('zzz-radio--md')
    expect(root).toHaveAttribute('data-size', 'md')
  })

  it('a standalone radio takes its own size', () => {
    render(
      <Radio value="a" size="sm">
        Alpha
      </Radio>,
    )
    const radio = screen.getByRole('radio', { name: 'Alpha' })
    expect(radio.closest('label')).toHaveAttribute('data-size', 'sm')
    expect(radio).not.toHaveAttribute('size')
  })

  it('RadioGroup size applies to every radio; a radio’s own size wins', async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup label="Speed" size="lg" onValueChange={onValueChange}>
        <Radio value="slow">Slow</Radio>
        <Radio value="fast" size="sm">
          Fast
        </Radio>
      </RadioGroup>,
    )
    expect(screen.getByRole('radiogroup', { name: 'Speed' })).toHaveAttribute('data-size', 'lg')
    expect(screen.getByRole('radio', { name: 'Slow' }).closest('label')).toHaveAttribute('data-size', 'lg')
    expect(screen.getByRole('radio', { name: 'Fast' }).closest('label')).toHaveAttribute('data-size', 'sm')
    await userEvent.click(screen.getByRole('radio', { name: 'Slow' }))
    expect(onValueChange).toHaveBeenCalledWith('slow')
  })

  it('scales sm and lg from the control size tokens', () => {
    expect(radioCss).toMatch(/\.zzz-radio--sm\s*\{[^}]*--zzz-size-control-sm-n/)
    expect(radioCss).toMatch(/\.zzz-radio--lg\s*\{[^}]*--zzz-size-control-lg-n/)
  })
})
