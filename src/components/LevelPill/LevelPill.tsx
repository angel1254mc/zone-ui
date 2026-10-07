import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { InfoAlertIcon } from '../../icons';
import { RankCoin } from '../Badges';
import type { Rank } from '../Badges';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';
import { Text } from '../Text';
import './LevelPill.css';

/**
 * - `panel`: 200 × 44 #161616 capsule, RankCoin, upright "Lv. 60/60" (side detail panel)
 * - `equip`: ~450 × 44 black bar, left end flush, RankCoin, centred "Lv. 60/60" (equip list)
 * - `large`: 296 × 60 #202020 pill, RankCoin 29, italic outlined "Lv. 60", 24° divider, engraved ghost
 *   max digits, `(i)` sub-pill 85 × 56 (big item panel)
 * - `agent`: 355 × 66 pill, big italic "Lv. 60", divider, ghost "60", black MAX capsule (character info)
 */
export type LevelPillVariant = 'panel' | 'equip' | 'large' | 'agent';

export interface LevelPillOwnProps {
  variant?: LevelPillVariant;
  level: number;
  max: number;
  /** Rarity coin (panel / equip / large). Omit to hide it. */
  rank?: Rank;
  /** Agent variant: show "MAX" in the black end capsule. Default `level >= max`. */
  showMax?: boolean;
  /** Large variant: shows the `(i)` "Details" sub-pill and calls this on activation. */
  onInfo?: () => void;
  /** Accessible name of the `(i)` button. Default "Details". */
  infoLabel?: string;
  /** Extra props for the `(i)` button (`disabled`, `pressed`…). */
  infoProps?: Omit<ButtonProps, 'onClick' | 'children' | 'variant' | 'icon'>;
  /** Custom glyph for the `(i)` button. Default `InfoAlertIcon`. */
  infoIcon?: ReactNode;
  /** Accessible name of the pill. Default "Level {level} of {max}". */
  label?: string;
  ref?: Ref<HTMLDivElement>;
}

export type LevelPillProps = LevelPillOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof LevelPillOwnProps | 'children'>;

/**
 * Level display. The pill is a `role="group"` named "Level 60 of 60"; the visible digits
 * (including the engraved ghost max) are hidden from assistive tech. Only the large variant holds a
 * control (the `(i)` Details sub-pill).
 */
export function LevelPill({
  variant = 'panel',
  level,
  max,
  rank,
  showMax,
  onInfo,
  infoLabel = 'Details',
  infoProps,
  infoIcon,
  label,
  className,
  ref,
  ...rest
}: LevelPillProps) {
  const name = label ?? `Level ${level} of ${max}`;
  const withCoin = rank != null && variant !== 'agent';
  const coin = withCoin ? (
    <RankCoin
      rank={rank}
      size={variant === 'large' ? 29 : variant === 'panel' ? 33 : 30}
      decorative
      className="zzz-level-pill__coin"
    />
  ) : null;

  if (variant === 'panel' || variant === 'equip') {
    return (
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-label={name}
        className={cx('zzz-level-pill', `zzz-level-pill--${variant}`, className)}
      >
        {coin}
        <span className="zzz-level-pill__text" aria-hidden="true">
          Lv. {level}
          <span className="zzz-level-pill__slash">/</span>
          {max}
        </span>
      </div>
    );
  }

  const isAgent = variant === 'agent';
  const maxShown = showMax ?? level >= max;
  const hasInfo = !isAgent && onInfo != null;

  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-label={name}
      className={cx('zzz-level-pill', `zzz-level-pill--${variant}`, hasInfo && 'zzz-level-pill--has-info', className)}
    >
      <span className="zzz-level-pill__lead" aria-hidden="true">
        {coin}
        <Text
          role={isAgent ? 'titlePill' : 'bodyXl'}
          italic
          outline={isAgent ? 'md' : 'sm'}
          className="zzz-level-pill__level"
        >
          Lv. {level}
        </Text>
      </span>
      <span className="zzz-level-pill__ghost" aria-hidden="true">
        <span className="zzz-level-pill__ghost-digits zzz-italic">{max}</span>
      </span>
      {isAgent ? (
        <span className="zzz-level-pill__max" aria-hidden="true">
          {maxShown ? 'MAX' : null}
        </span>
      ) : null}
      {hasInfo ? (
        <Button
          {...infoProps}
          variant="sub"
          width={85}
          icon={infoIcon ?? <InfoAlertIcon />}
          aria-label={infoLabel}
          onClick={onInfo}
          className={cx('zzz-level-pill__info', infoProps?.className)}
        />
      ) : null}
    </div>
  );
}
