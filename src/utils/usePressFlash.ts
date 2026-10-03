import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, FocusEventHandler, KeyboardEvent, KeyboardEventHandler } from 'react'

export interface UsePressFlashOptions<T extends Element = Element> {
  /** Length of the Enter flash in ms. Default 100. */
  duration?: number
  /** No press feedback while disabled. */
  disabled?: boolean
  /** Caller handlers, chained first. Calling `event.preventDefault()` suppresses the press. */
  onKeyDown?: KeyboardEventHandler<T>
  onKeyUp?: KeyboardEventHandler<T>
  onBlur?: FocusEventHandler<T>
}

export interface PressFlashProps<T extends Element = Element> {
  /** Present (empty string) while the pressed look should show; pairs with `[data-pressed]` in CSS. */
  'data-pressed'?: ''
  onKeyDown: KeyboardEventHandler<T>
  onKeyUp: KeyboardEventHandler<T>
  onBlur: FocusEventHandler<T>
}

const isSpace = (key: string) => key === ' ' || key === 'Spacebar'

/**
 * Keyboard half of the shared pressed state. Spread the result on the pressable element:
 * - Enter shows `data-pressed` for `duration` ms (a flash, like a click).
 * - Space shows it for as long as the key is held (released on keyup or blur).
 * Pointer presses use `:active` in CSS (see `.zzz-pressable`), so they need nothing here.
 */
export function usePressFlash<T extends Element = Element>(options: UsePressFlashOptions<T> = {}): PressFlashProps<T> {
  const { duration = 100, disabled = false, onKeyDown, onKeyUp, onBlur } = options
  const [flash, setFlash] = useState(false)
  const [held, setHeld] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const clearTimer = () => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }

  useEffect(() => clearTimer, [])

  useEffect(() => {
    if (!disabled) return
    clearTimer()
    setFlash(false)
    setHeld(false)
  }, [disabled])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<T>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || disabled) return
      if (event.key === 'Enter') {
        clearTimer()
        setFlash(true)
        timer.current = setTimeout(() => {
          timer.current = undefined
          setFlash(false)
        }, duration)
      } else if (isSpace(event.key)) {
        setHeld(true)
      }
    },
    [onKeyDown, disabled, duration],
  )

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<T>) => {
      onKeyUp?.(event)
      if (isSpace(event.key)) setHeld(false)
    },
    [onKeyUp],
  )

  const handleBlur = useCallback(
    (event: FocusEvent<T>) => {
      onBlur?.(event)
      setHeld(false)
    },
    [onBlur],
  )

  const pressed = !disabled && (flash || held)
  return {
    ...(pressed ? { 'data-pressed': '' as const } : {}),
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,
  }
}
