import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Stage } from './Stage';

const canvasOf = (stage: HTMLElement) => stage.querySelector<HTMLElement>('.zzz-stage__canvas')!;
const styleVar = (el: HTMLElement, name: string) => el.style.getPropertyValue(name);

describe('Stage', () => {
  it('renders an outer .zzz-stage with a .zzz-stage__canvas.zzz-theme holding the children', () => {
    render(
      <Stage data-testid="stage">
        <p>Unlock</p>
      </Stage>
    );
    const stage = screen.getByTestId('stage');
    expect(stage).toHaveClass('zzz-stage');
    const canvas = canvasOf(stage);
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('zzz-stage__canvas', 'zzz-theme');
    expect(canvas).toContainElement(screen.getByText('Unlock'));
  });

  it('defaults to a 1920 x 1080 canvas fitted with "contain"', () => {
    render(<Stage data-testid="stage" />);
    const stage = screen.getByTestId('stage');
    const canvas = canvasOf(stage);
    expect(stage).toHaveAttribute('data-fit', 'contain');
    expect(styleVar(stage, '--zzz-stage-width')).toBe('1920');
    expect(styleVar(stage, '--zzz-stage-height')).toBe('1080');
    expect(styleVar(canvas, '--zzz-px')).toBe('min(100cqw / 1920, 100cqh / 1080)');
  });

  it('fits to the container height with fit="height"', () => {
    render(<Stage data-testid="stage" fit="height" />);
    const stage = screen.getByTestId('stage');
    expect(stage).toHaveAttribute('data-fit', 'height');
    expect(styleVar(canvasOf(stage), '--zzz-px')).toBe('calc(100cqh / 1080)');
  });

  it('renders 1 design unit = 1 CSS px with fit="none"', () => {
    render(<Stage data-testid="stage" fit="none" />);
    expect(styleVar(canvasOf(screen.getByTestId('stage')), '--zzz-px')).toBe('1px');
  });

  it('uses custom artboard dimensions', () => {
    render(<Stage data-testid="stage" width={2560} height={1440} />);
    const stage = screen.getByTestId('stage');
    expect(styleVar(stage, '--zzz-stage-width')).toBe('2560');
    expect(styleVar(canvasOf(stage), '--zzz-px')).toBe('min(100cqw / 2560, 100cqh / 1440)');
  });

  it('passes className, style, native props and ref to the outer element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stage
        ref={ref}
        data-testid="stage"
        className="page"
        style={{ height: '100vh' }}
        role="region"
        aria-label="Storage"
      />
    );
    const stage = screen.getByRole('region', { name: 'Storage' });
    expect(stage).toHaveClass('zzz-stage', 'page');
    expect(stage.style.height).toBe('100vh');
    expect(styleVar(stage, '--zzz-stage-width')).toBe('1920');
    expect(ref.current).toBe(stage);
  });
});
