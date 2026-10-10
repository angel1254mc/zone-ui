import { Button, Capsule, ContentCard } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a notice card with its header strip, title, body and footer action. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(540 * var(--zzz-px))' }}>
      <ContentCard
        eyebrow="Daily briefing"
        trailing={<Capsule>Day 12</Capsule>}
        title="Rift alert"
        footer={<Button width="compact">Details</Button>}
      >
        <p style={{ margin: 0 }}>Three new rifts reported since midnight.</p>
      </ContentCard>
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
        A content card holds one self-contained piece of content: a header strip, a large title, body text, optional
        media and actions in the footer. Use it for quiz questions, dashboard tiles, notices and detail views. The{' '}
        <code>accent</code> variant marks the featured or current card, and <code>compact</code> suits lists, sidebars
        and phones.
      </p>
      <p>
        For an article in a news listing, where the whole card is one link, use News card. For a framed container with
        your own header layout, use Panel.
      </p>
    </>
  ),
  usageCode: `import { Button, ContentCard } from '@angel1254mc/zone-ui';

<ContentCard
  eyebrow="Notice"
  title="Maintenance tonight"
  footer={<Button width="compact">OK</Button>}
>
  <p>Servers go down at 02:00 for about an hour.</p>
</ContentCard>`,
  examples: [
    {
      demo: 'quiz-question',
      title: 'Quiz question',
      description:
        'The accent variant with a counter and timer in the header, a Choice group in the body and Lock in in the footer.',
    },
    {
      demo: 'side-media',
      title: 'Media beside the body',
      description:
        'With mediaPosition="side" the art takes a column on wide cards and moves above the text on narrow ones.',
    },
    {
      demo: 'dashboard-grid',
      title: 'Dashboard grid',
      description: 'Accent, default and compact cards side by side in a responsive grid.',
    },
  ],
  notes: [
    {
      title: 'Structure',
      items: [
        <>
          The header strip appears when you pass <code>eyebrow</code> or <code>trailing</code>, and the footer when you
          pass <code>footer</code>. A card with only a title and body has neither.
        </>,
        <>
          The card renders an <code>article</code> named by its title. Change the element with <code>as</code> and the
          heading level with <code>titleAs</code>.
        </>,
        <>The card fills its container's width. Set the width on a wrapper or grid cell.</>,
      ],
    },
  ],
  related: ['news-card', 'panel', 'choice-group'],
};

export default doc;
