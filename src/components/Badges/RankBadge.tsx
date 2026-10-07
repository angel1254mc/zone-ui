import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../utils';
import { InfinityRankIcon, RankLetterA, RankLetterS, RankStarburstIcon } from '../../icons';
import { badgeA11y, type BadgeA11yProps } from './shared';
import './Badges.css';

export type AgentRank = 'S' | 'A' | 'infinity';

export interface RankBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'>, BadgeA11yProps {
  rank: AgentRank;
  /** Size in design units. Default 37 (card footer sun, 36 × 37). */
  size?: number;
}

const GLYPHS = {
  S: RankLetterS,
  A: RankLetterA,
  infinity: InfinityRankIcon,
} as const;

/**
 * Card rank sun: the gold `color.rank.starburst*` gear with a black italic
 * letter, or "∞". S and A share the gold sun.
 */
export function RankBadge({ rank, size, label, decorative, className, style, ...rest }: RankBadgeProps) {
  const Glyph = GLYPHS[rank];
  const s = size == null ? style : ({ '--zzz-badge-size': String(size), ...style } as CSSProperties);
  return (
    <span
      {...rest}
      {...badgeA11y(label ?? `Rank ${rank === 'infinity' ? '∞' : rank}`, decorative)}
      className={cx('zzz-rank-badge', `zzz-rank-badge--${rank}`, className)}
      style={s}
    >
      <RankStarburstIcon className="zzz-rank-badge__sun" />
      <Glyph className="zzz-rank-badge__glyph" />
    </span>
  );
}
