import { CameraModeIcon, InterKnotIcon, MailIcon, NoticesIcon, SiteFooter } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the full footer at an explicit width in design units. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(820 * var(--zzz-px))', border: '1px solid #333', borderRadius: 12, overflow: 'hidden' }}>
      <SiteFooter
        logo={
          <strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 'calc(44 * var(--zzz-px))' }}>ZONE</strong>
        }
        social={[
          { label: 'Newsletter', href: '#newsletter', icon: <MailIcon /> },
          { label: 'Community', href: '#community', icon: <InterKnotIcon /> },
          { label: 'Gallery', href: '#gallery', icon: <CameraModeIcon /> },
          { label: 'Announcements', href: '#announcements', icon: <NoticesIcon /> },
        ]}
        links={[
          { label: 'Privacy Policy', href: '#privacy' },
          { label: 'Terms of Service', href: '#terms' },
          { label: 'About Us', href: '#about' },
          { label: 'Contact Us', href: '#contact' },
        ]}
        legal="Copyright © Your Studio. All rights reserved."
      />
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.34,
  usage: (
    <>
      <p>
        The site footer closes every page of a website: a band of social links at the top, then a centred logo, policy
        links and legal text. Every part is optional, so a footer can be as small as one line of links.
      </p>
      <p>Pair it with the Nav Bar at the top of the page. Game-style screens end with a Bottom Bar instead.</p>
    </>
  ),
  usageCode: `import { SiteFooter } from '@angel1254mc/zone-ui';

<SiteFooter
  logo={<Logo />}
  links={[
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]}
  legal="Copyright © Your Studio. All rights reserved."
/>`,
  examples: [
    {
      demo: 'page-frame',
      title: 'Page frame',
      description: 'A Nav Bar on top, the page content, and the footer pushed to the bottom of the page.',
      frame: 'bleed',
    },
    {
      demo: 'language-picker',
      title: 'Extra content',
      description: 'Children render between the links and the legal text, here a language picker.',
      frame: 'bleed',
    },
  ],
  types: [
    {
      name: 'SiteFooterSocial',
      rows: [
        {
          name: 'label',
          type: 'string',
          required: true,
          description: 'Accessible name of the link. The icon is decorative.',
        },
        { name: 'href', type: 'string', required: true, description: 'Link target.' },
        { name: 'icon', type: 'ReactNode', required: true, description: 'Glyph drawn in currentColor.' },
      ],
    },
    {
      name: 'SiteFooterLink',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Link text.' },
        { name: 'href', type: 'string', required: true, description: 'Link target.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Landmarks',
      items: [
        <>
          The footer is a <code className="d-inline-code">&lt;footer&gt;</code>. The policy links are a navigation named
          &quot;Legal&quot; and the social links a list named &quot;Social media&quot;. Rename them with{' '}
          <code className="d-inline-code">linksLabel</code> and <code className="d-inline-code">socialLabel</code>.
        </>,
        <>
          <code className="d-inline-code">externalSocial</code> opens the social links in a new tab.
        </>,
      ],
    },
  ],
  related: ['navbar', 'hero', 'bottom-bar'],
};

export default doc;
