import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils';
import { placementProps, type BadgeOffset, type BadgePlacement } from './shared';
import './Badges.css';

export interface NewBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** `md` = 19 design units (glyphs ~51 × 16); `sm` = 17.8 (cap ~15). Default `md`. */
  size?: 'sm' | 'md';
  /**
   * `top-right` (default) / `top-left`: absolutely positioned on the host's corner, overhanging it
   * (the host must be `position: relative`). `inline`: in the text flow.
   */
  placement?: BadgePlacement;
  /** Overhang `[x, y]` in design units past the host corner. Default `[6, 8]`. */
  offset?: BadgeOffset;
  /** The text. Default `"NEW!"`. */
  children?: ReactNode;
}

/**
 * "NEW!" tag: heavy 10° italic, holographic `color.badge.newGradient` fill
 * (background-clip: text) over a `shadow.textNew` black stroke (~3 px visible). Static.
 */
export function NewBadge({
  size = 'md',
  placement = 'top-right',
  offset,
  className,
  style,
  children = 'NEW!',
  ...rest
}: NewBadgeProps) {
  const pos = placementProps(placement, offset, style);
  return (
    <span
      {...rest}
      className={cx('zzz-new-badge', `zzz-new-badge--${size}`, pos.className, className)}
      style={pos.style}
    >
      <span className="zzz-new-badge__skew zzz-italic">
        <span className="zzz-new-badge__stroke" aria-hidden="true">
          {children}
        </span>
        <span className="zzz-new-badge__fill">{children}</span>
      </span>
    </span>
  );
}
