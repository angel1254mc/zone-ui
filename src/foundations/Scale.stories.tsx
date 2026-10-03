import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Stage } from '../components/Stage'
import { ZzzTheme } from '../components/ZzzTheme'
import './foundations.css'

const meta = {
  title: 'Foundations/Stage',
  component: Stage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Optional.** `<Stage>` is an artboard for full-screen, game-style scenes (a title screen, a mock of a game menu, a hero scene): a fixed canvas, default 1920 × 1080 design units (pass `width` / `height` for other aspects, e.g. 2520 × 1080 for 21:9), that scales as one picture to fit its container. It is not how pages are sized: ordinary pages and components use the web-standard, rem-based density (`--zzz-scale`, default 0.7; see **Foundations / Sizing**) and lay themselves out responsively.',
          '',
          '- `fit="contain"` (default, letterboxed), `"height"` (scale with the height, the sides crop), `"none"` (1 design unit = 1 CSS px). The outer box is a size container, so give it a definite size.',
          '- Inside the canvas `--zzz-px` is derived from the container size, so everything is laid out in design units.',
          '- `<ZzzTheme scale={n}>` re-scales a subtree (`0.7` web default, `1` game density); `scale="viewport"` sets `--zzz-px: calc(100vh / 1080)` for full-window game scenes only.',
        ].join('\n'),
      },
    },
  },
  args: { width: 1920, height: 1080, fit: 'contain' },
  argTypes: { fit: { control: 'inline-radio', options: ['contain', 'height', 'none'] } },
} satisfies Meta<typeof Stage>

export default meta
type Story = StoryObj<typeof meta>

const edge = 'calc(5 * var(--zzz-px))'
const CORNERS: CSSProperties[] = [
  { left: 0, top: 0, borderLeftWidth: edge, borderTopWidth: edge },
  { right: 0, top: 0, borderRightWidth: edge, borderTopWidth: edge },
  { left: 0, bottom: 0, borderLeftWidth: edge, borderBottomWidth: edge },
  { right: 0, bottom: 0, borderRightWidth: edge, borderBottomWidth: edge },
]

/** A 120 design-unit grid, corner brackets and a centred marker with the canvas size. */
function Artboard({ w = 1920, h = 1080 }: { w?: number; h?: number }) {
  return (
    <>
      <div className="zzz-doc-stage-grid" />
      {CORNERS.map((c, i) => (
        <div key={i} className="zzz-doc-stage-corner" style={c} />
      ))}
      <div className="zzz-doc-stage-marker">
        <div>
          <div className="zzz-text-title zzz-italic">
            {w} × {h}
          </div>
          <div className="zzz-text-label zzz-tone-muted">120-unit grid</div>
        </div>
      </div>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <div className="zzz-doc-stage-host">
      <Stage {...args}>
        <Artboard w={args.width} h={args.height} />
      </Stage>
    </div>
  ),
}

export const FitHeight: Story = {
  args: { fit: 'height' },
  render: (args) => (
    <div className="zzz-doc-stage-host">
      <Stage {...args}>
        <Artboard w={args.width} h={args.height} />
      </Stage>
    </div>
  ),
}

export const ThemeScale: Story = {
  name: 'ZzzTheme scale',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="zzz-doc-row">
      {[0.5, 0.7, 1].map((s) => (
        <ZzzTheme key={s} scale={s}>
          <div className="zzz-doc-cell">
            <div className="zzz-mat-pill zzz-doc-pill">
              <span className="zzz-doc-pill__label zzz-italic">View</span>
            </div>
            <span className="zzz-doc-caption">
              scale={s}
              {s === 0.7 ? ' (default)' : s === 1 ? ' (game density)' : ''}
            </span>
          </div>
        </ZzzTheme>
      ))}
    </div>
  ),
}

/** Raw `.zzz-theme` nesting: class only keeps the parent scale; an inline `--zzz-scale` re-scales. */
export const NestedThemes: Story = {
  name: 'Nested .zzz-theme',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Plain `<div class="zzz-theme">` nesting without the component. Class only: the subtree keeps the parent `--zzz-px`. With an inline `style="--zzz-scale: N"`, `--zzz-px` is recomputed as `calc(1rem / 16 * N)`. An inline `--zzz-px` (as `Stage` and `scale="viewport"` write) always wins.',
      },
    },
  },
  render: () => (
    <ZzzTheme scale={1.5}>
      <div className="zzz-doc-row">
        {[
          { key: 'inherit', caption: 'class only (inherits 1.5)', style: undefined },
          { key: 'scale', caption: 'inline --zzz-scale: 0.75', style: { '--zzz-scale': 0.75 } as CSSProperties },
        ].map(({ key, caption, style }) => (
          <div key={key} className="zzz-theme" data-nested={key} style={style}>
            <div className="zzz-doc-cell">
              <div className="zzz-mat-pill zzz-doc-pill">
                <span className="zzz-doc-pill__label zzz-italic">View</span>
              </div>
              <span className="zzz-doc-caption">{caption}</span>
            </div>
          </div>
        ))}
      </div>
    </ZzzTheme>
  ),
}
