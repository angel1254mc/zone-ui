import { NavBar } from '@angel1254mc/zone-ui';

export default function MobileMenu() {
  return (
    <div style={{ width: 380, maxWidth: '100%', minHeight: 300 }}>
      <NavBar
        collapse="always"
        defaultMenuOpen
        logo={<strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 22 }}>ZONE</strong>}
        defaultValue="agents"
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
