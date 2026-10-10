import { NavBar } from '@angel1254mc/zone-ui';

export default function GameSkin() {
  return (
    <NavBar
      skin="game"
      logo={<strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: 22 }}>ZONE</strong>}
      defaultValue="home"
      items={[
        { value: 'home', label: 'Home', href: '#home' },
        { value: 'agents', label: 'Agents', href: '#agents' },
        { value: 'news', label: 'News', href: '#news' },
      ]}
      cta={{ label: 'Play now', href: '#play' }}
    />
  );
}
