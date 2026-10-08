import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { PlusBadge } from '../Badges';
import type { PlusBadgeProps } from '../Badges';
import { Zeros } from '../Text';
import './CurrencyPill.css';

export interface CurrencyPillOwnProps {
  /** Amount. Numbers are zero-padded to `digits`; strings render as given. */
  value: number | string;
  /** Stamina: renders "value/max" (the max is never padded). */
  max?: number;
  /** Digit count of the padded value. Default 8, or 3 when `max` is set; 0 = no padding. */
  digits?: number;
  /** Colour of the padding zeros: `grey` (`color.text.zeroPad`) or `white` (stamina "020/240"). Default grey, white with `max`. */
  padTone?: 'grey' | 'white';
  /** Item art on the tail (~40 × 49). Decorative. */
  icon?: ReactNode;
  /** Shows the "+" PlusBadge (a separate button "Get more {label}"). */
  onAdd?: () => void;
  /** Currency name ("Dennies"); names the group and the "+" button. */
  label: string;
  /** Accessible name of the "+" button. Default "Get more {label}". */
  addLabel?: string;
  /** Extra props for the "+" button (`disabled`, `data-pressed`…). */
  addProps?: Omit<PlusBadgeProps, 'label' | 'onClick'>;
  ref?: Ref<HTMLDivElement>;
}

export type CurrencyPillProps = CurrencyPillOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof CurrencyPillOwnProps | 'children'>;

const nf = new Intl.NumberFormat('en-US');

/**
 * Top-bar currency pill: a 222 × 56 outline (round left end, right tail leaning 25°)
 * drawn in SVG — ring `color.border.button`, `surface.button` fill with the dot mesh — holding a
 * zero-padded `bodyXl` counter, the item art on the tail and an optional "+" PlusBadge.
 */
export function CurrencyPill({
  value,
  max,
  digits,
  padTone,
  icon,
  onAdd,
  label,
  addLabel,
  addProps,
  className,
  ref,
  ...rest
}: CurrencyPillProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const isStamina = max != null;
  const nDigits = digits ?? (isStamina ? 3 : 8);
  const tone = padTone ?? (isStamina ? 'white' : 'grey');
  const numeric = typeof value === 'number';
  const spoken = `${label} ${numeric ? nf.format(value) : value}${isStamina ? ` / ${nf.format(max)}` : ''}`;

  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-label={label}
      className={cx('zzz-currency-pill', tone === 'white' && 'zzz-currency-pill--pad-white', className)}
    >
      <svg className="zzz-currency-pill__shape" viewBox="0 0 222 56" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0"
              style={{
                stopColor: 'var(--zzz-color-border-button-bevel-top)',
              }}
            />
            <stop
              offset="0.12"
              style={{
                stopColor: 'var(--zzz-color-border-button)',
              }}
            />
            <stop
              offset="1"
              style={{
                stopColor: 'var(--zzz-color-border-button)',
              }}
            />
          </linearGradient>
          <pattern id={`${uid}-dots`} width="4.64" height="4.64" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="0.75" fill="#fff" fillOpacity="0.035" />
            <circle cx="4.64" cy="0" r="0.75" fill="#fff" fillOpacity="0.035" />
            <circle cx="0" cy="4.64" r="0.75" fill="#fff" fillOpacity="0.035" />
            <circle cx="4.64" cy="4.64" r="0.75" fill="#fff" fillOpacity="0.035" />
            <circle cx="2.32" cy="2.32" r="0.75" fill="#fff" fillOpacity="0.035" />
          </pattern>
        </defs>
        <path className="zzz-currency-pill__keyline" d={OUTER} />
        <path d={OUTER} fill={`url(#${uid}-ring)`} />
        <path d={INNER} className="zzz-currency-pill__fill" />
        <path d={INNER} fill={`url(#${uid}-dots)`} />
      </svg>
      <span className="zzz-sr-only">{spoken}</span>
      <span className="zzz-currency-pill__value" aria-hidden="true">
        {numeric && nDigits > 0 ? (
          <Zeros value={value} digits={nDigits} aria-hidden="true" />
        ) : numeric ? (
          nf.format(value).replace(/,/g, '')
        ) : (
          value
        )}
        {isStamina ? (
          <>
            <span className="zzz-currency-pill__slash">/</span>
            <span className="zzz-currency-pill__max">{max}</span>
          </>
        ) : null}
      </span>
      {icon != null ? (
        <span className="zzz-currency-pill__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {onAdd ? (
        <PlusBadge
          {...addProps}
          label={addLabel ?? `Get more ${label}`}
          onClick={onAdd}
          className={cx('zzz-currency-pill__add', addProps?.className)}
        />
      ) : null}
    </div>
  );
}

/* Outer edge (viewBox = design units): round left end r 28, straight top, right edge on
 * x = 196 + 0.4663·y (25° lean), rounded top-right and bottom-right corners. */
const OUTER = 'M28 0 H192 Q196 0 197.5 3.2 L219.2 49.8 Q222 56 215 56 H28 A28 28 0 0 1 28 0 Z';
/* The same outline inset by the 4.5 px ring (slant offset 4.5 / cos 25° = 4.97). */
const INNER = 'M28 4.5 H189.5 Q193.1 4.5 194.5 7.5 L213.1 47.5 Q215 51.5 210 51.5 H28 A23.5 23.5 0 0 1 28 4.5 Z';

export interface ResourceBarOwnProps {
  /** Pills, left to right. */
  items?: readonly CurrencyPillProps[];
  /** Or pass CurrencyPill elements directly. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export type ResourceBarProps = ResourceBarOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof ResourceBarOwnProps>;

/** Row of currency pills, right-aligned, at a 224 px pitch (2 px between the tail and the next pill). */
export function ResourceBar({ items, children, className, ref, ...rest }: ResourceBarProps) {
  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-label={rest['aria-label'] ?? 'Resources'}
      className={cx('zzz-resource-bar', className)}
    >
      {items?.map((item, i) => (
        <CurrencyPill key={item.label ?? i} {...item} />
      ))}
      {children}
    </div>
  );
}
