import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { BarChart } from './BarChart';
import type { BarChartDatum } from './BarChart';

const scores: BarChartDatum[] = [
  { label: '0/5', value: 2 },
  { label: '1/5', value: 6 },
  { label: '2/5', value: 14 },
  { label: '3/5', value: 30 },
  { label: '4/5', value: 28 },
  { label: '5/5', value: 20 },
];

const bars = () => [...document.querySelectorAll<HTMLElement>('.zzz-bar-chart__bar')];

describe('BarChart', () => {
  it('renders a figure with an img role named by the summary and one bar per datum', () => {
    render(<BarChart data={scores} label="Today's scores" />);
    const fig = document.querySelector('figure')!;
    expect(fig).toHaveClass('zzz-bar-chart');
    const img = screen.getByRole('img');
    expect(img).toHaveAccessibleName(/Today's scores/);
    expect(img).toHaveAccessibleName(/6 bars/);
    expect(img).toHaveAccessibleName(/highest: 3\/5 \(30\)/i);
    expect(bars()).toHaveLength(6);
  });

  it('scales bars to the max value (or an explicit max)', () => {
    const { rerender } = render(<BarChart data={scores} />);
    expect(bars()[3].style.getPropertyValue('--zzz-bar-chart-v')).toBe('1');
    expect(bars()[0].style.getPropertyValue('--zzz-bar-chart-v')).toBe(String(2 / 30));
    rerender(<BarChart data={scores} max={60} />);
    expect(bars()[3].style.getPropertyValue('--zzz-bar-chart-v')).toBe('0.5');
  });

  it('handles all-zero data without NaN', () => {
    render(
      <BarChart
        data={[
          { label: 'a', value: 0 },
          { label: 'b', value: 0 },
        ]}
        valueDisplay="percent"
      />
    );
    expect(bars()[0].style.getPropertyValue('--zzz-bar-chart-v')).toBe('0');
    expect(document.querySelector('.zzz-bar-chart__value')).toHaveTextContent('0%');
  });

  it('highlights bars by index with a marker label, in the summary and the table', () => {
    render(<BarChart data={scores} highlight={4} markerLabel="You" label="Scores" />);
    const cols = document.querySelectorAll('.zzz-bar-chart__col');
    expect(cols[4]).toHaveAttribute('data-highlight');
    expect(cols[3]).not.toHaveAttribute('data-highlight');
    expect(cols[4].querySelector('.zzz-bar-chart__marker')).toHaveTextContent('You');
    expect(document.querySelectorAll('.zzz-bar-chart__marker')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveAccessibleName(/highlighted: 4\/5 \(You\): 28/i);
    const row = screen.getAllByRole('row')[5];
    expect(row).toHaveTextContent('4/5 (You)');
  });

  it('highlights via datum.highlight / datum.marker and several indices', () => {
    render(
      <BarChart
        data={[
          { label: 'A', value: 3, highlight: true, marker: 'Top' },
          { label: 'B', value: 1 },
          { label: 'C', value: 2 },
        ]}
        highlight={[2]}
      />
    );
    const cols = document.querySelectorAll('.zzz-bar-chart__col');
    expect(cols[0]).toHaveAttribute('data-highlight');
    expect(cols[2]).toHaveAttribute('data-highlight');
    expect(cols[0].querySelector('.zzz-bar-chart__marker')).toHaveTextContent('Top');
    expect(cols[2].querySelector('.zzz-bar-chart__marker')).toBeNull();
  });

  it('renders a visually hidden data table with every value and share', () => {
    render(<BarChart data={scores} label="Scores" xAxisLabel="Score" yAxisLabel="Players" />);
    const table = screen.getByRole('table', { name: 'Scores' });
    expect(table).toHaveClass('zzz-sr-only');
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((h) => h.textContent);
    expect(headers).toEqual(['Score', 'Players', 'Share']);
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(6);
    expect(rows[3]).toHaveTextContent('3/5');
    expect(rows[3]).toHaveTextContent('30');
    expect(rows[3]).toHaveTextContent('30%');
    // the table is a sibling of the img (content inside role=img is presentational)
    expect(screen.getByRole('img').contains(table)).toBe(false);
  });

  it('shows values, percentages, both or none above the bars', () => {
    const { rerender } = render(<BarChart data={scores} />);
    const values = () => [...document.querySelectorAll('.zzz-bar-chart__value')].map((v) => v.textContent);
    expect(values()[3]).toBe('30');
    rerender(<BarChart data={scores} valueDisplay="percent" />);
    expect(values()[3]).toBe('30%');
    rerender(<BarChart data={scores} valueDisplay="both" />);
    expect(values()[3]).toBe('30 · 30%');
    rerender(<BarChart data={scores} valueDisplay="none" />);
    expect(values()).toHaveLength(0);
    rerender(<BarChart data={scores} formatValue={(v) => `${v} players`} />);
    expect(values()[3]).toBe('30 players');
  });

  it('renders the category labels and axis labels', () => {
    render(<BarChart data={scores} xAxisLabel="Correct answers" yAxisLabel="Players" />);
    expect([...document.querySelectorAll('.zzz-bar-chart__label')].map((l) => l.textContent)).toEqual(
      scores.map((s) => s.label)
    );
    expect(document.querySelector('.zzz-bar-chart__axis--x')).toHaveTextContent('Correct answers');
    expect(document.querySelector('.zzz-bar-chart__axis--y')).toHaveTextContent('Players');
  });

  it('maps fills to data attributes, custom colours to a CSS variable', () => {
    render(
      <BarChart
        fill="rarity-s"
        data={[
          { label: 'A', value: 1 },
          { label: 'B', value: 1, color: 'rarity-a' },
          { label: 'C', value: 1, color: '#123456' },
        ]}
      />
    );
    const cols = document.querySelectorAll<HTMLElement>('.zzz-bar-chart__col');
    expect(cols[0]).toHaveAttribute('data-fill', 'rarity-s');
    expect(cols[1]).toHaveAttribute('data-fill', 'rarity-a');
    expect(cols[2]).toHaveAttribute('data-fill', 'custom');
    expect(cols[2].style.getPropertyValue('--zzz-bar-chart-fill')).toBe('#123456');
  });

  it('animates growth by default and can opt out', () => {
    const { rerender } = render(<BarChart data={scores} />);
    const fig = document.querySelector('figure')!;
    expect(fig).toHaveAttribute('data-animate', 'true');
    rerender(<BarChart data={scores} animate={false} />);
    expect(fig).toHaveAttribute('data-animate', 'false');
  });

  it('accepts a custom summary', () => {
    render(<BarChart data={scores} summary="Most players got 3 of 5." />);
    expect(screen.getByRole('img')).toHaveAccessibleName('Most players got 3 of 5.');
  });

  it('passes className, style, ref and native props to the figure', () => {
    const ref = createRef<HTMLElement>();
    render(<BarChart ref={ref} data={scores} className="c" style={{ marginTop: 5 }} data-x="1" height={200} />);
    const fig = document.querySelector('figure')!;
    expect(ref.current).toBe(fig);
    expect(fig).toHaveClass('c');
    expect(fig).toHaveAttribute('data-x', '1');
    expect(fig.style.marginTop).toBe('5px');
    expect(fig.style.getPropertyValue('--zzz-bar-chart-h')).toBe('200');
  });
});
