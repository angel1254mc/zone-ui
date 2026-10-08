import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { StatusGrid } from './StatusGrid';
import type { StatusGridItem } from './StatusGrid';

const quiz: StatusGridItem[] = [
  { status: 'success', label: 'Q1' },
  { status: 'error', label: 'Q2' },
  { status: 'warning', label: 'Q3' },
  { status: 'neutral', label: 'Q4' },
  { status: 'empty', label: 'Q5' },
];

describe('StatusGrid', () => {
  it('renders a labelled list with one item per cell', () => {
    render(<StatusGrid items={quiz} aria-label="Results" />);
    const list = screen.getByRole('list', { name: 'Results' });
    expect(list).toHaveClass('zzz-status-grid', 'zzz-status-grid--md');
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  });

  it('maps every status to a data attribute and an accessible word', () => {
    render(<StatusGrid items={quiz} aria-label="Results" />);
    const cells = document.querySelectorAll('.zzz-status-grid__cell');
    expect([...cells].map((c) => c.getAttribute('data-status'))).toEqual([
      'success',
      'error',
      'warning',
      'neutral',
      'empty',
    ]);
    expect(screen.getAllByRole('img').map((c) => c.getAttribute('aria-label'))).toEqual([
      'Q1: Success',
      'Q2: Error',
      'Q3: Warning',
      'Q4: Neutral',
      'Q5: Empty',
    ]);
  });

  it('accepts custom status words (e.g. Correct / Wrong)', () => {
    render(
      <StatusGrid
        aria-label="Quiz"
        items={[{ status: 'success' }, { status: 'error' }]}
        statusLabels={{ success: 'Correct', error: 'Wrong' }}
      />
    );
    expect(screen.getByRole('img', { name: '1: Correct' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '2: Wrong' })).toBeInTheDocument();
  });

  it('shows status glyphs by default (aria-hidden) and hides them with glyphs={false}', () => {
    const { rerender } = render(<StatusGrid items={quiz} aria-label="R" />);
    const glyphs = document.querySelectorAll('.zzz-status-grid__glyph');
    expect(glyphs.length).toBe(4); // empty has no glyph
    glyphs.forEach((g) => expect(g).toHaveAttribute('aria-hidden', 'true'));
    rerender(<StatusGrid items={quiz} aria-label="R" glyphs={false} />);
    expect(document.querySelectorAll('.zzz-status-grid__glyph')).toHaveLength(0);
  });

  it('renders visible captions, or keeps them screen-reader only with hideLabels', () => {
    const { rerender } = render(<StatusGrid items={quiz} aria-label="R" />);
    expect(document.querySelectorAll('.zzz-status-grid__caption')).toHaveLength(5);
    rerender(<StatusGrid items={quiz} aria-label="R" hideLabels />);
    expect(document.querySelectorAll('.zzz-status-grid__caption')).toHaveLength(0);
    expect(screen.getByRole('img', { name: 'Q1: Success' })).toBeInTheDocument();
  });

  it('supports sizes, a fixed column count and custom cell content', () => {
    render(<StatusGrid aria-label="R" size="lg" columns={7} items={[{ status: 'success', content: '12' }]} />);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('zzz-status-grid--lg', 'zzz-status-grid--columns');
    expect(list.style.getPropertyValue('--zzz-status-grid-columns')).toBe('7');
    expect(document.querySelector('.zzz-status-grid__cell')).toHaveTextContent('12');
  });

  it('marks the current cell with aria-current', () => {
    render(<StatusGrid aria-label="R" items={[{ status: 'success' }, { status: 'empty', current: true }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'true');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  it('makes cells with a tooltip focusable and opens the tooltip on focus', async () => {
    render(
      <StatusGrid
        aria-label="R"
        items={[
          {
            status: 'error',
            label: 'Mon',
            tooltip: 'Missed on Monday',
          },
        ]}
      />
    );
    const cell = document.querySelector('.zzz-status-grid__cell') as HTMLElement;
    expect(cell).toHaveAttribute('tabindex', '0');
    await act(async () => {
      fireEvent.focus(cell);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Missed on Monday');
    // cells without a tooltip are not tab stops
  });

  it('cells without a tooltip are not tab stops', () => {
    render(<StatusGrid aria-label="R" items={quiz} />);
    document.querySelectorAll('.zzz-status-grid__cell').forEach((c) => expect(c).not.toHaveAttribute('tabindex'));
  });

  it('passes className, style, ref and native props through', () => {
    const ref = createRef<HTMLUListElement>();
    render(<StatusGrid ref={ref} items={quiz} aria-label="R" className="x" style={{ marginTop: 4 }} data-k="1" />);
    const list = screen.getByRole('list');
    expect(ref.current).toBe(list);
    expect(list).toHaveClass('x');
    expect(list).toHaveAttribute('data-k', '1');
    expect(list.style.marginTop).toBe('4px');
  });
});
