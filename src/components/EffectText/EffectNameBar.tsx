import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx, useControllableState, usePressFlash } from '../../utils';
import './EffectText.css';

export interface EffectNameBarOwnProps {
  /** Effect name ("Scorching Breath"). */
  children?: ReactNode;
  /**
   * Capsule fill: `panel` #161616 (side DETAIL panel), `sunken` #0D0D0D (big panel), `black` (equip
   * screen). Default `panel`.
   */
  surface?: 'panel' | 'sunken' | 'black';
  /**
   * Show the white expand chevron (a `button` with `aria-expanded`) under the bar. The chevron hangs
   * 13 px below the bar and reserves no layout space: leave at least 13 px before the next content.
   */
  expandable?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Uncontrolled initial state. Default false. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Accessible name of the chevron button. Default "Show effect details". */
  expandLabel?: string;
  /** Id of the region the chevron expands (`aria-controls`). */
  controls?: string;
  /** Force the pressed look on the chevron (stories / tests). */
  chevronPressed?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export type EffectNameBarProps = EffectNameBarOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof EffectNameBarOwnProps>;

/**
 * Full-width 38 px effect-name capsule, white `body` label, pad 18. With `expandable`, a
 * 32 × 15 white inverted triangle overlaps the bar bottom by 2 px; it is a toggle button
 * (`aria-expanded`). Expanded: the triangle points up.
 */
export function EffectNameBar({
  children,
  surface = 'panel',
  expandable = false,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  expandLabel = 'Show effect details',
  controls,
  chevronPressed = false,
  className,
  ref,
  ...rest
}: EffectNameBarProps) {
  const [expanded, setExpanded] = useControllableState(expandedProp, defaultExpanded, onExpandedChange);
  const flash = usePressFlash<HTMLButtonElement>({});
  const labelId = useId();
  const pressed = chevronPressed || 'data-pressed' in flash;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        'zzz-effect-name-bar',
        surface !== 'panel' && `zzz-effect-name-bar--${surface}`,
        expandable && 'zzz-effect-name-bar--expandable',
        className
      )}
    >
      <span className="zzz-effect-name-bar__label" id={labelId}>
        {children}
      </span>
      {expandable ? (
        <button
          type="button"
          className="zzz-effect-name-bar__chevron zzz-focusable"
          aria-expanded={expanded}
          aria-controls={controls}
          aria-label={expandLabel}
          aria-describedby={labelId}
          data-expanded={expanded ? '' : undefined}
          {...(pressed ? { 'data-pressed': '' } : null)}
          onKeyDown={flash.onKeyDown}
          onKeyUp={flash.onKeyUp}
          onBlur={flash.onBlur}
          onClick={() => setExpanded((v) => !v)}
        >
          <svg viewBox="0 0 32 15" aria-hidden="true" focusable="false">
            <path d="M2.2 0 H29.8 Q32 0 30.7 1.8 L17.6 14 Q16 15.4 14.4 14 L1.3 1.8 Q0 0 2.2 0 Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
