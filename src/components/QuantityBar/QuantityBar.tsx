import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils';
import { Text } from '../Text';
import './QuantityBar.css';

/** `sm` / `md` / `lg`: 31 / 38 / 46 design units tall; text `fontSize.label` / `body` / `bodyLg`. */
export type QuantityBarSize = 'sm' | 'md' | 'lg';

export interface QuantityBarProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Label slot ("Craft Quantity"). */
  label: ReactNode;
  /** Value slot ("1"); omitted = label only. */
  value?: ReactNode;
  /** Between label and value (default the multiplication sign ×). */
  separator?: ReactNode;
  /** Announce changes politely (default true). */
  live?: boolean;
  /** Height, padding and bevel scale with the web size scale (sm = md × 46/57, lg = md × 69/57); pair it with the Slider's size. Default `md`. */
  size?: QuantityBarSize;
}

/**
 * Quantity readout: a flat 581 × 38
 * `color.surface.track` pill, no ring, centred upright white `fontSize.body` text such as
 * "Craft Quantity × 1" (a real × sign). A polite live region, so value changes are announced.
 */
export function QuantityBar({
  label,
  value,
  separator = '×',
  live = true,
  size = 'md',
  className,
  ...rest
}: QuantityBarProps) {
  const hasValue = value !== undefined && value !== null && value !== false;
  return (
    <div
      className={cx('zzz-quantity-bar', `zzz-quantity-bar--${size}`, className)}
      data-size={size}
      aria-live={live ? 'polite' : undefined}
      aria-atomic={live ? true : undefined}
      {...rest}
    >
      <Text role="body" className="zzz-quantity-bar__text">
        <span className="zzz-quantity-bar__label">{label}</span>
        {hasValue ? (
          <>
            {' '}
            <span className="zzz-quantity-bar__times">{separator}</span>{' '}
            <span className="zzz-quantity-bar__value">{value}</span>
          </>
        ) : null}
      </Text>
    </div>
  );
}
