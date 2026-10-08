import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { Text } from '../Text';
import { ClaimedCheck } from './ClaimedCheck';
import './CheckInCalendar.css';

export interface CheckInTileOwnProps {
  /** Day number (1-based). Rendered zero-padded ("01") in the red disc. */
  day: number;
  /** Reward art slot (an `<img>`, `<picture>` or SVG), ~90 px, centred in the art window. */
  item?: ReactNode;
  /** Reward name for the accessible name ("Day 1, 30 × Film, claimed"). */
  itemName?: string;
  /** Quantity ("× 30"). */
  count: number;
  /** Day already claimed: static lime tick over the art, greyed count. */
  claimed?: boolean;
  /** Special reward day: pink art window instead of yellow. */
  special?: boolean;
  /** Red tag over the art bottom (e.g. "Outfit Select"). `\n` breaks the line. */
  tag?: ReactNode;
  /** Glyph in the small black disc at the top-left (item type). Default: a cube. `null` hides the disc. */
  typeIcon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export type CheckInTileProps = CheckInTileOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof CheckInTileOwnProps>;

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Default item-type glyph: an isometric cube outline (original drawing). */
function CubeGlyph() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M10 2.2 17 6v8L10 17.8 3 14V6Z M3.6 6.3 10 9.8l6.4-3.5 M10 9.8v7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One daily check-in "ticket": 141 × 265 silver frame
 * with perforated side strips, a yellow (pink on special days) art window, a black item-type disc, a red day disc
 * (68 px circle clipped by the ticket's top-right corner to 57 × 61, "01" over "DAY"), a dashed perforation line and a 50 px dark count
 * strip with "× 30" in a black capsule. Claimed: a static lime tick over the art and a grey count.
 * Display only (claiming is handled by the page, not the tile).
 */
export function CheckInTile(props: CheckInTileProps) {
  const {
    day,
    item,
    itemName,
    count,
    claimed = false,
    special = false,
    tag,
    typeIcon,
    className,
    ref,
    ...rest
  } = props;
  const name = [
    `Day ${day}`,
    `${count} × ${itemName ?? 'reward'}`,
    claimed ? 'claimed' : null,
    special ? 'special reward' : null,
    typeof tag === 'string' ? tag.replace(/\s+/g, ' ') : null,
  ]
    .filter(Boolean)
    .join(', ');
  const glyph = typeIcon === undefined ? <CubeGlyph /> : typeIcon;

  return (
    <div
      role="group"
      aria-label={name}
      {...rest}
      ref={ref}
      className={cx(
        'zzz-check-in-tile',
        claimed && 'zzz-check-in-tile--claimed',
        special && 'zzz-check-in-tile--special',
        className
      )}
      data-claimed={claimed ? '' : undefined}
    >
      <span className="zzz-check-in-tile__frame" aria-hidden="true" />
      <span className="zzz-check-in-tile__window" aria-hidden="true">
        <span className="zzz-check-in-tile__swirl" />
        <span className="zzz-check-in-tile__art">{item}</span>
        {claimed ? <ClaimedCheck className="zzz-check-in-tile__check" /> : null}
      </span>
      {glyph != null ? (
        <span className="zzz-check-in-tile__type" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      <span className="zzz-check-in-tile__day-clip" aria-hidden="true">
        <span className="zzz-check-in-tile__day">
          <Text role="title" className="zzz-check-in-tile__day-num">
            {pad2(day)}
          </Text>
          <Text role="nano" className="zzz-check-in-tile__day-label">
            DAY
          </Text>
        </span>
      </span>
      {tag != null ? (
        <span className="zzz-check-in-tile__tag" aria-hidden="true">
          <Text role="label" className="zzz-check-in-tile__tag-text">
            {tag}
          </Text>
        </span>
      ) : null}
      <span className="zzz-check-in-tile__perforation" aria-hidden="true" />
      <span className="zzz-check-in-tile__strip" aria-hidden="true">
        <span className="zzz-check-in-tile__capsule">
          <Text role="bodyXl" className="zzz-check-in-tile__count">
            <span className="zzz-check-in-tile__times">×</span> {pad2(count)}
          </Text>
        </span>
      </span>
    </div>
  );
}
