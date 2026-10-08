import { EventDescription } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a three-line blurb, right-aligned on a pastel stand-in for event art. */
function Thumbnail() {
  return (
    <div
      style={{
        width: 'calc(460 * var(--zzz-px))',
        padding: 'calc(24 * var(--zzz-px))',
        boxSizing: 'border-box',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventDescription maxWidth="none">
        {'The lanterns are up!\nPlay mini-games around\nthe night market to earn\na limited outfit.'}
      </EventDescription>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Event description is the short blurb under an event's title. The white text has a black sticker outline, so it
        stays readable on bright key art. It is right-aligned by default to sit under a right-aligned Event Title.
      </p>
      <p>
        Line breaks in the text are kept, so you can set the lines yourself; without them it wraps within{' '}
        <code>maxWidth</code>. For a one-line subtitle, use Event Ribbon. To describe what an item or skill does, use
        Effect Text.
      </p>
    </>
  ),
  usageCode: `import { EventDescription } from '@angel1254mc/zone-ui';

<EventDescription>
  {'Play mini-games around the market\\nto earn a limited outfit.'}
</EventDescription>`,
  examples: [
    {
      demo: 'left-header',
      title: 'Left-aligned header',
      description: 'When the art leaves room on the left, align the title and the description to the start.',
    },
    {
      demo: 'wrapping',
      title: 'Line breaks and wrapping',
      description: 'Break the lines yourself in the string, or let the text wrap inside a narrower maxWidth.',
    },
  ],
  related: ['event-title', 'event-ribbon', 'info-pill'],
};

export default doc;
