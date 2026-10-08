import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef } from 'react';
import { TagButton } from './TagButton';

describe('TagButton', () => {
  it('renders Back with a default accessible name', () => {
    const { container } = render(<TagButton kind="back" />);
    const btn = screen.getByRole('button', { name: 'Back' });
    expect(btn).toHaveClass('zzz-tag-button', 'zzz-tag-button--back', 'zzz-focusable');
    expect(btn).toHaveAttribute('type', 'button');
    expect(container.querySelector('svg.zzz-tag-button__shape')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders Close (mirrored) with its default name; label overrides', () => {
    const { rerender } = render(<TagButton kind="close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('zzz-tag-button--close');
    rerender(<TagButton kind="close" label="Close filters" />);
    expect(screen.getByRole('button', { name: 'Close filters' })).toBeInTheDocument();
    rerender(<TagButton kind="back" aria-label="Go back" />);
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('uses unique SVG ids per instance', () => {
    const { container } = render(
      <>
        <TagButton kind="back" />
        <TagButton kind="close" />
      </>
    );
    const ids = [...container.querySelectorAll('[id]')].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('clicks, passes ref / className / native props', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<TagButton kind="back" ref={ref} className="x" data-k="1" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toHaveClass('x');
    expect(ref.current).toHaveAttribute('data-k', '1');
  });

  it('keyboard: Enter activates and flashes data-pressed', async () => {
    vi.useFakeTimers();
    try {
      const onClick = vi.fn();
      render(<TagButton kind="back" onClick={onClick} />);
      const btn = screen.getByRole('button');
      fireEvent.keyDown(btn, { key: 'Enter' });
      expect(btn).toHaveAttribute('data-pressed', '');
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(btn).not.toHaveAttribute('data-pressed');
    } finally {
      vi.useRealTimers();
    }
  });

  it('pressed forces the pressed look; disabled blocks click', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<TagButton kind="back" pressed />);
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed', '');
    rerender(<TagButton kind="back" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aria-disabled stays focusable but blocks click and keyboard activation', async () => {
    const onClick = vi.fn();
    render(<TagButton kind="back" aria-disabled="true" onClick={onClick} />);
    const btn = screen.getByRole('button', { name: 'Back' });
    expect(btn).not.toBeDisabled();
    await userEvent.click(btn);
    btn.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).not.toHaveAttribute('data-pressed');
  });
});

describe('TagButton sizes (sm / md / lg web scale)', () => {
  it('defaults to md and maps sm / md / lg to a modifier class and data-size', () => {
    const { rerender } = render(<TagButton kind="back" />);
    const btn = screen.getByRole('button', { name: 'Back' });
    expect(btn).toHaveClass('zzz-tag-button--md');
    expect(btn).toHaveAttribute('data-size', 'md');
    for (const size of ['sm', 'md', 'lg'] as const) {
      rerender(<TagButton kind="back" size={size} />);
      expect(btn).toHaveClass(`zzz-tag-button--${size}`);
      expect(btn).toHaveAttribute('data-size', size);
    }
  });

  it('scales the 90x58 design box and the glyph placement by the control ratio', () => {
    const css = readFileSync(resolve(__dirname, 'TagButton.css'), 'utf8');
    expect(css).toMatch(
      /\.zzz-tag-button--sm\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-sm-n\) \/ var\(--zzz-size-control-md-n\)\)/
    );
    expect(css).toMatch(
      /\.zzz-tag-button--lg\s*\{[^}]*--zzz-control-ratio: calc\(var\(--zzz-size-control-lg-n\) \/ var\(--zzz-size-control-md-n\)\)/
    );
    expect(css).toContain('width: calc(var(--zzz-size-control-back) * var(--zzz-control-ratio))');
    expect(css).toContain('height: calc(58 * var(--zzz-control-ratio) * var(--zzz-px))');
  });
});
