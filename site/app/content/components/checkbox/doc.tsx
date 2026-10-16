import { Checkbox } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a short settings list with one box ticked, one mixed and one empty. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox size="lg" defaultChecked>
        Show locked items
      </Checkbox>
      <Checkbox size="lg" indeterminate>
        All specialties
      </Checkbox>
      <Checkbox size="lg">Hide duplicates</Checkbox>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        Use a checkbox for a yes-or-no choice in a form, or to pick any number of items from a list. The choice takes
        effect when the form is saved or submitted.
      </p>
      <p>
        For a setting that applies straight away, use Switch. For one choice out of several, use Radio. For filter
        toggles in a drawer, use Chip.
      </p>
    </>
  ),
  usageCode: `import { Checkbox } from '@angel1254mc/zone-ui';

<Checkbox defaultChecked>Show locked items</Checkbox>`,
  examples: [
    {
      demo: 'select-all',
      title: 'Select all',
      description: 'A parent checkbox shows the mixed state while only some of its children are checked.',
      frame: 'start',
    },
    {
      demo: 'in-a-form',
      title: 'In a form',
      description: 'The native input takes name and value, so checked boxes arrive in the form data.',
      frame: 'start',
    },
    {
      demo: 'sizes-and-states',
      title: 'Sizes and states',
      description: 'Small, medium and large, each checked, mixed, unchecked and disabled.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Checked.</b> The box fills with the live accent and the label turns white.
        </>,
        <>
          <b>Mixed.</b> <code>indeterminate</code> draws a bar and reports <code>aria-checked="mixed"</code>. Work it
          out from the children yourself, as in Select all.
        </>,
        <>
          <b>Disabled.</b> Box and label grey out.
        </>,
      ],
    },
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Space</kbd> toggles the focused checkbox. Clicking the label toggles it too.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          <code>className</code> and <code>style</code> go to the outer <code>&lt;label&gt;</code>. <code>ref</code>,{' '}
          <code>name</code>, <code>value</code>, <code>required</code> and every other input attribute go to the native
          checkbox.
        </>,
        <>
          Without visible text, pass <code>aria-label</code>.
        </>,
      ],
    },
  ],
  related: ['switch', 'radio', 'chip'],
};

export default doc;
