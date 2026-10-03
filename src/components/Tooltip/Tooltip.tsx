import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef } from 'react'
import type {
  ComponentPropsWithRef,
  CSSProperties,
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import { ThemePortal, useFloatingPosition } from './floating'
import type { Side } from './floating'
import './Tooltip.css'

export type TooltipPlacement = Side

type TriggerProps = {
  ref?: Ref<HTMLElement>
  'aria-describedby'?: string
  onPointerEnter?(e: PointerEvent<HTMLElement>): void
  onPointerLeave?(e: PointerEvent<HTMLElement>): void
  onFocus?(e: FocusEvent<HTMLElement>): void
  onBlur?(e: FocusEvent<HTMLElement>): void
  onKeyDown?(e: ReactKeyboardEvent<HTMLElement>): void
}

export interface TooltipProps extends Omit<ComponentPropsWithRef<'div'>, 'content' | 'children'> {
  /** Bubble content. */
  content: ReactNode
  /** The trigger: ONE focusable element (button, link, input…). It gets `aria-describedby`. */
  children: ReactElement
  /** Preferred side; flips to the opposite side when it does not fit. Default `top`. */
  placement?: TooltipPlacement
  /** Hover delay before showing, ms. Default 300. Focus shows immediately. */
  delay?: number
  /** Delay before hiding after the pointer leaves, ms. Default 100. */
  closeDelay?: number
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  /** Never open. */
  disabled?: boolean
}

/**
 * Tooltip: a `rgba(0,0,0,.6)` bubble, radius 10, padding 10/14, `fontSize.label` white, a 12×10 arrow,
 * 16 px from the anchor, 300 ms opacity. Shown on hover (after `delay`) and on focus; Escape
 * dismisses. Placement top/bottom/left/right with a simple collision flip; the bubble is
 * portalled to `<body>` (never clipped) and keeps the host's `--zzz-scale`.
 *
 * `className` / `style` / `ref` / other div props go to the bubble (`role="tooltip"`).
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  closeDelay = 100,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  style,
  id,
  ref,
  ...rest
}: TooltipProps) {
  const autoId = useId()
  const tipId = id ?? `zzz-tooltip${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [openState, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const open = openState && !disabled
  const triggerRef = useRef<HTMLElement | null>(null)
  const bubbleRef = useRef<HTMLDivElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current)
    timer.current = undefined
  }
  useEffect(() => clear, [])

  const show = useCallback(
    (after: number) => {
      clear()
      if (disabled) return
      if (after <= 0) setOpen(true)
      else timer.current = setTimeout(() => setOpen(true), after)
    },
    [disabled, setOpen],
  )
  const hide = useCallback(
    (after: number) => {
      clear()
      if (after <= 0) setOpen(false)
      else timer.current = setTimeout(() => setOpen(false), after)
    },
    [setOpen],
  )

  // Escape dismisses from anywhere while open (WAI-ARIA tooltip pattern). This native listener
  // covers a hover-opened tooltip while focus is elsewhere; Escape on the focused trigger is
  // handled (and consumed) by the trigger's onKeyDown below so it never reaches an enclosing
  // Modal/Drawer (useModalLayer skips defaultPrevented Escapes).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clear()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const pos = useFloatingPosition(open, triggerRef, bubbleRef, { side: placement, gap: 16 })

  if (!isValidElement<TriggerProps>(children)) return children
  const childProps = children.props
  const describedBy = [childProps['aria-describedby'], open ? tipId : undefined].filter(Boolean).join(' ') || undefined

  const trigger = cloneElement(children, {
    ref: mergeRefs(childProps.ref, triggerRef),
    'aria-describedby': describedBy,
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      childProps.onPointerEnter?.(e)
      if (e.pointerType !== 'touch') show(delay)
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      childProps.onPointerLeave?.(e)
      hide(closeDelay)
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(e)
      show(0)
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(e)
      hide(0)
    },
    onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(e)
      if (open && e.key === 'Escape' && !e.defaultPrevented) {
        // This Escape belongs to the tooltip only: keep it from closing an enclosing dialog.
        e.preventDefault()
        e.stopPropagation()
        clear()
        setOpen(false)
      }
    },
  })

  return (
    <>
      {trigger}
      {open ? (
        <ThemePortal host={triggerRef.current}>
          <div
            {...rest}
            ref={mergeRefs(ref, bubbleRef)}
            id={tipId}
            role="tooltip"
            className={cx('zzz-tooltip', className)}
            data-side={pos.side}
            style={{ ...pos.style, '--zzz-tooltip-arrow': `${pos.arrow}px`, ...style } as CSSProperties}
            onPointerEnter={() => clear()}
            onPointerLeave={() => hide(closeDelay)}
          >
            {content}
          </div>
        </ThemePortal>
      ) : null}
    </>
  )
}
