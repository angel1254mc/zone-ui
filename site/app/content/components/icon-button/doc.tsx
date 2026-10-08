import { FilterIcon, IconButton, LockIcon, StarIcon, TrashIcon, InfoAlertIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a row of round glyph buttons, with the padlock in its locked look. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 'calc(16 * var(--zzz-px))' }}>
      <IconButton icon={<FilterIcon />} label="Filter" />
      <IconButton icon={<LockIcon />} label="Unlock" tone="lockOn" />
      <IconButton icon={<StarIcon />} label="Favourite" />
      <IconButton icon={<TrashIcon />} label="Discard" />
      <IconButton icon={<InfoAlertIcon />} label="Details" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.7,
  usage: (
    <>
      <p>
        Use an icon button for an action people recognise from its glyph alone: filter, search, lock, discard, details.
        It has no visible text, so <code>label</code> is required and becomes its accessible name. Add a Tooltip when
        the glyph might not be obvious.
      </p>
      <p>
        When the action needs words, use Button. For Back and Close at the edges of a screen, use Tag button. To flip a
        sort order, use Sort toggle.
      </p>
    </>
  ),
  usageCode: `import { FilterIcon, IconButton } from '@angel1254mc/zone-ui';

<IconButton icon={<FilterIcon />} label="Filter" onClick={openFilters} />`,
  examples: [
    {
      demo: 'lock-toggle',
      title: 'Lock toggle',
      description: 'With toggle the button keeps an on state. Swap the glyph with iconOn and the look with tone.',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Each size matches a Button of the same size. Shown at rest, pressed and disabled.',
      frame: 'start',
    },
    {
      demo: 'presets',
      title: 'Presets',
      description: 'Fixed sizes for a pair of steppers and for the search circle on event mission cards.',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Pressed.</b> The live accent fills the circle while it is held. Force it with <code>pressed</code>.
        </>,
        <>
          <b>Toggle.</b> <code>toggle</code> adds <code>aria-pressed</code>. Control it with <code>pressedState</code>{' '}
          or start it with <code>defaultPressedState</code>.
        </>,
        <>
          <b>Disabled.</b> The glyph greys out. Use <code>aria-disabled</code> instead to keep it focusable; clicks are
          ignored either way.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          Every <code>&lt;button&gt;</code> attribute is passed through. An explicit <code>aria-label</code> wins over{' '}
          <code>label</code>.
        </>,
      ],
    },
  ],
  related: ['button', 'tag-button', 'tooltip'],
};

export default doc;
