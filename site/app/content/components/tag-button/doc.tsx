import { TagButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the Back tag and its mirrored, red-filled Close twin. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 'calc(28 * var(--zzz-px))', alignItems: 'center' }}>
      <TagButton kind="back" size="lg" />
      <TagButton kind="close" size="lg" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.8,
  usage: (
    <>
      <p>
        Tag buttons are the two tag-shaped buttons at the edges of a screen. The Back tag sits at the top left and
        returns to the previous screen, usually followed by a location pill. The Close tag ends the header of a drawer
        or panel. Both come with an accessible name, "Back" or "Close".
      </p>
      <p>
        Top bar places the Back tag for you, and Drawer the Close tag. For any other single-glyph action, use Icon
        button.
      </p>
    </>
  ),
  usageCode: `import { TagButton } from '@angel1254mc/zone-ui';

<TagButton kind="back" onClick={goBack} />`,
  examples: [
    {
      demo: 'drawer-header',
      title: 'Drawer header',
      description: 'The Close tag at the right end of a header. Press it to close, then reopen with Filter.',
    },
    {
      demo: 'going-back',
      title: 'Going back',
      description: 'Each press of Back drops one screen. At the first screen it turns aria-disabled.',
      frame: 'start',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Each size lines up with a Button of the same size. The second tag is pressed.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Pressed.</b> The whole tag fills with the live accent and grows slightly. Force it with{' '}
          <code>pressed</code>.
        </>,
        <>
          <b>Disabled.</b> <code>disabled</code> or <code>aria-disabled</code>. With <code>aria-disabled</code> the tag
          stays focusable and clicks are ignored.
        </>,
      ],
    },
    {
      title: 'Customising',
      items: [
        <>
          <code>label</code> replaces the accessible name, for example "Close filters".
        </>,
        <>
          <code>icon</code> replaces the U-turn arrow or the cross.
        </>,
      ],
    },
  ],
  related: ['top-bar', 'icon-button', 'drawer'],
};

export default doc;
