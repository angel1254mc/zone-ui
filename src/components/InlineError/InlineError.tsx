import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { InfoAlertIcon } from '../../icons';
import './InlineError.css';

export interface InlineErrorOwnProps {
  /**
   * `role="alert"`: only when the message appears in response to a user action. Default false —
   * then reference it with `aria-describedby` from the disabled action.
   */
  alert?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLParagraphElement>;
}

export type InlineErrorProps = InlineErrorOwnProps & Omit<ComponentPropsWithoutRef<'p'>, keyof InlineErrorOwnProps>;

/**
 * Red inline error (e.g. "Insufficient crafting materials"): `color.danger.text`, upright
 * `fontSize.body`, centred, no icon, no plate, no entrance animation.
 */
export function InlineError({ alert = false, className, ref, ...rest }: InlineErrorProps) {
  return <p role={alert ? 'alert' : undefined} {...rest} ref={ref} className={cx('zzz-inline-error', className)} />;
}

export interface NoticeOwnProps {
  /** Trailing glyph (22 px, white outline). Default `InfoAlertIcon`; `null` hides it. */
  icon?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export type NoticeProps = NoticeOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof NoticeOwnProps>;

/**
 * Translucent notice pill (e.g. "'Unlock Early' has been unlocked"): 424 × 39,
 * `color.surface.notice` (black 50 %, no blur), white `label` text inset 12, a 22 px glyph 8 px
 * from the right end. `role="status"`.
 */
export function Notice({ icon, className, children, ref, ...rest }: NoticeProps) {
  const glyph = icon === undefined ? <InfoAlertIcon /> : icon;
  return (
    <div role="status" {...rest} ref={ref} className={cx('zzz-notice', className)}>
      <span className="zzz-notice__text">{children}</span>
      {glyph != null ? (
        <span className="zzz-notice__icon" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
    </div>
  );
}
