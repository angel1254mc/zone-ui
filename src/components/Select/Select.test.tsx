import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { value: 'rarity', label: 'Rarity' },
  { value: 'level', label: 'Level' },
  { value: 'atk', label: 'Base ATK' },
  { value: 'recent', label: 'Recently Obtained' },
];

describe('Select', () => {
  it('renders a closed combobox showing the selected label', () => {
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" />);
    const combo = screen.getByRole('combobox', { name: 'Sort by' });
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveAttribute('aria-haspopup', 'listbox');
    expect(combo).toHaveTextContent('Rarity');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows the placeholder when nothing is selected', () => {
    render(<Select aria-label="Sort by" options={OPTIONS} placeholder="Sort by…" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Sort by…');
  });

  it('opens on click and picks an option (uncontrolled)', async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" onValueChange={onValueChange} />);
    const combo = screen.getByRole('combobox');
    await userEvent.click(combo);
    expect(combo).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    expect(combo).toHaveAttribute('aria-controls', listbox.id);
    expect(screen.getByRole('option', { name: 'Rarity' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Level' }));
    expect(onValueChange).toHaveBeenCalledWith('level');
    expect(combo).toHaveTextContent('Level');
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveFocus();
  });

  it('keyboard: ArrowDown opens, arrows move the active option, Enter picks', async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" onValueChange={onValueChange} />);
    const combo = screen.getByRole('combobox');
    combo.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(combo).toHaveAttribute('aria-expanded', 'true');
    // Opens on the selected option.
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Rarity' }).id);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Base ATK' }).id);
    await userEvent.keyboard('{ArrowUp}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Level' }).id);
    await userEvent.keyboard('{End}');
    expect(combo).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Recently Obtained' }).id
    );
    await userEvent.keyboard('{Home}{Enter}');
    expect(onValueChange).not.toHaveBeenCalled(); // Rarity was already selected
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('level');
  });

  it('Space and Enter open; Escape closes without changing the value', async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" onValueChange={onValueChange} />);
    const combo = screen.getByRole('combobox');
    combo.focus();
    await userEvent.keyboard(' ');
    expect(combo).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(combo).toHaveTextContent('Rarity');
    await userEvent.keyboard('{Enter}');
    expect(combo).toHaveAttribute('aria-expanded', 'true');
  });

  it('type-ahead jumps to a matching option (closed: selects it; open: activates it)', async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" onValueChange={onValueChange} />);
    const combo = screen.getByRole('combobox');
    combo.focus();
    await userEvent.keyboard('b');
    expect(onValueChange).toHaveBeenLastCalledWith('atk');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('re');
    expect(combo).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Recently Obtained' }).id
    );
  });

  it('is controlled by `value`', async () => {
    function Harness() {
      const [v, setV] = useState('level');
      return (
        <>
          <Select aria-label="Sort by" options={OPTIONS} value={v} onValueChange={setV} />
          <output>{v}</output>
        </>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Base ATK' }));
    expect(screen.getByRole('status')).toHaveTextContent('atk');
    expect(screen.getByRole('combobox')).toHaveTextContent('Base ATK');
  });

  it('closes on an outside pointer down', async () => {
    render(
      <>
        <Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" />
        <button type="button">outside</button>
      </>
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options', async () => {
    render(
      <Select
        aria-label="Sort by"
        options={[OPTIONS[0], { ...OPTIONS[1], disabled: true }, OPTIONS[2]]}
        defaultValue="rarity"
      />
    );
    const combo = screen.getByRole('combobox');
    combo.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Base ATK' }).id);
    expect(screen.getByRole('option', { name: 'Level' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled: not focusable and does not open', async () => {
    render(<Select aria-label="Sort by" options={OPTIONS} defaultValue="rarity" disabled />);
    const combo = screen.getByRole('combobox');
    expect(combo).toHaveAttribute('aria-disabled', 'true');
    expect(combo).not.toHaveAttribute('tabindex', '0');
    await userEvent.click(combo);
    expect(combo).toHaveAttribute('aria-expanded', 'false');
  });

  it('forces the pressed look on the trigger with `pressed`', () => {
    render(<Select aria-label="Sort by" options={OPTIONS} pressed />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-pressed');
  });

  it('submits through a hidden input when `name` is set; passes className/ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Select aria-label="Sort by" options={OPTIONS} defaultValue="level" name="sort" className="extra" ref={ref} />
    );
    const input = container.querySelector('input[name="sort"]') as HTMLInputElement;
    expect(input.value).toBe('level');
    expect(container.firstChild).toHaveClass('zzz-select', 'extra');
    expect(ref.current).toBe(container.firstChild);
  });
});

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
  const css = readFileSync(resolve(process.cwd(), 'src/components/Select/Select.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  const pxDecls = css
    .split(/[;{}]/)
    .map((s) => s.trim())
    .filter((s) => s.includes('var(--zzz-px)'));
  return { css, pxDecls };
}

describe('Select size', () => {
  it('defaults to md and reflects size on data-size', () => {
    const { container, rerender } = render(<Select aria-label="Sort by" options={OPTIONS} />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    rerender(<Select aria-label="Sort by" options={OPTIONS} size="sm" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'sm');
    rerender(<Select aria-label="Sort by" options={OPTIONS} size="lg" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
  });
  it('keeps an explicit width literal (design units, not size-scaled)', () => {
    const { container } = render(<Select aria-label="Sort by" options={OPTIONS} size="sm" width={300} />);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--zzz-select-width')).toBe(
      'calc(300 * var(--zzz-px))'
    );
  });
  it('accepts width="fill"', () => {
    const { container } = render(<Select aria-label="Sort by" options={OPTIONS} width="fill" />);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--zzz-select-width')).toBe('100%');
  });

  it('routes every stylesheet length through the size unit', () => {
    const { css, pxDecls } = sizeUnitCss();
    expect(css).toMatch(/\[data-size='sm'\]/);
    expect(css).toMatch(/\[data-size='lg'\]/);
    for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/);
  });

  it('accepts the opt-in drawer size', () => {
    const { container } = render(<Select aria-label="Sort by" options={OPTIONS} size="drawer" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'drawer');
  });

  it('puts sm / md / lg on the shared control heights (46 / 57 / 69), the 53-unit drawer height only on size="drawer"', () => {
    const { css } = sizeUnitCss();
    // Trigger height reads the per-size height variable, which defaults to size.control.md (57 × the size ratio = 46 / 57 / 69).
    expect(css).toMatch(
      /\.zzz-select__trigger\s*\{[^}]*height:\s*calc\(var\(--zzz-select-h-n\) \* var\(--zzz-select-u\)\)/
    );
    expect(css).toMatch(/\.zzz-select\s*\{[^}]*--zzz-select-h-n:\s*var\(--zzz-size-control-md-n\)/);
    // The drawer height (size.control.select = 53) appears only in the drawer rule.
    const rules = css.split('}').filter((r) => r.includes('--zzz-size-control-select-n'));
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatch(/\.zzz-select\[data-size='drawer'\]\s*\{/);
  });
});
