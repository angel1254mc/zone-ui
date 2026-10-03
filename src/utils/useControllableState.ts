import { useCallback, useRef, useState } from 'react'

/**
 * State that can be controlled (value + onChange) or uncontrolled (defaultValue).
 * Mirrors the pattern used by Radix / React Aria.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [inner, setInner] = useState<T>(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? (value as T) : inner
  const currentRef = useRef(current)
  currentRef.current = current

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next
      if (Object.is(resolved, currentRef.current)) return
      if (!controlled) setInner(resolved)
      onChange?.(resolved)
    },
    [controlled, onChange],
  )

  return [current, setValue]
}
