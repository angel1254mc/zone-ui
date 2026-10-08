import { SegmentedTabs } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three tabs with the middle one selected. */
function Thumbnail() {
  return (
    <SegmentedTabs
      aria-label="Manage item"
      width={500}
      defaultValue="dismantle"
      items={[
        { value: 'craft', label: 'Craft' },
        { value: 'dismantle', label: 'Dismantle' },
        { value: 'destroy', label: 'Destroy' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Segmented tabs switch between two to five views of the same thing, like Craft, Dismantle and Destroy for one
        item. The active fill slides between tabs and the arrow keys move it.
      </p>
      <p>
        Pair them with <code>TabPanel</code> for the content. For page-level sections on a website, use Web tabs
        instead.
      </p>
    </>
  ),
  usageCode: `import { SegmentedTabs } from '@angel1254mc/zone-ui';

<SegmentedTabs
  aria-label="Manage item"
  defaultValue="craft"
  items={[
    { value: 'craft', label: 'Craft' },
    { value: 'dismantle', label: 'Dismantle' },
  ]}
/>`,
  examples: [
    {
      demo: 'with-panels',
      title: 'With panels',
      description: 'Controlled tabs that show one TabPanel at a time. Click a tab or use the arrow keys.',
      frame: 'start',
    },
    {
      demo: 'surfaces',
      title: 'Surfaces',
      description: 'A black track for toolbars, and a dot-mesh track for panels and detail views.',
      frame: 'start',
    },
    {
      demo: 'fill-width',
      title: 'Fill the width',
      description: 'With width="fill" the tabs share the container, which suits a section bar.',
    },
  ],
  types: [
    {
      name: 'SegmentedTabsItem',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the tab in `value` and `onValueChange`.',
        },
        { name: 'label', type: 'ReactNode', required: true, description: 'Text or node shown in the tab.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the label. Arrow keys skip it.' },
        { name: 'aria-label', type: 'string', description: 'Accessible name when `label` is not plain text.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>←</kbd> <kbd>→</kbd> move between tabs and select them. <kbd>Home</kbd> and <kbd>End</kbd> jump to the
          first and last.
        </>,
        <>Disabled tabs are skipped.</>,
      ],
    },
  ],
  related: ['web-tabs', 'icon-tabs', 'chip'],
};

export default doc;
