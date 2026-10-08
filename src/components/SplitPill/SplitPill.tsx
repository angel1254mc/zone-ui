import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import './SplitPill.css';

export interface SplitPillItem {
  /** 30–34 px glyph (element icon in its colour; specialty grey metallic). Decorative. */
  icon?: ReactNode;
  label: ReactNode;
}

export interface SplitPillOwnProps {
  /** The two halves, e.g. element + specialty. */
  items: readonly [SplitPillItem, SplitPillItem];
  ref?: Ref<HTMLDivElement>;
}

export type SplitPillProps = SplitPillOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SplitPillOwnProps | 'children'>;

/**
 * Two-part tag pill (e.g. element / specialty): the level-pill shell (66 px incl. the 5 px black
 * rim) split by the 24° divider; each half holds an icon and a `bodyXl` label in `text.secondary`.
 * Rendered as a two-item list.
 */
export function SplitPill({ items, className, ref, ...rest }: SplitPillProps) {
  return (
    <div {...rest} ref={ref} role="list" className={cx('zzz-split-pill', className)}>
      {items.map((item, i) => (
        <span key={i} role="listitem" className={cx('zzz-split-pill__half', i === 1 && 'zzz-split-pill__half--second')}>
          {item.icon != null ? (
            <span className="zzz-split-pill__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className="zzz-split-pill__label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
