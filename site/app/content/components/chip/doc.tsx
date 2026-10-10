import { ChipGroup } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a labelled two-column filter section with two chips selected. */
function Thumbnail() {
  return (
    <ChipGroup
      label="Agent Specialties"
      defaultValue={['attack', 'anomaly']}
      options={[
        { value: 'attack', label: 'Attack' },
        { value: 'stun', label: 'Stun' },
        { value: 'anomaly', label: 'Anomaly' },
        { value: 'support', label: 'Support' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.45,
  usage: (
    <>
      <p>
        Chips are filter toggles, the kind that fill a filter drawer. <code>ChipGroup</code> lays out a labelled section
        of them and lets people pick several, or just one with <code>multiple={'{false}'}</code>. A single{' '}
        <code>Chip</code> works on its own as an on/off toggle.
      </p>
      <p>In web forms, use Checkbox or Radio instead. To switch between views of the same thing, use Segmented tabs.</p>
    </>
  ),
  usageCode: `import { ChipGroup } from '@angel1254mc/zone-ui';

<ChipGroup
  label="Rarity"
  defaultValue={['s']}
  options={[
    { value: 's', label: 'S' },
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ]}
/>`,
  examples: [
    {
      demo: 'controlled-group',
      title: 'Controlled group',
      description: 'Keep the selected values in state and filter your list with them.',
      frame: 'start',
    },
    {
      demo: 'single-choice',
      title: 'Single choice',
      description: 'With multiple={false} one chip stays selected and the arrow keys move the selection.',
      frame: 'start',
    },
    {
      demo: 'standalone',
      title: 'Standalone chip',
      description: 'One chip outside a group is a toggle button for a single filter.',
    },
  ],
  types: [
    {
      name: 'ChipGroupOption',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the chip in `value` and `onValueChange`.',
        },
        { name: 'label', type: 'ReactNode', required: true, description: 'Text shown on the chip.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the chip. Arrow keys skip it.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Space</kbd> or <kbd>Enter</kbd> toggles the focused chip.
        </>,
        <>
          In a multiple group every chip is a tab stop, and <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>{' '}
          <kbd>Home</kbd> <kbd>End</kbd> also move focus.
        </>,
        <>In a single-choice group only the selected chip is a tab stop, and the arrow keys move and select.</>,
      ],
    },
    {
      title: 'States',
      items: [
        <>
          <b>Selected.</b> The live accent fills the chip and the label turns black.
        </>,
        <>
          <b>Disabled.</b> The label greys out. The disabled look wins over selected.
        </>,
        <>
          <b>Roles.</b> A standalone chip reports <code>aria-pressed</code>. Inside a group the chips are checkboxes, or
          radios in a single-choice group.
        </>,
      ],
    },
  ],
  related: ['checkbox', 'segmented-tabs', 'drawer'],
};

export default doc;
