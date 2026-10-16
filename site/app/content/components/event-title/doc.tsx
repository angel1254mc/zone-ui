import { EventRibbon, EventTitle } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a title and its ribbon, right-aligned on a pastel stand-in for event art. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'calc(20 * var(--zzz-px))',
        width: 'calc(470 * var(--zzz-px))',
        padding: 'calc(26 * var(--zzz-px))',
        boxSizing: 'border-box',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventTitle as="h3" size={46}>
        Night Market
      </EventTitle>
      <EventRibbon>Limited-Time Event</EventRibbon>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero', frame: 'start' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Event title is the big display heading of an event page. The white type has a thick black outline and a hard
        drop shadow, so it reads on any key art. It renders an <code>h1</code> on one line and is right-aligned by
        default, like the rest of the event header.
      </p>
      <p>
        Stack Event Ribbon, Info Pill and Event Description under it to build the header. For the title of an ordinary
        screen, use Page Title.
      </p>
    </>
  ),
  usageCode: `import { EventTitle } from '@angel1254mc/zone-ui';

<EventTitle>Night Market Festival</EventTitle>`,
  examples: [
    {
      demo: 'event-header',
      title: 'Event header',
      description: 'Title, ribbon and description stacked on the right of the art.',
      frame: 'start',
    },
    {
      demo: 'with-info-pills',
      title: 'With info pills',
      description: 'The time left and an Event Details button sit between the title and the description.',
      frame: 'start',
    },
    {
      demo: 'alignment',
      title: 'Alignment, level and size',
      description: 'Align it to match the art, pick the heading level, and set a larger size for short headlines.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Headings',
      items: [
        <>
          It renders an <code>h1</code>. When the event header sits inside a page that already has one, pass{' '}
          <code>as="h2"</code> or lower.
        </>,
        <>
          The title never wraps. Keep it short, or lower <code>size</code> for long names.
        </>,
      ],
    },
  ],
  related: ['event-ribbon', 'event-description', 'page-title'],
};

export default doc;
