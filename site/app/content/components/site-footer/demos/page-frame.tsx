import { NavBar, SiteFooter, Text } from '@angel1254mc/zone-ui';

const logo = <strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 22 }}>ZONE</strong>;

export default function PageFrame() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 520 }}>
      <NavBar
        logo={logo}
        defaultValue="news"
        items={[
          { value: 'home', label: 'Home', href: '#home' },
          { value: 'news', label: 'News', href: '#news' },
        ]}
      />
      <main style={{ flex: 1, padding: '32px 24px' }}>
        <Text as="h1" role="title" style={{ margin: 0 }}>
          News
        </Text>
      </main>
      <SiteFooter
        logo={logo}
        links={[
          { label: 'Privacy Policy', href: '#privacy' },
          { label: 'Terms of Service', href: '#terms' },
        ]}
        legal="Copyright © Your Studio. All rights reserved."
      />
    </div>
  );
}
