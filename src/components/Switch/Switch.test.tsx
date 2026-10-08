import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders an off switch by default', () => {
    render(<Switch aria-label="Auto-lock" />);
    const sw = screen.getByRole('switch', { name: 'Auto-lock' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveAttribute('type', 'button');
    expect(sw).toHaveClass('zzz-switch', 'zzz-focusable');
  });

  it('toggles uncontrolled on click and reports changes', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="x" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles with Space and Enter', async () => {
    render(<Switch aria-label="x" defaultChecked />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{Enter}');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('is controlled by `checked`', async () => {
    function Harness() {
      const [on, setOn] = useState(true);
      return (
        <>
          <Switch aria-label="x" checked={on} onCheckedChange={setOn} />
          <output>{String(on)}</output>
        </>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('status')).toHaveTextContent('false');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('works with an external <label>', async () => {
    render(
      <>
        <label htmlFor="sw">Notifications</label>
        <Switch id="sw" />
      </>
    );
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    await userEvent.click(screen.getByText('Notifications'));
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled; passes ref/className', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="x" disabled ref={ref} className="c" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    await userEvent.click(sw);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(ref.current).toBe(sw);
    expect(sw).toHaveClass('c');
  });
});

// Vitest runs with css: false, so the size rules are checked as text.
const switchCss = readFileSync(resolve(__dirname, 'Switch.css'), 'utf8');

describe('Switch sizes', () => {
  it('defaults to md', () => {
    render(<Switch aria-label="x" />);
    expect(screen.getByRole('switch')).toHaveClass('zzz-switch--md');
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" sets the class + data-size and still toggles', async (size) => {
    render(<Switch aria-label="x" size={size} />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveClass(`zzz-switch--${size}`);
    expect(sw).toHaveAttribute('data-size', size);
    expect(sw).not.toHaveAttribute('size');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('scales sm and lg from the control size tokens', () => {
    expect(switchCss).toMatch(/\.zzz-switch--sm\s*\{[^}]*--zzz-size-control-sm-n/);
    expect(switchCss).toMatch(/\.zzz-switch--lg\s*\{[^}]*--zzz-size-control-lg-n/);
  });
});
