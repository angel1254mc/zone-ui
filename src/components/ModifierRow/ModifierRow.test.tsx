import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ModifierRow } from '.';

describe('ModifierRow', () => {
  it('renders the label and the sage count without a button by default', () => {
    const { container } = render(<ModifierRow count={8} />);
    expect(container.firstElementChild).toHaveTextContent('Active Modifier Count 8');
    expect(screen.getByText('8')).toHaveClass('zzz-modifier-row__count');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('action props render the Combat Readiness button with defaults', async () => {
    const onClick = vi.fn();
    const { container } = render(<ModifierRow count={8} action={{ onClick }} />);
    const btn = screen.getByRole('button', { name: /Combat\s*Readiness/ });
    expect(container.querySelector('.zzz-combat-badge')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(btn);
    btn.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('disabled action and custom label/children', async () => {
    const onClick = vi.fn();
    render(<ModifierRow label="Modifiers" count={2} action={{ onClick, disabled: true, children: 'Details' }} />);
    const btn = screen.getByRole('button', { name: 'Details' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText(/Modifiers/)).toBeInTheDocument();
  });

  it('accepts an element as action; className and ref pass through', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ModifierRow ref={ref} className="x" count={1} action={<button type="button">Go</button>} />);
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(ref.current).toHaveClass('zzz-modifier-row', 'zzz-modifier-row--has-action', 'x');
  });
});
