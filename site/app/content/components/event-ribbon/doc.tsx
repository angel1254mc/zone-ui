import { EventRibbon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the ribbon on a dusk stand-in for event art. */
function Thumbnail() {
  return (
    <div
      style={{
        padding: 'calc(28 * var(--zzz-px))',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventRibbon>New Chapter Unlocked</EventRibbon>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero', frame: 'start' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.5,
  usage: (
    <>
      <p>
        The event ribbon is the white subtitle band under an event title, like "New Chapter Unlocked". It holds one line
        that never wraps, and fades into halftone dots at both ends. It sizes to its text.
      </p>
      <p>
        Keep it to a few words. For longer copy, use Event Description below it. To label the type of a news post, use
        Category Tag.
      </p>
    </>
  ),
  usageCode: `import { EventRibbon } from '@angel1254mc/zone-ui';

<EventRibbon>New Chapter Unlocked</EventRibbon>`,
  examples: [
    {
      demo: 'under-title',
      title: 'Under the title',
      description: 'Right-aligned under the event title, with a short gap between them.',
      frame: 'start',
    },
    {
      demo: 'lengths',
      title: 'Short and long',
      description: 'The ribbon grows with its text and keeps the dot fade at both ends.',
      frame: 'start',
    },
  ],
  related: ['event-title', 'event-description', 'category-tag'],
};

export default doc;
