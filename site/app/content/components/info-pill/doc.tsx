import { ClockIcon, InfoAlertIcon, InfoPill } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the time-left pill and the Event Details pill on a pastel stand-in for event art. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'calc(11 * var(--zzz-px))',
        padding: 'calc(26 * var(--zzz-px))',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <InfoPill icon={<ClockIcon />}>66d</InfoPill>
      <InfoPill icon={<InfoAlertIcon />}>Event Details</InfoPill>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        An info pill is a black pill with an outline glyph and a short text. Event pages use it for the time left
        ("66d") and for the button that opens the event rules. Without <code>onClick</code> it is plain text; with it,
        it becomes a button.
      </p>
      <p>
        For a live countdown to a date, use Countdown. For a level or count under a tile, use Capsule. For a regular
        action, use Button.
      </p>
    </>
  ),
  usageCode: `import { ClockIcon, InfoPill } from '@angel1254mc/zone-ui';

<InfoPill icon={<ClockIcon />}>66d</InfoPill>`,
  examples: [
    {
      demo: 'event-details',
      title: 'Timer and details',
      description: 'A static timer next to a button pill that shows and hides the event rules.',
    },
    {
      demo: 'check-in-event',
      title: 'Under an event title',
      description: 'A row of pills under the title. The last one has no icon and stays plain text.',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Pressed.</b> Button pills fill with the live accent, the label turns black and the glyph hides. Force it
          with <code>pressed</code>.
        </>,
        <>
          <b>Disabled.</b> Button pills only. The label and glyph grey out and the shape stays.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>The glyph is decorative, so the text must make sense on its own.</>,
        <>
          A button pill passes through button attributes, such as <code>aria-expanded</code> when it toggles content.
        </>,
      ],
    },
  ],
  related: ['countdown', 'event-title', 'capsule'],
};

export default doc;
