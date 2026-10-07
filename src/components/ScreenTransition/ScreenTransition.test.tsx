import { act, render, screen } from '@testing-library/react';
import { ScreenFade, ScreenTransition, SCREEN_TIMING, tileStagger, useScreenEntered } from './ScreenTransition';

function Probe({ name }: { name: string }) {
  const entered = useScreenEntered();
  return (
    <div>
      <h2>{name}</h2>
      <span data-testid={`entered-${name}`}>{String(entered)}</span>
    </div>
  );
}

const root = () => document.querySelector('.zzz-screen-transition') as HTMLElement;
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe('ScreenTransition', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the current screen idle and entered', () => {
    render(
      <ScreenTransition screenKey="a">
        <Probe name="A" />
      </ScreenTransition>
    );
    expect(root()).toHaveAttribute('data-phase', 'idle');
    expect(screen.getByTestId('entered-A')).toHaveTextContent('true');
  });

  it('cut: keeps the old screen through fade-out + hold, then cuts, focuses the heading and calls onDone', () => {
    const onDone = vi.fn();
    const { rerender } = render(
      <ScreenTransition screenKey="a" onDone={onDone}>
        <Probe name="A" />
      </ScreenTransition>
    );
    rerender(
      <ScreenTransition screenKey="b" onDone={onDone}>
        <Probe name="B" />
      </ScreenTransition>
    );
    expect(root()).toHaveAttribute('data-phase', 'out');
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.getByTestId('entered-A')).toHaveTextContent('false');
    advance(SCREEN_TIMING.out);
    expect(root()).toHaveAttribute('data-phase', 'hold');
    advance(SCREEN_TIMING.hold);
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.getByRole('heading', { name: 'B' })).toHaveFocus();
    expect(root()).toHaveAttribute('data-phase', 'idle');
    expect(onDone).toHaveBeenCalledWith('b');
  });

  it('fadeThroughBlack fades back in over 300 ms; hold is configurable', () => {
    const { rerender } = render(
      <ScreenTransition screenKey="a" mode="fadeThroughBlack" hold={500}>
        <Probe name="A" />
      </ScreenTransition>
    );
    rerender(
      <ScreenTransition screenKey="b" mode="fadeThroughBlack" hold={500}>
        <Probe name="B" />
      </ScreenTransition>
    );
    advance(SCREEN_TIMING.out + 499);
    expect(screen.getByText('A')).toBeInTheDocument();
    advance(1);
    expect(root()).toHaveAttribute('data-phase', 'in');
    expect(screen.getByTestId('entered-B')).toHaveTextContent('true');
    advance(SCREEN_TIMING.in);
    expect(root()).toHaveAttribute('data-phase', 'idle');
  });

  it('blurThrough blurs the old screen for ~100 ms then cuts (variant alias)', () => {
    const { rerender } = render(
      <ScreenTransition screenKey="a" variant="blurThrough">
        <Probe name="A" />
      </ScreenTransition>
    );
    rerender(
      <ScreenTransition screenKey="b" variant="blurThrough">
        <Probe name="B" />
      </ScreenTransition>
    );
    expect(root()).toHaveAttribute('data-mode', 'blurThrough');
    expect(root()).toHaveAttribute('data-phase', 'blur');
    advance(SCREEN_TIMING.blur);
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('A')).toBeNull();
  });

  it('fadeFromBlack swaps at once and fades in', () => {
    const { rerender } = render(
      <ScreenTransition screenKey="a" mode="fadeFromBlack">
        <Probe name="A" />
      </ScreenTransition>
    );
    rerender(
      <ScreenTransition screenKey="b" mode="fadeFromBlack">
        <Probe name="B" />
      </ScreenTransition>
    );
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(root()).toHaveAttribute('data-phase', 'in');
  });

  it('reduced motion cross-fades in 100 ms with the old layer inert', () => {
    const { rerender } = render(
      <ScreenTransition screenKey="a" reducedMotion>
        <Probe name="A" />
      </ScreenTransition>
    );
    rerender(
      <ScreenTransition screenKey="b" reducedMotion>
        <Probe name="B" />
      </ScreenTransition>
    );
    expect(root()).toHaveAttribute('data-phase', 'xfade');
    expect(screen.getByText('A').closest('.zzz-screen-transition__layer')).toHaveAttribute('inert');
    expect(screen.getByText('B')).toBeInTheDocument();
    advance(SCREEN_TIMING.reduced);
    expect(screen.queryByText('A')).toBeNull();
  });

  it('appear fades the first screen in from black', () => {
    render(
      <ScreenTransition screenKey="a" appear>
        <Probe name="A" />
      </ScreenTransition>
    );
    expect(root()).toHaveAttribute('data-phase', 'in');
    advance(SCREEN_TIMING.in);
    expect(root()).toHaveAttribute('data-phase', 'idle');
  });
});

describe('tileStagger', () => {
  it('returns the tile class and index var', () => {
    expect(tileStagger(3)).toEqual({
      className: 'zzz-stagger-tile',
      style: { '--i': '3' },
    });
    expect(tileStagger(1, { slow: true }).className).toBe('zzz-stagger-tile zzz-stagger-tile--slow');
  });
});

describe('ScreenFade', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fades to black, reports it, and clears with a cut or a fade', () => {
    const onDone = vi.fn();
    const { container, rerender } = render(<ScreenFade active={false} onDone={onDone} />);
    const veil = container.firstElementChild!;
    expect(veil).toHaveAttribute('aria-hidden', 'true');
    expect(veil).toHaveAttribute('data-state', 'clear');
    rerender(<ScreenFade active onDone={onDone} />);
    expect(veil).toHaveAttribute('data-state', 'toBlack');
    advance(SCREEN_TIMING.out);
    expect(veil).toHaveAttribute('data-state', 'black');
    expect(onDone).toHaveBeenLastCalledWith('black');
    rerender(<ScreenFade active={false} exit="fade" onDone={onDone} />);
    expect(veil).toHaveAttribute('data-state', 'fromBlack');
    advance(SCREEN_TIMING.in);
    expect(onDone).toHaveBeenLastCalledWith('clear');
  });
});
