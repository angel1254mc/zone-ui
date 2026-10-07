import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, getPaginationItems } from './index';

describe('getPaginationItems', () => {
  it('lists 1 2 3 4 5 … 175 at page 1 of 175', () => {
    expect(getPaginationItems(1, 175)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 175]);
  });
  it('shows both ellipses in the middle', () => {
    expect(getPaginationItems(50, 175)).toEqual([1, 'ellipsis-start', 49, 50, 51, 'ellipsis-end', 175]);
  });
  it('lists every page when they fit', () => {
    expect(getPaginationItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationItems(1, 1)).toEqual([1]);
  });
  it('handles the end', () => {
    expect(getPaginationItems(175, 175)).toEqual([1, 'ellipsis-start', 171, 172, 173, 174, 175]);
  });
});

describe('Pagination', () => {
  it('renders a navigation landmark with the current page marked', () => {
    render(<Pagination count={175} defaultPage={1} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toHaveClass('zzz-pagination');
    expect(nav).toHaveAttribute('data-skin', 'web');
    const current = within(nav).getByRole('button', { name: 'Page 1' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('button', { name: 'Page 175' })).not.toHaveAttribute('aria-current');
    expect(within(nav).getByRole('button', { name: 'Previous page' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(nav).getByRole('button', { name: 'Next page' })).not.toHaveAttribute('aria-disabled');
    expect(nav.querySelectorAll('.zzz-pagination__ellipsis')).toHaveLength(1);
  });

  it('changes page (uncontrolled) via numbers and prev/next', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange.mock.calls.map((c) => c[0])).toEqual([3, 4, 3]);
  });

  it('does not go past the ends', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={3} defaultPage={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('is operable with the keyboard', async () => {
    render(<Pagination count={5} />);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('is controllable', async () => {
    function Controlled() {
      const [page, setPage] = useState(5);
      return (
        <>
          <Pagination count={20} page={page} onPageChange={setPage} />
          <output>{page}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('status')).toHaveTextContent('6');
    expect(screen.getByRole('button', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders links when getPageHref is given', () => {
    render(<Pagination count={3} defaultPage={2} getPageHref={(p) => `?page=${p}`} />);
    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '?page=3');
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '?page=3');
  });

  it('keeps focus on Next when stepping to the last page in link mode', async () => {
    render(<Pagination count={4} defaultPage={2} getPageHref={(p) => `#page-${p}`} />);
    const next = screen.getByRole('link', { name: 'Next page' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    const inactiveNext = screen.getByRole('link', { name: 'Next page' });
    expect(inactiveNext).toHaveAttribute('aria-disabled', 'true');
    expect(inactiveNext).not.toHaveAttribute('href');
    expect(inactiveNext).toHaveAttribute('tabindex', '0');
    expect(inactiveNext).toHaveFocus();
    // Enter on the inactive end does nothing.
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the inactive Previous link in the tab order', async () => {
    render(<Pagination count={3} getPageHref={(p) => `#page-${p}`} />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveFocus();
  });

  it('disables every control when disabled', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} disabled onPageChange={onPageChange} />);
    for (const b of screen.getAllByRole('button')) expect(b).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('supports skin, custom labels and pass-through props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        count={4}
        skin="game"
        aria-label="News pages"
        prevLabel="Back"
        nextLabel="Forward"
        getPageLabel={(p) => `Go to ${p}`}
        className="extra"
        data-testid="p"
      />
    );
    const nav = screen.getByTestId('p');
    expect(ref.current).toBe(nav);
    expect(nav).toHaveAccessibleName('News pages');
    expect(nav).toHaveAttribute('data-skin', 'game');
    expect(nav).toHaveClass('extra');
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to 4' })).toBeInTheDocument();
  });
});

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
  const css = readFileSync(resolve(process.cwd(), 'src/components/Pagination/Pagination.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  const pxDecls = css
    .split(/[;{}]/)
    .map((s) => s.trim())
    .filter((s) => s.includes('var(--zzz-px)'));
  return { css, pxDecls };
}

describe('Pagination size', () => {
  it('defaults to md and reflects size on data-size', () => {
    const { rerender } = render(<Pagination count={10} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-size', 'md');
    rerender(<Pagination count={10} size="sm" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-size', 'sm');
    rerender(<Pagination count={10} size="lg" skin="game" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-size', 'lg');
  });

  it('routes every stylesheet length through the size unit', () => {
    const { css, pxDecls } = sizeUnitCss();
    expect(css).toMatch(/\[data-size='sm'\]/);
    expect(css).toMatch(/\[data-size='lg'\]/);
    for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/);
  });
});
