import { useId, useRef } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx, mergeRefs, useControllableState } from '../../utils';
import { Text } from '../Text';
import { TagButton } from '../TagButton';
import { MOTION, OverlayPortal, prefersReducedMotion, useModalLayer, usePresence } from '../DialogBand/overlay';
import './Drawer.css';

export interface DrawerProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'role'> {
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  /** Header title (upright, `fontSize.button` 26); the dialog's accessible name. */
  title: ReactNode;
  /** Header glyph before the title (e.g. `<FilterIcon />`, 21 × 22). */
  icon?: ReactNode;
  /** Footer action(s), centred on the inner panel (e.g. the Reset button). */
  footer?: ReactNode;
  /** Drawer width in design units (default 688, `size.panel.drawerWidth`). */
  width?: number;
  /** Accessible name of the header Close tag (default "Close"). */
  closeLabel?: string;
  /** Close when the dimmed page (scrim) is clicked (default true). */
  closeOnScrim?: boolean;
  /** Escape closes (default true). */
  closeOnEscape?: boolean;
  /** Render inside this element (position: absolute) instead of a fixed layer on `<body>`. */
  container?: HTMLElement | null;
  children?: ReactNode;
}

/**
 * Right-anchored side sheet: 688 wide, full height, 4 px black left edge; black
 * 95 px header (icon + upright title + red Close tag), `#1A1A1A` dotted body holding a `#030303`
 * inner panel (radius 12, margins 41 / 63 / 21 / 23), black 100 px footer with the action centred on
 * the inner panel. The page behind is dimmed by a left-to-right gradient (`effect.drawerScrim`), no blur.
 *
 * Motion: in 200 ms `cubic-bezier(.16,1,.3,1)` (translateX 100 % → 0), out 170 ms ease-in; the scrim fades
 * with it. Same accessibility as DialogBand: `role="dialog"` + `aria-modal`, focus trap, Escape closes,
 * page inert + scroll-locked, focus returns to the opener.
 */
export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  icon,
  footer,
  width,
  closeLabel = 'Close',
  closeOnScrim = true,
  closeOnEscape = true,
  container,
  className,
  style,
  children,
  ref,
  ...rest
}: DrawerProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const reduced = typeof window !== 'undefined' && prefersReducedMotion(container);
  const { mounted, state } = usePresence(open, reduced ? 100 : MOTION.drawerOut);
  const titleId = `zzz-drawer${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-title`;
  const layerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  const { onKeyDown } = useModalLayer({
    active: open && mounted,
    layerRef,
    dialogRef: drawerRef,
    lockScroll: container == null,
    onEscape: closeOnEscape ? close : undefined,
  });

  if (!mounted) return null;

  const layerStyle = (width != null ? { '--zzz-drawer-width': `calc(${width} * var(--zzz-px))` } : undefined) as
    | CSSProperties
    | undefined;

  return (
    <OverlayPortal
      container={container}
      state={state}
      layerRef={layerRef}
      className="zzz-drawer-layer"
      style={layerStyle}
    >
      <div
        className="zzz-drawer-scrim"
        aria-hidden="true"
        data-state={state}
        onPointerDown={closeOnScrim ? (e) => e.target === e.currentTarget && close() : undefined}
      />
      <div
        {...rest}
        ref={mergeRefs(ref, drawerRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-state={state}
        className={cx('zzz-drawer', className)}
        style={style}
        onKeyDown={(e) => {
          rest.onKeyDown?.(e);
          onKeyDown(e);
        }}
      >
        <header className="zzz-drawer__header">
          {icon != null ? (
            <span className="zzz-drawer__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <Text as="h2" id={titleId} role="button" className="zzz-drawer__title">
            {title}
          </Text>
          <TagButton kind="close" label={closeLabel} className="zzz-drawer__close" onClick={close} />
        </header>
        <div className="zzz-drawer__body zzz-mat-drawer">
          <div className="zzz-drawer__panel">{children}</div>
        </div>
        <footer className="zzz-drawer__footer">{footer}</footer>
      </div>
    </OverlayPortal>
  );
}
