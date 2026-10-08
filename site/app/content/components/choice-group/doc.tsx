import { ChoiceGroup } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a quiz question as a list of three answers, one picked. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(480 * var(--zzz-px))' }}>
      <ChoiceGroup
        aria-label="Answers"
        layout="list"
        defaultValue="sixth"
        items={[
          { value: 'lumina', label: 'Lumina Square' },
          { value: 'sixth', label: 'Sixth Street' },
          { value: 'blazewood', label: 'Blazewood' },
        ]}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Use a choice group when people pick one answer, or a few, from a short set of large options: a quiz question, a
        poll, an onboarding or settings picker. It handles selection, arrow keys and optional letter hotkeys. After an
        answer is locked in, it can mark choices right or wrong.
      </p>
      <p>
        Four options sit in a two-by-two grid and fold to one column in narrow containers. For form fields, use Radio or
        Checkbox. For a row of filters, use Chip. For a single option on its own, use Choice button.
      </p>
    </>
  ),
  usageCode: `import { ChoiceGroup } from '@angel1254mc/zone-ui';

<ChoiceGroup
  label="Where is Random Play?"
  items={[
    { value: 'sixth', label: 'Sixth Street' },
    { value: 'lumina', label: 'Lumina Square' },
  ]}
  onValueChange={setAnswer}
/>`,
  examples: [
    {
      demo: 'quiz-with-reveal',
      title: 'Quiz with reveal',
      description:
        'Pick an answer and lock it in: results mark your pick and reveal the right answer, and locked freezes the group.',
    },
    {
      demo: 'poll',
      title: 'Poll',
      description: 'Multiple selection capped at two picks, with the vote share shown as descriptions after voting.',
    },
    {
      demo: 'settings-picker',
      title: 'Settings picker',
      description: 'A list with icon badges, descriptions and one option that is not available yet.',
    },
  ],
  types: [
    {
      name: 'ChoiceItem',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the choice in `value`, `onValueChange` and `results`.',
        },
        {
          name: 'label',
          type: 'ReactNode',
          required: true,
          description: 'The answer text. Wraps to two or three lines.',
        },
        { name: 'description', type: 'ReactNode', description: 'A second, quieter line under the label.' },
        {
          name: 'media',
          type: 'ReactNode',
          description: 'An image or avatar. It is decorative, so the label must stand alone.',
        },
        {
          name: 'badge',
          type: 'ReactNode',
          description: 'Replaces the automatic letter or number in the round cap, for example with an icon.',
        },
        { name: 'hotkey', type: 'string', description: 'One character that picks this choice when `hotkeys` is on.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the label. Arrow keys skip it.' },
        {
          name: 'textValue',
          type: 'string',
          description: 'Plain text for announcements when `label` is not a string.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          The group is one tab stop. Arrow keys, <kbd>Home</kbd> and <kbd>End</kbd> move between choices.
        </>,
        <>
          <kbd>Space</kbd> or <kbd>Enter</kbd> picks the focused choice.
        </>,
        <>
          With <code>hotkeys</code> the badge letter or number picks a choice while focus is in the group. Use{' '}
          <code>hotkeys="global"</code> to listen on the whole page, except in text fields.
        </>,
      ],
    },
    {
      title: 'Results',
      items: [
        <>
          <code>results</code> maps values to <code>correct</code>, <code>incorrect</code> or <code>revealed</code>.
          Choices without an entry keep their normal look.
        </>,
        <>
          <code>locked</code> stops selection changes and dims the other choices. Choices stay focusable so people can
          still read them.
        </>,
        <>
          Results are announced to screen readers. Pass your own text in <code>announcement</code>, or false to handle
          it yourself.
        </>,
      ],
    },
  ],
  related: ['choice-button', 'content-card', 'step-progress'],
};

export default doc;
