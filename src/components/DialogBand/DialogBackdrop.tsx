import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils';
import './DialogBand.css';

export interface DialogBackdropProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** 'open' fades the stripes in (70 ms); 'closed' fades them out (100 ms after 60 ms) and keeps the blur. */
  state?: 'open' | 'closed';
  /**
   * Show a ~100 ms pixelated "freeze" of the page before the band appears (a coarse mosaic grid
   * over a light blur).
   */
  pixelate?: boolean;
}

/**
 * The modal scrim behind a DialogBand: the page seen through `blur(13)` plus the
 * static 39.8° two-stripe dimming `rgba(0,0,0,.55)` / `rgba(26,26,26,.66)` (`effect.dialogBackdrop`).
 * Decorative (`aria-hidden`); position: absolute, filling its layer.
 */
export function DialogBackdrop({ state = 'open', pixelate = false, className, ...rest }: DialogBackdropProps) {
  return (
    <div
      aria-hidden="true"
      data-state={state}
      data-pixelate={pixelate ? '' : undefined}
      className={cx('zzz-dialog-backdrop', className)}
      {...rest}
    >
      <div className="zzz-dialog-backdrop__blur" />
      <div className="zzz-dialog-backdrop__stripes" />
      {pixelate ? <div className="zzz-dialog-backdrop__mosaic" /> : null}
    </div>
  );
}
