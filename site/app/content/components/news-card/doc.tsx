import { NewsCard } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: one article card. The banner is a drawn graphic, so the card loads no images. */
function Thumbnail() {
  return (
    <NewsCard
      href="#news"
      art={<span style={{ background: 'linear-gradient(115deg, var(--zzz-accent) 0 34%, #1d1d1d 34% 100%)' }} />}
      date="2024/07/04"
      category="Notices"
      title="Signal Search Probability Details"
      description="Channel rates, pity rules and guarantees for the current version."
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.46,
  usage: (
    <>
      <p>
        A news card lists one article on a website: banner art, date, category tag, headline and a two-line summary. The
        whole card is one link, so pass <code>href</code>. Headlines stop after one line and summaries after two, so a
        grid of cards keeps even rows.
      </p>
      <p>
        For content that is not a link, or that needs its own buttons, use Content card. To filter a list of articles by
        category, put Web tabs above the grid.
      </p>
    </>
  ),
  usageCode: `import { NewsCard } from '@angel1254mc/zone-ui';

<NewsCard
  href="/news/check-in"
  art={<img src="/banners/check-in.jpg" alt="" />}
  date="2024/07/03"
  category="Events"
  title="Daily Check-In"
  description="Check in every day to claim Polychromes."
/>`,
  examples: [
    {
      demo: 'news-grid',
      title: 'News grid',
      description: 'Cards in a list grid that adds columns as the page gets wider.',
    },
    {
      demo: 'light-page',
      title: 'On a light page',
      description: 'tone="light" switches the text to dark colours for pages with a light background.',
    },
    {
      demo: 'long-text',
      title: 'Long text and no art',
      description:
        'A long headline ends in an ellipsis, the summary stops at two lines, and the banner keeps its space.',
    },
  ],
  notes: [
    {
      title: 'Content',
      items: [
        <>
          <code>art</code> takes an image, a picture element or an SVG. It is cropped to fill the banner and hidden from
          screen readers.
        </>,
        <>
          A string <code>category</code> renders a Category tag. Pass <code>skin="game"</code> to give it the live
          accent, or pass any node to render your own.
        </>,
        <>The headline is the link's accessible name. Date, category and summary are read as its description.</>,
        <>
          The card has a fixed width and shrinks to fit a narrower container. Change the width with <code>width</code>,
          in design units.
        </>,
      ],
    },
  ],
  related: ['content-card', 'category-tag', 'web-tabs'],
};

export default doc;
