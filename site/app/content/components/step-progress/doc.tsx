import { StepProgress } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: five pips with the third one current. */
function Thumbnail() {
  return <StepProgress steps={5} current={2} size="lg" />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 1,
  usage: (
    <>
      <p>
        Step progress shows where someone is in a fixed sequence: a wizard, a quiz, onboarding or checkout. Each step is
        pending, current, complete or marked as right, wrong or skipped. It does not move people between steps, so pair
        it with buttons or your own navigation.
      </p>
      <p>
        Use the pips for a compact bar, capsules when each step needs a label, and the text form for a count such as
        Step 3 of 5. For a choice between options, use Choice group.
      </p>
    </>
  ),
  usageCode: `import { StepProgress } from '@angel1254mc/zone-ui';

<StepProgress
  variant="capsules"
  steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Done' }]}
  current={step}
/>`,
  examples: [
    {
      demo: 'wizard',
      title: 'Wizard',
      description: 'Back and Next change the current step, and the text form repeats the count below the labels.',
    },
    {
      demo: 'quiz-results',
      title: 'Quiz results',
      description:
        'Each step takes its own status, so answers show as right, wrong or skipped with the current question last.',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <code>pending</code> is a step not reached yet, and <code>current</code> is the step in progress.
        </>,
        <>
          <code>complete</code> is a finished step. <code>success</code> and <code>error</code> mark a right or wrong
          answer, and <code>skipped</code> marks a step that was passed over.
        </>,
        <>
          Without an explicit <code>status</code>, steps before <code>current</code> are complete and steps after it are
          pending.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The steps form a list named Progress. Pass <code>label</code> to name it for your flow.
        </>,
        <>
          The current step is marked as the current step. Each step is read with its status, for example Step 2,
          Profile, complete. Use <code>statusLabels</code> to change the status words.
        </>,
      ],
    },
  ],
  related: ['progress', 'choice-group', 'segmented-tabs'],
};

export default doc;
