import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WebTabs } from './index';
import type { WebTabsItem } from './index';

const items: WebTabsItem[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'news', label: 'News' },
  { value: 'notices', label: 'Notices' },
  { value: 'events', label: 'Events' },
];

describe('WebTabs', () => {
  it('renders a tablist with the selected tab marked', () => {
    render(<WebTabs aria-label="News categories" items={items} defaultValue="news" />);
    const list = screen.getByRole('tablist', { name: 'News categories' });
    expect(list).toHaveClass('zzz-web-tabs');
    expect(list).toHaveAttribute('data-skin', 'web');
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false', 'false']);
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1, -1]);
    expect(tabs[2]).toHaveAccessibleName('Notices');
  });

  it('selects on click (uncontrolled) and reports the change', async () => {
    const onValueChange = vi.fn();
    render(<WebTabs items={items} onValueChange={onValueChange} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(tabs[3]);
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledWith('events');
  });

  it('moves with arrow keys, wraps, and supports Home/End', async () => {
    render(<WebTabs items={items} />);
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[3]).toHaveFocus();
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
  });

  it('is controllable', async () => {
    function Controlled() {
      const [value, setValue] = useState('notices');
      return (
        <>
          <WebTabs items={items} value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('tab', { name: 'Latest' }));
    expect(screen.getByRole('status')).toHaveTextContent('latest');
    expect(screen.getByRole('tab', { name: 'Latest' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores a fixed value without onValueChange', async () => {
    render(<WebTabs items={items} value="news" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Events' }));
    expect(screen.getByRole('tab', { name: 'News' })).toHaveAttribute('aria-selected', 'true');
  });

  it('skips and ignores disabled tabs', async () => {
    const onValueChange = vi.fn();
    render(<WebTabs items={[items[0], { ...items[1], disabled: true }, items[2]]} onValueChange={onValueChange} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(tabs[1]);
    expect(onValueChange).not.toHaveBeenCalled();
    tabs[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
  });

  it('supports the game skin, width and pass-through props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <WebTabs
        ref={ref}
        items={items}
        skin="game"
        width={900}
        className="extra"
        style={{ margin: 3 }}
        data-testid="t"
      />
    );
    const list = screen.getByTestId('t');
    expect(ref.current).toBe(list);
    expect(list).toHaveAttribute('data-skin', 'game');
    expect(list).toHaveClass('zzz-web-tabs', 'zzz-mat-pill', 'extra');
    expect(list.style.getPropertyValue('--zzz-web-tabs-width')).toBe('calc(900 * var(--zzz-px))');
    expect(list.style.margin).toBe('3px');
  });

  it('defaults the width to 40 + 195 per tab', () => {
    render(<WebTabs items={items} data-testid="t" />);
    expect(screen.getByTestId('t').style.getPropertyValue('--zzz-web-tabs-width')).toBe(
      'calc(820 * var(--zzz-web-tabs-u))'
    );
  });
});

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
  const css = readFileSync(resolve(process.cwd(), 'src/components/WebTabs/WebTabs.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  const pxDecls = css
    .split(/[;{}]/)
    .map((s) => s.trim())
    .filter((s) => s.includes('var(--zzz-px)'));
  return { css, pxDecls };
}

describe('WebTabs size', () => {
  it('defaults to md and reflects size on data-size (both skins)', () => {
    const { rerender } = render(<WebTabs aria-label="News" items={items} />);
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'md');
    rerender(<WebTabs aria-label="News" items={items} size="sm" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'sm');
    rerender(<WebTabs aria-label="News" items={items} size="lg" skin="game" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'lg');
  });
  it('scales the default width with the size unit; an explicit width stays literal', () => {
    const { rerender } = render(<WebTabs aria-label="News" items={items} size="lg" />);
    expect(screen.getByRole('tablist').style.getPropertyValue('--zzz-web-tabs-width')).toContain(
      'var(--zzz-web-tabs-u)'
    );
    rerender(<WebTabs aria-label="News" items={items} size="lg" width={500} />);
    expect(screen.getByRole('tablist').style.getPropertyValue('--zzz-web-tabs-width')).toBe(
      'calc(500 * var(--zzz-px))'
    );
  });

  it('routes every stylesheet length through the size unit', () => {
    const { css, pxDecls } = sizeUnitCss();
    expect(css).toMatch(/\[data-size='sm'\]/);
    expect(css).toMatch(/\[data-size='lg'\]/);
    for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/);
  });
});
