import { CategoryTag } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a post's date and tag above its headline, on a light page. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(10 * var(--zzz-px))',
        width: 'calc(300 * var(--zzz-px))',
        padding: 'calc(18 * var(--zzz-px)) calc(20 * var(--zzz-px))',
        borderRadius: 'calc(14 * var(--zzz-px))',
        background: '#efefef',
        color: '#222',
        fontSize: 'calc(16 * var(--zzz-px))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(14 * var(--zzz-px))' }}>
        <span>2026/09/30</span>
        <CategoryTag>Events</CategoryTag>
      </div>
      <strong style={{ fontWeight: 800 }}>Night Market Festival</strong>
      <div style={{ display: 'flex', gap: 'calc(12 * var(--zzz-px))' }}>
        <CategoryTag>News</CategoryTag>
        <CategoryTag>Notices</CategoryTag>
      </div>
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
        A category tag names the kind of post in a news list: News, Notices, Events. It is a label, not a button, so put
        it next to the date and let the headline carry the link. The tag is black, so it reads best on light pages.
      </p>
      <p>
        News Card renders one for you when you pass <code>category</code>. To let people filter a list by category, use
        Chip or Web Tabs instead.
      </p>
    </>
  ),
  usageCode: `import { CategoryTag } from '@angel1254mc/zone-ui';

<CategoryTag>Notices</CategoryTag>`,
  examples: [
    {
      demo: 'news-list',
      title: 'News list',
      description: 'Date and tag on one line, the headline link below, for each post.',
    },
    {
      demo: 'skins',
      title: 'Skins',
      description: 'The web skin uses a fixed lime. The game skin takes the theme accent, which pulses.',
    },
  ],
  related: ['news-card', 'chip', 'web-tabs'],
};

export default doc;
