import { EventCtaButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the button with its chevrons held still, since cards must not animate. */
function Thumbnail() {
  return <EventCtaButton still>Go</EventCtaButton>;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.8,
  usage: (
    <>
      <p>
        The event CTA is the large pill in the bottom-right corner of an event page that takes people into the event.
        Its fill is a band of chevrons drifting to the right. <code>still</code> stops the drift, and it also stops for
        people who prefer reduced motion.
      </p>
      <p>
        Use one per event screen. For any other action, use Button. For the small Go button on a mission card, use{' '}
        <code>Button variant="mission"</code>.
      </p>
    </>
  ),
  usageCode: `import { EventCtaButton } from '@angel1254mc/zone-ui';

<EventCtaButton onClick={openEvent}>Go</EventCtaButton>`,
  examples: [
    {
      demo: 'on-event-art',
      title: 'On event art',
      description: 'Anchored to the bottom right of the art, next to the time-left pill. Press it to enter.',
      frame: 'start',
    },
    {
      demo: 'states',
      title: 'Still, pressed and disabled',
      description: 'Held still, forced into the pressed look, and disabled.',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Pressed.</b> The pill fills with the live accent, the label turns black and the chevrons hide. Force it
          with <code>pressed</code>.
        </>,
        <>
          <b>Disabled.</b> Use <code>disabled</code>, or <code>aria-disabled</code> to keep it focusable. Either way,
          clicks are ignored.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          Every <code>&lt;button&gt;</code> attribute is passed through. <code>type</code> defaults to{' '}
          <code>button</code>.
        </>,
      ],
    },
  ],
  related: ['button', 'info-pill', 'event-title'],
};

export default doc;
