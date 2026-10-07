import { useEffect, useRef } from 'react';
import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from 'react';
import { cx, mergeRefs, useControllableState } from '../../utils';
import { CheckIcon } from '../../icons';
import { Text } from '../Text';
import './Checkbox.css';

/** `sm` / `md` / `lg`: box 19 / 24 / 29 and row 32 / 40 / 48 design units (≈ 13.5 / 17 / 20 px boxes at the default scale). */
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'size' | 'children' | 'checked' | 'defaultChecked'
> {
  /** Checked (controlled). */
  checked?: boolean;
  /** Initial state (uncontrolled). */
  defaultChecked?: boolean;
  onCheckedChange?(checked: boolean): void;
  /** Mixed state ("some selected"): a black bar on the accent box; `aria-checked="mixed"`. */
  indeterminate?: boolean;
  /** Visible label. */
  children?: ReactNode;
  /**
   * Box, ring, check and row height scale with the control scale (sm = md × 46/57, lg = md × 69/57);
   * the label is `fontSize.label` / `body` / `bodyLg`. Default `md`.
   */
  size?: CheckboxSize;
}

/**
 * A native checkbox drawn as a 24 px box (radius 5, 3 px `color.border.button` ring, 1 px black
 * keyline) with a `body` label in `color.text.secondary`. Checked: live accent fill + black
 * check, label white. Disabled: `color.text.disabled`. Row height 40. Sizes sm / md / lg.
 *
 * `className` / `style` go to the root `<label>`; `ref` and other props to the `<input>`.
 */
export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  children,
  size = 'md',
  className,
  style,
  disabled,
  onChange,
  ref,
  ...rest
}: CheckboxProps) {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked, onCheckedChange);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.defaultPrevented) return;
    setChecked(event.target.checked);
  };

  return (
    <label
      className={cx('zzz-checkbox', `zzz-checkbox--${size}`, className)}
      style={style}
      data-size={size}
      data-checked={checked ? '' : undefined}
      data-indeterminate={indeterminate ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <span className="zzz-checkbox__control">
        <input
          ref={mergeRefs(inputRef, ref)}
          type="checkbox"
          className="zzz-checkbox__input"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        <span className="zzz-checkbox__box" aria-hidden="true">
          {indeterminate ? <span className="zzz-checkbox__bar" /> : <CheckIcon className="zzz-checkbox__check" />}
        </span>
      </span>
      {children != null ? (
        <Text role="body" className="zzz-checkbox__label">
          {children}
        </Text>
      ) : null}
    </label>
  );
}
