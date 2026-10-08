import { Select, SortToggle } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the sort row of a filter drawer, closed (the open list would need a live overlay). */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 'calc(20 * var(--zzz-px))', alignItems: 'center' }}>
      <Select aria-label="Sort by" width={360} defaultValue="rarity" options={[{ value: 'rarity', label: 'Rarity' }]} />
      <SortToggle />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.55,
  usage: (
    <>
      <p>
        Use a select to pick one option from a list that is too long to show at once: a sort order, a server, a region.
        The list opens under the trigger, and typing jumps to a matching option.
      </p>
      <p>
        With only a few options that should all stay visible, use Radio. For a menu of actions rather than a value, use
        Dropdown menu. Pair it with Sort toggle to choose the sort direction.
      </p>
    </>
  ),
  usageCode: `import { Select } from '@angel1254mc/zone-ui';

<Select
  aria-label="Sort by"
  defaultValue="rarity"
  options={[
    { value: 'rarity', label: 'Rarity' },
    { value: 'level', label: 'Level' },
  ]}
/>`,
  examples: [
    {
      demo: 'controlled',
      title: 'Controlled',
      description: 'Keep the value in state and react to it with onValueChange.',
      frame: 'start',
    },
    {
      demo: 'in-a-form',
      title: 'In a form',
      description: 'A visible label, a placeholder, and a name so the value arrives in the form data.',
      frame: 'start',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Small, medium and large match the Text field and Button heights. The last one is disabled.',
      frame: 'start',
    },
  ],
  types: [
    {
      name: 'SelectOption',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the option in `value` and `onValueChange`.',
        },
        {
          name: 'label',
          type: 'string',
          required: true,
          description: 'Text shown in the list and in the trigger. Typing matches against it.',
        },
        { name: 'disabled', type: 'boolean', description: 'Shown but cannot be picked. Arrow keys skip it.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>↓</kbd> and <kbd>↑</kbd> open the list.
        </>,
        <>
          In the list, <kbd>↑</kbd> <kbd>↓</kbd> <kbd>Home</kbd> <kbd>End</kbd> move, <kbd>Enter</kbd> or{' '}
          <kbd>Space</kbd> picks, and <kbd>Esc</kbd> closes.
        </>,
        <>Typing jumps to the next option that starts with those letters. While closed, it selects it straight away.</>,
      ],
    },
    {
      title: 'Forms and labels',
      items: [
        <>
          <code>name</code> adds a hidden input that carries the value.
        </>,
        <>
          <code>aria-label</code>, <code>aria-labelledby</code> and <code>aria-describedby</code> go to the trigger.
          Other attributes go to the wrapper.
        </>,
        <>
          <code>width="fill"</code> stretches the trigger to its container. <code>size="drawer"</code> is a shorter
          select for filter drawers.
        </>,
      ],
    },
  ],
  related: ['sort-toggle', 'radio', 'dropdown-menu'],
};

export default doc;
