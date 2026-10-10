import { Pagination } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: page 2 of 24, with the gap before the last page. */
function Thumbnail() {
  return <Pagination aria-label="Pages" count={24} defaultPage={2} />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.4,
  usage: (
    <>
      <p>
        Pagination moves through a long list one page at a time: a news archive, search results, a leaderboard. It shows
        the first and last page, the pages next to the current one, and an ellipsis for the rest. The number of slots
        stays the same as people page through, so the bar never changes width.
      </p>
      <p>
        For server-rendered lists, pass <code>getPageHref</code> so each page is a real link. For short lists inside an
        app screen, a Scroll area is usually a better fit than pages.
      </p>
    </>
  ),
  usageCode: `import { Pagination } from '@angel1254mc/zone-ui';

<Pagination count={24} page={page} onPageChange={setPage} />`,
  examples: [
    {
      demo: 'with-list',
      title: 'Controlled with a list',
      description: 'The current page in state picks which slice of the list to show.',
    },
    {
      demo: 'as-links',
      title: 'As links',
      description:
        'With getPageHref every page and arrow is a link, and getPageLabel names each one for screen readers.',
    },
    {
      demo: 'skins',
      title: 'Skins',
      description: 'The web skin on a light page, and the game skin with the live accent on a dark pill.',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          It renders a <code>nav</code> landmark named Pagination. Give each one its own <code>aria-label</code> when a
          page has more than one.
        </>,
        <>
          The current page is marked as the current item. Each control is named Page N, or by <code>getPageLabel</code>.
        </>,
        <>
          On the first and last page the arrows stay focusable but do nothing, so focus is not lost when you reach an
          end.
        </>,
      ],
    },
    {
      title: 'Page range',
      items: [
        <>
          <code>siblingCount</code> sets how many pages show on each side of the current one, and{' '}
          <code>boundaryCount</code> how many at each end. Both default to 1.
        </>,
        <>Pages are counted from 1.</>,
      ],
    },
  ],
  related: ['news-card', 'table', 'web-tabs'],
};

export default doc;
