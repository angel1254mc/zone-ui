import { WebTabs } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: three section tabs with the middle one selected. */
function Thumbnail() {
  return (
    <WebTabs
      aria-label="News categories"
      width={480}
      defaultValue="notices"
      items={[
        { value: 'news', label: 'News' },
        { value: 'notices', label: 'Notices' },
        { value: 'events', label: 'Events' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Web tabs split one page into sections, such as Latest, News, Notices and Events on a news page. The active
        section sits on a bright chip, and the arrow keys move between sections.
      </p>
      <p>
        Pair them with <code>TabPanel</code> to show the content for each section. For switching views inside an app
        screen, use Segmented tabs.
      </p>
    </>
  ),
  usageCode: `import { TabPanel, WebTabs } from '@angel1254mc/zone-ui';

<WebTabs
  id="news-tabs"
  aria-label="News categories"
  items={[
    { value: 'news', label: 'News' },
    { value: 'notices', label: 'Notices' },
  ]}
  value={section}
  onValueChange={setSection}
/>
<TabPanel tabsId="news-tabs" value={section}>...</TabPanel>`,
  examples: [
    {
      demo: 'with-panels',
      title: 'With panels',
      description: 'Controlled tabs with one panel per section. The panel is linked to its tab by the shared id.',
    },
    {
      demo: 'game-skin',
      title: 'Game skin',
      description: 'The game skin sits on a dark pill with a slanted chip, for menus inside a game.',
    },
    {
      demo: 'light-page',
      title: 'On a light page',
      description: 'The web skin reads well on a light page, such as a news section or a support page.',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>←</kbd> and <kbd>→</kbd> move between tabs and select them. <kbd>Home</kbd> and <kbd>End</kbd> jump to
          the first and last.
        </>,
        <>Disabled tabs are skipped.</>,
      ],
    },
    {
      title: 'Skins and sizes',
      items: [
        <>
          <code>skin</code> is <code>web</code> (the default) or <code>game</code>. <code>size</code> is <code>sm</code>
          , <code>md</code> or <code>lg</code>.
        </>,
        <>
          <code>width</code> is <code>fill</code> to span the container, or a number for a fixed width.
        </>,
      ],
    },
  ],
  related: ['segmented-tabs', 'pagination', 'icon-tabs'],
};

export default doc;
