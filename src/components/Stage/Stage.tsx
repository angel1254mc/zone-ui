import type { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react';
import { cx } from '../../utils';
import './Stage.css';

export type StageFit = 'contain' | 'height' | 'none';

export interface StageProps extends ComponentPropsWithoutRef<'div'> {
  /** Artboard width in design units. Default 1920 (16:9). */
  width?: number;
  /** Artboard height in design units. Default 1080. */
  height?: number;
  /**
   * How the artboard scales to the Stage box:
   * - `'contain'` (default): largest scale at which the whole artboard fits (letterboxed);
   * - `'height'`: scale with the box height (the sides crop on narrow boxes);
   * - `'none'`: 1 design unit = 1 CSS px.
   */
  fit?: StageFit;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Optional artboard for full-screen, game-style scenes: a fixed canvas (default 1920 x 1080 design
 * units) that scales as one picture to fit its container, like a game screen or a slide.
 *
 * It is NOT how ordinary pages are sized. Pages and components use the web-standard, rem-based
 * density (`--zzz-scale`, default 0.7) and lay themselves out responsively; reach for Stage only
 * when a composition must keep a fixed aspect and scale as a whole (a title screen, a mock of a
 * game menu, a hero scene).
 *
 * The outer box is a size container (it needs a definite size; with an auto height it falls back
 * to the artboard's aspect ratio). The inner canvas is a `.zzz-theme` whose `--zzz-px` is derived
 * from the container (`fit`), so everything inside is laid out in design units.
 */
export function Stage({
  width = 1920,
  height = 1080,
  fit = 'contain',
  className,
  style,
  children,
  ref,
  ...rest
}: StageProps) {
  const px =
    fit === 'none'
      ? '1px'
      : fit === 'height'
        ? `calc(100cqh / ${height})`
        : `min(100cqw / ${width}, 100cqh / ${height})`;

  const stageVars = {
    '--zzz-stage-width': String(width),
    '--zzz-stage-height': String(height),
  } as CSSProperties;
  const canvasVars = { '--zzz-px': px } as CSSProperties;

  return (
    <div ref={ref} className={cx('zzz-stage', className)} data-fit={fit} style={{ ...stageVars, ...style }} {...rest}>
      <div className="zzz-stage__canvas zzz-theme" style={canvasVars}>
        {children}
      </div>
    </div>
  );
}
