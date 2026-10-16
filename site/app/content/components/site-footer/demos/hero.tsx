import { CameraModeIcon, InterKnotIcon, MailIcon, NoticesIcon, SiteFooter } from '@angel1254mc/zone-ui';

export default function SiteFooterHero() {
  return (
    <SiteFooter
      logo={<strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 28 }}>ZONE</strong>}
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
  );
}
