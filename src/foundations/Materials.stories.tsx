import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import './foundations.css'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Foundations/Materials',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Shared surface recipes from `base.css`. They are CSS classes, not components: put them on any element.',
          '',
          '| Class | Recipe |',
          '|---|---|',
          '| `.zzz-mat-pill` | fill `color.surface.button` + dot lattice `pattern.dots.sm`, 5 px `#333` ring lit on its outer top/left row (`#454545`), 3 px black keyline, pill radius |',
          '| `.zzz-mat-panel` | 5 px `#333` lit ring, outer radius `radius.panel` (29), 3 px keyline, black body. `--large`: 4 px `#2D2D2D`, radius 33. Ring and keyline are outer box-shadows: the element box is the INNER area (radius 29 − 5 = 24), so `overflow: hidden` clips content to the inner curve and never clips the ring |',
          '| `.zzz-mat-textured` | `color.surface.panelHeader` `#222` + dots `lg` (`--body`: `#191919`) |',
          '| `.zzz-mat-drawer` | `color.surface.drawerBody` `#1A1A1A` + dots `md` |',
          '| `.zzz-bg-hatch` | 39.8° hatch, 7.68 px period, white 0→10.5 % over `--zzz-hatch-base` (black) |',
          '| `.zzz-dots` | the dot lattice alone: `--zzz-dots-size`, `--zzz-dots-alpha` (light dots), `--zzz-dots-shade` (dark dots) |',
          '| `.zzz-accent-fill` / `.zzz-accent-ring` | `background` / `border-color: var(--zzz-accent)`; fill text turns `color.accent.on` |',
          '| `.zzz-pressable` | the pressed recipe (below) |',
          '| `.zzz-focusable` | `:focus-visible` → `box-shadow: var(--zzz-focus-ring)` |',
          '',
          '**Pseudo-element ownership.** `.zzz-mat-pill` draws its bevel with `::after`; `.zzz-pressable` draws the pressed fill with `::before`. Components that use these classes should not use those pseudo-elements for anything else. `.zzz-mat-panel` uses no pseudo-element.',
          '',
          '**Panel sizing.** `.zzz-mat-panel` draws its ring (5 px, `--large` 4 px) and keyline outside its box, so size it by its inner area: a panel whose outer ring edge should be W × H gets `width: W − 2·ring`, `height: H − 2·ring`, placed `ring` further in.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Cell({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <div className="zzz-doc-cell">
      {children}
      <span className="zzz-doc-caption">{caption}</span>
    </div>
  )
}

function Pill({ label = 'View', pressed, cap, style }: { label?: string; pressed?: boolean; cap?: boolean; style?: CSSProperties }) {
  return (
    <div
      className={`zzz-mat-pill zzz-pressable zzz-doc-pill${cap ? ' zzz-doc-pill--with-cap' : ''}`}
      data-pressed={pressed ? '' : undefined}
      style={style}
    >
      {cap && (
        <span className="zzz-doc-cap zzz-pressable__hide" aria-hidden="true">
          <span className="zzz-doc-cap__disc" />
        </span>
      )}
      <span className="zzz-doc-pill__label zzz-italic">{label}</span>
    </div>
  )
}

export const Pill_: Story = {
  name: 'Pill',
  render: () => (
    <div className="zzz-doc-row">
      <Cell caption=".zzz-mat-pill (248 × 57)">
        <Pill />
      </Cell>
      <Cell caption="with an icon cap (.zzz-pressable__hide)">
        <Pill label="Recycle" cap />
      </Cell>
      <Cell caption="circle (57 × 57)">
        <div className="zzz-mat-pill" style={{ width: gpx(57), height: gpx(57) }} />
      </Cell>
    </div>
  ),
}

export const Pressed: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          'The reusable pressed recipe. Add `.zzz-pressable`; while `:active` (pointer, or Space held on a native button) or `[data-pressed]` (forced, or `usePressFlash` for Enter) it:',
          '',
          '- draws `var(--zzz-accent)` in `::before`, `--zzz-press-outset` (default `size.control.pressOutset` = 4) beyond the border box on every side, over ring, keyline and bevel;',
          '- turns the label and glyphs (`currentColor`) `color.accent.on` black;',
          '- hides children marked `.zzz-pressable__hide` (icon caps, discs).',
          '',
          'Knobs: `--zzz-press-outset` (set `0` for dialog buttons; inherits), `--zzz-press-border` (the host border width; `.zzz-mat-pill` sets it, never inherits).',
          '',
          '```tsx',
          "const press = usePressFlash({ disabled, onKeyDown, onKeyUp, onBlur })",
          '<button className="zzz-mat-pill zzz-pressable zzz-focusable" data-pressed={forced ? \'\' : press[\'data-pressed\']} {...press}>…</button>',
          '```',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="zzz-doc-row">
      <Cell caption="default">
        <Pill />
      </Cell>
      <Cell caption="[data-pressed] — accent, +4 outset">
        <Pill pressed />
      </Cell>
      <Cell caption="pressed with cap: cap hidden">
        <Pill label="Recycle" cap pressed />
      </Cell>
      <Cell caption="--zzz-press-outset: 0 (dialog)">
        <Pill label="Confirm" pressed style={{ ['--zzz-press-outset' as string]: '0px' }} />
      </Cell>
      <Cell caption="live: press and hold">
        <button type="button" className="zzz-mat-pill zzz-pressable zzz-focusable zzz-doc-pill" style={{ padding: 0 }}>
          <span className="zzz-doc-pill__label zzz-italic">Hold me</span>
        </button>
      </Cell>
    </div>
  ),
}

export const Panel: Story = {
  render: () => (
    <div className="zzz-doc-row zzz-bg-hatch" style={{ padding: gpx(40) }}>
      <Cell caption=".zzz-mat-panel + .zzz-mat-textured header">
        <div className="zzz-mat-panel" style={{ width: gpx(460 - 10), height: gpx(300 - 10), margin: gpx(5), overflow: 'hidden' }}>
          <div className="zzz-mat-textured" style={{ height: gpx(39) }} />
        </div>
      </Cell>
      <Cell caption=".zzz-mat-panel--large">
        <div className="zzz-mat-panel zzz-mat-panel--large" style={{ width: gpx(460 - 8), height: gpx(300 - 8), margin: gpx(4) }} />
      </Cell>
    </div>
  ),
}

export const Surfaces: Story = {
  render: () => (
    <div className="zzz-doc-row">
      <Cell caption=".zzz-mat-textured (#222, dots lg)">
        <div className="zzz-mat-textured zzz-doc-swatch-area" />
      </Cell>
      <Cell caption=".zzz-mat-textured--body (#191919)">
        <div className="zzz-mat-textured zzz-mat-textured--body zzz-doc-swatch-area" />
      </Cell>
      <Cell caption=".zzz-mat-drawer (#1A1A1A, dots md)">
        <div className="zzz-mat-drawer zzz-doc-swatch-area" />
      </Cell>
      <Cell caption=".zzz-bg-hatch (39.8°, 7.68 px)">
        <div className="zzz-bg-hatch zzz-doc-swatch-area" />
      </Cell>
    </div>
  ),
}

export const Dots: Story = {
  render: () => (
    <div className="zzz-doc-row">
      {(
        [
          ['sm', 'var(--zzz-pattern-dots-sm)', 0.025, 0.75, '#090909'],
          ['md', 'var(--zzz-pattern-dots-md)', 0.02, 0.2, '#1A1A1A'],
          ['lg', 'var(--zzz-pattern-dots-lg)', 0.022, 0.18, '#222222'],
          ['sm, exaggerated ×6', 'var(--zzz-pattern-dots-sm)', 0.3, 1, '#333333'],
        ] as const
      ).map(([name, size, alpha, shade, base]) => (
        <Cell key={name} caption={`.zzz-dots ${name}: alpha ${alpha}, shade ${shade}`}>
          <div
            className="zzz-dots zzz-doc-swatch-area"
            style={
              {
                backgroundColor: base,
                '--zzz-dots-size': size,
                '--zzz-dots-alpha': alpha,
                '--zzz-dots-shade': shade,
              } as CSSProperties
            }
          />
        </Cell>
      ))}
    </div>
  ),
}

export const Accent: Story = {
  render: () => (
    <div className="zzz-doc-row">
      <Cell caption=".zzz-accent-fill">
        <div className="zzz-mat-pill zzz-accent-fill zzz-doc-pill">
          <span className="zzz-doc-pill__label zzz-italic">Craft</span>
        </div>
      </Cell>
      <Cell caption=".zzz-accent-ring">
        <div className="zzz-mat-pill zzz-accent-ring zzz-doc-pill">
          <span className="zzz-doc-pill__label zzz-italic">Base</span>
        </div>
      </Cell>
      <Cell caption=".zzz-focusable:focus-visible (Tab to it)">
        <button type="button" className="zzz-mat-pill zzz-focusable zzz-doc-pill" style={{ padding: 0 }}>
          <span className="zzz-doc-pill__label zzz-italic">Focus</span>
        </button>
      </Cell>
    </div>
  ),
}
