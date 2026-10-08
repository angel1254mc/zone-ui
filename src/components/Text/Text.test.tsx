import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import { Zeros } from './Zeros';
import { Keyword } from './Keyword';
import { Value } from './Value';

describe('Text', () => {
  it('renders a span with the body role by default', () => {
    render(<Text>Base ATK</Text>);
    const el = screen.getByText('Base ATK');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('zzz-text', 'zzz-text-body');
  });

  it.each([
    ['bodyLg', 'zzz-text-bodyLg'],
    ['title', 'zzz-text-title'],
    ['condensedXlHud', 'zzz-text-condensedXlHud'],
    ['badgeNew', 'zzz-text-badgeNew'],
  ] as const)('maps role %s to %s', (role, cls) => {
    render(<Text role={role}>x</Text>);
    expect(screen.getByText('x')).toHaveClass(cls);
  });

  it.each([
    ['muted', 'zzz-tone-muted'],
    ['onAccent', 'zzz-tone-onAccent'],
    ['keyword', 'zzz-tone-keyword'],
  ] as const)('maps tone %s to %s', (tone, cls) => {
    render(<Text tone={tone}>x</Text>);
    expect(screen.getByText('x')).toHaveClass(cls);
  });

  it('renders the element given by `as` and forwards native props and ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Text as="h2" role="title" id="t" className="extra" style={{ margin: 0 }} ref={ref}>
        The Brimstone
      </Text>
    );
    const el = screen.getByRole('heading', {
      level: 2,
      name: 'The Brimstone',
    });
    expect(el).toHaveAttribute('id', 't');
    expect(el).toHaveClass('extra', 'zzz-text-title');
    expect(el).toHaveStyle({ margin: '0px' });
    expect(ref.current).toBe(el);
  });

  it('wraps italic content in a .zzz-italic span inside the element', () => {
    const { container } = render(
      <Text role="button" italic>
        Craft
      </Text>
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer).not.toHaveClass('zzz-italic');
    const inner = outer.querySelector('.zzz-italic');
    expect(inner).not.toBeNull();
    expect(inner).toHaveTextContent('Craft');
  });

  it('adds outline, deboss and tracked modifiers', () => {
    render(
      <>
        <Text outline="md">a</Text>
        <Text outline="event">b</Text>
        <Text deboss>c</Text>
        <Text tracked="name">d</Text>
        <Text tracked="interstitial">e</Text>
      </>
    );
    expect(screen.getByText('a')).toHaveClass('zzz-text--outline-md');
    expect(screen.getByText('b')).toHaveClass('zzz-text--outline-event');
    expect(screen.getByText('c')).toHaveClass('zzz-text--deboss', 'zzz-tone-engraved');
    expect(screen.getByText('d')).toHaveClass('zzz-text--tracked-name');
    expect(screen.getByText('e')).toHaveClass('zzz-text--tracked-interstitial');
  });

  it('uses the theme figures by default and opts into tabular figures with tabular', () => {
    render(
      <>
        <Text>1</Text>
        <Text tabular>2</Text>
        <Text tabular={false}>3</Text>
      </>
    );
    expect(screen.getByText('1')).not.toHaveClass('zzz-text--tabular');
    expect(screen.getByText('2')).toHaveClass('zzz-text--tabular');
    expect(screen.getByText('3')).not.toHaveClass('zzz-text--tabular');
  });

  it('never hard-codes tabular-nums in its stylesheet (Mona Sans tnum = slashed 0, footed 1)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/components/Text/Text.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      ''
    );
    expect(css).not.toMatch(/font-variant-numeric:\s*tabular-nums/);
    expect(css).toMatch(/\.zzz-text\s*\{\s*font-variant-numeric:\s*var\(--zzz-font-numeric-default\)/);
  });

  it('renders with fit without crashing and marks the element', () => {
    render(
      <Text role="label" fit>
        Automatic Adrenaline Accumulation
      </Text>
    );
    expect(screen.getByText('Automatic Adrenaline Accumulation')).toHaveClass('zzz-text--fit');
  });

  describe('fit', () => {
    // jsdom has no layout: fake an overflowing box (100 wide, content 200 wide).
    let restore: (() => void) | undefined;
    beforeEach(() => {
      const proto = HTMLElement.prototype;
      const cw = Object.getOwnPropertyDescriptor(proto, 'clientWidth');
      const sw = Object.getOwnPropertyDescriptor(proto, 'scrollWidth');
      Object.defineProperty(proto, 'clientWidth', {
        configurable: true,
        get: () => 100,
      });
      Object.defineProperty(proto, 'scrollWidth', {
        configurable: true,
        get(this: HTMLElement) {
          return this.style.fontSize ? 100 : 200;
        },
      });
      // css: false → no role font-size; pretend the role resolves to 24 design units.
      const gcs = vi.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            fontSize: '24px',
            getPropertyValue: () => '1px',
          }) as unknown as CSSStyleDeclaration
      );
      restore = () => {
        gcs.mockRestore();
        if (cw) Object.defineProperty(proto, 'clientWidth', cw);
        if (sw) Object.defineProperty(proto, 'scrollWidth', sw);
      };
    });
    afterEach(() => restore?.());

    it('shrinks inline and removes the inline font-size when fit is turned off', () => {
      const { rerender } = render(
        <Text role="label" fit>
          Automatic Adrenaline Accumulation
        </Text>
      );
      const el = screen.getByText('Automatic Adrenaline Accumulation');
      expect(el.style.getPropertyValue('font-size')).toMatch(/^calc\(/);
      rerender(<Text role="label">Automatic Adrenaline Accumulation</Text>);
      expect(el).not.toHaveClass('zzz-text--fit');
      expect(el.style.getPropertyValue('font-size')).toBe('');
    });

    it('keeps a user font-size when fit was never on', () => {
      render(<Text style={{ fontSize: '20px' }}>x</Text>);
      expect(screen.getByText('x').style.fontSize).toBe('20px');
    });

    it('does not re-register resize / font listeners when children change', () => {
      const add = vi.spyOn(window, 'addEventListener');
      const { rerender } = render(
        <Text fit>
          <b>a</b>
        </Text>
      );
      const count = () => add.mock.calls.filter(([type]) => type === 'resize').length;
      expect(count()).toBe(1);
      rerender(
        <Text fit>
          <b>b</b>
        </Text>
      );
      rerender(
        <Text fit>
          <b>c</b>
        </Text>
      );
      expect(count()).toBe(1);
      add.mockRestore();
    });
  });

  it('does not forward the role prop as an ARIA role', () => {
    render(<Text role="title">x</Text>);
    expect(screen.getByText('x')).not.toHaveAttribute('role');
  });
});

describe('Zeros', () => {
  it('pads 76418 to 8 digits with dimmed zeros and a plain aria-label', () => {
    const { container } = render(<Zeros value={76418} digits={8} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-label', '76418');
    expect(root).toHaveTextContent('00076418');
    const pad = root.querySelector('.zzz-zeros__pad');
    expect(pad).toHaveTextContent(/^000$/);
    expect(pad).toHaveAttribute('aria-hidden', 'true');
    expect(root.querySelector('.zzz-zeros__digits')).toHaveTextContent(/^76418$/);
  });

  it('puts every digit in its own fixed-pitch cell (game tabular advance, plain zeros)', () => {
    const { container } = render(<Zeros value={76418} digits={8} />);
    const cells = container.querySelectorAll('.zzz-zeros__d');
    expect(cells).toHaveLength(8);
    expect([...cells].map((c) => c.textContent).join('')).toBe('00076418');
    expect(container.querySelectorAll('.zzz-zeros__pad .zzz-zeros__d')).toHaveLength(3);
  });

  it('renders no pad when the value already has enough digits', () => {
    const { container } = render(<Zeros value={123456789} digits={8} />);
    expect(container.querySelector('.zzz-zeros__pad')).toBeNull();
    expect(container.firstElementChild).toHaveTextContent('123456789');
  });
});

describe('Keyword / Value', () => {
  it('Keyword renders orange keyword tone with an optional leading icon', () => {
    render(<Keyword icon={<svg data-testid="ic" />}>Attack</Keyword>);
    const el = screen.getByText('Attack').closest('.zzz-keyword') as HTMLElement;
    expect(el).toHaveClass('zzz-tone-keyword');
    expect(screen.getByTestId('ic').closest('.zzz-keyword__icon')).not.toBeNull();
  });

  it('Value renders the green value tone', () => {
    render(<Value>3.5%</Value>);
    expect(screen.getByText('3.5%')).toHaveClass('zzz-tone-value');
  });
});
