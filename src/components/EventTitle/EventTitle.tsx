import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { Text } from '../Text';
import './EventTitle.css';

export type EventTitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface EventTitleOwnProps {
  /** Heading element. Default `h1` (the event page's title). */
  as?: EventTitleLevel;
  /** Horizontal alignment. Default `end` (right-aligned, as on every event page). */
  align?: 'start' | 'center' | 'end';
  /**
   * Font size in design units. Default `fontSize.eventTitle` 38. Short headlines can go larger
   * (~46–47).
   */
  size?: number;
  children?: ReactNode;
  ref?: Ref<HTMLHeadingElement>;
}

export type EventTitleProps = EventTitleOwnProps & Omit<ComponentPropsWithoutRef<'h1'>, keyof EventTitleOwnProps>;

/**
 * Event page title: `eventTitle` 38, white, upright,
 * with the sticker outline: a 7 px black stroke painted behind the fill (~3.5 px visible rim) and a
 * hard 3 px black `drop-shadow()` of the stroked silhouette. This locally
 * overrides the `shadow.textEventTitle` (6 px) / `shadow.textEventTitleDrop` (4 px) tokens, whose
 * text-shadow would hide behind the stroke in Chrome (see EventTitle.css). Right-aligned by default.
 */
export function EventTitle({
  as = 'h1',
  align = 'end',
  size,
  className,
  style,
  children,
  ref,
  ...rest
}: EventTitleProps) {
  return (
    <Text
      {...rest}
      as={as}
      ref={ref}
      role="eventTitle"
      outline="event"
      tone="primary"
      className={cx('zzz-event-title', `zzz-event-title--${align}`, className)}
      style={size !== undefined ? { fontSize: `calc(${size} * var(--zzz-px))`, ...style } : style}
    >
      {children}
    </Text>
  );
}
