import type { ComponentPropsWithRef } from 'react';
import { cx, usePressFlash } from '../../utils';
import './Badges.css';

export interface PlusBadgeProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label'> {
  /** Accessible name, e.g. "Get more Battery Charge" (the badge shows only a "+"). */
  label: string;
}

/**
 * "Get more" disc: a 15 px `color.badge.plus` disc with a black "+" (3 px bars,
 * 8 px span) and a 1.5 px dark ring. It is a `<button>`; its hit area extends 8 px beyond the disc.
 * Pressed: the disc takes the live accent and grows 1 px per side.
 */
export function PlusBadge({
  label,
  className,
  type = 'button',
  disabled,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}: PlusBadgeProps) {
  const press = usePressFlash<HTMLButtonElement>({
    disabled,
    onKeyDown,
    onKeyUp,
    onBlur,
  });
  return (
    <button
      {...press}
      {...rest}
      type={type}
      disabled={disabled}
      aria-label={label}
      className={cx('zzz-plus-badge', 'zzz-pressable', 'zzz-focusable', className)}
    >
      <svg className="zzz-plus-badge__glyph" viewBox="0 0 15 15" aria-hidden="true" focusable="false">
        <rect x="3.5" y="6" width="8" height="3" />
        <rect x="6" y="3.5" width="3" height="8" />
      </svg>
    </button>
  );
}
