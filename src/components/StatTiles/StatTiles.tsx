import { createContext, useContext } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import './StatTiles.css';

/** `md` (dashboards, results), `sm` (dense rows, phone sidebars). */
export type StatTilesSize = 'sm' | 'md';

/** Colour of the delta: `positive` green, `negative` red, `neutral` grey. */
export type StatTileDeltaTone = 'positive' | 'negative' | 'neutral';

const StatTilesContext = createContext<{ size: StatTilesSize } | null>(null);

export interface StatTileOwnProps {
  /** What is measured ("Played", "Win rate"). Rendered as the `<dt>`. */
  label: ReactNode;
  /** The big number ("42", "87%", "1:42"). Rendered as the `<dd>`. */
  value: ReactNode;
  /** Secondary line under the value ("Top 12% today", "best 7"). */
  sub?: ReactNode;
  /** Change indicator. A number is signed (+3 / −2) and picks its own tone. */
  delta?: ReactNode;
  /** Default: from the sign of a numeric `delta`, else `neutral`. */
  deltaTone?: StatTileDeltaTone;
  /** Decorative glyph next to the label (aria-hidden). */
  icon?: ReactNode;
  /** Accent ring + accent label: the stat to look at first. */
  highlight?: boolean;
  /** Size when used outside StatTiles. Default `md`, or the grid's size. */
  size?: StatTilesSize;
  ref?: Ref<HTMLElement>;
}

export type StatTileProps = StatTileOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof StatTileOwnProps | 'children'>;

function formatDelta(delta: ReactNode): ReactNode {
  if (typeof delta !== 'number') return delta;
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `−${Math.abs(delta)}`;
  return '±0';
}

function toneOf(delta: ReactNode, tone: StatTileDeltaTone | undefined): StatTileDeltaTone {
  if (tone) return tone;
  if (typeof delta === 'number') return delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';
  return 'neutral';
}

/**
 * One stat: label, big sheared value, optional sub-label / delta / icon, on the dark panel
 * material (`.zzz-mat-panel`: #333 lit ring + black keyline drawn OUTSIDE the box, top-lit
 * hero gradient inside). A standalone tile is its own `<dl>`; inside `StatTiles` it is a
 * `<div>` group of the grid's `<dl>`.
 */
export function StatTile({
  label,
  value,
  sub,
  delta,
  deltaTone,
  icon,
  highlight = false,
  size: sizeProp,
  className,
  ref,
  ...rest
}: StatTileProps) {
  const grid = useContext(StatTilesContext);
  const size = sizeProp ?? grid?.size ?? 'md';
  const Root = (grid ? 'div' : 'dl') as 'div';
  const hasFoot = sub != null || delta != null;
  return (
    <Root
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      className={cx(
        'zzz-stat-tile',
        'zzz-mat-panel',
        !grid && `zzz-stat-tile--${size}`,
        highlight && 'zzz-stat-tile--highlight',
        className
      )}
      data-highlight={highlight ? '' : undefined}
    >
      <dt className="zzz-stat-tile__label">
        {icon != null ? (
          <span className="zzz-stat-tile__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="zzz-stat-tile__label-text">{label}</span>
      </dt>
      <dd className="zzz-stat-tile__body">
        <span className="zzz-stat-tile__value">{value}</span>
        {hasFoot ? (
          <span className="zzz-stat-tile__foot">
            {delta != null ? (
              <span className="zzz-stat-tile__delta" data-tone={toneOf(delta, deltaTone)}>
                {formatDelta(delta)}
              </span>
            ) : null}
            {sub != null ? <span className="zzz-stat-tile__sub">{sub}</span> : null}
          </span>
        ) : null}
      </dd>
    </Root>
  );
}

export interface StatTilesOwnProps {
  /** Fixed column count. Default: as many columns of at least `minTileWidth` as fit. */
  columns?: number;
  /** Minimum tile width in design units for the auto-fit grid. Default 220 (sm 190). */
  minTileWidth?: number;
  /** Default `md`. */
  size?: StatTilesSize;
  children?: ReactNode;
  ref?: Ref<HTMLDListElement>;
}

export type StatTilesProps = StatTilesOwnProps & Omit<ComponentPropsWithoutRef<'dl'>, keyof StatTilesOwnProps>;

/**
 * Responsive grid of StatTiles (a `<dl>`): dashboards, profile summaries, results screens.
 * Reserves room around the tiles for their outside ring + keyline.
 */
export function StatTiles({
  columns,
  minTileWidth,
  size = 'md',
  className,
  style,
  children,
  ref,
  ...rest
}: StatTilesProps) {
  const vars = {
    ...(columns ? { '--zzz-stat-tiles-columns': String(columns) } : null),
    ...(minTileWidth ? { '--zzz-stat-tiles-min': String(minTileWidth) } : null),
    ...style,
  } as CSSProperties;
  return (
    <StatTilesContext.Provider value={{ size }}>
      <dl
        {...rest}
        ref={ref}
        style={vars}
        className={cx('zzz-stat-tiles', `zzz-stat-tiles--${size}`, columns && 'zzz-stat-tiles--columns', className)}
      >
        {children}
      </dl>
    </StatTilesContext.Provider>
  );
}
