import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders a labelled textbox', () => {
    render(<TextField label="Redeem code" placeholder="Enter code" />);
    const input = screen.getByRole('textbox', { name: 'Redeem code' });
    expect(input).toHaveAttribute('placeholder', 'Enter code');
    expect(input).toHaveClass('zzz-text-field__input');
  });

  it('uncontrolled typing reports values via onValueChange and onChange', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<TextField aria-label="Search" defaultValue="Ba" onValueChange={onValueChange} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    await userEvent.type(input, 'n');
    expect(input).toHaveValue('Ban');
    expect(onValueChange).toHaveBeenLastCalledWith('Ban');
    expect(onChange).toHaveBeenCalled();
  });

  it('controlled value', async () => {
    function Harness() {
      const [v, setV] = useState('');
      return <TextField aria-label="Search" value={v} onValueChange={(n) => setV(n.toUpperCase())} />;
    }
    render(<Harness />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'ab');
    expect(input).toHaveValue('AB');
  });

  it('error: aria-invalid and the message is described-by', () => {
    render(<TextField label="Code" error="Invalid redemption code" description="12 characters" />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('12 characters Invalid redemption code');
    expect(screen.getByText('Invalid redemption code')).toHaveClass('zzz-text-field__error');
  });

  it('error={true} marks invalid without a message', () => {
    const { container } = render(<TextField aria-label="x" error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('.zzz-text-field__error')).toBeNull();
  });

  it('disabled', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<TextField aria-label="x" disabled onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    await userEvent.type(input, 'a');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(container.firstChild).toHaveAttribute('data-disabled');
  });

  it('leading icon cap is decorative; ref goes to the input, className to the root', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <TextField aria-label="x" icon={<svg data-testid="icon" />} ref={ref} className="c" />
    );
    expect(screen.getByTestId('icon').closest('.zzz-text-field__cap')).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(container.firstChild).toHaveClass('zzz-text-field', 'c');
  });

  it('supports other input types (search)', () => {
    render(<TextField aria-label="Find" type="search" />);
    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument();
  });
});

// Vitest runs with css: false, so the size rules are checked as text.
const textFieldCss = readFileSync(resolve(__dirname, 'TextField.css'), 'utf8');

describe('TextField sizes', () => {
  it('defaults to md and mirrors the size on the root', () => {
    const { container } = render(<TextField label="Name" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('zzz-text-field', 'zzz-text-field--md');
    expect(root).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" sets the class + data-size and never reaches the <input>', (size) => {
    const { container } = render(<TextField label="Name" size={size} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass(`zzz-text-field--${size}`);
    expect(root).toHaveAttribute('data-size', size);
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('size');
  });

  it('keeps working with every other prop at a non-default size', async () => {
    const onValueChange = vi.fn();
    render(<TextField label="Code" size="lg" icon={<svg />} error="Bad" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    await userEvent.type(input, 'ab');
    expect(onValueChange).toHaveBeenLastCalledWith('ab');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('maps sm / md / lg onto the control height tokens (46 / 57 / 69 design units)', () => {
    for (const size of ['sm', 'md', 'lg']) {
      expect(textFieldCss).toMatch(new RegExp(`\\.zzz-text-field--${size}\\s*\\{[^}]*--zzz-size-control-${size}\\b`));
    }
  });
});
