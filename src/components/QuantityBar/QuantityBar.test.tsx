import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { QuantityBar } from './QuantityBar';

describe('QuantityBar', () => {
  it('renders label × value in a polite live region', () => {
    const { container } = render(<QuantityBar label="Craft Quantity" value={1} />);
    const bar = container.firstChild as HTMLElement;
    expect(bar).toHaveClass('zzz-quantity-bar');
    expect(bar).toHaveAttribute('aria-live', 'polite');
    expect(bar).toHaveAttribute('aria-atomic', 'true');
    expect(bar).toHaveTextContent('Craft Quantity × 1');
    expect(screen.getByText('1')).toHaveClass('zzz-quantity-bar__value');
  });

  it('renders the label alone when there is no value', () => {
    const { container } = render(<QuantityBar label="Nothing selected" />);
    expect(container.firstChild).toHaveTextContent(/^Nothing selected$/);
    expect(container.querySelector('.zzz-quantity-bar__times')).toBeNull();
  });

  it('accepts a custom separator and passes className/style/ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <QuantityBar label="Dismantle" value={3} separator=":" ref={ref} className="x" style={{ width: 300 }} />
    );
    const bar = container.firstChild as HTMLElement;
    expect(bar).toHaveTextContent('Dismantle : 3');
    expect(bar).toHaveClass('x');
    expect(bar.style.width).toBe('300px');
    expect(ref.current).toBe(bar);
  });

  it('can opt out of the live region', () => {
    const { container } = render(<QuantityBar label="x" value={1} live={false} />);
    expect(container.firstChild).not.toHaveAttribute('aria-live');
  });
});

// Vitest runs with css: false, so the size rules are checked as text.
const quantityBarCss = readFileSync(resolve(__dirname, 'QuantityBar.css'), 'utf8');

describe('QuantityBar sizes', () => {
  it('defaults to md', () => {
    const { container } = render(<QuantityBar label="Qty" value={1} />);
    expect(container.firstChild).toHaveClass('zzz-quantity-bar--md');
    expect(container.firstChild).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" sets the class + data-size and keeps the text', (size) => {
    const { container } = render(<QuantityBar label="Qty" value={3} size={size} />);
    expect(container.firstChild).toHaveClass(`zzz-quantity-bar--${size}`);
    expect(container.firstChild).toHaveAttribute('data-size', size);
    expect(container.firstChild).toHaveTextContent('Qty × 3');
  });

  it('scales sm and lg from the control size tokens', () => {
    expect(quantityBarCss).toMatch(/\.zzz-quantity-bar--sm\s*\{[^}]*--zzz-size-control-sm-n/);
    expect(quantityBarCss).toMatch(/\.zzz-quantity-bar--lg\s*\{[^}]*--zzz-size-control-lg-n/);
  });
});
