import { NavBar } from '@angel1254mc/zone-ui';

export default function NavBarHero() {
  return (
    <NavBar
      logo={<strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 22 }}>ZONE</strong>}
      defaultValue="news"
      items={[
        { value: 'home', label: 'Home', href: '#home' },
        { value: 'agents', label: 'Agents', href: '#agents' },
        { value: 'news', label: 'News', href: '#news' },
        { value: 'media', label: 'Media', href: '#media' },
      ]}
      cta={{ label: 'Play now', href: '#play' }}
    />
  );
}
