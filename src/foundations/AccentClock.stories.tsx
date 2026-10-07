import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZzzTheme } from '../components/ZzzTheme';
import './foundations.css';

const meta = {
  title: 'Foundations/Accent Clock',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One clock drives every selected, active and pressed accent in the kit. `--zzz-accent` is a registered `<color>` animated on `:root` by `@keyframes zzz-accent-pulse`: `#93BA00` (lime) → `#FCDC00` (yellow), 750 ms per half, `cubic-bezier(.45, 0, .55, 1)`, `alternate` (1.5 s period), starting 300 ms into the cycle.',
          '',
          'Components never animate anything themselves: they read `var(--zzz-accent)`, so all of them pulse in phase. Nested `.zzz-theme` roots inherit the page clock, so remounts never reset the phase.',
          '',
          '- `accentPhase="lime" | "mid" | "yellow"` (`data-accent-phase`) pins the accent (visual regression, static mocks). `"mid"` is `#C7CB00`, the time average; the live clock never rests there.',
          '- `accentPhase="live"` starts a clock of its own inside a pinned ancestor.',
          '- `reducedMotion` (`data-reduced-motion`) and `prefers-reduced-motion: reduce` freeze it at lime.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Chip({ caption }: { caption: string }) {
  return (
    <div className="zzz-doc-cell">
      <div className="zzz-doc-accent-chip" />
      <span className="zzz-doc-caption">{caption}</span>
    </div>
  );
}

export const Live: Story = {
  render: () => (
    <div className="zzz-doc-row">
      <Chip caption="var(--zzz-accent), live" />
      <Chip caption="same clock, same phase" />
      <div className="zzz-doc-cell">
        <div className="zzz-mat-pill zzz-pressable zzz-doc-pill" data-pressed="">
          <span className="zzz-doc-pill__label zzz-italic">Pressed</span>
        </div>
        <span className="zzz-doc-caption">.zzz-pressable[data-pressed]</span>
      </div>
    </div>
  ),
};

export const PinnedPhases: Story = {
  render: () => (
    <div className="zzz-doc-row">
      <ZzzTheme accentPhase="lime">
        <Chip caption='accentPhase="lime" #93BA00' />
      </ZzzTheme>
      <ZzzTheme accentPhase="mid">
        <Chip caption='accentPhase="mid" #C7CB00' />
      </ZzzTheme>
      <ZzzTheme accentPhase="yellow">
        <Chip caption='accentPhase="yellow" #FCDC00' />
      </ZzzTheme>
      <ZzzTheme reducedMotion>
        <Chip caption="reducedMotion (frozen lime)" />
      </ZzzTheme>
    </div>
  ),
};

export const LiveInsidePinned: Story = {
  name: 'Live inside a pinned ancestor',
  render: () => (
    <ZzzTheme accentPhase="yellow">
      <div className="zzz-doc-row">
        <Chip caption="pinned yellow" />
        <ZzzTheme accentPhase="live">
          <Chip caption='nested accentPhase="live"' />
        </ZzzTheme>
      </div>
    </ZzzTheme>
  ),
};
