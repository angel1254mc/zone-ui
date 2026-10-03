import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyPill, ResourceBar } from '.'

describe('CurrencyPill', () => {
  it('is a named group with the zero-padded value and a spoken amount', () => {
    const { container } = render(<CurrencyPill label="Dennies" value={76418} />)
    const group = screen.getByRole('group', { name: 'Dennies' })
    expect(group).toHaveTextContent('Dennies 76,418')
    const pad = container.querySelector('.zzz-zeros__pad')
    expect(pad).toHaveTextContent('000')
    expect(container.querySelector('.zzz-currency-pill__value')).toHaveAttribute('aria-hidden', 'true')
    expect(group).not.toHaveClass('zzz-currency-pill--pad-white')
  })

  it('stamina: pads to 3 digits in white and shows the unpadded max', () => {
    const { container } = render(<CurrencyPill label="Battery Charge" value={20} max={240} />)
    const group = screen.getByRole('group', { name: 'Battery Charge' })
    expect(group).toHaveClass('zzz-currency-pill--pad-white')
    expect(container.querySelector('.zzz-currency-pill__value')).toHaveTextContent('020/240')
    expect(group).toHaveTextContent('Battery Charge 20 / 240')
  })

  it('digits=0 disables padding; strings render as given', () => {
    const { container, rerender } = render(<CurrencyPill label="Film" value={193} digits={0} />)
    expect(container.querySelector('.zzz-currency-pill__value')).toHaveTextContent(/^193$/)
    rerender(<CurrencyPill label="Film" value="9,999+" />)
    expect(container.querySelector('.zzz-currency-pill__value')).toHaveTextContent('9,999+')
  })

  it('the "+" is a separate button; keyboard and disabled work', async () => {
    const onAdd = vi.fn()
    const { rerender } = render(<CurrencyPill label="Dennies" value={1} onAdd={onAdd} icon={<svg data-testid="coin" />} />)
    const add = screen.getByRole('button', { name: 'Get more Dennies' })
    await userEvent.click(add)
    add.focus()
    await userEvent.keyboard('{Enter}')
    expect(onAdd).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('coin').parentElement).toHaveAttribute('aria-hidden', 'true')
    rerender(<CurrencyPill label="Dennies" value={1} onAdd={onAdd} addProps={{ disabled: true }} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onAdd).toHaveBeenCalledTimes(2)
  })

  it('no "+" without onAdd; className and ref pass through', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CurrencyPill ref={ref} label="Dennies" value={1} className="x" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(ref.current).toHaveClass('zzz-currency-pill', 'x')
  })
})

describe('ResourceBar', () => {
  it('renders one pill per item in a named group', () => {
    render(
      <ResourceBar
        items={[
          { label: 'Battery Charge', value: 20, max: 240 },
          { label: 'Dennies', value: 76418 },
          { label: 'Polychrome', value: 193 },
        ]}
      />,
    )
    const bar = screen.getByRole('group', { name: 'Resources' })
    expect(bar.querySelectorAll('.zzz-currency-pill')).toHaveLength(3)
    expect(screen.getByRole('group', { name: 'Polychrome' })).toBeInTheDocument()
  })
})
