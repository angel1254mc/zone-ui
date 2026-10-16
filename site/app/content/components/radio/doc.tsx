import { Radio, RadioGroup } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a labelled group with the middle option checked. */
function Thumbnail() {
  return (
    <RadioGroup label="Difficulty" defaultValue="hard" size="lg">
      <Radio value="normal">Normal</Radio>
      <Radio value="hard">Hard</Radio>
      <Radio value="hell">Hell</Radio>
    </RadioGroup>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        Use a radio group for one choice from a short list in a web form, when every option should stay visible.{' '}
        <code>RadioGroup</code> labels the set, shares one <code>name</code> and handles the arrow keys. Each{' '}
        <code>Radio</code> is a native radio input.
      </p>
      <p>
        For a long list, use Select. For a single-choice filter in a drawer, use a Chip group with{' '}
        <code>multiple={'{false}'}</code>. For large picture or quiz answers, use Choice group.
      </p>
    </>
  ),
  usageCode: `import { Radio, RadioGroup } from '@angel1254mc/zone-ui';

<RadioGroup label="Difficulty" defaultValue="normal">
  <Radio value="normal">Normal</Radio>
  <Radio value="hard">Hard</Radio>
</RadioGroup>`,
  examples: [
    {
      demo: 'controlled',
      title: 'Controlled',
      description: 'Keep the value in state and show what the choice means.',
      frame: 'start',
    },
    {
      demo: 'horizontal',
      title: 'Horizontal',
      description: 'orientation="horizontal" puts short options on one line.',
      frame: 'start',
    },
    {
      demo: 'in-a-form',
      title: 'In a form',
      description: 'Give the group a name and the checked value arrives in the form data.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Tab</kbd> enters the group on the checked radio, or on the first enabled one.
        </>,
        <>
          <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> move and select. They wrap around and skip disabled
          radios.
        </>,
      ],
    },
    {
      title: 'States',
      items: [
        <>
          <b>Checked.</b> The circle fills with the live accent, gets a black dot, and the label turns white.
        </>,
        <>
          <b>Disabled.</b> Disable one <code>Radio</code>, or the whole group with <code>disabled</code> on{' '}
          <code>RadioGroup</code>.
        </>,
        <>
          <b>Sizes.</b> <code>size</code> on the group sets every radio. A radio's own <code>size</code> wins.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          On <code>Radio</code>, <code>className</code> and <code>style</code> go to the outer{' '}
          <code>&lt;label&gt;</code>. <code>ref</code> and other input attributes go to the native radio.
        </>,
        <>
          Without a <code>name</code>, the group generates one.
        </>,
      ],
    },
  ],
  related: ['checkbox', 'select', 'chip'],
};

export default doc;
