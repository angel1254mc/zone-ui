import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import './BarChart.css';

/**
 * Bar fill. Named fills read tokens: `muted` grey (color.star.empty), `light` (color.text.soft),
 * `accent` (live --zzz-accent), `rarity-s|a|b|c` (color.rarity.*). Any other string is a CSS colour.
 */
export type BarChartFill =
  | 'muted'
  | 'light'
  | 'accent'
  | 'rarity-s'
  | 'rarity-a'
  | 'rarity-b'
  | 'rarity-c'
  | (string & {});

export interface BarChartDatum {
  /** Category label under the bar. */
  label: ReactNode;
  /** Plain-text label for the summary / data table when `label` is not a string. */
  labelText?: string;
  value: number;
  /** Highlight this bar (accent fill, bright label). */
  highlight?: boolean;
  /** Marker tag above a highlighted bar ("You"). Defaults to the chart's `markerLabel`. */
  marker?: ReactNode;
  /** Per-bar fill (overrides `fill` / `highlightFill`). */
  color?: BarChartFill;
  /** React key (defaults to the index). */
  id?: string | number;
}

/** What is printed above each bar. */
export type BarChartValueDisplay = 'value' | 'percent' | 'both' | 'none';

export interface BarChartOwnProps {
  data: BarChartDatum[];
  /** Index (or indices) of highlighted bars, in addition to `datum.highlight`. */
  highlight?: number | number[];
  /** Marker tag above highlighted bars ("You"). */
  markerLabel?: ReactNode;
  /** Fill of normal bars. Default `muted`. */
  fill?: BarChartFill;
  /** Fill of highlighted bars. Default `accent`. */
  highlightFill?: BarChartFill;
  /** Default `value`. Percentages are of the sum of all values. */
  valueDisplay?: BarChartValueDisplay;
  /** Custom value text (wins over `valueDisplay` unless that is `none`). */
  formatValue?: (value: number, datum: BarChartDatum, share: number) => ReactNode;
  /** Scale maximum. Default: the largest value. */
  max?: number;
  /** Plot height in design units (the tallest bar). Default 280. */
  height?: number;
  /** Axis title under the category labels. */
  xAxisLabel?: ReactNode;
  /** Axis title left of the plot (rotated). */
  yAxisLabel?: ReactNode;
  /** Chart name: starts the generated summary and captions the data table. Default "Bar chart". */
  label?: string;
  /** Replace the generated accessible summary. */
  summary?: string;
  /** Grow the bars on mount (always off under prefers-reduced-motion). Default true. */
  animate?: boolean;
  ref?: Ref<HTMLElement>;
}

export type BarChartProps = BarChartOwnProps &
  Omit<ComponentPropsWithoutRef<'figure'>, keyof BarChartOwnProps | 'children'>;

const NAMED_FILLS = new Set(['muted', 'light', 'accent', 'rarity-s', 'rarity-a', 'rarity-b', 'rarity-c']);

function plain(node: ReactNode): string | undefined {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : undefined;
}

function pct(share: number): string {
  return `${Math.round(share * 100)}%`;
}

/**
 * Simple categorical bar chart (vertical bars): score distributions, poll results, stats.
 * Dark hatched tracks, token fills, highlighted bar(s) in the live accent with a marker tag,
 * sheared heavy labels, bars that grow on mount.
 *
 * Accessibility: the drawing is one `role="img"` named by a generated summary (count, highest
 * bar, highlighted bars); a visually hidden `<table>` next to it carries every value and share.
 */
export function BarChart({
  data,
  highlight,
  markerLabel,
  fill = 'muted',
  highlightFill = 'accent',
  valueDisplay = 'value',
  formatValue,
  max: maxProp,
  height,
  xAxisLabel,
  yAxisLabel,
  label = 'Bar chart',
  summary,
  animate = true,
  className,
  style,
  ref,
  ...rest
}: BarChartProps) {
  const hlSet = new Set(highlight == null ? [] : Array.isArray(highlight) ? highlight : [highlight]);
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);
  const max = maxProp ?? Math.max(0, ...data.map((d) => d.value));

  const rows = data.map((d, i) => {
    const isHl = d.highlight === true || hlSet.has(i);
    const share = total > 0 ? Math.max(0, d.value) / total : 0;
    const v = max > 0 ? Math.min(1, Math.max(0, d.value) / max) : 0;
    const color = d.color ?? (isHl ? highlightFill : fill);
    const marker = isHl ? (d.marker ?? markerLabel) : undefined;
    const name = d.labelText ?? plain(d.label) ?? `Bar ${i + 1}`;
    const markerText = plain(marker ?? null);
    let valueText: ReactNode = null;
    if (valueDisplay !== 'none') {
      if (formatValue) valueText = formatValue(d.value, d, share);
      else if (valueDisplay === 'percent') valueText = pct(share);
      else if (valueDisplay === 'both') valueText = `${d.value} · ${pct(share)}`;
      else valueText = String(d.value);
    }
    return {
      d,
      i,
      isHl,
      share,
      v,
      color,
      marker,
      name,
      markerText,
      valueText,
    };
  });

  const autoSummary = (() => {
    if (rows.length === 0) return `${label}: no data.`;
    const top = rows.reduce((a, b) => (b.d.value > a.d.value ? b : a));
    const parts = [
      `${label}: ${rows.length} ${rows.length === 1 ? 'bar' : 'bars'}.`,
      `Highest: ${top.name} (${top.d.value}).`,
    ];
    const hl = rows.filter((r) => r.isHl);
    if (hl.length) {
      parts.push(
        `Highlighted: ${hl
          .map((r) => `${r.name}${r.markerText ? ` (${r.markerText})` : ''}: ${r.d.value} (${pct(r.share)})`)
          .join(', ')}.`
      );
    }
    return parts.join(' ');
  })();

  const vars = {
    '--zzz-bar-chart-n': String(Math.max(1, rows.length)),
    ...(height != null ? { '--zzz-bar-chart-h': String(height) } : null),
    ...style,
  } as CSSProperties;

  return (
    <figure
      {...rest}
      ref={ref}
      style={vars}
      className={cx('zzz-bar-chart', yAxisLabel != null && 'zzz-bar-chart--y-axis', className)}
      data-animate={animate ? 'true' : 'false'}
    >
      <div className="zzz-bar-chart__chart" role="img" aria-label={summary ?? autoSummary}>
        {yAxisLabel != null ? (
          <span className="zzz-bar-chart__axis zzz-bar-chart__axis--y">
            <span className="zzz-bar-chart__axis-text">{yAxisLabel}</span>
          </span>
        ) : null}
        <div className="zzz-bar-chart__plot">
          {rows.map((r) => {
            const named = NAMED_FILLS.has(r.color);
            const colStyle = {
              '--zzz-bar-chart-i': String(r.i),
              ...(named ? null : { '--zzz-bar-chart-fill': r.color }),
            } as CSSProperties;
            return (
              <div
                key={r.d.id ?? r.i}
                className="zzz-bar-chart__col"
                data-highlight={r.isHl ? '' : undefined}
                data-fill={named ? r.color : 'custom'}
                style={colStyle}
              >
                <div className="zzz-bar-chart__track zzz-bg-hatch">
                  <div
                    className="zzz-bar-chart__bar"
                    style={
                      {
                        '--zzz-bar-chart-v': String(r.v),
                      } as CSSProperties
                    }
                  />
                  {r.marker != null || r.valueText != null ? (
                    <div
                      className="zzz-bar-chart__annot"
                      style={
                        {
                          '--zzz-bar-chart-v': String(r.v),
                        } as CSSProperties
                      }
                    >
                      {r.marker != null ? <span className="zzz-bar-chart__marker">{r.marker}</span> : null}
                      {r.valueText != null ? <span className="zzz-bar-chart__value">{r.valueText}</span> : null}
                    </div>
                  ) : null}
                </div>
                <span className="zzz-bar-chart__label">{r.d.label}</span>
              </div>
            );
          })}
        </div>
        {xAxisLabel != null ? <span className="zzz-bar-chart__axis zzz-bar-chart__axis--x">{xAxisLabel}</span> : null}
      </div>
      <table className="zzz-sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{xAxisLabel ?? 'Category'}</th>
            <th scope="col">{yAxisLabel ?? 'Value'}</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.d.id ?? r.i}>
              <th scope="row">
                {r.d.label}
                {r.marker != null ? <> ({r.marker})</> : null}
              </th>
              <td>{r.d.value}</td>
              <td>{pct(r.share)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
