import { Button } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/**
 * Gallery preview: the trigger above a static copy of the open panel. The real menu is a portal, so the panel is
 * drawn inline with the kit's own menu classes, the first item active.
 */
function Thumbnail() {
  const items = ['News', 'Notices', 'Events', 'Agents'];
  return (
    <div style={{ display: 'grid', gap: 'calc(8 * var(--zzz-px))', justifyItems: 'start' }}>
      <Button width="compact">More</Button>
      <div className="zzz-dropdown" data-top-bar="" style={{ position: 'relative', animation: 'none' }}>
        <span className="zzz-dropdown__bar" />
        {items.map((label, i) => (
          <div key={label} className="zzz-dropdown__item" data-active={i === 0 ? '' : undefined}>
            <span className="zzz-dropdown__label">{label}</span>
          </div>
        ))}
      </div>
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
        A dropdown menu puts a short list of actions or destinations behind one button: More, account actions, the tools
        for a card. People open it with a click or the arrow keys. It closes when they choose an item, press{' '}
        <kbd>Escape</kbd> or click outside.
      </p>
      <p>
        Items are menu items, not links, so handle navigation in <code>onSelect</code>. To pick a value that stays on
        screen, like a sort order or a form answer, use Select. For the sections of a website, use the Nav bar or Web
        tabs.
      </p>
    </>
  ),
  usageCode: `import { Button, DropdownMenu } from '@angel1254mc/zone-ui';

<DropdownMenu
  trigger={<Button width="compact">More</Button>}
  items={[
    { id: 'share', label: 'Share' },
    { id: 'report', label: 'Report' },
  ]}
  onSelect={(id) => console.log(id)}
/>`,
  examples: [
    {
      demo: 'icon-trigger',
      title: 'Icon button trigger',
      description: 'A round More button opens an end-aligned menu with icons and no accent bar.',
    },
    {
      demo: 'item-actions',
      title: 'Actions on each item',
      description: 'Each item runs its own onSelect, and an item can turn disabled once its action is done.',
    },
  ],
  types: [
    {
      name: 'DropdownMenuItem',
      rows: [
        { name: 'id', type: 'string', required: true, description: 'Passed to the menu’s `onSelect`.' },
        { name: 'label', type: 'ReactNode', required: true, description: 'Item text.' },
        { name: 'icon', type: 'ReactNode', description: 'A decorative glyph before the label.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the item. Arrow keys and typing skip it.' },
        {
          name: 'onSelect',
          type: '() => void',
          description: 'Runs when this item is chosen, before the menu’s `onSelect`.',
        },
        { name: 'textValue', type: 'string', description: 'Text for type-to-find when `label` is not a string.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>↓</kbd> on the trigger opens the menu on the first item.{' '}
          <kbd>↑</kbd> opens it on the last.
        </>,
        <>
          <kbd>↑</kbd> <kbd>↓</kbd> move between items, <kbd>Home</kbd> and <kbd>End</kbd> jump to the ends, and typing
          jumps to the first item that starts with those letters.
        </>,
        <>
          <kbd>Enter</kbd> or <kbd>Space</kbd> chooses. <kbd>Escape</kbd> closes and returns focus to the trigger.{' '}
          <kbd>Tab</kbd> closes and moves on.
        </>,
      ],
    },
    {
      title: 'Trigger and panel',
      items: [
        <>
          <code>trigger</code> must be a single button element. The menu adds the popup, expanded and controls
          attributes to it.
        </>,
        <>
          The panel opens below by default and flips up when there is no room. <code>className</code>,{' '}
          <code>style</code> and other div props go to the panel.
        </>,
      ],
    },
  ],
  related: ['select', 'button', 'icon-button'],
};

export default doc;
