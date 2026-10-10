import {
  ConsumablesCategoryIcon,
  DriveDiscCategoryIcon,
  IconTabs,
  MaterialsCategoryIcon,
  WEngineCategoryIcon,
} from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the four storage shelves with the second one active. */
function Thumbnail() {
  return (
    <IconTabs
      aria-label="Storage category"
      defaultValue="disc"
      items={[
        { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon /> },
        { value: 'disc', label: 'Drive Disc', icon: <DriveDiscCategoryIcon /> },
        { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon /> },
        { value: 'consumables', label: 'Consumables', icon: <ConsumablesCategoryIcon /> },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.55,
  usage: (
    <>
      <p>
        Icon tabs switch between categories that people know by their glyph, like the W-Engine, Drive Disc, Materials
        and Consumables shelves of a storage screen. The active tab grows into an accent circle that breaks out of the
        pill.
      </p>
      <p>
        The tabs show no text, so every item needs a <code>label</code>: it is the tab's accessible name. When the
        categories need words, use Segmented tabs. For the sections of a website, use Web tabs.
      </p>
    </>
  ),
  usageCode: `import { IconTabs, MaterialsCategoryIcon, WEngineCategoryIcon } from '@angel1254mc/zone-ui';

<IconTabs
  aria-label="Storage category"
  defaultValue="wengine"
  items={[
    { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon /> },
    { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon /> },
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
      demo: 'sizes',
      title: 'Sizes and disabled tabs',
      description: 'Small, medium and large follow the shared control scale, and a disabled tab is skipped.',
      frame: 'start',
    },
  ],
  types: [
    {
      name: 'IconTabsItem',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the tab in `value` and `onValueChange`.',
        },
        { name: 'icon', type: 'ReactNode', required: true, description: 'The glyph: a kit icon, an SVG or an image.' },
        { name: 'label', type: 'string', required: true, description: 'Accessible name of the tab. It is not shown.' },
        { name: 'disabled', type: 'boolean', description: 'Dims the glyph. Arrow keys skip it.' },
        {
          name: 'panelId',
          type: 'string',
          description: 'Id of the panel this tab controls, when you do not use `TabPanel` with the list `id`.',
        },
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
    {
      title: 'Panels',
      items: [
        <>
          Give the tabs an <code>id</code> and each <code>TabPanel</code> the same <code>tabsId</code>. Tabs and panels
          then point at each other for screen readers.
        </>,
        <>
          <code>beat</code> adds a small pulse to the active circle, for screens that should feel more alive.
        </>,
      ],
    },
  ],
  related: ['segmented-tabs', 'web-tabs', 'item-grid'],
};

export default doc;
