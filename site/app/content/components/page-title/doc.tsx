import { PageTitle, SectionTitleStrip, TagButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: Back button and page title above a section strip with a count. Fixed width, no measuring. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(40 * var(--zzz-px))',
        width: 'calc(560 * var(--zzz-px))',
        paddingBottom: 'calc(10 * var(--zzz-px))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(28 * var(--zzz-px))',
          paddingLeft: 'calc(30 * var(--zzz-px))',
        }}
      >
        <TagButton kind="back" />
        <PageTitle as="div">Manage Item</PageTitle>
      </div>
      <SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} headingAs="div" />
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
        <code>PageTitle</code> is the plain grey heading at the top of a game-style screen, right after the Back button:
        "Manage Item", "W-Engine Overclocking". <code>SectionTitleStrip</code> is the full-width band that heads a
        section of a storage screen, with an optional item count and a slot on the right for tabs.
      </p>
      <p>
        Top Bar renders a page title for you through its <code>title</code> prop. For event pages, use Event Title. For
        the small grey heading above stat rows, use Section Label.
      </p>
    </>
  ),
  usageCode: `import { PageTitle, TagButton } from '@angel1254mc/zone-ui';

<TagButton kind="back" onClick={goBack} />
<PageTitle>Manage Item</PageTitle>`,
  examples: [
    {
      demo: 'section-strip',
      title: 'Section strip',
      description: 'The count renders in brackets after the title. Turn off the rule above the band with rule={false}.',
      frame: 'bleed',
    },
    {
      demo: 'strip-with-tabs',
      title: 'Strip with tabs',
      description: 'Icon tabs in the right slot overlap the band and switch the section, its title and its count.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Headings',
      items: [
        <>
          <code>PageTitle</code> renders an <code>h1</code>; change it with <code>as</code>.
        </>,
        <>
          <code>SectionTitleStrip</code> renders its title as an <code>h2</code>; change it with <code>headingAs</code>.
        </>,
      ],
    },
  ],
  related: ['top-bar', 'tag-button', 'icon-tabs'],
};

export default doc;
