import type { ComponentPropsWithoutRef, Ref } from 'react';
import { cx } from '../../utils';
import type { TextRole } from './Text';
import './Text.css';

export interface ValueProps extends ComponentPropsWithoutRef<'span'> {
  /** Optional text role; omitted = inherit the surrounding size. */
  textRole?: TextRole;
  ref?: Ref<HTMLSpanElement>;
}

/** Green highlight (`color.highlight.value` #2CA306) for numbers in effect text ("3.5%"). */
export function Value({ textRole, className, ref, ...rest }: ValueProps) {
  return (
    <span
      ref={ref}
      className={cx('zzz-value', 'zzz-tone-value', textRole && `zzz-text-${textRole}`, className)}
      {...rest}
    />
  );
}
