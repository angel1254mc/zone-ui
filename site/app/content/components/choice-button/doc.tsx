import { ChoiceButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three lettered answers with the middle one selected. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(16 * var(--zzz-px))', width: 'calc(480 * var(--zzz-px))' }}>
      <ChoiceButton badge="A">Ballet Twins Road</ChoiceButton>
      <ChoiceButton badge="B" selected>
        Lumina Square
      </ChoiceButton>
      <ChoiceButton badge="C">Sixth Street</ChoiceButton>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.45,
  usage: (
    <>
      <p>
        A choice button is a large answer people can pick: a quiz answer, a poll option, a plan or an onboarding topic.
        It can carry a letter or icon badge, a description and an image, and it can show whether the answer was right.
      </p>
      <p>
        For a set of answers with keyboard support, hotkeys and results built in, use Choice group. For small choices in
        a web form, use Radio or Checkbox.
      </p>
    </>
  ),
  usageCode: `import { ChoiceButton } from '@angel1254mc/zone-ui';

<ChoiceButton badge="A" selected={picked === 'a'} onClick={() => setPicked('a')}>
  Ballet Twins Road
</ChoiceButton>`,
  examples: [
    {
      demo: 'show-the-answer',
      title: 'Showing the answer',
      description: 'After a pick, mark it correct or incorrect and reveal the right answer.',
    },
    {
      demo: 'with-descriptions',
      title: 'Icons and descriptions',
      description: 'Independent toggles with an icon badge and a muted line under the label.',
    },
    {
      demo: 'with-media',
      title: 'With an image',
      description: 'mediaLayout="cover" puts a wide image above the label, for picture answers.',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Selected.</b> An accent ring and accent badge that pulse with the live accent.
        </>,
        <>
          <b>Results.</b> <code>result</code> overrides the selected look: <code>correct</code> (green, or the accent
          with <code>correctTone="accent"</code>), <code>incorrect</code> (red) and <code>revealed</code> (the right
          answer when another one was picked).
        </>,
        <>
          <b>Disabled.</b> The label greys out and the shape stays.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          On its own with <code>selected</code>, the button reports <code>aria-pressed</code>. Give it{' '}
          <code>role="radio"</code> or <code>role="checkbox"</code> inside your own group and it reports{' '}
          <code>aria-checked</code> instead.
        </>,
        <>
          Screen readers hear the result after the label: "Correct", "Incorrect" or "Correct answer". Change the words
          with <code>resultLabel</code>.
        </>,
        <>
          <code>media</code> is decorative and hidden from assistive tech, so the label must make sense on its own.
        </>,
      ],
    },
  ],
  related: ['choice-group', 'radio', 'button'],
};

export default doc;
