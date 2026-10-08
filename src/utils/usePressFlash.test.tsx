import { act, fireEvent, render, screen } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { usePressFlash, type UsePressFlashOptions } from './usePressFlash';

function Probe(props: UsePressFlashOptions) {
  const press = usePressFlash(props);
  return (
    <button type="button" {...press}>
      Craft
    </button>
  );
}

describe('usePressFlash', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('is not pressed initially', () => {
    render(<Probe />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-pressed');
  });

  it('flashes data-pressed for 100 ms on Enter', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('data-pressed');
    act(() => vi.advanceTimersByTime(99));
    expect(button).toHaveAttribute('data-pressed');
    act(() => vi.advanceTimersByTime(1));
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('keeps the flash for its full duration even if Enter is released early', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });
    expect(button).toHaveAttribute('data-pressed');
    act(() => vi.advanceTimersByTime(100));
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('restarts the flash on a repeated Enter', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    act(() => vi.advanceTimersByTime(80));
    fireEvent.keyDown(button, { key: 'Enter' });
    act(() => vi.advanceTimersByTime(80));
    expect(button).toHaveAttribute('data-pressed');
    act(() => vi.advanceTimersByTime(20));
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('honours a custom flash duration', () => {
    render(<Probe duration={250} />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    act(() => vi.advanceTimersByTime(200));
    expect(button).toHaveAttribute('data-pressed');
    act(() => vi.advanceTimersByTime(50));
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('shows data-pressed while Space is held', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });
    act(() => vi.advanceTimersByTime(1000));
    expect(button).toHaveAttribute('data-pressed');
    fireEvent.keyUp(button, { key: ' ' });
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('releases a held Space when focus leaves', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.blur(button);
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('ignores other keys', () => {
    render(<Probe />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'a' });
    fireEvent.keyDown(button, { key: 'Tab' });
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('does nothing when disabled', () => {
    render(<Probe disabled />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).not.toHaveAttribute('data-pressed');
  });

  it('chains the caller key handlers and respects preventDefault', () => {
    const onKeyDown = vi.fn((e: KeyboardEvent) => e.key === 'Enter' && e.preventDefault());
    const onKeyUp = vi.fn();
    render(<Probe onKeyDown={onKeyDown} onKeyUp={onKeyUp} />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(button).not.toHaveAttribute('data-pressed');
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyUp(button, { key: ' ' });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
  });

  it('clears its timer on unmount', () => {
    const { unmount } = render(<Probe />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
