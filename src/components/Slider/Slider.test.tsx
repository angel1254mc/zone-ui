import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a slider with value, bounds and stepper buttons', () => {
    render(<Slider aria-label="Craft quantity" min={1} max={5} defaultValue={1} />);
    const slider = screen.getByRole('slider', { name: 'Craft quantity' });
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '5');
    expect(slider).toHaveAttribute('aria-valuenow', '1');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(screen.getByRole('button', { name: 'Decrease' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Increase' })).not.toHaveAttribute('aria-disabled');
    expect(screen.getByText('1', { selector: '.zzz-slider__bound--min *' })).toBeInTheDocument();
    expect(screen.getByText('5', { selector: '.zzz-slider__bound--max *' })).toBeInTheDocument();
  });

  it('keyboard: arrows step, PageUp/PageDown jump, Home/End go to the bounds', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="q" min={0} max={100} defaultValue={50} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '51');
    await userEvent.keyboard('{ArrowUp}');
    expect(slider).toHaveAttribute('aria-valuenow', '52');
    await userEvent.keyboard('{ArrowLeft}{ArrowDown}');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    await userEvent.keyboard('{PageUp}');
    expect(slider).toHaveAttribute('aria-valuenow', '60');
    await userEvent.keyboard('{PageDown}{PageDown}');
    expect(slider).toHaveAttribute('aria-valuenow', '40');
    await userEvent.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('steppers step and clamp, and turn aria-disabled (still focusable, no-op) at the bounds', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="q" min={1} max={3} defaultValue={2} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');
    const inc = screen.getByRole('button', { name: 'Increase' });
    const dec = screen.getByRole('button', { name: 'Decrease' });
    await userEvent.click(inc);
    expect(slider).toHaveAttribute('aria-valuenow', '3');
    expect(inc).toHaveAttribute('aria-disabled', 'true');
    expect(inc).not.toBeDisabled();
    await userEvent.click(inc);
    expect(slider).toHaveAttribute('aria-valuenow', '3');
    await userEvent.click(dec);
    expect(inc).not.toHaveAttribute('aria-disabled');
    await userEvent.click(dec);
    expect(slider).toHaveAttribute('aria-valuenow', '1');
    expect(dec).toHaveAttribute('aria-disabled', 'true');
    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual([3, 2, 1]);
  });

  it('keeps keyboard focus on a stepper that reaches its bound', async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="q" min={1} max={5} defaultValue={1} />);
    const slider = screen.getByRole('slider');
    const inc = screen.getByRole('button', { name: 'Increase' });
    inc.focus();
    for (let i = 0; i < 6; i++) await user.keyboard('{Enter}');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(inc).toHaveAttribute('aria-disabled', 'true');
    expect(inc).toHaveFocus();
    expect(inc).not.toHaveAttribute('data-pressed');
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('slider')).toHaveFocus();
  });

  it('respects step and snaps to it', async () => {
    render(<Slider aria-label="q" min={0} max={10} step={2.5} defaultValue={5} />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '7.5');
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('min === max: both steppers disabled, thumb at the right end', () => {
    const { container } = render(<Slider aria-label="q" min={1} max={1} defaultValue={1} />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute('aria-disabled', 'true');
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue('--zzz-slider-fraction')).toBe('1');
  });

  it('is controlled by `value`', async () => {
    function Harness() {
      const [v, setV] = useState(2);
      return (
        <>
          <Slider aria-label="q" min={1} max={5} value={v} onValueChange={setV} />
          <output>{v}</output>
        </>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByRole('status')).toHaveTextContent('3');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '3');
  });

  it('controlled without onValueChange stays put', async () => {
    render(<Slider aria-label="q" min={1} max={5} value={2} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '2');
  });

  it('pointer on the rail sets the value from the x position', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Slider aria-label="q" min={0} max={10} defaultValue={0} onValueChange={onValueChange} />
    );
    const track = container.querySelector('.zzz-slider__track') as HTMLElement;
    track.getBoundingClientRect = () =>
      ({
        left: 100,
        width: 200,
        right: 300,
        top: 0,
        bottom: 12,
        height: 12,
        x: 100,
        y: 0,
        toJSON() {},
      }) as DOMRect;
    const rail = container.querySelector('.zzz-slider__rail') as HTMLElement;
    fireEvent.pointerDown(rail, { clientX: 200, button: 0, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    fireEvent.pointerMove(rail, { clientX: 400, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    fireEvent.pointerUp(rail, { pointerId: 1 });
    fireEvent.pointerMove(rail, { clientX: 100, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it('disabled: no keyboard, no steppers, thumb not focusable', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="q" min={1} max={5} defaultValue={3} disabled onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).not.toHaveAttribute('tabindex');
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('can hide steppers and bound numbers; custom labels; ref + className on the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Slider
        aria-label="q"
        min={1}
        max={5}
        showSteppers={false}
        showBounds={false}
        ref={ref}
        className="x"
        decrementLabel="Less"
        incrementLabel="More"
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('.zzz-slider__bound')).toBeNull();
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass('zzz-slider', 'x');
  });

  it('custom stepper labels', () => {
    render(<Slider aria-label="q" min={1} max={5} decrementLabel="Less" incrementLabel="More" />);
    expect(screen.getByRole('button', { name: 'Less' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('aria-valuetext via getValueText', () => {
    render(<Slider aria-label="q" min={1} max={5} defaultValue={2} getValueText={(v) => `${v} items`} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '2 items');
  });
});

// Vitest runs with css: false, so the size rules are checked as text.
const sliderCss = readFileSync(resolve(__dirname, 'Slider.css'), 'utf8');

describe('Slider sizes', () => {
  it('defaults to md', () => {
    const { container } = render(<Slider aria-label="Qty" min={1} max={5} />);
    expect(container.firstChild).toHaveClass('zzz-slider--md');
    expect(container.firstChild).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'size="%s" sets the class + data-size and keeps keyboard + steppers working',
    async (size) => {
      const onValueChange = vi.fn();
      const { container } = render(
        <Slider aria-label="Qty" min={1} max={5} size={size} onValueChange={onValueChange} />
      );
      expect(container.firstChild).toHaveClass(`zzz-slider--${size}`);
      expect(container.firstChild).toHaveAttribute('data-size', size);
      const thumb = screen.getByRole('slider', { name: 'Qty' });
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(onValueChange).toHaveBeenLastCalledWith(2);
      await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
      expect(onValueChange).toHaveBeenLastCalledWith(3);
    }
  );

  it('scales sm / lg from the control size tokens and sizes the numbers with the control label tokens', () => {
    expect(sliderCss).toMatch(/\.zzz-slider--sm\s*\{[^}]*--zzz-size-control-sm-n/);
    expect(sliderCss).toMatch(/\.zzz-slider--lg\s*\{[^}]*--zzz-size-control-lg-n/);
    for (const size of ['sm', 'md', 'lg']) expect(sliderCss).toContain(`var(--zzz-font-size-control-${size})`);
  });
});
