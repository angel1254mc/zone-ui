import { Button, CheckIcon, CloseIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';
import { ButtonPlayground } from './playground';

/** Gallery preview: the Cancel / Confirm pair every dialog ends with. */
function Thumbnail() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button width="dialog" icon={<CloseIcon />} iconTone="cancel">
        Cancel
      </Button>
      <Button width="dialog" icon={<CheckIcon />} iconTone="confirm">
        Confirm
      </Button>
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
        Use a button for an action on the current screen: confirm a dialog, start a run, open a filter. For navigation
        that should look like a button, pass <code>href</code> and it renders a link.
      </p>
      <p>
        The icon cap is optional. Give it a coloured disc with <code>iconTone</code> when the action has a meaning
        people already know: confirm, cancel, reset, recycle.
      </p>
      <p>
        For the one big action on an event page, use <code>variant=&quot;event&quot;</code>. For a featured action such
        as a draw or a purchase, <code>variant=&quot;marquee&quot;</code> drifts big words behind the label and can show
        its price in a <code>cost</code> segment.
      </p>
    </>
  ),
  usageCode: `import { Button } from '@angel1254mc/zone-ui';

<Button onClick={start}>Start</Button>`,
  examples: [
    {
      demo: 'icon-tones',
      title: 'Icon tones',
      description: 'A coloured disc behind the glyph tells people what the action does before they read it.',
    },
    {
      demo: 'dialog-actions',
      title: 'Dialog actions',
      description: 'Cancel on the left, Confirm on the right, with the dialog gap token between them.',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Small, medium and large follow the shared control scale, about 32, 40 and 48 px tall.',
    },
    {
      demo: 'variants',
      title: 'Variants',
      description: 'The compact sub-pill for a single glyph, and the mission button used on event cards.',
    },
    {
      demo: 'event-cta',
      title: 'Event call to action',
      description:
        'The event variant is 284 units wide with chevrons drifting right, for the main action on an event page.',
      frame: 'bleed',
    },
    {
      demo: 'marquee',
      title: 'Marquee',
      description: 'Big words drift behind the label; a cost segment and the icon cap are both optional.',
    },
    {
      demo: 'as-link',
      title: 'As a link',
      description: 'With href the button renders an anchor, so it works with your router and opens in new tabs.',
    },
  ],
  playground: ButtonPlayground,
  types: [
    {
      name: 'ButtonCost',
      rows: [
        {
          name: 'amount',
          type: 'ReactNode',
          required: true,
          description: 'The price, e.g. `× 1`. Screen readers hear it as the button description.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description:
            'Shown before the amount and hidden from assistive tech, so name the currency in `amount` if it matters.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Pressed.</b> The live accent fills the pill while it is held (pointer, Space, or a short flash on Enter).
          Force it with <code className="d-inline-code">pressed</code>.
        </>,
        <>
          <b>Disabled.</b> The label greys out and the shape stays. Prefer{' '}
          <code className="d-inline-code">aria-disabled</code> when the button should stay focusable.
        </>,
        <>
          <b>Hover.</b> None, by design. The kit behaves like a game menu.
        </>,
      ],
    },
    {
      title: 'Motion',
      items: [
        <>
          The <code className="d-inline-code">event</code> and <code className="d-inline-code">marquee</code>{' '}
          backgrounds drift slowly to the right. <code className="d-inline-code">still</code> stops them, and they stop
          on their own when the system asks for reduced motion.
        </>,
        <>
          The drifting words are decorative and hidden from assistive tech. The{' '}
          <code className="d-inline-code">cost</code> segment is read as the button&apos;s description.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          Every <code className="d-inline-code">&lt;button&gt;</code> attribute is passed through (
          <code className="d-inline-code">onClick</code>, <code className="d-inline-code">type</code>,{' '}
          <code className="d-inline-code">disabled</code>…). With <code className="d-inline-code">href</code>, anchor
          attributes apply instead.
        </>,
      ],
    },
  ],
  related: ['icon-button', 'copy-button', 'tag-button'],
};

export default doc;
