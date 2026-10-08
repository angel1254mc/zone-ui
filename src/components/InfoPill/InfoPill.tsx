import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { cx, usePressFlash } from '../../utils';
import { Text } from '../Text';
import './InfoPill.css';

export interface InfoPillOwnProps {
  /** Leading outline glyph (27 px, white), e.g. `<ClockIcon />` for the timer or `<InfoAlertIcon />` for "Event Details". */
  icon?: ReactNode;
  /** Makes the pill a `<button>` (e.g. "Event Details" opens the rules). Without it the pill is static text. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Button pills only: disables it (label/glyph grey, shape unchanged). */
  disabled?: boolean;
  /** Force the pressed look (stories, tests). Button pills only. */
  pressed?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement | HTMLSpanElement>;
}

export type InfoPillProps = InfoPillOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof InfoPillOwnProps | 'type'>;

/**
 * Event timer / info pill (e.g. "66d", "Event Details"): a 36 px black full pill with
 * no ring, a 27 px white outline glyph inset 4 and `bodyXl` upright white text. With `onClick` it is
 * a button and follows the pressed rule (accent fill + 4 px outset, black label, glyph hidden).
 */
export function InfoPill(props: InfoPillProps) {
  const {
    icon,
    onClick,
    disabled = false,
    pressed = false,
    className,
    children,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props;
  const interactive = onClick !== undefined;
  const flash = usePressFlash<HTMLButtonElement>({
    disabled: disabled || !interactive,
    onKeyDown: onKeyDown as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined,
    onKeyUp: onKeyUp as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined,
    onBlur,
  });

  const inner = (
    <>
      {icon != null ? (
        <span className="zzz-info-pill__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <Text role="bodyXl" className="zzz-info-pill__text">
        {children}
      </Text>
    </>
  );

  if (!interactive) {
    const spanRest = rest as ComponentPropsWithoutRef<'span'>;
    return (
      <span {...spanRest} ref={ref as Ref<HTMLSpanElement>} className={cx('zzz-info-pill', className)}>
        {inner}
      </span>
    );
  }

  const isPressed = !disabled && (pressed || 'data-pressed' in flash);
  return (
    <button
      {...rest}
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      className={cx('zzz-info-pill', 'zzz-info-pill--button', 'zzz-pressable', 'zzz-focusable', className)}
      {...(isPressed ? { 'data-pressed': '' } : null)}
      onKeyDown={flash.onKeyDown}
      onKeyUp={flash.onKeyUp}
      onBlur={flash.onBlur}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
