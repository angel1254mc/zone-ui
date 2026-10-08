import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { cx, usePressFlash } from '../../utils';
import { Text } from '../Text';
import './EventCtaButton.css';

export interface EventCtaButtonOwnProps {
  /** Label. Default "Go". */
  children?: ReactNode;
  /** Force the pressed look (stories, tests). */
  pressed?: boolean;
  /** Stop the chevron drift (it also stops under `prefers-reduced-motion`). */
  still?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export type EventCtaButtonProps = EventCtaButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof EventCtaButtonOwnProps>;

/**
 * Bottom-right event call to action: a 284 × 57 dark pill
 * (`.zzz-mat-pill` ring) whose fill is a row of right-pointing chevron bands (`color.event.ctaChevronLight`
 * ~23 px / `ctaChevronDark` ~12 px, period 35, arms ~35° from vertical) fading to ~50 % toward both ends and
 * drifting right ~20 px/s (`motion.duration.ctaChevronDrift`), with a centred italic `button` label.
 * Pressed follows the shared pressed recipe (accent fill, 4 px outset, black label; chevrons hidden).
 * Distinct from `Button variant="mission"`.
 */
export function EventCtaButton(props: EventCtaButtonProps) {
  const {
    children = 'Go',
    pressed = false,
    still = false,
    disabled = false,
    type = 'button',
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props;
  const ariaDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const inert = disabled || ariaDisabled;
  const flash = usePressFlash<HTMLButtonElement>({
    disabled: inert,
    onKeyDown: onKeyDown as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined,
    onKeyUp,
    onBlur,
  });
  const isPressed = !inert && (pressed || 'data-pressed' in flash);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inert) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      className={cx(
        'zzz-event-cta',
        'zzz-mat-pill',
        'zzz-pressable',
        'zzz-focusable',
        still && 'zzz-event-cta--still',
        className
      )}
      {...(isPressed ? { 'data-pressed': '' } : null)}
      onKeyDown={flash.onKeyDown}
      onKeyUp={flash.onKeyUp}
      onBlur={flash.onBlur}
      onClick={handleClick}
    >
      <span className="zzz-event-cta__chevrons zzz-pressable__hide" aria-hidden="true" />
      <Text role="button" italic className="zzz-event-cta__label">
        {children}
      </Text>
    </button>
  );
}
