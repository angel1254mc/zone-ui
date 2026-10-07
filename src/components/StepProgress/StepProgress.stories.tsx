import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../Button';
import { StepProgress } from './StepProgress';
import type { StepItem } from './StepProgress';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-label)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
};
const col: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: gpx(26),
  width: gpx(860),
  maxWidth: '100%',
};

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(8) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

const quiz: StepItem[] = [{ status: 'success' }, { status: 'error' }, { status: 'success' }, {}, {}];
const checkout: StepItem[] = [{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Review' }];
const allStatuses: StepItem[] = [
  { label: 'Pending', status: 'pending' },
  { label: 'Current', status: 'current' },
  { label: 'Complete', status: 'complete' },
  { label: 'Success', status: 'success' },
  { label: 'Error', status: 'error' },
  { label: 'Skipped', status: 'skipped' },
];

/** Stories that draw their own frame (story decorators cannot remove the meta one). */
const BARE = ['Phone Width'];

const meta = {
  title: 'Data Display/StepProgress',
  component: StepProgress,
  tags: ['autodocs'],
  args: { steps: 5, current: 2 },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['pips', 'capsules', 'text'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    steps: { control: 'object' },
  },
  decorators: [
    (Story, ctx) =>
      BARE.includes(ctx.name) ? (
        <Story />
      ) : (
        <div
          style={{
            padding: gpx(28),
            background: 'var(--zzz-color-bg-base)',
          }}
        >
          <Story />
        </div>
      ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Horizontal step indicator for quizzes, wizards, onboarding and checkout.',
      },
    },
  },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pips: Story = {};

/** Every variant at sm / md / lg. */
export const Sizes: Story = {
  render: () => (
    <div style={col}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Labeled key={size} label={size}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: gpx(16),
            }}
          >
            <StepProgress
              steps={quiz}
              current={3}
              size={size}
              stepName="Question"
              statusLabels={{
                success: 'correct',
                error: 'wrong',
              }}
            />
            <StepProgress variant="capsules" steps={checkout} current={2} size={size} label={`Checkout (${size})`} />
            <StepProgress variant="text" steps={5} current={2} size={size} />
          </div>
        </Labeled>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={col}>
      <Labeled label="pips · quiz (success / error / success / current / pending)">
        <StepProgress
          steps={quiz}
          current={3}
          stepName="Question"
          statusLabels={{ success: 'correct', error: 'wrong' }}
        />
      </Labeled>
      <Labeled label="pips · sm">
        <StepProgress steps={8} current={5} size="sm" />
      </Labeled>
      <Labeled label="capsules · checkout">
        <StepProgress variant="capsules" steps={checkout} current={2} label="Checkout" />
      </Labeled>
      <Labeled label="capsules · sm, no labels">
        <StepProgress variant="capsules" steps={5} current={1} size="sm" />
      </Labeled>
      <Labeled label="text">
        <StepProgress variant="text" steps={5} current={2} />
      </Labeled>
      <Labeled label="text · stepName='Question', sm">
        <StepProgress variant="text" steps={5} current={4} stepName="Question" size="sm" />
      </Labeled>
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div style={col}>
      <StepProgress steps={allStatuses} />
      <StepProgress variant="capsules" steps={allStatuses.slice(0, 3)} />
      <StepProgress variant="capsules" steps={allStatuses.slice(3)} />
      <span style={caption}>six capsules in a narrow row: non-current steps collapse to their disc</span>
      <StepProgress variant="capsules" steps={allStatuses} />
    </div>
  ),
};

function WizardDemo() {
  const [step, setStep] = useState(0);
  const steps: StepItem[] = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Preferences' }, { label: 'Done' }];
  return (
    <div style={col}>
      <StepProgress variant="capsules" steps={steps} current={step} label="Onboarding" />
      <StepProgress variant="text" steps={steps.length} current={step} />
      <div style={{ display: 'flex', gap: gpx(16) }}>
        <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button disabled={step >= steps.length - 1} onClick={() => setStep((s) => s + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

/** Wizard: step forward / back. */
export const Wizard: Story = { render: () => <WizardDemo /> };

/** Phone width (360 px at --zzz-scale 0.6): pips shrink, capsule labels ellipsise. */
export const PhoneWidth: Story = {
  render: () => (
    <div
      className="zzz-theme"
      style={
        {
          '--zzz-scale': 0.6,
          width: 360,
          padding: 16,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        } as CSSProperties
      }
    >
      <StepProgress steps={quiz} current={3} />
      <StepProgress steps={10} current={6} />
      <StepProgress variant="capsules" steps={checkout} current={1} />
      <StepProgress variant="text" steps={5} current={3} stepName="Question" />
    </div>
  ),
};
