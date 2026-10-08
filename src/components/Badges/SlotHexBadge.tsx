import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils';
import { HexBadge, SlotDigit1, SlotDigit2, SlotDigit3, SlotDigit4, SlotDigit5, SlotDigit6 } from '../../icons';
import { badgeA11y, placementProps, type BadgeA11yProps, type BadgeOffset } from './shared';
import './Badges.css';

export type DriveDiscSlot = 1 | 2 | 3 | 4 | 5 | 6;

export interface SlotHexBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'slot'>, BadgeA11yProps {
  /** Drive-disc slot number (replaces the HTML `slot` attribute). */
  slot: DriveDiscSlot;
  /**
   * `top-left`: straddles the host card's corner (4.5 px left of it, 2 px above; the host must be
   * `position: relative`). `inline` (default): in flow.
   */
  placement?: 'top-left' | 'inline';
  /** Overhang `[x, y]` in design units. Default `[4.5, 2]`. */
  offset?: BadgeOffset;
}

const DIGITS = {
  1: SlotDigit1,
  2: SlotDigit2,
  3: SlotDigit3,
  4: SlotDigit4,
  5: SlotDigit5,
  6: SlotDigit6,
} as const;

/**
 * Slot number: a 38 × 36 hexagon (flat top/bottom, pointed sides),
 * `color.surface.slotHex` fill with a 2.5 px `#666568` outline, and a squared "techno" digit
 * 17 × 16 in `#B4B3B6`.
 */
export function SlotHexBadge({
  slot,
  placement = 'inline',
  offset,
  label,
  decorative,
  className,
  style,
  ...rest
}: SlotHexBadgeProps) {
  const Digit = DIGITS[slot];
  const pos = placementProps(placement, offset, style);
  return (
    <span
      {...rest}
      {...badgeA11y(label ?? `Slot ${slot}`, decorative)}
      className={cx('zzz-slot-hex', pos.className, className)}
      style={pos.style}
    >
      <HexBadge className="zzz-slot-hex__hex" />
      <Digit className="zzz-slot-hex__digit" preserveAspectRatio="none" />
    </span>
  );
}
