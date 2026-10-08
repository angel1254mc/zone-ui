import { createContext, useContext } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { Text } from '../Text';
import type { TextRole } from '../Text';
import './StatRow.css';

/**
 * - `panel`: 412 × 41 `color.surface.statRow` #161616 capsule on a black panel (side panel)
 * - `grid`: 300 × 40 `statRowSunken` capsule on a #1A1A1A panel column, 2 columns
 * - `agent`: 350 × 37 black capsule on a #232323 card, `bodyLg` text, pitch 52
 * - `equip`: ~550 × 45 black bar, left end flush, right end rounded (equipment lists)
 */
export type StatRowVariant = 'panel' | 'grid' | 'agent' | 'equip';

/** Grid context: rows inside a StatGrid are `<div>` groups of the grid's `<dl>` and inherit its variant. */
const StatGridContext = createContext<{ variant?: StatRowVariant } | null>(null);

/** @internal Resolve the element + variant for a row (shared with EmptyStatRow). */
export function useStatRowContext(variant: StatRowVariant | undefined, fallback: StatRowVariant) {
  const grid = useContext(StatGridContext);
  return {
    inGrid: grid != null,
    variant: variant ?? grid?.variant ?? fallback,
  };
}

const TEXT_ROLE: Record<StatRowVariant, TextRole> = {
  panel: 'body',
  grid: 'body',
  agent: 'bodyLg',
  equip: 'body',
};

export interface StatRowOwnProps {
  /** Stat name ("Base ATK"). Rendered as the `<dt>`. */
  label: ReactNode;
  /** Stat value ("684", "30%"). Rendered as the `<dd>`, tabular figures. */
  value: ReactNode;
  /** Default `panel`, or the enclosing StatGrid's variant. */
  variant?: StatRowVariant;
  /** Label AND value in `color.highlight.keyword` (the orange agent stats: HP, CRIT Rate…). */
  highlight?: boolean;
  /** Drive-disc sub-stat roll count: appends an orange "+n" tag after the label. */
  rollCount?: number;
  /** Optional leading glyph before the label (decorative). */
  icon?: ReactNode;
  /**
   * Long labels: `true` shrinks the label to fit (never below 16 design units, "Anomaly Proficiency");
   * `'wrap'` sets it on two tight lines at ~15 px ("Automatic Adrenaline Accumulation").
   */
  fit?: boolean | 'wrap';
  ref?: Ref<HTMLElement>;
}

export type StatRowProps = StatRowOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof StatRowOwnProps>;

/**
 * Label/value capsule. A standalone row is its own `<dl>`; inside `StatGrid` it is a
 * `<div>` group of the grid's `<dl>` (`dt` = label, `dd` = value).
 */
export function StatRow({
  label,
  value,
  variant: variantProp,
  highlight = false,
  rollCount,
  icon,
  fit = false,
  className,
  ref,
  ...rest
}: StatRowProps) {
  const { inGrid, variant } = useStatRowContext(variantProp, 'panel');
  const Root = (inGrid ? 'div' : 'dl') as 'div';
  const role = TEXT_ROLE[variant];
  const roll = rollCount != null && rollCount > 0 ? <span className="zzz-stat-row__roll">+{rollCount}</span> : null;

  return (
    <Root
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      className={cx(
        'zzz-stat-row',
        `zzz-stat-row--${variant}`,
        highlight && 'zzz-stat-row--highlight',
        fit === 'wrap' && 'zzz-stat-row--wrap',
        className
      )}
    >
      <dt className="zzz-stat-row__label">
        {icon != null ? (
          <span className="zzz-stat-row__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {fit === true ? (
          <Text role={role} fit className="zzz-stat-row__label-text">
            {label}
            {roll ? ' ' : null}
            {roll}
          </Text>
        ) : (
          <span className="zzz-stat-row__label-text">
            {label}
            {roll ? ' ' : null}
            {roll}
          </span>
        )}
      </dt>
      <dd className="zzz-stat-row__value">{value}</dd>
    </Root>
  );
}

export interface StatGridOwnProps {
  /** 1 or 2 columns. Default 1. */
  columns?: 1 | 2;
  /** Default variant for the rows and the gaps: `grid` 14 / 21, `agent` 15 / 21 (pitch 52), `panel` / `equip` 12. */
  variant?: StatRowVariant;
  children?: ReactNode;
  ref?: Ref<HTMLDListElement>;
}

export type StatGridProps = StatGridOwnProps & Omit<ComponentPropsWithoutRef<'dl'>, keyof StatGridOwnProps>;

/** A `<dl>` of StatRows in 1–2 columns with per-variant gaps. */
export function StatGrid({ columns = 1, variant = 'panel', className, children, ref, ...rest }: StatGridProps) {
  return (
    <StatGridContext.Provider value={{ variant }}>
      <dl
        {...rest}
        ref={ref}
        className={cx('zzz-stat-grid', `zzz-stat-grid--cols-${columns}`, `zzz-stat-grid--${variant}`, className)}
      >
        {children}
      </dl>
    </StatGridContext.Provider>
  );
}

export interface EmptyStatRowOwnProps {
  /** Default `grid` (the 300 × 40 big-panel capsule), or the enclosing StatGrid's variant. */
  variant?: StatRowVariant;
  /** Accessible term (the visible word is always "EMPTY"). Default "Empty slot". */
  label?: string;
  ref?: Ref<HTMLElement>;
}

export type EmptyStatRowProps = EmptyStatRowOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof EmptyStatRowOwnProps | 'children'>;

/**
 * Empty stat slot: `statRowEmpty` #0C0C0C capsule, a centred condensed "EMPTY" in
 * `color.text.ghost`, flanked by two solid 4 px rules inset 13.
 */
export function EmptyStatRow({
  variant: variantProp,
  label = 'Empty slot',
  className,
  ref,
  ...rest
}: EmptyStatRowProps) {
  const { inGrid, variant } = useStatRowContext(variantProp, 'grid');
  const Root = (inGrid ? 'div' : 'dl') as 'div';
  return (
    <Root
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      className={cx('zzz-stat-row', 'zzz-empty-stat-row', `zzz-stat-row--${variant}`, className)}
    >
      <dt className="zzz-sr-only">{label}</dt>
      <dd className="zzz-empty-stat-row__body" aria-hidden="true">
        <span className="zzz-empty-stat-row__rule" />
        <span className="zzz-empty-stat-row__word">EMPTY</span>
        <span className="zzz-empty-stat-row__rule" />
      </dd>
    </Root>
  );
}
