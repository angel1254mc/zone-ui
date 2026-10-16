import { NavBar } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/**
 * Gallery preview. A full-width part gets an explicit width in design units (so it follows thumbnailScale)
 * and `collapse="never"`, so it renders un-folded instead of measuring the narrow card and folding.
 */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(820 * var(--zzz-px))', border: '1px solid #333', borderRadius: 12, overflow: 'hidden' }}>
      <NavBar
        collapse="never"
        logo={
          <strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 'calc(40 * var(--zzz-px))' }}>ZONE</strong>
        }
        defaultValue="news"
        items={[
          { value: 'home', label: 'Home', href: '#home' },
          { value: 'agents', label: 'Agents', href: '#agents' },
          { value: 'news', label: 'News', href: '#news' },
        ]}
        cta={{ label: 'Play now', href: '#play' }}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.36,
  usage: (
    <>
      <p>
        The nav bar is the header of a website: logo on the left, page links in the middle, one call to action and
        optional round actions on the right. The current page gets the white pill.
      </p>
      <p>
        It measures its own width. As space runs out the spacing tightens, then links fold into a menu button, and on
        narrow bars the call to action joins them.
      </p>
    </>
  ),
  usageCode: `import { NavBar } from '@angel1254mc/zone-ui';

<NavBar
  logo={<Logo />}
  defaultValue="news"
  items={[
    { value: 'home', label: 'Home', href: '/' },
    { value: 'news', label: 'News', href: '/news' },
  ]}
  cta={{ label: 'Play now', href: '/download' }}
/>`,
  examples: [
    {
      demo: 'game-skin',
      title: 'Game skin',
      description: 'The call to action takes the live accent, for pages that should feel like the game menu.',
      frame: 'bleed',
    },
    {
      demo: 'mobile-menu',
      title: 'Mobile menu',
      description: 'With collapse="always" the links live in the menu. This is what a phone sees.',
      frame: 'start',
    },
    {
      demo: 'client-routing',
      title: 'Client-side routing',
      description: 'Leave out href and handle onValueChange to route without page loads.',
      frame: 'bleed',
    },
  ],
  types: [
    {
      name: 'NavBarItem',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Identifies the item in `value` and `onValueChange`.',
        },
        { name: 'label', type: 'ReactNode', required: true, description: 'Link text.' },
        { name: 'href', type: 'string', description: 'Renders a link. Without it the item is a button.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the label and removes it from the tab order.' },
      ],
    },
    {
      name: 'NavBarCta',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Button text.' },
        { name: 'href', type: 'string', description: 'Renders the call to action as a link.' },
        { name: 'onClick', type: 'MouseEventHandler', description: 'Click handler when there is no `href`.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Responsive behaviour',
      items: [
        <>Full spacing above 1800 px of bar width, tighter spacing below.</>,
        <>Links fold into the menu button as soon as they overflow. Below 900 px the call to action folds too.</>,
        <>
          Force a layout with <code className="d-inline-code">collapse</code>:{' '}
          <code className="d-inline-code">always</code> or <code className="d-inline-code">never</code>.
        </>,
      ],
    },
  ],
  related: ['site-footer', 'web-tabs', 'hero'],
};

export default doc;
