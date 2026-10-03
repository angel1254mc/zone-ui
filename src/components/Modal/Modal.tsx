import { cloneElement, isValidElement, useEffect, useId, useRef } from 'react'
import type {
  ComponentPropsWithRef,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import { CloseIcon } from '../../icons'
import { IconButton } from '../IconButton'
import { OverlayPortal, getFocusable, useModalLayer } from '../DialogBand/overlay'
import './Modal.css'

type TriggerProps = {
  ref?: Ref<HTMLElement>
  onClick?(e: MouseEvent<HTMLElement>): void
}

export interface ModalProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Controlled open state. */
  open?: boolean
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  /** Dialog title (its accessible name). */
  title: ReactNode
  /** Optional lead text under the title (its accessible description). */
  description?: ReactNode
  /** Footer actions, right-aligned (e.g. two `Button`s). */
  footer?: ReactNode
  /** Optional opener: ONE button element; clicking it opens the modal (uncontrolled use). */
  trigger?: ReactElement
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean
  /** Hide the top-right close button. */
  hideClose?: boolean
  /** Accessible name of the close button. Default "Close". */
  closeLabel?: string
  /** Panel width in design units. Default 450. */
  width?: number
  /** Element to focus on open. Default: the first focusable element in the body / footer. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Use `alertdialog` (confirmations that interrupt). */
  alert?: boolean
  children?: ReactNode
}

/**
 * A centred dialog panel for web pages; for full-width band dialogs prefer `DialogBand`.
 * A centred 450-wide panel with the asymmetric radius 20 0 20 20 (top-right square), a 3 px
 * black border + 3 px rgba(66,66,66,.66) outline, `linear-gradient(170deg, #222, #000 80%)`
 * with the rhombus grid; header min 60 on `linear-gradient(#1C1C1C, #080808)`, title in
 * `color.text.title`. Backdrop: a light scrim with 39.8deg stripes and a 4 px blur.
 *
 * `role="dialog"` + `aria-modal`, labelled by the title, described by `description`; focus moves
 * in on open, Tab / Shift+Tab are trapped, Escape closes, focus returns to the opener. The modal
 * layer is shared with DialogBand / Drawer (`useModalLayer`): while open every sibling of the
 * layer root is `inert` and page scroll is locked; the page is un-inerted before focus returns.
 * `className` / `style` / `ref` / other div props go to the dialog panel.
 */
export function Modal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  footer,
  trigger,
  closeOnBackdrop = true,
  closeOnEscape = true,
  hideClose = false,
  closeLabel = 'Close',
  width,
  initialFocus,
  alert = false,
  className,
  style,
  children,
  ref,
  onKeyDown,
  ...rest
}: ModalProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const titleId = `zzz-modal${uid}-title`
  const descId = `zzz-modal${uid}-desc`
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const layerRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Shared modal layer: focus in, Tab trap, Escape, scroll lock, inert page, focus restore (LIFO stack,
  // so a Modal over a Drawer only traps itself).
  const { onKeyDown: layerKeyDown } = useModalLayer({
    active: open,
    layerRef,
    dialogRef: panelRef,
    getInitialFocus: () =>
      initialFocus?.current ?? (bodyRef.current ? getFocusable(bodyRef.current)[0] : undefined) ?? undefined,
    lockScroll: true,
    onEscape: closeOnEscape ? () => setOpen(false) : undefined,
  })

  // Fallback restore: when nothing was focused at open (e.g. Safari does not focus clicked buttons),
  // send focus back to the trigger. Declared after useModalLayer, so this cleanup runs after its restore.
  useEffect(() => {
    if (!open) return
    return () => {
      const a = document.activeElement
      const t = triggerRef.current
      if ((a == null || a === document.body) && t && t.isConnected) t.focus({ preventScroll: true })
    }
  }, [open])

  const close = () => setOpen(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    layerKeyDown(e)
  }

  const onBackdropDown = (e: PointerEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) close()
  }

  let triggerEl: ReactNode = null
  if (trigger && isValidElement<TriggerProps>(trigger)) {
    const tp = trigger.props
    triggerEl = cloneElement(trigger, {
      ref: mergeRefs(tp.ref, triggerRef),
      'aria-haspopup': 'dialog',
      onClick: (e: MouseEvent<HTMLElement>) => {
        tp.onClick?.(e)
        if (!e.defaultPrevented) setOpen(true)
      },
    } as Partial<TriggerProps> & Record<string, unknown>)
  }

  const panelStyle = (width != null ? { '--zzz-modal-width': `calc(${width} * var(--zzz-px))`, ...style } : style) as
    | CSSProperties
    | undefined

  return (
    <>
      {triggerEl}
      {open ? (
        <OverlayPortal state="open" layerRef={layerRef} className="zzz-modal-layer">
          <div className="zzz-modal-overlay" onPointerDown={onBackdropDown}>
            <div
              {...rest}
              ref={mergeRefs(ref, panelRef)}
              role={alert ? 'alertdialog' : 'dialog'}
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description != null ? descId : undefined}
              tabIndex={-1}
              className={cx('zzz-modal', className)}
              style={panelStyle}
              onKeyDown={handleKeyDown}
            >
              <header className="zzz-modal__header">
                <h2 id={titleId} className="zzz-modal__title">
                  {title}
                </h2>
                {description != null ? (
                  <p id={descId} className="zzz-modal__description">
                    {description}
                  </p>
                ) : null}
              </header>
              <div ref={bodyRef} className="zzz-modal__body">
                {children}
                {footer != null ? <div className="zzz-modal__footer">{footer}</div> : null}
              </div>
              {hideClose ? null : (
                <IconButton
                  className="zzz-modal__close"
                  size="stepper"
                  icon={<CloseIcon />}
                  label={closeLabel}
                  onClick={close}
                />
              )}
            </div>
          </div>
        </OverlayPortal>
      ) : null}
    </>
  )
}
