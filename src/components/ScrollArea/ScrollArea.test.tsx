import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ScrollArea,
  thumbMetrics,
  SCROLL_CAP_UP_PATH,
  SCROLL_CAP_DOWN_PATH,
  SCROLL_REPEAT_DELAY,
  SCROLL_REPEAT_INTERVAL,
  SCROLL_RUN_INSET,
  type ScrollAreaProps,
} from './ScrollArea';

function fake(el: HTMLElement, box: { ch?: number; sh?: number; cw?: number; sw?: number }) {
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    value: box.ch ?? 200,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    value: box.sh ?? 200,
  });
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    value: box.cw ?? 300,
  });
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    value: box.sw ?? 300,
  });
}

function setup(props: Partial<ScrollAreaProps> = {}, box: Parameters<typeof fake>[1] = { ch: 200, sh: 1000 }) {
  const utils = render(
    <ScrollArea label="Items" {...props}>
      <div style={{ height: 1000 }}>content</div>
    </ScrollArea>
  );
  const viewport = screen.getByRole('region', { name: 'Items' });
  // jsdom has no layout: fake a 200 px viewport over 1000 px of content, then resync
  fake(viewport, box);
  fireEvent.scroll(viewport);
  const bars = utils.container.querySelectorAll<HTMLElement>('.zzz-scroll-area__bar');
  return {
    ...utils,
    viewport,
    bar: bars[0],
    bars,
    root: utils.container.firstElementChild as HTMLElement,
  };
}

describe('thumbMetrics', () => {
  it('sizes the thumb to the visible fraction and places it by progress', () => {
    const m = thumbMetrics(200, 1000, 400, 500);
    expect(m.size).toBe(0.2);
    expect(m.progress).toBe(0.5);
    expect(m.length).toBe(100);
    expect(m.offset).toBe(200); // == run * pos / scroll (500 * 400 / 1000)
    expect(m.overflow).toBe(true);
  });
  it('clamps to the minimum length and keeps the thumb inside the run', () => {
    const m = thumbMetrics(100, 100000, 99900, 500, 20);
    expect(m.length).toBe(20);
    expect(m.offset).toBe(480);
  });
  it('fills the run when the content fits', () => {
    const m = thumbMetrics(300, 300, 0, 500, 20);
    expect(m).toMatchObject({
      size: 1,
      progress: 0,
      length: 500,
      offset: 0,
      overflow: false,
    });
    expect(thumbMetrics(0, 0, 0).size).toBe(1);
  });
});

describe('ScrollArea', () => {
  it('renders a focusable, named native scroll viewport and an aria-hidden bar', () => {
    const { viewport, bar } = setup();
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport).toHaveClass('zzz-scroll-area__viewport');
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar.querySelectorAll('.zzz-scroll-area__arrow')).toHaveLength(2);
    expect(bar.querySelector('.zzz-scroll-area__thumb')).not.toBeNull();
  });

  it('draws the arrow caps as a bullet shape (tip, vertical-sided base) in a 9 x 8 box', () => {
    const { bar } = setup();
    const up = bar.querySelector('.zzz-scroll-area__arrow--up')!;
    const down = bar.querySelector('.zzz-scroll-area__arrow--down')!;
    expect(up.getAttribute('viewBox')).toBe('0 0 9 8');
    expect(up.querySelector('path')!.getAttribute('d')).toBe(SCROLL_CAP_UP_PATH);
    expect(down.querySelector('path')!.getAttribute('d')).toBe(SCROLL_CAP_DOWN_PATH);
    // pentagon: 5 vertices, two of them at the same y (the shoulders) above the flat base
    expect(SCROLL_CAP_UP_PATH.match(/[\d.]+ [\d.]+/g)).toHaveLength(5);
  });

  it('viewportTabIndex overrides the tab stop', () => {
    render(<ScrollArea viewportTabIndex={-1}>x</ScrollArea>);
    expect(document.querySelector('.zzz-scroll-area__viewport')).toHaveAttribute('tabindex', '-1');
  });

  it('has no region role without a label', () => {
    render(<ScrollArea>x</ScrollArea>);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('routes native aria-label / aria-labelledby to the focusable viewport (role region), not the root', () => {
    const { container, rerender } = render(<ScrollArea aria-label="Inventory">x</ScrollArea>);
    const root = container.firstElementChild as HTMLElement;
    const region = screen.getByRole('region', { name: 'Inventory' });
    expect(region).toHaveClass('zzz-scroll-area__viewport');
    expect(root).not.toHaveAttribute('aria-label');
    rerender(
      <>
        <h2 id="t">Discs</h2>
        <ScrollArea aria-labelledby="t">x</ScrollArea>
      </>
    );
    const labelled = screen.getByRole('region', { name: 'Discs' });
    expect(labelled).toHaveClass('zzz-scroll-area__viewport');
    expect(container.querySelector('.zzz-scroll-area')).not.toHaveAttribute('aria-labelledby');
    // the custom `label` prop wins over a native aria-label
    rerender(
      <ScrollArea label="A" aria-label="B">
        x
      </ScrollArea>
    );
    expect(screen.getByRole('region', { name: 'A' })).toBeInTheDocument();
  });

  it('does not tag the auto hint with an unused class', () => {
    const { container } = render(
      <ScrollArea variant="panel" hint>
        x
      </ScrollArea>
    );
    expect(container.querySelector('.zzz-scroll-area__hint')).toBeNull();
    expect(container.querySelector('.zzz-scroll-hint')).not.toBeNull();
  });

  it('is reachable with the keyboard and keeps native keyboard scrolling', async () => {
    const user = userEvent.setup();
    const { viewport } = setup();
    await user.tab();
    expect(viewport).toHaveFocus();
    // no keydown handler swallows the keys: the browser's native scrolling handles them
    const ev = new KeyboardEvent('keydown', {
      key: 'PageDown',
      bubbles: true,
      cancelable: true,
    });
    viewport.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('syncs the thumb to the scroll position', () => {
    const { viewport, bar, root } = setup();
    viewport.scrollTop = 400;
    fireEvent.scroll(viewport);
    expect(bar.style.getPropertyValue('--zzz-thumb-size')).toBe('0.2');
    expect(bar.style.getPropertyValue('--zzz-thumb-start')).toBe('');
    expect(bar.style.getPropertyValue('--zzz-thumb-progress')).toBe('0.5');
    expect(bar).toHaveAttribute('data-overflow');
    expect(root).toHaveAttribute('data-more-up');
    expect(root).toHaveAttribute('data-more-down');
    viewport.scrollTop = 800;
    fireEvent.scroll(viewport);
    expect(root).not.toHaveAttribute('data-more-down');
  });

  it('arrow caps step the viewport', () => {
    const { viewport, bar } = setup({ step: 50 });
    viewport.scrollTop = 100;
    fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--down')!, { button: 0 });
    fireEvent.pointerUp(bar);
    expect(viewport.scrollTop).toBe(150);
    fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--up')!, {
      button: 0,
    });
    fireEvent.pointerUp(bar);
    expect(viewport.scrollTop).toBe(100);
  });

  it('default arrow step is 25 % of the viewport (min 40)', () => {
    const { viewport, bar } = setup();
    fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--down')!, { button: 0 });
    fireEvent.pointerUp(bar);
    expect(viewport.scrollTop).toBe(50);
  });

  it('holding an arrow cap repeats until release', () => {
    vi.useFakeTimers();
    try {
      const { viewport, bar } = setup({ step: 10 });
      fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--down')!, { button: 0, pointerId: 1 });
      expect(viewport.scrollTop).toBe(10);
      act(() => vi.advanceTimersByTime(SCROLL_REPEAT_DELAY - 1));
      expect(viewport.scrollTop).toBe(10);
      act(() => vi.advanceTimersByTime(1 + SCROLL_REPEAT_INTERVAL * 3));
      expect(viewport.scrollTop).toBe(40);
      fireEvent.pointerUp(bar, { pointerId: 1 });
      act(() => vi.advanceTimersByTime(SCROLL_REPEAT_INTERVAL * 5));
      expect(viewport.scrollTop).toBe(40);
    } finally {
      vi.useRealTimers();
    }
  });

  it('dragging the thumb maps pointer travel onto the scrollable distance', () => {
    const { viewport, bar } = setup();
    const thumb = bar.querySelector<HTMLElement>('.zzz-scroll-area__thumb')!;
    // bar 20 x 200: run = 200 - 2 * 23 = 154; thumb = 154 * 0.2 = 30.8; free = 123.2; ratio = 800 / 123.2
    bar.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: 20,
      height: 200,
      right: 20,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON() {},
    });
    thumb.getBoundingClientRect = () => ({
      top: 23,
      left: 8,
      width: 4,
      height: 30.8,
      right: 12,
      bottom: 53.8,
      x: 8,
      y: 23,
      toJSON() {},
    });
    fireEvent.pointerDown(thumb, { button: 0, pointerId: 7, clientY: 30 });
    expect(bar).toHaveAttribute('data-dragging');
    fireEvent.pointerMove(bar, { pointerId: 7, clientY: 30 + 61.6 });
    expect(viewport.scrollTop).toBeCloseTo(400, 5);
    fireEvent.pointerUp(bar, { pointerId: 7 });
    expect(bar).not.toHaveAttribute('data-dragging');
    fireEvent.pointerMove(bar, { pointerId: 7, clientY: 200 });
    expect(viewport.scrollTop).toBeCloseTo(400, 5);
    expect(2 * SCROLL_RUN_INSET).toBe(46);
  });

  it('clicking the track pages towards the pointer', () => {
    const { viewport, bar } = setup();
    const thumb = bar.querySelector<HTMLElement>('.zzz-scroll-area__thumb')!;
    thumb.getBoundingClientRect = () => ({
      top: 23,
      left: 8,
      width: 4,
      height: 30,
      right: 12,
      bottom: 53,
      x: 8,
      y: 23,
      toJSON() {},
    });
    fireEvent.pointerDown(bar, { button: 0, clientY: 150 });
    expect(viewport.scrollTop).toBe(180);
  });

  it('ignores non-primary buttons', () => {
    const { viewport, bar } = setup({ step: 50 });
    fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--down')!, { button: 2 });
    expect(viewport.scrollTop).toBe(0);
  });

  it.each(['left', 'right'] as const)('side %s sets its modifier and default gap', (side) => {
    const { container } = render(<ScrollArea side={side}>x</ScrollArea>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass(`zzz-scroll-area--${side}`);
    expect(root.style.getPropertyValue('--zzz-scroll-gap')).toBe(side === 'left' ? '14' : '34');
  });

  it('keeps the bar when the content fits by default; alwaysShow={false} opts into hiding it', () => {
    const fits = setup({}, { ch: 200, sh: 200 });
    expect(fits.bar).not.toHaveAttribute('data-overflow');
    expect(fits.root).not.toHaveClass('zzz-scroll-area--auto-hide');
    fits.unmount();
    const hide = setup({ alwaysShow: false }, { ch: 200, sh: 200 });
    expect(hide.root).toHaveClass('zzz-scroll-area--auto-hide');
    expect(hide.bar).not.toHaveAttribute('data-overflow');
  });

  it('horizontal: one horizontal bar at the bottom that steps scrollLeft', () => {
    const { viewport, bars, root } = setup({ orientation: 'horizontal', step: 30 }, { cw: 300, sw: 900 });
    expect(bars).toHaveLength(1);
    const bar = bars[0];
    expect(bar).toHaveClass('zzz-scroll-area__bar--horizontal');
    expect(root).toHaveClass('zzz-scroll-area--horizontal', 'zzz-scroll-area--bottom');
    expect(root.style.getPropertyValue('--zzz-scroll-gap')).toBe('14');
    expect(bar.style.getPropertyValue('--zzz-thumb-size')).toBe(String(1 / 3));
    fireEvent.pointerDown(bar.querySelector('.zzz-scroll-area__arrow--down')!, { button: 0 });
    fireEvent.pointerUp(bar);
    expect(viewport.scrollLeft).toBe(30);
    expect(viewport.scrollTop).toBe(0);
    fireEvent.scroll(viewport);
    expect(root).toHaveAttribute('data-more-right');
    expect(root).toHaveAttribute('data-more-left');
  });

  it('horizontal side top and both orientations', () => {
    const { container, rerender } = render(
      <ScrollArea orientation="horizontal" side="top">
        x
      </ScrollArea>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('zzz-scroll-area--top');
    rerender(
      <ScrollArea orientation="both" side="left" horizontalSide="top">
        x
      </ScrollArea>
    );
    expect(root).toHaveClass('zzz-scroll-area--both', 'zzz-scroll-area--left', 'zzz-scroll-area--h-top');
    expect(root.querySelectorAll('.zzz-scroll-area__bar')).toHaveLength(2);
    expect(root.querySelector('.zzz-scroll-area__corner')).toHaveAttribute('aria-hidden', 'true');
  });

  it('panel and list variants draw no bar; hint renders an auto ScrollHint', () => {
    const { root, container, viewport } = setup({
      variant: 'panel',
      hint: true,
    });
    expect(container.querySelector('.zzz-scroll-area__bar')).toBeNull();
    expect(root).toHaveClass('zzz-scroll-area--panel');
    const hint = container.querySelector('.zzz-scroll-hint')!;
    expect(hint).toHaveAttribute('aria-hidden', 'true');
    expect(hint).toHaveClass('zzz-scroll-hint--down', 'zzz-scroll-hint--panel');
    // the hint subscribed to the viewport: scroll to the end and it hides
    viewport.scrollTop = 800;
    fireEvent.scroll(viewport);
    expect(hint).toHaveAttribute('data-visible', 'false');
  });

  it('list variant uses the small triangle; horizontal list a chevron', () => {
    const { container, rerender } = render(
      <ScrollArea variant="list" hint>
        x
      </ScrollArea>
    );
    expect(container.querySelector('.zzz-scroll-hint')).toHaveClass('zzz-scroll-hint--list');
    rerender(
      <ScrollArea variant="list" orientation="horizontal" hint>
        x
      </ScrollArea>
    );
    expect(container.querySelector('.zzz-scroll-hint')).toHaveClass(
      'zzz-scroll-hint--right',
      'zzz-scroll-hint--chevron'
    );
  });

  it('forwards onScroll from the viewport', () => {
    const onScroll = vi.fn();
    const { viewport } = setup({ onScroll });
    fireEvent.scroll(viewport);
    expect(onScroll).toHaveBeenCalled();
  });

  it('passes props, className, style, ref and viewportRef through', () => {
    const ref = createRef<HTMLDivElement>();
    const vref = createRef<HTMLDivElement>();
    render(
      <ScrollArea
        ref={ref}
        viewportRef={vref}
        className="x"
        style={{ height: 300 }}
        gap={20}
        data-testid="s"
        viewportClassName="vp"
      >
        x
      </ScrollArea>
    );
    const el = screen.getByTestId('s');
    expect(ref.current).toBe(el);
    expect(vref.current).toHaveClass('zzz-scroll-area__viewport', 'vp');
    expect(el).toHaveClass('x');
    expect(el.style.height).toBe('300px');
    expect(el.style.getPropertyValue('--zzz-scroll-gap')).toBe('20');
  });
});
