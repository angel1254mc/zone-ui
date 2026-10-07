import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef } from 'react';
import { CopyButton, copyToClipboard } from './CopyButton';

const realClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
const realExec = document.execCommand;

function mockClipboard(writeText: ((t: string) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    value: writeText ? { writeText: vi.fn(writeText) } : undefined,
    configurable: true,
  });
  return (
    navigator as Navigator & {
      clipboard?: { writeText: ReturnType<typeof vi.fn> };
    }
  ).clipboard;
}

/** Click and let the async copy settle. */
async function click(el: HTMLElement) {
  await act(async () => {
    fireEvent.click(el);
  });
}

afterEach(() => {
  if (realClipboard) Object.defineProperty(navigator, 'clipboard', realClipboard);
  else delete (navigator as unknown as Record<string, unknown>).clipboard;
  document.execCommand = realExec;
  vi.useRealTimers();
});

describe('CopyButton', () => {
  it('renders a Button with the idle label and a live status region', () => {
    render(<CopyButton text="hello" />);
    const btn = screen.getByRole('button', { name: 'Copy' });
    expect(btn).toHaveClass('zzz-button', 'zzz-copy-button');
    expect(btn).toHaveAttribute('data-copy-status', 'idle');
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('');
  });

  it('copies `text` with navigator.clipboard and shows "Copied" for ~2 s', async () => {
    vi.useFakeTimers();
    const clip = mockClipboard(() => Promise.resolve());
    const onCopy = vi.fn();
    render(<CopyButton text="Score 4/5" onCopy={onCopy} />);
    const btn = screen.getByRole('button');
    await click(btn);
    expect(clip!.writeText).toHaveBeenCalledWith('Score 4/5');
    expect(onCopy).toHaveBeenCalledWith('Score 4/5');
    expect(btn).toHaveAttribute('data-copy-status', 'copied');
    expect(btn).toHaveAccessibleName('Copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    await act(async () => {
      vi.advanceTimersByTime(1999);
    });
    expect(btn).toHaveAttribute('data-copy-status', 'copied');
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(btn).toHaveAttribute('data-copy-status', 'idle');
    expect(btn).toHaveAccessibleName('Copy');
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('reads lazy text from getText() (sync or async) at click time', async () => {
    const clip = mockClipboard(() => Promise.resolve());
    let n = 0;
    const { rerender } = render(<CopyButton getText={() => `run ${++n}`} />);
    await click(screen.getByRole('button'));
    expect(clip!.writeText).toHaveBeenLastCalledWith('run 1');
    rerender(<CopyButton getText={async () => 'async text'} />);
    await click(screen.getByRole('button'));
    expect(clip!.writeText).toHaveBeenLastCalledWith('async text');
  });

  it('falls back to a hidden textarea + execCommand when the Clipboard API is missing', async () => {
    mockClipboard(undefined);
    let copiedValue = '';
    const exec = vi.fn(() => {
      copiedValue = (document.activeElement as HTMLTextAreaElement).value;
      return true;
    });
    document.execCommand = exec;
    const onCopy = vi.fn();
    render(<CopyButton text="fallback!" onCopy={onCopy} />);
    const btn = screen.getByRole('button');
    await click(btn);
    expect(exec).toHaveBeenCalledWith('copy');
    expect(copiedValue).toBe('fallback!');
    expect(document.querySelector('textarea')).toBeNull();
    expect(onCopy).toHaveBeenCalledWith('fallback!');
    expect(btn).toHaveAttribute('data-copy-status', 'copied');
  });

  it('falls back when navigator.clipboard.writeText rejects', async () => {
    mockClipboard(() => Promise.reject(new Error('denied')));
    document.execCommand = vi.fn(() => true);
    render(<CopyButton text="x" />);
    await click(screen.getByRole('button'));
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('button')).toHaveAttribute('data-copy-status', 'copied');
  });

  it('shows "Copy failed" and calls onError when every method fails', async () => {
    vi.useFakeTimers();
    mockClipboard(() => Promise.reject(new Error('denied')));
    document.execCommand = vi.fn(() => false);
    const onError = vi.fn();
    const onCopy = vi.fn();
    render(<CopyButton text="x" onError={onError} onCopy={onCopy} />);
    const btn = screen.getByRole('button');
    await click(btn);
    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(btn).toHaveAttribute('data-copy-status', 'failed');
    expect(btn).toHaveAccessibleName('Copy failed');
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(btn).toHaveAttribute('data-copy-status', 'idle');
  });

  it('treats a throwing getText() as a failure', async () => {
    mockClipboard(() => Promise.resolve());
    const onError = vi.fn();
    render(
      <CopyButton
        getText={() => {
          throw new Error('nope');
        }}
        onError={onError}
      />
    );
    await click(screen.getByRole('button'));
    expect(onError).toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('data-copy-status', 'failed');
  });

  it('accepts custom labels and reset time', async () => {
    vi.useFakeTimers();
    mockClipboard(() => Promise.resolve());
    render(
      <CopyButton text="x" copiedLabel="Link copied" failedLabel="Nope" resetAfter={500}>
        Share
      </CopyButton>
    );
    const btn = screen.getByRole('button', { name: 'Share' });
    await click(btn);
    expect(btn).toHaveAccessibleName('Link copied');
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(btn).toHaveAccessibleName('Share');
  });

  it('reserves the widest label so the pill does not jump (inactive labels are aria-hidden)', () => {
    render(<CopyButton text="x" />);
    const btn = screen.getByRole('button');
    const labels = btn.querySelectorAll('.zzz-copy-button__label');
    expect(labels).toHaveLength(3);
    expect([...labels].filter((l) => l.getAttribute('aria-hidden') !== 'true')).toHaveLength(1);
  });

  it('calls the consumer onClick and respects disabled', async () => {
    const clip = mockClipboard(() => Promise.resolve());
    const onClick = vi.fn();
    const { rerender } = render(<CopyButton text="x" onClick={onClick} />);
    await click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<CopyButton text="x" disabled />);
    clip!.writeText.mockClear();
    await click(screen.getByRole('button'));
    expect(clip!.writeText).not.toHaveBeenCalled();
  });

  it('does not copy when onClick calls preventDefault', async () => {
    const clip = mockClipboard(() => Promise.resolve());
    render(<CopyButton text="x" onClick={(e) => e.preventDefault()} />);
    await click(screen.getByRole('button'));
    expect(clip!.writeText).not.toHaveBeenCalled();
  });

  it('passes className, style and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<CopyButton ref={ref} text="x" className="extra" style={{ marginTop: 2 }} />);
    const btn = screen.getByRole('button');
    expect(ref.current).toBe(btn);
    expect(btn).toHaveClass('extra');
    expect(btn.style.marginTop).toBe('2px');
  });

  it('is keyboard operable (Enter)', async () => {
    const clip = mockClipboard(() => Promise.resolve());
    render(<CopyButton text="kbd" />);
    const btn = screen.getByRole('button');
    btn.focus();
    // native buttons fire click on Enter; jsdom needs the click dispatched explicitly
    await act(async () => {
      fireEvent.keyDown(btn, { key: 'Enter' });
      fireEvent.click(btn);
    });
    expect(clip!.writeText).toHaveBeenCalledWith('kbd');
  });
});

describe('copyToClipboard', () => {
  it('resolves on success and rejects when nothing works', async () => {
    mockClipboard(() => Promise.resolve());
    await expect(copyToClipboard('a')).resolves.toBeUndefined();
    mockClipboard(undefined);
    document.execCommand = vi.fn(() => false);
    await expect(copyToClipboard('a')).rejects.toBeInstanceOf(Error);
  });
});

describe('CopyButton controlled status', () => {
  it('shows a forced status and reports changes through onStatusChange', async () => {
    mockClipboard(() => Promise.resolve());
    const onStatusChange = vi.fn();
    const { rerender } = render(<CopyButton text="x" status="failed" onStatusChange={onStatusChange} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-copy-status', 'failed');
    expect(btn).toHaveAccessibleName('Copy failed');
    await click(btn);
    expect(onStatusChange).toHaveBeenCalledWith('copied');
    // still controlled: stays failed until the parent updates it
    expect(btn).toHaveAttribute('data-copy-status', 'failed');
    rerender(<CopyButton text="x" status="copied" onStatusChange={onStatusChange} />);
    expect(btn).toHaveAttribute('data-copy-status', 'copied');
  });
});

describe('CopyButton sizes', () => {
  it('forwards size to the Button (default md)', () => {
    const { rerender } = render(<CopyButton text="x" />);
    const btn = screen.getByRole('button', { name: 'Copy' });
    expect(btn).toHaveClass('zzz-button--md');
    for (const size of ['sm', 'md', 'lg'] as const) {
      rerender(<CopyButton text="x" size={size} />);
      expect(btn).toHaveClass(`zzz-button--${size}`);
      expect(btn).toHaveAttribute('data-size', size);
    }
  });

  it('scales the cap-to-label gap with the size ratio', () => {
    const css = readFileSync(resolve(__dirname, 'CopyButton.css'), 'utf8');
    expect(css).toContain('36 * var(--zzz-control-ratio) * var(--zzz-px)');
  });
});
