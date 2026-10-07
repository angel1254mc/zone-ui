import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import type { ToastApi } from './ToastProvider';

let api: ToastApi;
function Grab() {
  api = useToast();
  return null;
}
function setup(props: Parameters<typeof ToastProvider>[0] = {}) {
  render(
    <ToastProvider {...props}>
      <Grab />
    </ToastProvider>
  );
}
const list = () => screen.getByRole('region', { name: 'Notifications' }).querySelector('ol')!;

describe('Toast', () => {
  it('renders a status pill with an icon disc per variant', () => {
    const { container, rerender } = render(<Toast>Saved</Toast>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'info');
    expect(container.querySelector('.zzz-toast__disc')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Toast variant="error">Failed</Toast>);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    rerender(<Toast icon={null}>No disc</Toast>);
    expect(container.querySelector('.zzz-toast__disc')).toBeNull();
  });

  it('renders a dismiss button when onDismiss is given', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Toast onDismiss={onDismiss} dismissLabel="Close">
        Hi
      </Toast>
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe('ToastProvider / useToast', () => {
  afterEach(() => vi.useRealTimers());

  it('mounts an aria-live polite region before any toast', () => {
    setup();
    expect(list()).toHaveAttribute('aria-live', 'polite');
    expect(list().children).toHaveLength(0);
  });

  it('queues toasts, shows at most `max`, and auto-dismisses', () => {
    vi.useFakeTimers();
    setup({ duration: 1000, max: 2 });
    act(() => {
      api.toast('one');
      api.toast({ message: 'two', variant: 'success' });
      api.toast({ message: 'three', variant: 'error' });
    });
    expect(within(list()).getByText('one')).toBeInTheDocument();
    expect(within(list()).getByText('two')).toBeInTheDocument();
    expect(within(list()).queryByText('three')).toBeNull();
    // info/success rely on the live list; error is an alert
    expect(within(list()).queryAllByRole('status')).toHaveLength(0);
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(210));
    expect(within(list()).queryByText('one')).toBeNull();
    expect(within(list()).getByRole('alert')).toHaveTextContent('three');
  });

  it('dismiss(id), dismiss() and the close button', () => {
    vi.useFakeTimers();
    setup({ duration: 0 });
    let id = '';
    act(() => {
      id = api.toast('sticky');
      api.toast('other');
    });
    act(() => vi.advanceTimersByTime(10000));
    expect(list().children).toHaveLength(2);
    act(() => api.dismiss(id));
    expect(list().children[0]).toHaveAttribute('data-state', 'closing');
    act(() => vi.advanceTimersByTime(210));
    expect(list().children).toHaveLength(1);
    fireEvent.click(within(list()).getByRole('button', { name: 'Dismiss' }));
    act(() => vi.advanceTimersByTime(210));
    expect(list().children).toHaveLength(0);
    act(() => {
      api.toast('a');
      api.toast('b');
    });
    act(() => api.dismiss());
    act(() => vi.advanceTimersByTime(210));
    expect(list().children).toHaveLength(0);
  });

  it('pauses auto-dismiss while hovered', () => {
    vi.useFakeTimers();
    setup({ duration: 1000 });
    act(() => {
      api.toast('hover me');
    });
    const item = list().children[0];
    act(() => vi.advanceTimersByTime(500));
    fireEvent.pointerEnter(item);
    act(() => vi.advanceTimersByTime(5000));
    expect(within(list()).getByText('hover me')).toBeInTheDocument();
    fireEvent.pointerLeave(item);
    act(() => vi.advanceTimersByTime(600));
    act(() => vi.advanceTimersByTime(210));
    expect(within(list()).queryByText('hover me')).toBeNull();
  });

  it('replaces a toast that reuses an id; dismissible=false hides the close button', () => {
    setup({ duration: 0 });
    act(() => {
      api.toast({ id: 'x', message: 'v1' });
      api.toast({ id: 'x', message: 'v2', dismissible: false });
    });
    expect(list().children).toHaveLength(1);
    expect(within(list()).getByText('v2')).toBeInTheDocument();
    expect(within(list()).queryByRole('button')).toBeNull();
  });

  it.each([
    ['a new message', 'two'],
    ['the same message', 'one'],
  ])('replacing a toast by id with %s restarts its auto-dismiss timer', (_, second) => {
    vi.useFakeTimers();
    setup();
    act(() => {
      api.toast({ id: 'a', message: 'one', duration: 1000 });
    });
    act(() => vi.advanceTimersByTime(800));
    act(() => {
      api.toast({ id: 'a', message: second, duration: 1000 });
    });
    act(() => vi.advanceTimersByTime(999));
    expect(list().children[0]).toHaveAttribute('data-state', 'open');
    act(() => vi.advanceTimersByTime(1));
    expect(list().children[0]).toHaveAttribute('data-state', 'closing');
    act(() => vi.advanceTimersByTime(210));
    expect(list().children).toHaveLength(0);
  });

  it('replacing a closing toast by id reopens it with a fresh timer', () => {
    vi.useFakeTimers();
    setup();
    act(() => {
      api.toast({ id: 'a', message: 'one', duration: 1000 });
    });
    act(() => vi.advanceTimersByTime(1100));
    expect(list().children[0]).toHaveAttribute('data-state', 'closing');
    act(() => {
      api.toast({ id: 'a', message: 'two', duration: 1000 });
    });
    act(() => vi.advanceTimersByTime(999));
    expect(list().children[0]).toHaveAttribute('data-state', 'open');
    expect(within(list()).getByText('two')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(list().children[0]).toHaveAttribute('data-state', 'closing');
  });

  it('useToast outside a provider throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Grab />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
