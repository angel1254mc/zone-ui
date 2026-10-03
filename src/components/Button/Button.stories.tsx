import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import {
  CheckIcon,
  CloseIcon,
  CombatSIcon,
  CompareIcon,
  EnhanceIcon,
  FilterIcon,
  HomeIcon,
  InfoAlertIcon,
  RecommendIcon,
  RecycleIcon,
  ResetIcon,
} from '../../icons'
import { AgentImage } from '../../../examples/art'
import { Button } from './Button'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--zzz-space-control-gap)', flexWrap: 'wrap' }
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: gpx(28), alignItems: 'flex-start' }
const caption: CSSProperties = { font: '600 13px/1.3 system-ui, sans-serif', color: '#9a9a9a' }
const stage: CSSProperties = { background: '#000', padding: gpx(28) }

const Stage = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ ...stage, ...style }}>{children}</div>
)

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'View', width: 'default' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    width: { control: 'select', options: ['auto', 'compact', 'default', 'dialog', 'wide'] },
    iconTone: {
      control: 'select',
      options: ['plain', 'confirm', 'cancel', 'recycle', 'reset', 'compare', 'recommend', 'combat'],
    },
    variant: { control: 'inline-radio', options: ['default', 'mission', 'sub'] },
    missionState: { control: 'inline-radio', options: ['default', 'claimed', 'locked'] },
    icon: { control: false },
    avatar: { control: false },
  },
  decorators: [(S) => <Stage>{S()}</Stage>],
  parameters: {
    docs: {
      description: {
        component: [
          'The kit\'s action button: the dark pill material (5 px `#333` ring with a lit',
          'top/left row, `#090909` + dot mesh, 3 px black keyline), an optional leading **icon cap** (a circle as',
          'tall as the pill with a 34 px coloured disc, or a white glyph straight on black), and a 26 px italic label.',
          '',
          '- **Hover:** nothing (no hover state by design).',
          '- **Pressed** (`:active`, Space held, a 100 ms flash on Enter, or `pressed`): the live accent fills the pill',
          '  and grows 4 px on every side (`pressOutset`, 0 for dialog buttons); ring, cap and disc vanish; label and',
          '  glyph turn black.',
          '- **Disabled:** label/glyph `#666`, shape unchanged, no opacity. Use `aria-disabled` to keep it focusable.',
          '',
          '**Sizes** (the shared web control scale, `size.control.*`): `sm` 46 · `md` 57 (default) · `lg` 69',
          'design units, about **32 / 40 / 48 CSS px** at the default `--zzz-scale` 0.7. Label',
          '(21 / 26 / 30), icon cap, disc, glyph and padding come from the size tokens; ring, bevel, keyline, pressed',
          'outset and the preset widths scale with the size, so every size keeps the ZZZ proportions.',
          '*Migration:* `lg` used to mean the 59-unit top-bar / dialog pill; it now means the web `lg` (69). Use `md`',
          'for the old look (2 units shorter). `width="dialog"` no longer implies `lg`.',
          '',
          'Widths (md; × size ratio on sm / lg): compact 233, default 248, dialog 275, wide 282, `auto`, or a number',
          '(absolute design units). `width="dialog"` implies `pressOutset={0}`. Rows use `space.controlGap` (24) between',
          'siblings and `space.dialogButtonGap` (28) between Cancel and Confirm. `href` renders an `<a>`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Widths: Story = {
  render: () => (
    <div style={col}>
      <Button width="compact">Remove</Button>
      <Button width="default">View</Button>
      <Button width="dialog">Confirm</Button>
      <Button width="wide">Auto Add</Button>
      <Button width="auto">Auto</Button>
      <Button width={325}>Craft</Button>
    </div>
  ),
}

const SIZES = ['sm', 'md', 'lg'] as const
const sizeLabel: CSSProperties = { ...caption, width: 32, flexShrink: 0 }

export const Sizes: Story = {
  render: () => (
    <div style={col}>
      {SIZES.map((size) => (
        <div key={size} style={row}>
          <span style={sizeLabel}>{size}</span>
          <Button size={size}>View</Button>
          <Button size={size} icon={<FilterIcon />} width="compact">
            Filter
          </Button>
          <Button size={size} icon={<CheckIcon />} iconTone="confirm" width="dialog">
            Confirm
          </Button>
          <Button size={size} icon={<HomeIcon />} pressed>
            City
          </Button>
          <Button size={size} variant="sub" icon={<EnhanceIcon />} aria-label="Enhance" />
          <Button size={size} disabled>
            Craft
          </Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` 46 · `md` 57 · `lg` 69 design units — about 32 / 40 / 48 px at the default scale (0.7). Each row: auto width, a compact capped pill, a dialog pill with a disc, pressed (outset scales with the size), the `>>` sub-pill and disabled.',
      },
    },
  },
}

export const IconCaps: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <Button width="dialog" icon={<CheckIcon />} iconTone="confirm">
          Confirm
        </Button>
        <Button width="dialog" icon={<CloseIcon />} iconTone="cancel">
          Cancel
        </Button>
      </div>
      <div style={row}>
        <Button width="wide" icon={<RecycleIcon />} iconTone="recycle">
          Recycle
        </Button>
        <Button width="wide" icon={<ResetIcon />} iconTone="reset">
          Reset
        </Button>
      </div>
      <div style={row}>
        <Button width="compact" icon={<CompareIcon />} iconTone="compare">
          Compare
        </Button>
        <Button width="compact" icon={<RecommendIcon />} iconTone="recommend">
          Recommend
        </Button>
      </div>
      <div style={row}>
        <Button width="compact" icon={<HomeIcon />}>
          City
        </Button>
        <Button width="compact" icon={<FilterIcon />}>
          Filter
        </Button>
        <Button width={260} icon={<CombatSIcon />} iconTone="combat" twoLine>
          {'Combat\nReadiness'}
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disc tones: confirm green, cancel red, recycle blue, reset orange, compare yellow, recommend lime, combat orange; `plain` (default) puts a white glyph straight on the black cap (City house, Filter funnel). "Recommend" auto-shrinks to fit the 233 pill.',
      },
    },
  },
}

export const Avatar: Story = {
  render: () => (
    <Button width={270} twoLine avatar={<AgentImage seed={3} crop="circle" alt="" />}>
      {'Special\nTraining Plan'}
    </Button>
  ),
  parameters: { docs: { description: { story: 'The cap holds an avatar (`avatar` slot: an `<img>` src string or any node).' } } },
}

export const TwoLine: Story = {
  render: () => (
    <Button width="default" twoLine icon={<InfoAlertIcon />}>
      {'Stat\nBonuses'}
    </Button>
  ),
}

export const Pressed: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <Button width="compact" icon={<FilterIcon />} pressed>
          Filter
        </Button>
        <Button width={325} pressed>
          Craft
        </Button>
      </div>
      <div style={row}>
        <Button width="dialog" icon={<CheckIcon />} iconTone="confirm" pressed>
          Confirm
        </Button>
        <Button variant="sub" icon={<EnhanceIcon />} aria-label="Enhance" pressed />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Forced with `pressed` (`data-pressed`). The dialog Confirm uses `pressOutset` 0 (no growth).',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <Button width="wide" disabled>
          Auto Add
        </Button>
        <Button width={325} aria-disabled="true">
          Craft
        </Button>
      </div>
      <Button width="dialog" icon={<CheckIcon />} iconTone="confirm" disabled>
        Confirm
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Label and glyph `#666`, ring/fill/shape unchanged. A coloured disc is kept and its glyph greyed.',
      },
    },
  },
}

export const DialogPair: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--zzz-space-dialog-button-gap)' }}>
      <Button width="dialog" icon={<CloseIcon />} iconTone="cancel">
        Cancel
      </Button>
      <Button width="dialog" icon={<CheckIcon />} iconTone="confirm">
        Confirm
      </Button>
    </div>
  ),
}

export const Mission: Story = {
  render: () => (
    <div style={{ ...col, background: '#F58DB0', padding: gpx(24) }}>
      <Button variant="mission">Go</Button>
      <Button variant="mission" missionState="claimed">
        Claimed
      </Button>
      <Button variant="mission" missionState="locked">
        Stay Tuned
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Event mission-card button: 174×48, 4 px `#333034` ring, 2 px black gap, 4 px teal halo (`--zzz-button-halo` overrides the per-event colour). `claimed` / `locked` are disabled.',
      },
    },
  },
}

export const SubPill: Story = {
  render: () => (
    <div style={row}>
      <Button variant="sub" icon={<EnhanceIcon />} aria-label="Enhance" />
      <Button variant="sub" icon={<EnhanceIcon />} aria-label="Enhance" pressed />
    </div>
  ),
  parameters: { docs: { description: { story: 'The `>>` sub-pill (81×57) at the end of the stars pill, rest and pressed (`variant="sub"`).' } } },
}

export const AsLink: Story = {
  render: () => (
    <Button href="#city" width="compact" icon={<HomeIcon />}>
      City
    </Button>
  ),
}
