import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import type { TextRole } from './Text';
import './Text.css';

export interface KeywordProps extends ComponentPropsWithoutRef<'span'> {
  /** Optional leading icon (e.g. a specialty glyph), sized 1 em. */
  icon?: ReactNode;
  /** Optional text role; omitted = inherit the surrounding size. */
  textRole?: TextRole;
  ref?: Ref<HTMLSpanElement>;
}

/** Orange highlight (`color.highlight.keyword` #FAAD2B) for keywords such as "Attack" or "Rupture". */
export function Keyword({ icon, textRole, className, children, ref, ...rest }: KeywordProps) {
  return (
    <span
      ref={ref}
      className={cx('zzz-keyword', 'zzz-tone-keyword', textRole && `zzz-text-${textRole}`, className)}
      {...rest}
    >
      {icon != null && (
        <span className="zzz-keyword__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
