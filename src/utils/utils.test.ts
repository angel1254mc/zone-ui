import { act, renderHook } from '@testing-library/react'
import { cx } from './cx'
import { useControllableState } from './useControllableState'

describe('cx', () => {
  it('joins truthy values and objects', () => {
    expect(cx('a', false, null, ['b', { c: true, d: false }], 0, 'e')).toBe('a b c e')
  })
})

describe('useControllableState', () => {
  it('works uncontrolled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<number | undefined>(undefined, 1, onChange))
    act(() => result.current[1](2))
    expect(result.current[0]).toBe(2)
    expect(onChange).toHaveBeenCalledWith(2)
  })
  it('works controlled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<number>(5, 1, onChange))
    act(() => result.current[1]((p) => p + 1))
    expect(result.current[0]).toBe(5)
    expect(onChange).toHaveBeenCalledWith(6)
  })
})
