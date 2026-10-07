import { useId, useRef } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { cx, mergeRefs, useControllableState } from '../../utils';
import { GraffitiLayer, HatchBackground } from '../Backgrounds';
import { Text } from '../Text';
import { useModalLayer, usePresence } from '../DialogBand/overlay';
import './Splash.css';

/** Fade-out length in ms after dismissing. */
export const SPLASH_EXIT_MS = 300;

export interface SplashOwnProps {
  /** Shown (controlled). */
  open?: boolean;
  /** Initially shown (uncontrolled). Default true. */
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  /**
   * Called synchronously inside the dismissing click / key event — a user gesture, so it is the place to
   * unlock audio (`audioContext.resume()`, `audio.play()`).
   */
  onEnter?(): void;
  /** Logo / art slot above the title. */
  logo?: ReactNode;
  /** Title (sticker-outlined, large). */
  title?: ReactNode;
  /** Line under the title. */
  subtitle?: ReactNode;
  /** Pulsing hint, also the accessible name of the enter button. Default "Press to enter". */
  hint?: ReactNode;
  /** Small print at the bottom (version, credits). */
  footer?: ReactNode;
  /** Background layer. Default `graffiti`. */
  background?: 'hatch' | 'graffiti' | 'plain';
  /** Fill the nearest positioned ancestor (position: absolute) instead of the viewport (fixed). */
  contained?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export type SplashProps = SplashOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof SplashOwnProps | 'title'>;

/**
 * Full-screen "press to enter" gate: logo / art slot, title, subtitle and
 * a softly pulsing hint over a graffiti, hatch or plain background. Apps use it to get the user gesture that
 * browsers require before audio can play. Click / tap anywhere, Enter or Space dismisses it (the enter button
 * is focused on open); it then fades out (300 ms) and unmounts. Rendered as a modal `dialog` labelled by the
 * title; while open its sibling elements are `inert` and Tab stays inside, so render it next to your app
 * content (e.g. first child of the app root). Reduced motion: no pulse, no fade.
 */
export function Splash({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onEnter,
  logo,
  title,
  subtitle,
  hint = 'Press to enter',
  footer,
  background = 'graffiti',
  contained = false,
  className,
  children,
  onClick,
  onKeyDown,
  ref,
  ...rest
}: SplashProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const { mounted, state } = usePresence(open, SPLASH_EXIT_MS);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const titleId = `${id}-title`;

  // Modal behaviour (shared with DialogBand / Drawer): page behind inert, Tab trapped, the enter button
  // focused on open, focus restored and scroll unlocked on dismiss.
  const modal = useModalLayer({
    active: open && mounted,
    layerRef: rootRef,
    dialogRef: rootRef,
    getInitialFocus: () => buttonRef.current,
    lockScroll: !contained,
  });

  if (!mounted) return null;

  const enter = () => {
    if (!open) return;
    onEnter?.();
    setOpen(false);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) enter();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    modal.onKeyDown(event);
    if (event.defaultPrevented) return;
    // The focused enter button turns Enter / Space into a click (which bubbles to handleClick); this covers
    // focus resting anywhere else inside the splash (e.g. on the root after a click).
    if (event.target !== buttonRef.current && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      enter();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title != null ? titleId : undefined}
      aria-label={title == null ? (typeof hint === 'string' ? hint : 'Splash') : undefined}
      {...rest}
      ref={mergeRefs(rootRef, ref)}
      data-state={state}
      className={cx('zzz-splash', contained && 'zzz-splash--contained', `zzz-splash--bg-${background}`, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {background === 'hatch' ? <HatchBackground className="zzz-splash__bg" /> : null}
      {background === 'graffiti' ? <GraffitiLayer className="zzz-splash__bg" /> : null}
      <div className="zzz-splash__body">
        {logo != null ? <div className="zzz-splash__logo">{logo}</div> : null}
        {title != null ? (
          <Text as="h1" id={titleId} role="eventTitle" outline="event" tone="primary" className="zzz-splash__title">
            {title}
          </Text>
        ) : null}
        {subtitle != null ? (
          <Text as="p" role="bodyXl" tone="secondary" className="zzz-splash__subtitle">
            {subtitle}
          </Text>
        ) : null}
        {children}
        <button ref={buttonRef} type="button" className="zzz-splash__enter zzz-focusable">
          <Text role="button" italic className="zzz-splash__hint">
            {hint}
          </Text>
        </button>
      </div>
      {footer != null ? (
        <Text as="div" role="label" tone="muted" className="zzz-splash__footer">
          {footer}
        </Text>
      ) : null}
    </div>
  );
}
