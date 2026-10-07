import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CountdownBar } from './CountdownBar';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

const root = (c: HTMLElement) => c.querySelector('.zzz-countdown-bar') as HTMLElement;
const live = (c: HTMLElement) => c.querySelector('[aria-live="polite"]') as HTMLElement;

describe('CountdownBar', () => {
  it('renders a labelled progressbar with seconds semantics (self-driven)', () => {
    const { container } = render(<CountdownBar durationMs={30_000} />);
    const bar = screen.getByRole('progressbar', { name: 'Time remaining' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '30');
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuetext', '30 seconds left');
    expect(root(container)).toHaveAttribute('data-state', 'normal');
    expect(container.textContent).toContain('30s');
    advance(5000);
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(root(container).style.getPropertyValue('--zzz-countdown-f')).toBe(String(25 / 30));
  });

  it('enters warning at warnAt, critical at criticalAt, then expires once with the custom label', () => {
    const onExpire = vi.fn();
    const { container } = render(
      <CountdownBar durationMs={15_000} warnAt={10} criticalAt={3} onExpire={onExpire} expiredLabel="Too slow!" />
    );
    advance(4000);
    expect(root(container)).toHaveAttribute('data-state', 'normal');
    advance(1000);
    expect(root(container)).toHaveAttribute('data-state', 'warning');
    expect(live(container)).toHaveTextContent('10 seconds left');
    advance(7000);
    expect(root(container)).toHaveAttribute('data-state', 'critical');
    advance(3000);
    expect(root(container)).toHaveAttribute('data-state', 'expired');
    expect(container.textContent).toContain('Too slow!');
    expect(live(container)).toHaveTextContent('Too slow!');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Too slow!');
    advance(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('announces sparsely (not every tick)', () => {
    const { container } = render(<CountdownBar durationMs={20_000} />);
    advance(3000);
    expect(live(container)).toBeEmptyDOMElement();
    advance(7000); // 10 s left
    expect(live(container)).toHaveTextContent('10 seconds left');
    advance(1000); // 9 s: unchanged
    expect(live(container)).toHaveTextContent('10 seconds left');
  });

  it('running=false holds the time and marks paused', () => {
    const { container, rerender } = render(<CountdownBar durationMs={10_000} running={false} />);
    advance(4000);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
    expect(root(container)).toHaveAttribute('data-paused');
    rerender(<CountdownBar durationMs={10_000} running />);
    advance(4000);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '6');
    expect(root(container)).not.toHaveAttribute('data-paused');
  });

  it('controlled: follows fraction/secondsLeft props and never ticks on its own', () => {
    const onExpire = vi.fn();
    const { container, rerender } = render(<CountdownBar secondsLeft={12} durationMs={30_000} onExpire={onExpire} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '12');
    expect(root(container).style.getPropertyValue('--zzz-countdown-f')).toBe('0.4');
    advance(20_000);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '12');
    rerender(<CountdownBar secondsLeft={8} durationMs={30_000} />);
    expect(root(container)).toHaveAttribute('data-state', 'warning');
    rerender(<CountdownBar fraction={0.5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
    rerender(<CountdownBar fraction={0} />);
    expect(root(container)).toHaveAttribute('data-state', 'expired');
    expect(container.textContent).toContain("Time's up");
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('accepts warning/expired overrides, label, chevrons, size and passes className/style/ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container, rerender } = render(
      <CountdownBar
        ref={ref}
        fraction={0.7}
        warning
        chevrons
        size="lg"
        label="Cooldown"
        className="x"
        style={{ maxWidth: 10 }}
        showValue={false}
      />
    );
    expect(ref.current).toBe(root(container));
    expect(root(container)).toHaveClass('zzz-countdown-bar--lg', 'x');
    expect(root(container).style.maxWidth).toBe('10px');
    expect(root(container)).toHaveAttribute('data-state', 'warning');
    expect(container.querySelector('.zzz-countdown-bar__chevrons')).not.toBeNull();
    expect(container.querySelector('.zzz-countdown-bar__value')).toBeNull();
    expect(screen.getByRole('progressbar', { name: 'Cooldown' })).toBeInTheDocument();
    rerender(<CountdownBar fraction={0.7} expired />);
    expect(root(container)).toHaveAttribute('data-state', 'expired');
  });

  it('renders a full idle bar when given nothing to count', () => {
    const { container } = render(<CountdownBar />);
    expect(root(container)).toHaveAttribute('data-state', 'normal');
    expect(root(container).style.getPropertyValue('--zzz-countdown-f')).toBe('1');
  });

  it('formats minutes and custom values', () => {
    const { container, rerender } = render(<CountdownBar secondsLeft={95} />);
    expect(container.textContent).toContain('1:35');
    rerender(<CountdownBar secondsLeft={5} formatValue={(s) => `${s} sec`} />);
    expect(container.textContent).toContain('5 sec');
  });

  it('idle (nothing to count) never fires onExpire; starts once durationMs arrives', () => {
    const onExpire = vi.fn();
    const { container, rerender } = render(<CountdownBar onExpire={onExpire} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onExpire).toHaveBeenCalledTimes(0);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'normal');
    expect(container.firstElementChild).not.toHaveAttribute('data-paused');
    rerender(<CountdownBar durationMs={2000} onExpire={onExpire} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onExpire).toHaveBeenCalledTimes(0);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'expired');
  });
});

// Vitest runs with css: false, so the size rules are checked as text.
const countdownCss = readFileSync(resolve(__dirname, 'CountdownBar.css'), 'utf8');

describe('CountdownBar sizes', () => {
  it('defaults to md', () => {
    const { container } = render(<CountdownBar fraction={0.5} />);
    expect(container.firstElementChild).toHaveClass('zzz-countdown-bar--md');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" sets the class + data-size and keeps the progressbar', (size) => {
    const { container } = render(<CountdownBar durationMs={30_000} secondsLeft={12} size={size} />);
    expect(container.firstElementChild).toHaveClass(`zzz-countdown-bar--${size}`);
    expect(container.firstElementChild).toHaveAttribute('data-size', size);
    expect(screen.getByRole('progressbar', { name: 'Time remaining' })).toHaveAttribute('aria-valuenow', '12');
  });

  it('sizes the readout with the control label tokens (21 / 26 / 30 design units)', () => {
    for (const size of ['sm', 'md', 'lg']) expect(countdownCss).toContain(`var(--zzz-font-size-control-${size})`);
  });
});
