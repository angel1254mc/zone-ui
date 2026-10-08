import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { InlineError, Notice } from '.';

describe('InlineError', () => {
  it('is plain text by default (reference it with aria-describedby)', () => {
    render(
      <>
        <InlineError id="err">Insufficient crafting materials</InlineError>
        <button type="button" disabled aria-describedby="err">
          Craft
        </button>
      </>
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Insufficient crafting materials');
  });

  it('alert opts into role="alert"; className and ref pass through', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <InlineError ref={ref} alert className="x">
        Oops
      </InlineError>
    );
    expect(screen.getByRole('alert')).toBe(ref.current);
    expect(ref.current).toHaveClass('zzz-inline-error', 'x');
  });
});

describe('Notice', () => {
  it('is a status with text and a hidden default icon', () => {
    const { container } = render(<Notice>"Unlock Early" has been unlocked</Notice>);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('"Unlock Early" has been unlocked');
    expect(container.querySelector('.zzz-notice__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('custom icon, no icon, ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container, rerender } = render(
      <Notice ref={ref} icon={<svg data-testid="i" />}>
        Hi
      </Notice>
    );
    expect(screen.getByTestId('i')).toBeInTheDocument();
    rerender(
      <Notice ref={ref} icon={null}>
        Hi
      </Notice>
    );
    expect(container.querySelector('.zzz-notice__icon')).toBeNull();
    expect(ref.current).toHaveClass('zzz-notice');
  });
});
